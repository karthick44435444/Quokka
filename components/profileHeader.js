import { View, Text, TouchableOpacity, Platform } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ios = Platform.OS == "ios";

export default function ProfileHeader() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: ios ? top : top + 10, backgroundColor: "#800080" }}
      className="flex-row items-center rounded-b-3xl px-5 pb-3 shadow"
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Entypo name="chevron-left" size={hp(4)} color="#fff" />
      </TouchableOpacity>
      <Text
        style={{
          color: "#fff",
          alignSelf: "center",
          fontSize: "18px",
          fontWeight: 500,
          marginLeft: "15px",
        }}
      >
        Profile
      </Text>
    </View>
  );
}
