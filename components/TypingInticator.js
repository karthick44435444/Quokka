import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TypingIndicator = () => {
  const dots = [".", "..", "..."];
  const [currentDot, setCurrentDot] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDot((prev) => (prev + 1) % dots.length);
    }, 500); // Update every 500ms

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.typingContainer}>
      <Text style={styles.typingText}>Typing{dots[currentDot]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  typingContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  typingText: {
    fontSize: 16,
    color: "gray",
  },
});

export default TypingIndicator;
