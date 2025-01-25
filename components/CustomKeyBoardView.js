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
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        {...scrollViewConfig}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {inChat && (
        <KeyboardAvoidingView
          behavior={ios ? "height" : "height"} // "height" to reduce extra space
          style={{
            position: "absolute", // Keep the input area at the bottom
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: Platform.OS === "ios" ? 15 : 10, // Adjust padding for iOS
            zIndex: 1,
          }}
        >
          {/* Your input area and send button */}
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
