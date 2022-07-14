import { Text, StyleSheet, View } from "react-native";
import React, { Component, useRef, useState } from "react";
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

export const GooglePlacesInput = ({ placeholder, onPlaceSelected }) => {
  return (
    <GooglePlacesAutocomplete
      placeholder={placeholder}
      fetchDetails
      styles={{ textInput: styles.inputText }}
      onPress={(data, details = null) => {
        onPlaceSelected(details);
      }}
      query={{
        key: GOOGLE_PLACES_APIKEY,
        language: "en",
      }}
      currentLocation={true}
    />
  );
};

export default function MapComponent() {
  const mapRef = useRef(null);

  const moveTo = async (position) => {
    const camera = await mapRef.current.getCamera();

    if (camera) {
      camera.center = position;
      mapRef.current.animateCamera(camera, { duration: 1000 });
    }
  };

  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  const onPlaceSelected = (details, flag) => {
    const set = flag === "origin" ? setOrigin : setDestination;
    const position = {
      latitude: details?.geometry.location.lat,
      longitude: details?.geometry.location.lng,
    };

    set(position);
    moveTo(position);
  };

  const INITIAL_POSITION = {
    latitude: 0.5143,
    longitude: 35.2698,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
    // latitudeDelta: 5.9,
    // longitudeDelta: 2.0,
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={INITIAL_POSITION}
        // customMapStyle={mapStyle}
        showsUserLocation={true}
        followUserLocation={true}
        rotateEnabled={true}
        zoomEnabled={true}
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}

        {/* {carsAround.map((marker) => (
          <Marker
            key={marker.latitude}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
          ></Marker>
        ))} */}
      </MapView>
      <View style={styles.searchContainer}>
        <GooglePlacesInput
          placeholder="Origin"
          onPlaceSelected={(details = null) => {
            onPlaceSelected(details, "origin");
            // 'details' is provided when fetchDetails = true
          }}
        />
        <View style={styles.compContainer}>
          <GooglePlacesInput
            placeholder="Destination"
            onPlaceSelected={(details = null) => {
              // 'details' is provided when fetchDetails = true
              onPlaceSelected(details, "destination");
            }}
          />
        </View>
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
    marginVertical: 10,
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
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
  inputText: {
    // borderWidth: 1,
    borderRadius: 6,
    elevation: 16,
  },
});
