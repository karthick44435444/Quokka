import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Feather, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loader from "../components/Loader";
import CustomKeyBoardView from "../components/CustomKeyBoardView";
import { useAuth } from "../context/authContext";

export default function SignUp() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { register } = useAuth();

  const mailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef("");
  const profileRef = useRef("");

  const handleSignUp = async () => {
    if (
      !mailRef.current ||
      !passwordRef.current ||
      !usernameRef.current ||
      !profileRef.current
    ) {
      Alert.alert("SignUp", "Please fill all the fields");
      return;
    }
    setLoading(true);
    let response = await register(
      mailRef.current,
      passwordRef.current,
      usernameRef.current,
      profileRef.current
    );
    setLoading(false);
    if (!response?.success) {
      Alert.alert("SignUp", response.msg);
    }
  };

  return (
    <CustomKeyBoardView>
      <StatusBar style="dark" />
      <View
        style={{ paddingTop: hp(7), paddingHorizontal: wp(5), height: "100%" }}
        className="flex-1 gap-12"
      >
        <View className="items-center">
          <Image
            style={{ height: hp(20) }}
            resizeMode="contain"
            source={require("../assets/images/signUp.jpg")}
          />
        </View>

        <View className="gap-10">
          <Text
            style={{ fontSize: hp(4) }}
            className="font-bold tracking-wider text-center text-neutral-800"
          >
            Sign Up
          </Text>
          <View className="gap-4">
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl"
            >
              <Feather name="user" size={hp(2.7)} color={"gray"} />
              <TextInput
                onChangeText={(value) => (usernameRef.current = value)}
                style={{ height: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Username"
                placeholderTextColor={"gray"}
              />
            </View>
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl"
            >
              <Octicons name="mail" size={hp(2.7)} color={"gray"} />
              <TextInput
                onChangeText={(value) => (mailRef.current = value)}
                style={{ height: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Email address"
                placeholderTextColor={"gray"}
              />
            </View>
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl"
            >
              <Octicons name="lock" size={hp(2.7)} color={"gray"} />
              <TextInput
                onChangeText={(value) => (passwordRef.current = value)}
                style={{ height: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Password"
                secureTextEntry
                placeholderTextColor={"gray"}
              />
            </View>
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl"
            >
              <Feather name="image" size={hp(2.7)} color={"gray"} />
              <TextInput
                onChangeText={(value) => (profileRef.current = value)}
                style={{ height: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Profile Url"
                placeholderTextColor={"gray"}
              />
            </View>

            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loader size={hp(12)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleSignUp}
                  style={{ height: hp(6.5), backgroundColor: "#800080" }}
                  className="rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ height: hp(2.4) }}
                    className="text-white font-bold tracking-wider"
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View className="flex-row justify-center">
              <Text
                style={{ height: hp(2.5) }}
                className="font-semibold text-neutral-500"
              >
                Already have an account?
              </Text>{" "}
              <Pressable onPress={() => router.push("SignIn")}>
                <Text
                  style={{ height: hp(2.5), color: "#800080" }}
                  className="font-bold text-neutral-500"
                >
                  SignIn
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyBoardView>
  );
}
