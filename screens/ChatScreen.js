import React, { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import { ScrollView } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { Keyboard } from "react-native";
import firebase from "firebase/app";
import { auth, db } from "../firebase";
const ChatScreen = ({ navigation, route }) => {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerContainer}>
          <Avatar
            rounded
            source={{
              uri: messages[messages.length - 1]?.data.photoURL,
            }}
          />
          <Text style={styles.text}>{route.params.chatName}</Text>
        </View>
      ),

      headerLeft: () => (
        <>
          <TouchableOpacity
            style={{ marginLeft: 10, marginRight: 10 }}
            onPress={navigation.goBack}
            activeOpacity={0.5}
          >
            <AntDesign name="arrowleft" size={23} color="white" />
          </TouchableOpacity>
        </>
      ),
      headerRight: () => (
        <View style={styles.headerContainer}>
          <TouchableOpacity activeOpacity={0.5}>
            <FontAwesome name="video-camera" size={23} color="white" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.5}>
            <Ionicons name="call" size={23} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  const sendMessage = () => {
    Keyboard.dismiss();

    if (message !== "") {
      db.collection("chats").doc(route.params.id).collection("messages").add({
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    setMessage("");
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView style={styles.scrollView}>
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.receiver}>
                    <Avatar
                      position="absolute"
                      bottom={-15}
                      right={-13}
                      //for web module
                      containerStyle={styles.avatarReceiver}
                      rounded
                      size={25}
                      source={{ uri: data.photoURL }}
                    />
                    <Text style={styles.receiverText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      position="absolute"
                      bottom={-15}
                      left={-13}
                      //for web module
                      containerStyle={styles.avatarSender}
                      rounded
                      size={25}
                      source={{ uri: data.photoURL }}
                    />
                    <Text style={styles.senderText}>{data.message}</Text>
                    <Text style={styles.senderName}>
                      {console.log(messages[messages?.length - 1])}
                      {data.displayName}
                    </Text>
                  </View>
                )
              )}
            </ScrollView>

            <View style={styles.footer}>
              <TextInput
                style={styles.input}
                placeholder="type message here"
                type="text"
                value={message}
                onChangeText={(text) => setMessage(text)}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={26} color="#2089DC" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", paddingTop: 10 },

  headerContainer: {
    display: "flex",
    flexDirection: "row",
    width: 90,
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 30,
  },

  text: {
    color: "white",
    fontSize: 20,
    marginLeft: 20,
  },

  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },

  footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },

  input: {
    bottom: 0,
    height: 50,
    marginRight: 15,
    fontSize: 20,
    padding: 10,
    paddingLeft: 15,
    borderRadius: 30,
    borderBottomColor: "transparent",
    backgroundColor: "#eee",
    flex: 1,
  },
  receiver: {
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 20,
    maxWidth: "80%",
    marginRight: 15,
    marginBottom: 10,
    flex: 0.7,
    alignSelf: "flex-end",
    position: "relative",
  },

  sender: {
    padding: 15,
    backgroundColor: "#2089DC",
    borderRadius: 20,
    maxWidth: "80%",
    margin: 15,
    flex: 0.7,
    alignSelf: "flex-start",
    position: "relative",
  },

  senderName: {
    paddingRight: 10,
    left: 10,
    fontSize: 10,
    color: "white",
  },

  avatarReceiver: {
    position: "absolute",
    bottom: -15,
    right: -13,
  },
  avatarSender: {
    position: "absolute",
    bottom: -15,
    left: -13,
  },

  receiverText: {
    color: "black",
    marginLeft: 10,
    fontWeight: "400",
  },

  senderText: {
    color: "white",
    marginLeft: 10,
    fontWeight: "400",
    marginBottom: 15,
  },
});
