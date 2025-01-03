import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";

export default function ChatRoomHeader({ user, router }) {
  return (
    <Stack.Screen
      options={{
        title: "",
        headerShadowVisible: false,
        headerLeft: () => {
          return (
            <View className="flex-row items-center gap-1 mx-1">
              <TouchableOpacity onPress={() => router.back()}>
                <Entypo name="chevron-left" size={hp(4)} color="#737373" />
              </TouchableOpacity>
              <View className="flex-row items-center gap-5">
                <Image
                  style={{ height: hp(6), width: wp(6), borderRadius: 100 }}
                  source={user?.profileUrl}
                />
                <Text
                  style={{ fontSize: hp(2.5) }}
                  className="text-neutral-700 font-medium capitalize"
                >
                  {user?.username}
                </Text>
              </View>
            </View>
          );
        },
        headerRight: () => {
          return (
            <View className="flex-row items-center gap-8 mr-4">
              <Ionicons name="call" size={hp(2.8)} color="#737373" />
              <Ionicons name="videocam" size={hp(2.8)} color="#737373" />
            </View>
          );
        },
      }}
    />
  );
}
