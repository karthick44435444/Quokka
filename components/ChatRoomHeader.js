import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { blurhash } from "../utils/commom";

export default function ChatRoomHeader({ user, router, component }) {
  return (
    <View className="flex-row items-center justify-between gap-1 px-1 py-2">
      <View className="flex-row items-center gap-1 mx-1 mt-2">
        <TouchableOpacity onPress={() => router.push(component)}>
          <Entypo name="chevron-left" size={hp(4)} color="#737373" />
        </TouchableOpacity>
        <View className="flex-row items-center gap-5">
          <Image
            style={{ height: hp(5), width: hp(5), borderRadius: 100 }}
            source={user?.profileUrl}
            placeholder={blurhash}
            transition={500}
          />
          <Text
            style={{ fontSize: hp(2.5) }}
            className="text-neutral-700 font-medium capitalize"
          >
            {user?.username}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-8 mr-4">
        <Ionicons name="call" size={hp(2.8)} color="#737373" />
        <Ionicons name="videocam" size={hp(2.8)} color="#737373" />
      </View>
    </View>
  );
}
