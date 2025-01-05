import React from "react";
import { Tabs } from "expo-router";
import HomeHeader from "../../components/HomeHeader";
import { Icon } from "@iconify/react";

export default function _layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "home")
            iconName = focused
              ? "material-symbols:home-rounded"
              : "material-symbols:home-outline-rounded";
          if (route.name === "chat")
            iconName = focused
              ? "fluent:chat-16-filled"
              : "fluent:chat-16-regular";
          if (route.name === "friends")
            iconName = focused
              ? "fluent:people-16-filled"
              : "fluent:people-16-regular";

          return (
            <Icon icon={iconName} width={size} height={size} color={color} />
          );
        },
        tabBarActiveTintColor: "#7e149f",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          header: () => <HomeHeader name={"Home"} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          header: () => <HomeHeader name={"Chats"} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          header: () => <HomeHeader name={"Friends"} />,
        }}
      />
    </Tabs>
  );
}
