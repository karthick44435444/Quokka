import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import ChatRoomHeader from "../../components/ChatRoomHeader";
import MessagesList from "../../components/MessagesList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from "@expo/vector-icons";
import CustomKeyBoardView from "../../components/CustomKeyBoardView";
import { useAuth } from "../../context/authContext";
import { getRoomId } from "../../utils/commom";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function ChatRoom() {
  const { user } = useAuth();
  const router = useRouter();
  const textRef = useRef("");
  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);

  const item = useLocalSearchParams();
  const [messages, setMessages] = useState([]);

  const createRoomIfNotExists = async () => {
    let roomId = getRoomId(user?.userId, item?.userId);

    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  const handleSendMsg = async () => {
    let message = textRef.current.trim();
    if (!message) return;
    try {
      let roomId = getRoomId(user?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const msgRef = collection(docRef, "messages");
      textRef.current = "";
      if (inputRef) inputRef?.current?.clear();

      const newDoc = await addDoc(msgRef, {
        userId: user?.userId,
        text: message,
        profileUrl: user?.profileUrl,
        senderName: user?.username,
        createdAT: Timestamp.fromDate(new Date()),
      });
    } catch (e) {
      Alert.alert("Message", e, message);
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  useEffect(() => {
    updateScrollView();
  }, [messages]);

  useEffect(() => {
    createRoomIfNotExists();

    let roomId = getRoomId(user?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const msgRef = collection(docRef, "messages");

    const q = query(msgRef, orderBy("createdAT", "asc"));

    let unSub = onSnapshot(q, (snapshot) => {
      let allMsg = snapshot.docs.map((doc) => {
        return doc.data();
      });
      setMessages([...allMsg]);
    });

    const keyboardDidShow = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );
    return () => {
      unSub();
      keyboardDidShow.remove();
    };
  }, [user?.userId, item?.userId]);

  return (
    <CustomKeyBoardView inChat={true}>
      <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        <ChatRoomHeader user={item} router={router} />
        <View className="h-3 border-b border-neutral-300" />
        <View className="flex-1 bg-neutral-100 justify-between overflow-visible">
          <View className="flex-1">
            <MessagesList
              messages={messages}
              currectUser={user}
              scrollViewRef={scrollViewRef}
            />
          </View>
          <View className="pt-2" style={{ marginBottom: hp(1.7) }}>
            <View className="flex-row justify-between items-center mx-3">
              <View className="flex-row justify-between bg-white p-2 border-neutral-300 rounded-full pl-5 w-full">
                <TextInput
                  ref={inputRef}
                  onChangeText={(value) => (textRef.current = value)}
                  placeholder="message..."
                  className="flex-1 mr-2"
                  style={{ fontSize: hp(2) }}
                />
                <TouchableOpacity
                  onPress={handleSendMsg}
                  className="bg-neutral-200 p-2 mr-[1px] rounded-full"
                >
                  <Feather name="send" size={hp(2.7)} color="#737373" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyBoardView>
  );
}
