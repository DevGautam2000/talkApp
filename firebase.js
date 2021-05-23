import firebase from "firebase/app"; // for firebase above 8.0
// import * as firebase from "firebase"; // for firebase upto 8.0
import "firebase/firestore";
import "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEbYGXqQetjLlFgyZzgLqSlS1dZUkfTzI",
  authDomain: "talk-76dbc.firebaseapp.com",
  projectId: "talk-76dbc",
  storageBucket: "talk-76dbc.appspot.com",
  messagingSenderId: "328437249655",
  appId: "1:328437249655:web:516458f1125b3570d83872",
  measurementId: "G-D2CW4CFQVP",
};

let firebaseApp;

if (firebase.apps.length === 0) {
  //optimaization of the re-initializatino of the app
  firebaseApp = firebase.initializeApp(firebaseConfig);
} else firebaseApp = firebase.app();

const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
