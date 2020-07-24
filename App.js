import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import * as Facebook from "expo-facebook";

import * as firebase from "firebase";
import { firebaseConfig, facebookConfig } from "./config/config";

firebase.initializeApp(firebaseConfig);

import {
  Container,
  Content,
  Header,
  Form,
  Input,
  Item,
  Button,
  Label,
} from "native-base";

export default function App() {
  // console.log(firebaseConfig);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        console.log("- User:", user);
      }
    });
  }, []);

  const signUpUser = (email, password) => {
    try {
      if (password.length < 6) {
        alert("Please enter at least 6 characters");
        return;
      }

      firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (err) {
      console.log(err.toString());
    }
  };

  const loginUser = (email, password) => {
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          console.log(user);
        });
    } catch (err) {
      console.log(err.toString());
    }
  };

  const loginWithFacebook = async () => {
    // const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
    //   facebookConfig.appId,
    //   {
    //     permissions: ["public_profile"],
    //   }
    // );
    await Facebook.initializeAsync(facebookConfig.appId);
    const { type, token } = await Facebook.logInWithReadPermissionsAsync({
      permissions: ["public_profile"],
    });

    if (type === "success") {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      firebase
        .auth()
        .signInWithCredential(credential)
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Container style={styles.container}>
      <Form>
        <Item floatingLabel>
          <Label>Email</Label>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          />
        </Item>

        <Item floatingLabel>
          <Label>Password</Label>
          <Input
            secureTextEntry={true}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
          />
        </Item>

        <Button
          style={{ marginTop: 10 }}
          full
          rounded
          success
          onPress={() => loginUser(email, password)}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Button>

        <Button
          style={{ marginTop: 10 }}
          full
          rounded
          primary
          onPress={() => signUpUser(email, password)}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </Button>

        <Button
          style={{ marginTop: 10 }}
          full
          rounded
          primary
          onPress={() => loginWithFacebook()}
        >
          <Text style={styles.buttonText}>Login With Facebook</Text>
        </Button>
      </Form>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 10,
  },
  buttonText: {
    color: "white",
  },
});
