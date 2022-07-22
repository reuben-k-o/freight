import { Text, StyleSheet, View, ActivityIndicator } from "react-native";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Marker } from "react-native-maps";
import Constants from "expo-constants";
import { io } from "socket.io-client";
import Geocoder from "react-native-geocoding";

import { PlacesAutocomplete } from "./PlacesAutocomplete";
import MapView from "./MapView";
import MapDirections from "./MapDirections";
import { currentLocation } from "../Screens/HomeScreen";
import { socketIoURL } from "../../baseUrl";
import Button from "./Button";
import LoadingOverlay from "./ui/LoadingOverlay";
import { GOOGLE_PLACES_APIKEY } from "@env";

export default function MapComponent() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [inputs, setInputs] = useState({
    lookingForDriver: false,
    buttonText: "REQUEST 🚗",
    driverIsOnTheWay: false,
  });
  const mapRef = useRef(null);

  Geocoder.init(GOOGLE_PLACES_APIKEY);

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
    setInputs((curInputs) => {
      return { ...curInputs, lookingForDriver: true };
    });
    const socket = io(socketIoURL);

    socket.on("connect", () => {
      const routeResponse = [origin, destination];
      //Request a Truck!
      socket.emit("truckRequest", routeResponse);
      console.log(`Client's route response ${routeResponse[0].latitude}`);
      Geocoder.from(origin).then((json) => {
        const address = json.results[0].address_components;
        console.log(address);
      });
    });

    socket.on("driverLocation", (driverLocation) => {
      console.log(`Client's destination ${destination}`);
      setOrigin(driverLocation);
      setDestination(currentLocation);
      console.log(`Current location ${currentLocation}`);
      console.log(`Driver location ${driverLocation}`);

      setInputs((curInputs) => {
        return {
          ...curInputs,
          buttonText: "TRUCK IS ON THE WAY!",
          lookingForDriver: false,
          driverIsOnTheWay: true,
        };
      });
    });
  };

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
        {inputs.lookingForDriver && <LoadingOverlay />}
      </View>
      <View style={styles.bottomButton}>
        <Button onPress={requestDriver} style={styles.requestButton}>
          {inputs.buttonText}
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  compContainer: {
    marginVertical: 10,
  },
  button: {},
  bottomButton: {
    width: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 650,
  },
  requestButton: {
    padding: 60,
    fontSize: 24,
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    marginTop: 40,
    marginLeft: 20,
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
