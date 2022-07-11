import { StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";

import { HomeScreen } from "./src/pages";
import RootNavigator from "./src/router/RootNavigator";

const App = () => {
  return <RootNavigator />;
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
