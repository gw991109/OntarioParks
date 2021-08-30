import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Alert
} from "react-native";

const URL = "http://192.168.2.87:3000"
 
// export default function Login() {
const Login = ({navigation}) => {

  const[currUser, setCurrUser] = useState(null);
  const[found, setFound] = useState(false);

  // for temp only
  const data = require('../userInfo.json');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const pressHandler = (page) =>{
        navigation.navigate(page);
  }

  doLogin = ()=>{
    // setFound(false);
    // data.forEach((user) =>{
    //   if(user["email"] === email && user["password"] === password){
    //     setFound(true);
    //     setCurrUser(user)
    //     console.log(user["username"], "Login!!");
    //   }
    // });
    // if (!found){
    //   console.log("Email or Password incorrect!!");
    //   Alert.alert('Email or Password incorrect!!');
    // }
    // else{
    //   navigation.navigate("MainPage");
    // }

    let user = {
        email: email,
        password: password
    }

    let url_login = URL.concat("/login")

    const request = new Request(url_login, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Content-type': 'application/json'
        }
    });
    fetch(request)
    .then(function(res) {
        if (res.status === 200) {
            // login here
            navigation.navigate("UserMainPage", user);
            
        } else if (res.status === 404) {
            console.log("404 Not found for this user");
            Alert.alert("404 Not found for this user\nemail or password incorrect");
            
        } else {
            Alert.alert("unknown error\nPlease Try again");
        }
    }).catch((error) => {
        console.log(error);
    })
  }
 
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("./../components/photos/LogoLogin.jpg")} />
 
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email:"
          placeholderTextColor="grey"
          onChangeText={(email) => setEmail(email)}
        />
      </View>
 
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password:"
          placeholderTextColor="grey"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
 
      <TouchableOpacity onPress={()=>{pressHandler('SignUp')}}>
        <Text style={styles.signup_button}>Sign Up</Text>
      </TouchableOpacity>
 
      <TouchableOpacity style={styles.loginBtn} onPress={()=>{doLogin()}}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
 
  image: {
    height: 100,
    width: "45%",
    marginBottom: 40,
  },
 
  inputView: {
    backgroundColor: "aliceblue",
    borderRadius: 30,
    width: "65%",
    height: 45,
    marginBottom: 20,
 
    alignItems: "center",
  },
 
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
 
  signup_button: {
    height: 30,
    marginBottom: 30,
  },
 
  loginBtn: {
    width: "30%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "aliceblue",
  },
});

export default Login;