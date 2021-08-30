import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
// expo install react-native-maps
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';

//backend server will run at localhost:3000
//To run the app correctly you have to:
//1. Make sure your mobile device and computer(device that run the server) are connected to a same wifi
//2. Change The URL below such that the IP address of the URL is your computer's IP address
// Make sure you run the server before run the app
const URL = "http://192.168.2.87:3000"

const Map = ({navigation}) => {
  const GOOD_DISTANCE = 500;
  const [location, setLocation] = useState({ lat: 43.663, lng: -79.395 });
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [nearestBuilding, setNearestBuilding] = useState(null);
  const [seenBuildings, setSeenBuildings] = useState([]);
  const [startStopBtn, setStartStopBtn] = useState("START");
  const [currentSite, setCurrentSite] = useState(null);
  const [siteLocation, setSiteLocation] = useState({ lat: 43.663, lng: -79.395 });
  const currloc = useRef({ lat: 43.663, lng: -79.395 });
  useEffect(() => {

    (async () => {
      // request permissions
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setError('Permission to access location was denied');
        return;
      }

      // get location
      let { coords } = await Location.getCurrentPositionAsync({});
      let location_ = {
        lat: coords.latitude,
        lng: coords.longitude
      }
      setLocation(location_);

      let info_ = {
        lat: location.lat,
        lng: location.lng
      }
      if (navigation.state.params){
        info_ = {
          lat: location.lat,
          lng: location.lng,
          email: navigation.state.params.email
        }
      }


      /**
       * get array of object with building info
       * object has attributes lat, lng, name, info
       */
      let url_attractions = URL.concat("/attractions")
      let res = await fetch(url_attractions, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(info_)
      });
      let buildings_ = await res.json()
      setBuildings(buildings_)
      console.log("===========SETTING BUILDINGS=============")
      console.log(buildings)
      console.log(info_)
      console.log("===========BUILDINGS SET=============")

      setReady(true);
    })();
  }, []);

  const onNext = async () => {
    /**
     * On press handler function for the Next button. Find the next building that hasn't been
     * explored yet and read out its hook. Read out no more places if that's the case.
     */
    Speech.stop();
    let text = "";

    if (buildings.length === 0) {
      Speech.speak("no more places can be found",{
        language: 'en',
        pitch: 1,
        rate: 1
      })
      setIsStart(false);
      return;
    }

    let result = await findNearestBuildingNotSeen();
    console.log("===========NEAREST BUILDING NOT SEEN=============")
    console.log(result)

      //if theres no Building that are not seen
      if(result.attraction === null){
        text = "You have seen all the attractions information"
      
      }
      // nearestBuilding is GOOD_DISTANCE away from user
      else if(result.distance > GOOD_DISTANCE){
        text = "There is no attraction in this area"
      
      }
      else{
        text = "There is another place called " + result.attraction.name;
        text = text + " which is " + Math.round(result.distance).toString() + "kilometers from here";
        setCurrentSite(result.attraction);
        const coord = (({lat, lng}) => ({latitude: parseFloat(lat), longitude: parseFloat(lng)}))(result.attraction);
        const coord2 = (({lat, lng}) => ({lat: parseFloat(lat), lng: parseFloat(lng)}))(result.attraction);
        animate(coord);
        setSiteLocation(coord2);
        currloc.current = coord2;
      }
      console.log("========================")
      //Speech.speak('text', options);
      Speech.speak(text,{
        language: 'en',
        pitch: 1,
        rate: 1
      })
  }

  //ADDED NEW FUNCTION
  const animate = (coord) =>{
    clearTimeout(regionTimeout);
    const regionTimeout = setTimeout(() => {
        _mapView.current.animateToRegion(
          {
            ...coord,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          },
          1000
        );
    });
  };

  const goToDetail = (attraction) => {
    console.log(attraction)
    if (attraction) {
        navigation.navigate('AttractionDetail', {
            attraction: attraction
        })
    }
  }

  const onDetail = () => {
    if(currentSite){
      console.log("============CURRENT SITE IS============")
      console.log(currentSite.name)
      console.log("========================")
      navigation.navigate('AttractionDetail',{
        attraction: currentSite
      })
    }
  }

  async function updateUserLocation(){
    // update user current location
    let { coords } = await Location.getCurrentPositionAsync({});
    let location_ = {
      lat: coords.latitude,
      lng: coords.longitude
    }
    console.log(location_);
    setLocation(location_);
  }

  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  async function findNearestBuildingNotSeen() {
    await updateUserLocation();
    let notSeen = buildings.filter(attraction => !seenBuildings.includes(attraction) )
    console.log("============NOT SEEN BUILDINGS============")
    console.log(notSeen)
    console.log("========================")
    let nearest = null
    let nearest_distance = -1
    notSeen.forEach((attraction) =>{
      let d = getDistanceFromLatLonInKm(location.lat, location.lng, attraction.lat, attraction.lng)
      if (nearest_distance === -1){
        nearest_distance = d
        nearest = attraction
      }
      else if(d<nearest_distance){
        nearest_distance = d
        nearest = attraction
      }
    })
    if(nearest !== null){
      //set the Nearest attraction
      setNearestBuilding({
        attraction: nearest,
        distance: nearest_distance
      })
      //update the seen buildings XXXXXXXXXXXXXXXXXXXX
      const new_seen = seenBuildings
      new_seen.push(nearest)
      setSeenBuildings(new_seen)
    }
    else{
      // BETTER WAY TO FILTER THROUGH THE SEEN BUILDINGS
      setNearestBuilding(null)
    }
    // console.log(nearest, nearest_distance);
    return {attraction: nearest, distance: nearest_distance};

  }

  const startAndStop = ()=>{
    if(isStart){
      Speech.stop();
      setIsStart(false);
      const loc = (({lat, lng}) => ({latitude: parseFloat(lat), longitude: parseFloat(lng)}))(location);
      animate(loc);
      setSiteLocation(location);
      currloc.current = location;
      setStartStopBtn("START");
    }
    else{
      setIsStart(true);
      onNext();
      setStartStopBtn("STOP");
    }
  }

  _mapView = useRef(null); // ADDED NEW LINE

  return(
    <View style={styles.container}>
      {ready && (
        <MapView.Animated //ADDED ANIMATED AND REF
        ref={_mapView}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
            latitude: currloc.current.lat,
            longitude: currloc.current.lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          {buildings.map((obj, index)=> <Marker
            key={index}
            coordinate={{
              latitude: parseFloat(obj.lat),
              longitude: parseFloat(obj.lng)
            }}
            >
              <Callout onPress={() => goToDetail(obj)}>
                <Text>{obj.name}</Text>
              </Callout>
            </Marker>
          )}
          <Marker   
            title={"current position"}         
            coordinate={{
              latitude: parseFloat(location.lat),
              longitude: parseFloat(location.lng)
            }}
            pinColor={'#00ffff'}
          />
        </MapView.Animated>
      )}

      <TouchableOpacity disabled={!isStart} style={styles.nextbutton} onPress={() => { onNext() }}>
          <Text style={styles.loginText}>Next</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={false} style={styles.detailbutton} onPress={() => { onDetail() }}>
            <Text style={styles.loginText}>Detail</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ssbutton} onPress={() => { startAndStop() }}>
          {/* startAndStop() */}
          <Text style={styles.loginText}>{startStopBtn}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      ...StyleSheet.absoluteFillObject,
      height: '100%',
      width: '100%',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
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
    ssbutton: {
      width: "25%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 'auto',
      marginRight: 10,
      marginBottom: 10,
      backgroundColor: "aliceblue",
    },
    nextbutton: {
      width: "25%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 'auto',
      marginLeft: 'auto',
      marginRight: 10,
      marginBottom: 10,
      backgroundColor: "aliceblue",
    },
    detailbutton: {
      width: "25%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 'auto',
      marginRight: 10,
      marginBottom: 10,
      backgroundColor: "aliceblue",
    }
});

export default Map;

