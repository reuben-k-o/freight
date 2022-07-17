import React from "react";
import { StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons, Fontisto } from "@expo/vector-icons";

import HomeScreen from "./src/Screens/HomeScreen";
import RequestScreen from "./src/Screens/RequestScreen";
import DestinationScreen from "./src/Screens/DestinationScreen";
import ProfileScreen from "./src/Screens/ProfileScreen";
import { colors } from "./src/global/styles";

const Home = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#351401" },
        // headerTintColor: "white",
        sceneContainerStyle: { backgroundColor: colors.blue },
        drawerContentStyle: { backgroundColor: colors.white },
        drawerInactiveTintColor: colors.black,
        drawerActiveTintColor: colors.white,
        drawerActiveBackgroundColor: colors.blue,
        drawerInactiveBackgroundColor: colors.primary,
      }}
    >
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "Home",
          drawerIcon: ({ focussed, size }) => (
            <Ionicons name="home" color={colors.black} size={size} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="RequestScreen"
        component={RequestScreen}
        options={{
          title: "Request Truck",
          drawerIcon: ({ focussed, size }) => (
            <Fontisto name="truck" size={size} color={colors.black} />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
          drawerIcon: ({ size, focussed }) => (
            <Ionicons
              name="person"
              size={size}
              color={focussed ? colors.white : colors.black}
            />
          ),
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Home.Navigator>
        <Home.Screen
          name="StartScreen"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        <Home.Screen
          name="Destination"
          component={DestinationScreen}
          options={{ headerShown: false }}
        />
      </Home.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
