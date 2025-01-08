import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ProfileHeader from "../components/profileHeader";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams } from "expo-router";
import { Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";

export default function ViewProfile() {
  const user = useLocalSearchParams();

  console.log("user", user);

  return (
    <LinearGradient
      style={styles.container}
      colors={["rgba(140, 34, 255, 0.15)", "#ff94c040"]}
    >
      <StatusBar style="light" />
      <ProfileHeader title={user?.username} />
      <View style={styles.gradientBackground}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: user?.profileUrl }}
            style={styles.profileImage}
          />
          <Text style={styles.bioText}>
            {user?.bio || "Hey! There, I am a Quokka user"}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    flex: 1,
    alignItems: "center",
  },
  profileImage: {
    height: hp(30),
    width: hp(30),
    borderRadius: 1000,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: hp(2),
    marginTop: hp(4),
  },
  bioText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    width: wp(80),
    lineHeight: 25,
    marginTop: hp(1),
    paddingHorizontal: wp(5),
  },
});
