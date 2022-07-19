import React, { Component, useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  Image,
} from "react-native";
import MapView, { Polyline, Marker } from "react-native-maps";
import apiKey from "../google_api_key";
import { io } from "socket.io-client";
import BottomButton from "../components/BottomButton";
import { baseURL, socketIoURL } from "../baseUrl";
import Button from "./Button";

function RequestTruck({ routeResponse, pointCoords }) {
  const [inputs, setInputs] = useState({
    lookingForDriver: false,
    buttonText: "REQUEST 🚗",
    driverIsOnTheWar: false,
    predictions: [],
  });

  const requestDriver = () => {
    //  this.setState({ lookingForDriver: true });

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

  return (
    <>
      {driverIsOnTheWay && (
        <Marker coordinate={driverLocation}>
          <Image
            source={require("../images/lorrytruck.jpg")}
            style={{ width: 40, height: 40 }}
          />
        </Marker>
      )}
      {lookingForDriver && (
        <ActivityIndicator
          size="large"
          animating={lookingForDriver}
          color="white"
        />
      )}
      {pointCoords.length > 1 &&
        (<Marker coordinate={pointCoords[pointCoords.length - 1]} />)(
          <Button onPress={() => requestDriver()}>
            {findingDriverActIndicator}
          </Button>
        )}
    </>
  );
}

export default class Passenger extends Component {
  render() {
    if (this.props.latitude === null) {
      return null;
    }

    if (this.state.driverIsOnTheWar) {
      driverMarker = (
        <Marker coordinate={driverLocation}>
          <Image
            source={require("../images/carIcon.png")}
            style={{ width: 40, height: 40 }}
          />
        </Marker>
      );
    }

    if (this.state.lookingForDriver) {
      findingDriverActIndicator = (
        <ActivityIndicator
          size="large"
          animating={this.state.lookingForDriver}
          color="white"
        />
      );
    }

    if (this.props.pointCoords.length > 1) {
      marker = (
        <Marker
          coordinate={this.props.pointCoords[this.props.pointCoords.length - 1]}
        />
      );
      getDriver = (
        <BottomButton
          onPressFunction={() => this.resquestDriver()}
          buttonText={this.state.buttonText}
        >
          {findingDriverActIndicator}
        </BottomButton>
      );
    }
    const predictions = this.state.predictions.map((prediction) => (
      <TouchableHighlight
        onPress={async () => {
          const destinationName = await this.props.getRouteDirections(
            prediction.place_id,
            prediction.structured_formatting.main_text
          );
          this.setState({ predictions: [], destination: destinationName });
          this.map.fitToCoordinates(this.props.pointCoords, {
            edgePadding: { top: 20, bottom: 20, left: 80, right: 80 },
          });
        }}
        key={prediction.place_id}
      >
        <View>
          <Text style={styles.suggestions}>
            {prediction.structured_formatting.main_text}
          </Text>
        </View>
      </TouchableHighlight>
    ));

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
          <Polyline
            coordinates={this.props.pointCoords}
            strokeWidth={2}
            strokeColor="red"
          />
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
}

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
