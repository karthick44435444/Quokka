import { View, Text } from "react-native";
import React from "react";
import ProfileHeader from "../components/profileHeader";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { blurhash } from "../utils/commom";
import { useAuth } from "../context/authContext";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { TouchableOpacity } from "react-native";

export default function Profile() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <ProfileHeader />
      <View className="flex-1 items-center justify-center bg-white">
        <Image
          style={{
            height: hp(30),
            width: hp(30),
            borderRadius: 25,
            marginBottom: 10,
          }}
          source={user?.profileUrl}
          placeholder={{ blurhash }}
          transition={500}
        />
        <Text
          className="px-2 text-neutral-800 font-medium"
          style={{
            fontSize: 25,
            marginTop: 20,
            marginBottom: 10,
            fontWeight: 500,
          }}
        >
          {user?.username}
        </Text>
        <Text
          className="px-2 text-neutral-500 font-medium"
          style={{
            fontSize: 20,
            marginTop: 10,
            marginBottom: 10,
            fontWeight: 500,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Email : </Text>
          {user?.email}
        </Text>
      </View>
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-neutral-200 p-2 rounded-full"
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: 500,
              color: "#800080",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
