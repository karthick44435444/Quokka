import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  doc,
  serverTimestamp,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import TypingIndicator from "./TypingInticator";

export default function MessagesItem({
  message,
  currectUser,
  isLastMessage,
  seenStatus,
}) {
  const emojiRegex = /^[\p{Emoji}\p{Extended_Pictographic}]+$/u; // Regex to check if the text is only emojis

  const isEmojiOnly = emojiRegex.test(message.text);

  // Update lastSeen timestamp when the message is received by the current user
  const updateLastSeen = async (userId) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      lastSeen: serverTimestamp(),
      typing: false, // This will set the current server timestamp
    });
  };

  // Render seen/unseen status for the last message sent by the current user
  const renderSeenStatus = () => {
    if (isLastMessage && currectUser?.userId === message?.userId) {
      // If the last message is sent by the current user, show the seen status
      return (
        <Text
          style={{
            fontSize: hp(1.5),
            color: seenStatus ? "#fff" : "gray",
            marginTop: hp(0.5),
            alignSelf: "flex-end",
          }}
        >
          {seenStatus ? "Seen" : "Unseen"}
        </Text>
      );
    }
    return null; // No status for other cases
  };

  // Listen for when the user sends a message
  useEffect(() => {
    updateLastSeen(currectUser?.userId);
  }, [currectUser?.userId]);

  if (currectUser?.userId == message?.userId) {
    return (
      <View className="flex-row justify-end mb-3 mr-3">
        <View style={{ width: wp(80) }}>
          <View
            className={`flex self-end rounded-3xl ${
              isEmojiOnly ? "py-3" : "p-3 px-4"
            }`}
            style={{
              backgroundColor: isEmojiOnly ? "transparent" : "white",
              borderWidth: isEmojiOnly ? 0 : 1,
              borderColor: isEmojiOnly ? "transparent" : "#e0e0e0",
            }}
          >
            <Text style={{ fontSize: isEmojiOnly ? hp(4) : hp(1.9) }}>
              {message.text}
            </Text>
          </View>
          {renderSeenStatus()}
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ width: wp(80) }} className="ml-3 mb-3">
        <View
          className={`flex self-start rounded-3xl border border-neutral-200 ${
            isEmojiOnly ? "py-3" : "p-3 px-4"
          }`}
          style={{
            backgroundColor: isEmojiOnly ? "transparent" : "#7c1bbf",
            borderWidth: isEmojiOnly ? 0 : 1,
            borderColor: isEmojiOnly ? "transparent" : "#7c1bbf",
          }}
        >
          <Text
            style={{ fontSize: isEmojiOnly ? hp(4) : hp(1.9) }}
            className="text-white"
          >
            {message.text}
          </Text>
          {message?.typing && <TypingIndicator />}
        </View>
      </View>
    );
  }
}
