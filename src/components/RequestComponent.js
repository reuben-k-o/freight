import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { io } from "socket.io-client";
import { baseURL, socketIoURL } from "../baseUrl";
import Button from "./Button";

function RequestTruck() {
  const [inputs, setInputs] = useState({
    lookingForDriver: false,
    buttonText: "REQUEST 🚗",
    driverIsOnTheWay: false,
    predictions: [],
  });

  const requestDriver = () => {
    setInputs({ lookingForDriver: true });
    const socket = io(socketIoURL);

    socket.on("connect", () => {
      //Request a Truck!
      socket.emit("truckRequest", routeResponse);
    });

    socket.on("driverLocation", (driverLocation) => {
      const pointCoords = [...pointCoords, driverLocation];
      console.log("socket on driverlocation", pointCoords);
      console.log("driver Loc", driverLocation);
      this.map.fitToCoordinates(pointCoords, {
        edgePadding: { top: 40, bottom: 20, left: 20, right: 20 },
      });
      //this.getRouteDirections(routeResponse.geocoded_waypoints[0].place_id);
      setInputs({
        buttonText: "TRUCK IS ON THE WAY!",
        lookingForDriver: false,
        driverIsOnTheWay: true,
        driverLocation,
      });
    });
  };

  let marker = null;
  let getDriver = null;
  let findingDriverActIndicator = null;
  let driverMarker = null;

  if (driverIsOnTheWay) {
    driverMarker = (
      <Marker coordinate={driverLocation}>
        <Image
          source={require("../images/lorrytruck.jpg")}
          style={{ width: 40, height: 40 }}
        />
      </Marker>
    );
  }

  if (lookingForDriver) {
    findingDriverActIndicator = (
      <ActivityIndicator
        size="large"
        animating={lookingForDriver}
        color="white"
      />
    );
  }

  if (pointCoords.length > 1) {
    marker = (<Marker coordinate={pointCoords[pointCoords.length - 1]} />)(
      <Button onPress={() => requestDriver()}>
        {lookingForDriver && (
          <ActivityIndicator
            size="large"
            animating={lookingForDriver}
            color="white"
          />
        )}
        {inputs.buttonText}
      </Button>
    );
  }
  return (
    <View style={styles.mapStyle}>
      <MapView
        ref={(map) => {
          this.map = map;
        }}
        style={styles.mapStyle}
        initialRegion={{
          latitude: this.props.latitude,
          longitude: this.props.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}
      >
        {marker}
        {driverMarker}
      </MapView>

      <TextInput
        placeholder="Enter destination..."
        style={styles.destinationInput}
        value={this.state.destination}
        clearButtonMode="always"
        onChangeText={(destination) => {
          this.props.destination = destination;
          //this.setState({destination});
          this.onChangeDestination(destination);
        }}
      />
      {predictions}
      {getDriver}
    </View>
  );
}

export default RequestTruck;

const styles = StyleSheet.create({
  bottomButton: {
    backgroundColor: "black",
    padding: 20,
    paddingRight: 40,
    paddingLeft: 40,
    marginTop: "auto",
    margin: 20,
    alignSelf: "center",
  },
  bottomButtonText: {
    color: "white",
    fontSize: 20,
  },
  suggestions: {
    backgroundColor: "white",
    fontSize: 14,
    padding: 5,
    borderWidth: 0.5,
    marginRight: 20,
    marginLeft: 20,
  },
  destinationInput: {
    height: 40,
    borderWidth: 0.5,
    marginTop: 50,
    marginRight: 20,
    marginLeft: 20,
    padding: 5,
    backgroundColor: "white",
  },
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },
});
