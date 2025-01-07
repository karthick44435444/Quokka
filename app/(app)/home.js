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

  const getGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <View className="flex-1 items-center justify-center">
        <Text style={{ fontSize: 30, fontWeight: "700" }}>Welcome!</Text>
        <Image
          style={{ height: hp(40), aspectRatio: 1, width: hp(40) }}
          source={logo}
        />
        <Text
          style={{ fontSize: 20, fontWeight: "600" }}
          className="text-neutral-500"
        >
          {getGreeting()}
        </Text>
        <Text
          style={{
            color: "#800080",
            fontWeight: "500",
            fontSize: 20,
            marginTop: 20,
          }}
        >
          {user?.username}
        </Text>
      </View>
    </View>
  );
}
