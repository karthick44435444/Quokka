import { View, Text, ScrollView } from "react-native";
import React from "react";
import MessagesItem from "./MessagesItem";

export default function MessagesList({ messages, currectUser, scrollViewRef }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 10,
      }}
      ref={scrollViewRef}
    >
      {messages.map((msg, index) => {
        return (
          <MessagesItem message={msg} key={index} currectUser={currectUser} />
        );
      })}
    </ScrollView>
  );
}
