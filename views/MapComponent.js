import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import MapView, {Circle} from 'react-native-maps';
import GetLocation from 'react-native-get-location';

const MapComponent = () => {
  const [userLocation, setUserLocation] = useState({
    latitude: 23.7808186,
    longitude: 90.337287,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  });

  const getCurrentLocationOfUser = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
      rationale: {
        title: 'Location permission',
        message: 'The app needs the permission to request your location.',
        buttonPositive: 'Ok',
      },
    })
      .then(location => {
        console.log(location);
        let locationObject = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.05,
        };
        setUserLocation(locationObject);
      })
      .catch(error => {
        const {code, message} = error;
        console.log(code, message);
      });
  };

  const onRegionChange = region => {
    setUserLocation(region);
  };

  const onRegionChangeComplete = (region, gesture) => {
    // This fix only works on Google Maps because isGesture is NOT available on Apple Maps
    if (!gesture.isGesture) {
      return;
    }
    // You can use
    dispatch({type: 'map_region', payload: {mapRegion: region}}); // if using useReducer
    // setMapRegionState(region); // if using useState
  };

  useEffect(() => {
    getCurrentLocationOfUser();
    return () => {
      console.log('cleanup');
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <MapView
        style={{flex: 1}}
        //initialRegion={userLocation}
        region={userLocation}
        onRegionChange={onRegionChange}
      />
      <Circle
        /// key = { (this.state.currentLongitude + this.state.currentLongitude).toString() }
        center={userLocation}
        radius={500}
        strokeWidth={1}
        strokeColor={'#1a66ff'}
        fillColor={'rgba(230,238,255,0.5)'}
        //onRegionChangeComplete = { this.onRegionChangeComplete.bind(this) }
      />
      <View style={{position: 'absolute', bottom: 10, right: 10}}>
        <Button
          title="Get Current Location"
          onPress={getCurrentLocationOfUser}
        />
      </View>
    </View>
  );
};

export default MapComponent;
