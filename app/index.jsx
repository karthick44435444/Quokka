import React from "react";
import { ActivityIndicator, View } from "react-native";

const index = () => {
  return (
    <View className="flex-1 justify-center">
      <ActivityIndicator size="large" color={"gray"} />
    </View>
  );
};

export default index;
