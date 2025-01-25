import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Image } from "expo-image";
import {
  blurhash,
  formatEpoch,
  getRelativeTime,
  getRoomId,
} from "../utils/commom";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ChatItem({ item, router, noBorder, currentUser }) {
  const [lastMsg, setLastmsg] = useState(undefined);
  const [lastSeen, setLastSeen] = useState(null);

  const openChatRoom = async () => {
    router.push({ pathname: "/ChatRoom", params: { ...item, lastSeen } });

    // Mark the last message as seen if it's not seen yet
    if (lastMsg && !lastMsg.seen && lastMsg.userId !== currentUser?.userId) {
      const roomId = getRoomId(currentUser?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId, "messages", lastMsg.id);

      await updateDoc(docRef, {
        seen: true,
      });
    }
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
      const truncatedText =
        lastMsg?.text?.length > 20
          ? `${lastMsg?.text.slice(0, 20)}...`
          : lastMsg?.text;
      if (currentUser?.userId == lastMsg?.userId)
        return `You: ${truncatedText}`;
      return truncatedText;
    } else {
      return "Say Hi 👋";
    }
  };

  // Real-time listener for lastSeen updates
  const listenForLastSeen = (userId) => {
    const userRef = doc(db, "users", userId);

    // Listen for changes to the lastSeen field
    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const lastSeenTimestamp = userData?.lastSeen;

        // If there is a lastSeen value, determine if the user is "Active Now"
        if (lastSeenTimestamp) {
          const currentTime = new Date().getTime() / 1000;
          const diff = currentTime - lastSeenTimestamp.seconds;

          // If the difference is less than 5 minutes, consider them as active
          if (diff < 10) {
            setLastSeen("Active Now");
          } else {
            setLastSeen(getRelativeTime(lastSeenTimestamp));
          }
        } else {
          setLastSeen("Not Available");
        }
      }
    });

    // Return the unsubscribe function to stop listening
    return unsubscribe;
  };

  useEffect(() => {
    let unsubscribeLastSeen = listenForLastSeen(item.userId);
    let roomId = getRoomId(currentUser?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const msgRef = collection(docRef, "messages");
    const q = query(msgRef, orderBy("createdAT", "desc"));
    let unSub = onSnapshot(q, (snapshot) => {
      const allMsg = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLastmsg(allMsg[0] ? allMsg[0] : null);
    });
    return () => {
      unsubscribeLastSeen();
      unSub();
    };
  }, []);

  return (
    <TouchableOpacity
      onPress={openChatRoom}
      className={`flex-row justify-between mx-4 items-center gap-3 mb-4 pb-2 ${
        noBorder ? "" : "border-b border-b-neutral-200"
      }`}
    >
      <View style={{ position: "relative" }}>
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
        {lastSeen === "Active Now" && (
          <View
            style={{
              backgroundColor: "#22C323",
              width: hp(2),
              height: hp(2),
              borderRadius: 100,
              borderWidth: 2,
              borderColor: "#fff",
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
          />
        )}
      </View>
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
        <View className="flex-row justify-between">
          {lastMsg &&
          !lastMsg.seen &&
          lastMsg.userId !== currentUser?.userId ? (
            <View
              style={{ fontSize: hp(1.6) }}
              className="flex-row items-center"
            >
              <View
                style={{
                  backgroundColor: "#000",
                  width: hp(1),
                  height: hp(1),
                  borderRadius: 100,
                  marginRight: 10,
                }}
              />
              <Text style={{ fontSize: hp(1.6) }} className="font-bold">
                {renderLastMsg()}
              </Text>
            </View>
          ) : (
            <Text
              style={{ fontSize: hp(1.6) }}
              className="font-medium text-neutral-500"
            >
              {renderLastMsg()}
            </Text>
          )}
          {lastSeen !== "Active Now" &&
          lastSeen !== "Not Available" &&
          lastSeen !== "" ? (
            <Text
              style={{ fontSize: hp(1.2) }}
              className="font-medium text-neutral-400"
            >
              Last seen at {lastSeen}
            </Text>
          ) : (
            ""
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
