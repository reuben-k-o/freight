import { StyleSheet, Text, View, Image, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../global/styles";

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image
          style={styles.image}
          source={{
            uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
          }}
        />
      </View>
      <Text style={styles.titleText}> Aileen Harris</Text>
      <View style={styles.buttonEdit}>
        <Button title="Edit Profile" color={colors.primary} />
      </View>
      <View style={styles.iconContainer}>
        <View style={styles.info}>
          <Ionicons name="chatbubbles" size={24} />
          <Text>Chat</Text>
        </View>
        <View style={styles.info}>
          <Ionicons name="ios-car" size={24} />
          <Text>Trips</Text>
        </View>
        <View style={styles.info}>
          <Ionicons name="md-card" size={24} />
          <Text>Payments</Text>
        </View>
        <View style={styles.info}>
          <Ionicons name="md-notifications" size={24} />
          <Text>Notifications</Text>
        </View>
        <View style={styles.info}>
          <Ionicons name="md-heart" size={24} />
          <Text>Favorites</Text>
        </View>
        <View style={styles.info}>
          <Ionicons name="ios-locate-outline" size={24} />
          <Text>location</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  top: {
    height: 250,
    width: "100%",
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  image: {
    marginBottom: -70,
    borderRadius: 75,
    height: 150,
    width: 150,
    borderWidth: 2,
    borderColor: colors.white,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 90,
  },
  buttonEdit: {
    marginVertical: 20,
  },
  iconContainer: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    alignContent: "space-around",
    marginVertical: 40,
    marginHorizontal: 20,
    backgroundColor: colors.white,
    borderRadius: 8,
    elevation: 8,
  },
  info: {
    height: 80,
    width: 80,
    margin: 10,
    backgroundColor: colors.white,
    borderRadius: 6,
    elevation: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
