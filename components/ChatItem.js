import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import { blurhash, formatEpoch, getRoomId } from "../utils/commom";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ChatItem({ item, router, noBorder, currentUser }) {
  const [lastMsg, setLastmsg] = useState(undefined);

  const openChatRoom = () => {
    router.push({ pathname: "/ChatRoom", params: item });
  };

  const renderTime = () => {
    if (lastMsg) {
      let date = lastMsg?.createdAT;
      return formatEpoch(date.seconds);
    }
  };

  const renderLastMsg = () => {
    if (typeof lastMsg === undefined) return "Loading...";
    if (lastMsg) {
      if (currentUser?.userId == lastMsg?.userId)
        return `You: ${lastMsg?.text}`;
      return lastMsg?.text;
    } else return "Say Hi 👋";
  };

  useEffect(() => {
    let roomId = getRoomId(currentUser?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const msgRef = collection(docRef, "messages");
    const q = query(msgRef, orderBy("createdAT", "desc"));
    let unSub = onSnapshot(q, (snapshot) => {
      let allMsg = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setLastmsg(allMsg[0] ? allMsg[0] : null);
    });

    return unSub;
  }, []);

  return (
    <TouchableOpacity
      onPress={openChatRoom}
      className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 ${
        noBorder ? "" : "border-b border-b-neutral-200"
      }`}
    >
      <Image
        source={item.profileUrl}
        style={{
          height: hp(6),
          width: hp(6),
          borderRadius: 100,
        }}
        placeholder={blurhash}
        transition={500}
      />
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-semibold text-neutral-800 capitalize"
          >
            {item?.username}
          </Text>
          <Text
            style={{ fontSize: hp(1.6) }}
            className="font-medium text-neutral-500"
          >
            {renderTime()}
          </Text>
        </View>
        <Text
          style={{ fontSize: hp(1.6) }}
          className="font-medium text-neutral-500"
        >
          {renderLastMsg()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
