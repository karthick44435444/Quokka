import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import React from "react";

const ios = Platform.OS == "ios";
export default function CustomKeyBoardView({ children, inChat }) {
  let keyConfig = {};
  let scrollViewConfig = {};
  if (inChat) {
    keyConfig = { keyboardVerticalOffset: 90 };
    scrollViewConfig = { contentContainerStyle: { flex: 1 } };
  }
  return (
    <KeyboardAvoidingView
      behavior={ios ? "padding" : "height"}
      style={{ flex: 1 }}
      {...keyConfig}
    >
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        {...scrollViewConfig}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
