import axios from "axios";
import { useContext, useEffect, useState } from "react";

import { StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../../store/auth-context";
import { BACKEND_URL } from "@env";

function WelcomeScreen() {
  const [fetchedMessage, setFetchedMesssage] = useState("");

  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  useEffect(() => {
    axios.get(BACKEND_URL + "message.json?auth=" + token).then((response) => {
      setFetchedMesssage(response.data);
    });
    //prove authenticated by sending the token with the request, also in order to be able to access protected resource
  }, [token]);

  return (
    <View style={styles.rootContainer}>
      <Text style={styles.title}>Welcome onboard!</Text>
      <Text style={styles.text}>You authenticated successfully!</Text>
      <Text style={styles.textFetch}>{fetchedMessage}</Text>
    </View>
  );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 20,
    // marginVertical: 16,
  },
  textFetch: {
    fontSize: 17,
    marginTop: 20,
  },
});
