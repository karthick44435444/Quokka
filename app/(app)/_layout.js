import React from "react";
import { Tabs } from "expo-router";
import HomeHeader from "../../components/HomeHeader";
import { Ionicons } from "@expo/vector-icons";

export default function _layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "home")
            iconName = focused ? "home" : "home-outline";
          if (route.name === "chat")
            iconName = focused ? "chatbubble-ellipses" : "chatbubble-outline";
          if (route.name === "friends")
            iconName = focused ? "people" : "people-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
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
