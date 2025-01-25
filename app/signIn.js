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
import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loader from "../components/Loader";
import CustomKeyBoardView from "../components/CustomKeyBoardView";
import { useAuth } from "../context/authContext";

export default function SignIn() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const mailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    if (!mailRef.current || !passwordRef.current) {
      Alert.alert("SignIn", "Please fill all the fields");
      return;
    }
    setLoading(true);
    const response = await login(mailRef.current, passwordRef.current);
    setLoading(false);
    if (!response.success) {
      Alert.alert("SignIn", response.msg);
    }
  };

  return (
    <CustomKeyBoardView>
      <StatusBar style="dark" />
      <View
        style={{ paddingTop: hp(8), paddingHorizontal: wp(5), height: "100%" }}
        className="flex-1 gap-12"
      >
        <View className="items-center">
          <Image
            style={{ height: hp(25) }}
            resizeMode="contain"
            source={require("../assets/images/signIn.jpg")}
          />
        </View>

        <View className="gap-10">
          <Text
            style={{ fontSize: hp(4) }}
            className="font-bold tracking-wider text-center text-neutral-800"
          >
            SignIn
          </Text>
          <View className="gap-4">
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
            <View className="gap-3">
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
              <Text
                style={{ fontSize: hp(1.8) }}
                className="font-semibold text-right text-neutral-500"
              >
                Forget password?
              </Text>
            </View>

            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loader size={hp(12)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleLogin}
                  style={{ height: hp(6.5), backgroundColor: "#7c1bbf" }}
                  className="rounded-xl justify-center items-center"
                >
                  <Text
                    style={{ height: hp(2.4) }}
                    className="text-white font-bold tracking-wider"
                  >
                    SignIn
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View className="flex-row justify-center">
              <Text
                style={{ height: hp(2.5) }}
                className="font-semibold text-neutral-500"
              >
                Don't have an account?
              </Text>{" "}
              <Pressable onPress={() => router.push("SignUp")}>
                <Text
                  style={{ height: hp(2.5), color: "#7c1bbf" }}
                  className="font-bold text-neutral-500"
                >
                  SignUp
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyBoardView>
  );
}
