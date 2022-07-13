import { Text, StyleSheet, View } from "react-native";
import React, { Component } from "react";
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
  Callout,
} from "react-native-maps";
import { mapStyle } from "../../global/mapStyle";

import { carsAround } from "../../global/data";

export default function MapComponent() {
  return (
    <View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: 0.29365,
          longitude: 35.2851,
          latitudeDelta: 5.9,
          longitudeDelta: 2.0,
        }}
        // customMapStyle={mapStyle}
        // showsUserLocation={true}
        // followUserLocation={true}
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

        {/* <Polyline
          coordinates={[
            { latitude: 0.32365, longitude: 34.2851 },
            { latitude: 0.0737, longitude: 35.18519 },
          ]}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeColors={[
            "#7F0000",
            "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
            // "#B24112",
            // "#E5845C",
            // "#238C23",
            // "#7F0000",
          ]}
          strokeWidth={6}
        /> */}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: "100%",
    width: "100%",
  },
});
