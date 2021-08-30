import React, { useState, useEffect } from 'react';
import {View, StyleSheet, Text, Alert, TouchableOpacity} from 'react-native';
import { Checkbox } from 'react-native-paper';

const URL = "http://192.168.2.87:3000"

const SettingPreference = ({ navigation }) =>{
    const [isNatural, setNatural] = useState(false);
    const [isCultural, setCultural] = useState(false);
    const [isGeneral, setGeneral] = useState(false);
    const [isHistorical, setHistorical] = useState(false);
    const [isPopular, setPopular] = useState(false);
    const lstPrefer = [];

    submit = ()=>{
        //get all preference 
        if (isNatural) {
            lstPrefer.push('natural');
        }
        if (isCultural) {
            lstPrefer.push('cultural');
        }
        if (isGeneral) {
            lstPrefer.push('general');
        }
        if (isHistorical) {
            lstPrefer.push('historical');
        }
        if (isPopular) {
            lstPrefer.push('popular');
        }

        console.log(navigation)

        let email = "";
        let login = false;
        // find the user's email. If the user did not login, use "" as his/her email
        if (typeof navigation.state.params !== 'undefined') {
            email = navigation.state.params.email;
            login = true;
        } 

        let preference = {
            "email": email,
            "preference": lstPrefer
        }
        console.log(preference)

        //post the preference to the server.
        let url_preference = URL.concat("/preference")
        const request = new Request(url_preference, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(preference)
        }); 

        fetch(request)
        .then(function(res) {
            if (res.status === 201) {
                console.log("save perference successfully");
                Alert.alert("save perference successfully");

                //choose which mainpage to return
                if (!login) {
                    navigation.navigate("MainPage");
                } else {
                    navigation.navigate("UserMainPage");
                } 
                
            } else if (res.status === 404) {
                console.log("user doesn't exist");
                Alert.alert("user doesn't exist");
                navigation.navigate("MainPage");
            }
        }).catch((error) => {
            console.log(error);
        })
    }


    return (
        <View style={styles.container}>
            {/* for checkboxes */}
            <View style={styles.checkboxContainer}>
                <Checkbox
                    status={isNatural ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setNatural(!isNatural);
                    }}
                />
                <Text style={styles.checkText}>Natural</Text>
            </View>
            
            <View style={styles.checkboxContainer}>
                <Checkbox
                    status={isCultural ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setCultural(!isCultural);
                    }}
                />
                <Text style={styles.checkText}>Cultural</Text>
            </View>

            <View style={styles.checkboxContainer}>
                <Checkbox
                    status={isGeneral ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setGeneral(!isGeneral);
                    }}
                />
                <Text style={styles.checkText}>General</Text>
            </View>

            <View style={styles.checkboxContainer}>
                <Checkbox
                    status={isHistorical ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setHistorical(!isHistorical);
                    }}
                />
                <Text style={styles.checkText}>Historical</Text>
            </View>

            <View style={styles.checkboxContainer}>
                <Checkbox
                    status={isPopular ? 'checked' : 'unchecked'}
                    onPress={() => {
                        setPopular(!isPopular);
                    }}
                />
                <Text style={styles.checkText}>Popular</Text>
            </View>

            {/* Here is used to record the selected text */}
            <Text style={styles.label}>Selected Preference: {isNatural ? "Natural " : ""} {isCultural ? "Cultural " : ""} {isGeneral ? "General " : ""} {isHistorical ? "Historical " : ""} {isPopular ? "Popular " : ""}</Text> 
            
            <TouchableOpacity style={styles.checkboxContainer} onPress={()=>{submit()}}>
                <Text style={styles.loginText}>Confirm</Text>
            </TouchableOpacity>
        </View>
  );
            
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: '#fff',
    },
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 50,
        width: "40%",
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "aliceblue",
    },
    checkText: {
        fontSize: 18,
        margin: 8,
    },
    label: {
        fontSize: 15,
        margin: 8,
    },
});

export default SettingPreference;