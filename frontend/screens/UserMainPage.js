import React, {component} from 'react';
import {View, Button, StyleSheet, Text, Image, TextInput, TouchableOpacity, Alert} from 'react-native';
import Header from '../components/Header';

const log = console.log

// const MainPage = (props) => {
const MainPage = ({navigation}) => {

    const tytle = "Explore Ontario";

    let user_info = {
        email: navigation.state.params.email,
        password: navigation.state.params.password
    }

    log(user_info)

    //function allow user to switch the pages when call
    const pressHandler = (page) => {
        navigation.navigate(page, user_info);
    }

    //function for logout
    const pressLogout = (page) => {
        navigation.navigate(page);
    }

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("./../components/photos/LogoLogin.jpg")} />
            
            <TouchableOpacity style={styles.button} onPress={() => { pressHandler('SettingPreference') }}>
                <Text style={styles.loginText}>Setting Preference</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => { pressHandler('Map') }}>
                <Text style={styles.loginText}>Map</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => { pressLogout('MainPage') }}>
                <Text style={styles.loginText}>Logout</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.button} onPress={() => { pressHandler('Map') }}>
                <Text style={styles.loginText}>Start</Text>
            </TouchableOpacity> */}
            
        </View>
    );
};

const styles = StyleSheet.create({

    image: {
        height: 105,
        width: "90%",
        marginBottom: 40,
    },

    button: {
        width: "40%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "aliceblue",
      },

    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#fff',
    }
});

export default MainPage;
