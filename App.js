import React, { useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";

import HomeScreen from "./src/Screens/HomeScreen";
import RequestScreen from "./src/Screens/RequestScreen";
import DestinationScreen from "./src/Screens/DestinationScreen";
import ProfileScreen from "./src/Screens/ProfileScreen";
import { colors } from "./src/global/styles";
import LoginScreen from "./src/Screens/LoginScreen";
import SignupScreen from "./src/Screens/SignupScreen";
import { Colors } from "./src/constants/styles";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import IconButton from "./src/components/ui/IconButton";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
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
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="exit"
              color={colors.black}
              size={24}
              onPress={authCtx.logout}
            />
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

// export function DrawerNavigator() {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         headerStyle: { backgroundColor: "#351401" },
//         // headerTintColor: "white",
//         sceneContainerStyle: { backgroundColor: colors.blue },
//         drawerContentStyle: { backgroundColor: colors.white },
//         drawerInactiveTintColor: colors.black,
//         drawerActiveTintColor: colors.white,
//         drawerActiveBackgroundColor: colors.blue,
//         drawerInactiveBackgroundColor: colors.primary,
//       }}
//     >
//       <Drawer.Screen
//         name="HomeScreen"
//         component={HomeScreen}
//         options={{
//           title: "Home",
//           drawerIcon: ({ focussed, size }) => (
//             <Ionicons name="home" color={colors.black} size={size} />
//           ),
//           headerRight: ({ tintColor }) => (
//             <IconButton
//               icon="exit"
//               color={tintColor}
//               size={24}
//               onPress={authCtx.logout}
//             />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Drawer.Screen
//         name="RequestScreen"
//         component={RequestScreen}
//         options={{
//           title: "Request Truck",
//           drawerIcon: ({ focussed, size }) => (
//             <Fontisto name="truck" size={size} color={colors.black} />
//           ),
//           headerShown: false,
//         }}
//       />
//       <Drawer.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           title: "Profile",
//           drawerIcon: ({ size, focussed }) => (
//             <Ionicons
//               name="person"
//               size={size}
//               color={focussed ? colors.white : colors.black}
//             />
//           ),
//           headerShown: false,
//         }}
//       />
//     </Drawer.Navigator>
//   );
// }

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
