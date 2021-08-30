import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import * as Speech from 'expo-speech';

const AttractionDetail = ({navigation}) => {
  /**
   * A detail page that provides more information about the infrastructure. 
   * */ 
    const { attraction } = navigation.state.params;
    console.log("Detail:")
    console.log(attraction.name)

    Speech.speak(attraction.description, {
      language: 'en',
      pitch: 1,
      rate: 1
    })

    return (
        <ScrollView>
        <View style={styles.screen}>
            {/* dsplays the name of the infrastructure */}
            <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{attraction.name}</Text>
            </View>
        
            {/* dsplays a description of the infrastructure */}
            <View style={styles.descriptionContainer}>
            <Text>{attraction.description}</Text>
            </View>
        </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingVertical: 20,
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    color: "black",
    fontSize: 26,
  },
  imageContainer: {
    width: 300,
    height: 250,
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 20,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  descriptionContainer: {
    width: 300,
    alignItems: "center",
  },
});

export default AttractionDetail;
