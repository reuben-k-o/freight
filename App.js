import React from "react";
import { StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Icon } from "react-native-elements";

import HomeScreen from "./src/Screens/HomeScreen";
import RequestScreen from "./src/Screens/RequestScreen";
import DestinationScreen from "./src/Screens/DestinationScreen";
import { colors } from "./src/global/styles";

const Home = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// export function DrawerNavigator() {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen
//         name="HomeStack"
//         component={HomeStack}
//         options={{
//           title: "Home",
//           drawerIcon: ({ focussed, size }) => (
//             <Icon
//               type="material-community"
//               name="home"
//               color={focussed ? "#7cc" : colors.grey2}
//               size={size}
//             />
//           ),
//           headerShown: false,
//         }}
//       />
//     </Drawer.Navigator>
//   );
// }

export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#351401" },
        headerTintColor: "white",
        sceneContainerStyle: { backgroundColor: "#3f2f25" },
        drawerContentStyle: { backgroundColor: "#351401" },
        drawerInactiveTintColor: "white",
        drawerActiveTintColor: "#351401",
        drawerActiveBackgroundColor: "#e4baa1",
      }}
    >
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "Home",
          drawerIcon: ({ focussed, size }) => (
            <Icon
              type="material-community"
              name="home"
              color={focussed ? "#7cc" : colors.grey2}
              size={size}
            />
          ),
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="RequestScreen"
        component={RequestScreen}
        options={{ headerShown: false }}
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
