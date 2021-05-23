import React, { useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { StyleSheet, View } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { auth } from "../firebase";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Login",
    });
  }, [navigation]);

  const register = () => {
    //register the user
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        //handle the promise returned
        authUser.user.updateProfile({
          displayName: name,
          photoURL:
            imageUrl ||
            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text h3 style={styles.text}>
        Create A Talk Account
      </Text>

      <View style={styles.inputForm}>
        <Input
          onChangeText={(text) => setName(text)}
          value={name}
          autoFocus
          placeholder="Full name"
        />
        <Input
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Email"
        />
        <Input
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          value={password}
          secureTextEntry
        />
        <Input
          onChangeText={(text) => setImageUrl(text)}
          value={imageUrl}
          placeholder="Profile Picture(optional)"
          onSubmitEditing={register}
        />
      </View>

      <Button
        raised
        containerStyle={styles.button}
        title="Register"
        onPress={register}
      />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputForm: {
    marginTop: 20,
    width: 300,
  },
  text: {
    marginTop: 150,
    marginBottom: 30,
  },
  button: {
    marginTop: 30,
    width: 300,
  },
});
