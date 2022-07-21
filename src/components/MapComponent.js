import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_PLACES_APIKEY } from "@env";
import { Marker } from "react-native-maps";
import Constants from "expo-constants";

import { PlacesAutocomplete } from "./PlacesAutocomplete";
import MapView from "./MapView";
import MapDirections from "./MapDirections";
import { currentLocation } from "../Screens/HomeScreen";
import Button from "./Button";

export default function MapComponent() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [inputs, setInputs] = useState({
    lookingForDriver: false,
    buttonText: "REQUEST 🚗",
    driverIsOnTheWay: false,
    predictions: [],
  });
  const mapRef = useRef(null);

  let travelTo;

  const moveTo = async (position) => {
    const camera = await mapRef.current.getCamera();

    if (camera) {
      camera.center = position;
      mapRef.current.animateCamera(camera, { duration: 1000 });
    }
  };

  const edgePaddingValue = 60;

  const edgePadding = {
    top: edgePaddingValue,
    bottom: edgePaddingValue,
    right: edgePaddingValue,
    left: edgePaddingValue,
  };

  const traceRoute = () => {
    if (origin && destination) {
      mapRef.current.fitToCoordinates([origin, destination], { edgePadding });
    }
  };

  const traceRouteOnReady = (args) => {
    if (args) {
      setDistance(args.distance);
      setDuration(args.duration);
    }
  };

  const onPlaceSelected = (details, flag) => {
    const set = flag === "origin" ? setOrigin : setDestination;
    const position = {
      latitude: details?.geometry.location.lat,
      longitude: details?.geometry.location.lng,
    };

    set(position);
    moveTo(position);
  };

  const requestDriver = () => {
    setInputs({ lookingForDriver: true });
    const socket = io(socketIoURL);

    socket.on("connect", () => {
      const routeResponse = [origin, destination];
      //Request a Truck!
      socket.emit("truckRequest", routeResponse);
    });

    socket.on("driverLocation", (driverLocation) => {
      travelTo = destination;
      console.log(`Client's destination ${destination}`);
      setOrigin(driverLocation);
      setDestination(currentLocation);
      console.log(`Current location ${currentLocation}`);

      setInputs({
        buttonText: "TRUCK IS ON THE WAY!",
        lookingForDriver: false,
        driverIsOnTheWay: true,
        driverLocation,
      });
    });
  };

  if (lookingForDriver) {
    findingDriverActIndicator = (
      <ActivityIndicator
        size="large"
        animating={lookingForDriver}
        color="white"
      />
    );
  }

  const driverToClient = (driverLoc) => {
    travelTo = destination;
    console.log(`Client's destination ${destination}`);
    setOrigin(driverLoc);
    setDestination(currentLocation);
    console.log(`Current location ${currentLocation}`);
  };

  driverToClient({ latitude: 0.53368, longitude: 35.28515 });

  return (
    <>
      <MapView reference={mapRef}>
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {origin && destination && traceRoute()}
        <MapDirections
          placeOrigin={origin}
          placeDest={destination}
          trackRouteOnReady={traceRouteOnReady}
        />
      </MapView>
      <View style={styles.searchContainer}>
        <PlacesAutocomplete
          placeholder="Origin"
          onPlaceSelected={(details = null) => {
            onPlaceSelected(details, "origin");
          }}
        />
        <View style={styles.compContainer}>
          <PlacesAutocomplete
            placeholder="Destination"
            onPlaceSelected={(details = null) => {
              onPlaceSelected(details, "destination");
            }}
          />
        </View>
        {duration && distance ? (
          <View>
            <Text>Distance : {distance.toFixed(2)} km</Text>
            <Text>Duration : {Math.ceil(duration)} min</Text>
          </View>
        ) : null}
      </View>
      <Button onPress={requestDriver}>
        {lookingForDriver && (
          <ActivityIndicator
            size="large"
            animating={lookingForDriver}
            color="white"
          />
        )}
        {inputs.buttonText}
      </Button>
    </>
  );
}

const styles = StyleSheet.create({
  compContainer: {
    marginVertical: 10,
  },
  button: {},
  buttonText: {},
  searchContainer: {
    position: "absolute",
    width: "90%",
    marginTop: 40,
    marginLeft: 20,
    // alignItems: "center",
    // justifyContent: "center",
    top: Constants.statusBarHeight,
  },
  searchContainerBelow: {
    position: "absolute",
    width: "90%",
    marginTop: 40,
    backgroundColor: "white",
    elevation: 6,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
});
