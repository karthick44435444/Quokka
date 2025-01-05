import { Text, View } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import logo from "../../assets/images/icon.png";
import { Image } from "expo-image";
import { blurhash } from "../../utils/commom";
import { useAuth } from "../../context/authContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <View className="flex-1 items-center">
        <Image
          style={{ height: hp(50), aspectRatio: 1, width: hp(50) }}
          source={logo}
          placeholder={{ blurhash }}
          transition={500}
        />
        <Text style={{ fontSize: "30px", fontWeight: "700" }}>Welcome !</Text>
        <Text
          style={{
            color: "#800080",
            fontWeight: "500",
            fontSize: "20px",
            marginTop: "20px",
          }}
        >
          {user?.username}
        </Text>
      </View>
    </View>
  );
}
