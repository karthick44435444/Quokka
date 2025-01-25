import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ImageBackground,
  Text,
  Modal,
  BackHandler, // Import BackHandler
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import MessagesList from "../components/MessagesList";
import ChatRoomHeader from "../components/ChatRoomHeader";
import { Feather } from "@expo/vector-icons";
import CustomKeyBoardView from "../components/CustomKeyBoardView";
import { useAuth } from "../context/authContext";
import { getRoomId } from "../utils/commom";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import ChatBgImg from "../assets/images/chatBg.png";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ChatRoom() {
  const { user } = useAuth();
  const router = useRouter();
  const textRef = useRef("");
  const inputRef = useRef(null);
  const scrollViewRef = useRef(null);

  const item = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Prevent keyboard from closing unless back is pressed
  useEffect(() => {
    const backAction = () => {
      Keyboard.dismiss(); // Dismiss keyboard manually when back button is pressed
      return true; // Prevent default behavior (closing the app)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove(); // Cleanup the backHandler when the component is unmounted
    };
  }, []);

  const createRoomIfNotExists = async () => {
    let roomId = getRoomId(user?.userId, item?.userId);
    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      createdAt: Timestamp.fromDate(new Date()),
    });
  };

  const handleSendMsg = async () => {
    let message = inputValue.trim();
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
      setInputValue("");
    } catch (e) {
      Alert.alert("Message", e, message);
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      scrollViewRef?.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const markLastMessageAsSeen = async (roomId, lastMessageId) => {
    if (lastMessageId) {
      const messageRef = doc(db, "rooms", roomId, "messages", lastMessageId);
      try {
        await updateDoc(messageRef, {
          seen: true,
        });
      } catch (error) {
        console.error("Error updating seen status:", error);
      }
    }
  };

  const updateLastSeen = async (userId) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      lastSeen: serverTimestamp(),
    });
  };

  const handleTyping = async (text) => {
    setInputValue(text);
    const userRef = doc(db, "users", user?.userId);
    await updateDoc(userRef, {
      typing: text.length > 0,
    });
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

  useEffect(() => {
    const roomId = getRoomId(user?.userId, item?.userId);
    const lastMessageId = messages[messages.length - 1]?.id;

    if (lastMessageId) {
      markLastMessageAsSeen(roomId, lastMessageId);
    }
    updateLastSeen(user?.userId);
  }, [messages, user?.userId, item?.userId]);

  return (
    <CustomKeyBoardView inChat={true}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar style="dark" />
        <View
          style={{ height: 13, borderBottomWidth: 1, borderColor: "#fff" }}
        />
        <ChatRoomHeader
          user={item}
          router={router}
          component={item.component}
        />
        <View
          style={{ height: 3, borderBottomWidth: 1, borderColor: "#ddd" }}
        />
        <ImageBackground
          source={ChatBgImg}
          style={{
            flex: 1,
            width: wp(100),
            justifyContent: "center",
          }}
          resizeMode="cover"
        >
          <View style={{ flex: 1, justifyContent: "space-between" }}>
            <View style={{ flex: 1 }}>
              <MessagesList
                roomId={getRoomId(user?.userId, item?.userId)}
                currectUser={user}
                scrollViewRef={scrollViewRef}
              />
            </View>
            <View style={{ paddingTop: 2, marginBottom: hp(1.7) }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginHorizontal: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "white",
                    padding: 8,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 40,
                    width: "100%",
                  }}
                >
                  <TextInput
                    ref={inputRef}
                    value={inputValue}
                    onChangeText={handleTyping}
                    placeholder="message..."
                    style={{
                      flex: 1,
                      fontSize: hp(2),
                      marginLeft: 16,
                      maxHeight: hp(12),
                      textAlignVertical: "top",
                    }}
                    multiline={true}
                    scrollEnabled={true}
                  />
                  <TouchableOpacity
                    onPress={handleSendMsg}
                    style={{
                      height: hp(5),
                      width: hp(5),
                      backgroundColor: "#7c1bbf",
                    }}
                    className="p-2 flex items-center justify-center mr-[1px] rounded-full"
                  >
                    <Feather name="send" size={hp(2.7)} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </CustomKeyBoardView>
  );
}
