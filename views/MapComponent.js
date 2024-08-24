import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import Slider from "react-native-slider";
import Geocoder from "react-native-geocoding";
let defaultRegion = {
  address: "",
  lat: 23.7844567,
  lng: 90.3956586,
  radius: 3,
};

let prevSelectedAddress = defaultRegion
let sliderInitial = prevSelectedAddress.radius > 10 ? 10 : prevSelectedAddress.radius
Geocoder.init("AIzaSyD8powhFel75G_xGbe6P7MKNKRvGcuvbP0")
const MapComponent = () => {
  const [userLocation, setUserLocation] = useState({
    latitude: 23.7808186,
    longitude: 90.337287,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  });
  const [geofenceRadius, setGeofenceRadius] = useState((prevSelectedAddress.radius > 10 ? 10 : prevSelectedAddress.radius) * 500)

  const [address, setAddress] = useState("")
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
        const { code, message } = error;
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
    dispatch({ type: 'map_region', payload: { mapRegion: region } }); // if using useReducer
    // setMapRegionState(region); // if using useState
  };

  useEffect(() => {
    getCurrentLocationOfUser();
    return () => {
      console.log('cleanup');
    };
  }, []);

  const onChangeGeoFenceRadius = (radius) => {
    setGeofenceRadius(radius * 1000);
  }

  const onPressMap = async (e) => {
    const { longitude, latitude } = e.nativeEvent.coordinate
    try {
      const result = await Geocoder.from(latitude, longitude)
      const address = result.results[0].formatted_address
      setAddress(address)
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ ...StyleSheet.absoluteFillObject, }}
        region={userLocation}
        onPress={onPressMap}
      //   onRegionChange={onRegionChange}
      >
        <Marker coordinate={userLocation} tracksViewChanges={false}>
        </Marker>
        <Circle
          center={userLocation}
          radius={geofenceRadius}
          strokeWidth={4}
          strokeColor={"green"}
        />
      </MapView>

      <View style={{ top: 30 }}>
        <Slider
          style={{
            height: 20,
            marginLeft: 15,
            marginRight: 15,
          }}
          step={1}
          maximumValue={10}
          animationType={'spring'}
          value={sliderInitial}
          thumbTintColo={"green"}
          minimumTrackTintColor={"green"}
          maximumTrackTintColo={"grey"}
          onValueChange={onChangeGeoFenceRadius}

        />
      </View>
      {address !== "" &&
        <View style={{ position: 'absolute', bottom: 40, right: 10 }}>
          <Text style={{ color: "black", fontSize: 20, fontWeight: "bold", paddingBottom: 10 }}>Address : {address}</Text>
        </View>}
      <View style={{ position: 'absolute', bottom: 10, right: 10 }}>
        <Button
          title="Get Current Location"
          onPress={getCurrentLocationOfUser}
        />
      </View>
    </View>
  );
};

export default MapComponent;
