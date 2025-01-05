import { View, Text, Platform } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { blurhash } from "../utils/commom";
import { useAuth } from "../context/authContext";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { MenuItems } from "./CustomMenuItems";
import { AntDesign, Feather } from "@expo/vector-icons";

const ios = Platform.OS == "ios";
export default function HomeHeader({ name }) {
  const { user, logout } = useAuth();

  const { top } = useSafeAreaInsets();

  const Divider = () => {
    return <View className="p-[1px] w-full bg-neutral-200" />;
  };

  const handleProfile = () => {};
  const handleLogout = async () => {
    await logout();
  };
  return (
    <View
      style={{ paddingTop: ios ? top : top + 10, backgroundColor: "#800080" }}
      className="flex-row justify-between rounded-b-3xl px-5 pb-3 shadow"
    >
      <View>
        <Text style={{ fontSize: hp(3) }} className="font-medium text-white">
          {name}
        </Text>
      </View>
      <View>
        <Menu>
          <MenuTrigger
            customStyles={{
              triggerWrapper: {
                // triggerWrapper
              },
            }}
          >
            <Image
              style={{ height: hp(4.3), aspectRatio: 1, borderRadius: 100 }}
              source={user?.profileUrl}
              placeholder={{ blurhash }}
              transition={500}
            />
          </MenuTrigger>
          <MenuOptions
            customStyles={{
              optionsContainer: {
                borderRadius: 10,
                borderCurve: "continuous",
                marginTop: 32,
                marginLeft: -20,
                backgroundColor: "#fff",
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 1 },
                width: 160,
              },
            }}
          >
            <MenuItems
              text={"Profile"}
              action={handleProfile}
              value={null}
              icon={<Feather name="user" size={hp(2.5)} color={"#737373"} />}
            />
            <Divider />
            <MenuItems
              text={"Logout"}
              action={handleLogout}
              value={null}
              icon={
                <AntDesign name="logout" size={hp(2.5)} color={"#737373"} />
              }
            />
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
}
