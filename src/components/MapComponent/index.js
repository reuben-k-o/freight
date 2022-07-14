import { Text, StyleSheet, View } from "react-native";
import React, { Component, useState } from "react";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
  Callout,
} from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY, GOOGLE_PLACES_APIKEY } from "@env";
import Constants from "expo-constants";
import { mapStyle } from "../../global/mapStyle";

import { carsAround } from "../../global/data";

export const GooglePlacesInput = ({ placeholder, onPress }) => {
  return (
    <View style={styles.searchContainer}>
      <GooglePlacesAutocomplete
        placeholder={placeholder}
        styles={{ textInput: styles.inputText }}
        onPress={onPress}
        query={{
          key: GOOGLE_PLACES_APIKEY,
          language: "en",
        }}
        currentLocation={true}
      />
    </View>
  );
};

export default function MapComponent() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const onPlaceSelected = (details, flag) => {
    const set = flag === "origin" ? setOrigin : setDestination;
  };

  const INITIAL_POSITION = {
    latitude: 0.29365,
    longitude: 35.2851,
    latitudeDelta: 5.9,
    longitudeDelta: 2.0,
  };
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={INITIAL_POSITION}
        // customMapStyle={mapStyle}
        showsUserLocation={true}
        followUserLocation={true}
        rotateEnabled={true}
        zoomEnabled={true}
      >
        <Marker
          coordinate={{ latitude: 0.29365, longitude: 35.2851 }}
          title={"Eldoret"}
        >
          <Callout>
            <Text>Eldoret</Text>
          </Callout>
        </Marker>
        {carsAround.map((marker) => (
          <Marker
            key={marker.latitude}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          ></Marker>
        ))}
      </MapView>
      <GooglePlacesInput
        placeholder="Origin"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
      />
      <View style={styles.compContainer}>
        <GooglePlacesInput
          placeholder="Destination"
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    alignItems: "center",
  },
  map: {
    height: "100%",
    width: "100%",
  },
  compContainer: {
    marginTop: 80,
    alignContent: "center",
    alignItems: "center",
    height: 30,
    width: "100%",
    position: "absolute",
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    margin: 4,
    backgroundColor: "white",
    elevation: 6,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  searchContainerBelow: {
    position: "absolute",
    width: "90%",
    marginTop: 20,
    backgroundColor: "white",
    elevation: 6,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  inputText: {},
});
