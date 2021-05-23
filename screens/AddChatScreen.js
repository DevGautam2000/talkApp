import React, { useLayoutEffect, useState } from "react";
// import { Button } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Icon, Input, Button } from "react-native-elements";
import { db } from "../firebase";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add new chat",
    });
  }, [navigation]);

  const createChat = async () => {
    if (input !== "") {
      await db
        .collection("chats")
        .add({
          chatName: input,
        })
        .then(() => {
          navigation.goBack();
        })
        .catch((err) => alert(err.message));
    }
  };

  return (
    <View style={styles.container}>
      <Input
        style={{ marginLeft: 10 }}
        placeholder="Enter chat name"
        value={input}
        onChangeText={(text) => setInput(text)}
        onSubmitEditing={createChat}
        leftIcon={
          <Icon
            style={{ marginLeft: 10 }}
            name="wechat"
            type="antdesign"
            color="black"
          />
        }
      />
      <Button
        containerStyle={styles.button}
        onPress={createChat}
        title="create a chat"
      />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  button: { alignSelf: "center", width: 400 },
});
