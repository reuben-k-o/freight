import { Text, StyleSheet, View } from "react-native";
import React, { Component } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { mapStyle } from "../../global/mapStyle";

export default class MapComponent extends Component {
  render() {
    return (
      <View>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          customMapStyle={mapStyle}
          showsUserLocation={true}
          followUserLocation={true}
          rotateEnabled={true}
          zoomEnabled={true}></MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    height: "100%",
    width: "100%",
  },
});
