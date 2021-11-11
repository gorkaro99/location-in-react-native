import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';



const pantallaLogin = () => {

  const LOCATION_TASK_NAME = 'background-location-task';

  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) {
      // Error occurred - check `error.message` for more details.
      return;
    }
    if (data) {
      const { locations } = data;
      // do something with the locations captured in the background
    }
  });
  const requestPermissions = async () => {
   const {status} = awaitLocation.requestBackgroundPermissionsAsync();
    if (status === 'granted') {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
       accuracy:Location.Accuracy.High,
         timeInterval: 10000,
         distanceInterval: 80,
      });
    }
  };

  
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setLoading] = useState(true);

  state = {
    initialRegion: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let locatiion = await Location.getCurrentPositionAsync({ enableHighAccuracy: true },
        (loc) => { console.log("posss", loc) }
        );

      setLocation(locatiion);

      let location = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest },
        (loc) => { console.log("ddd", loc) }
      );

    })();
  }, []);


  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    console.log(location.coords.latitude)
    console.log(location.coords.longitude)
    text = JSON.stringify(location);
    state.initialRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.003,
      longitudeDelta: 0.003,
    }
    if (isLoading) {
      setLoading(false);
    }
  }

  if (isLoading) {
    return <View style={{ backgroundColor: "#FFF", flex: 1 }}><ActivityIndicator /></View>
  } else {

    return (
      <View style={styles.container}>
        <Text style={{ marginTop: "30%" }}>{state.initialRegion.latitude} {state.initialRegion.longitude}</Text>
        <TouchableOpacity onPress={requestPermissions}>
          <Text>Enable background location</Text>
        </TouchableOpacity>
        <MapView
          showsUserLocation={true}
          initialRegion={state.initialRegion}
          style={styles.map}
          showsUserLocation={true}>
          <Marker
            coordinate={{ latitude: state.initialRegion.latitude, longitude: state.initialRegion.longitude }}
          />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});


export default pantallaLogin