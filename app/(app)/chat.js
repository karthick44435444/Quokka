import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ChatList from "../../components/ChatList";
import { StatusBar } from "expo-status-bar";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/authContext";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
} from "firebase/firestore";
import { usersRef, db } from "../../firebaseConfig";
import { getRoomId } from "../../utils/commom";

export default function Chat() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubscriptions, setActiveSubscriptions] = useState(new Set());

  const getUsers = async () => {
    const q = query(usersRef, where("userId", "!=", user?.uid));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => doc.data());

    data.forEach((item) => {
      const roomId = getRoomId(user?.uid, item?.userId);

      if (!activeSubscriptions.has(item.userId)) {
        const docRef = doc(db, "rooms", roomId);
        const msgRef = collection(docRef, "messages");
        const qa = query(msgRef, orderBy("createdAT", "asc"));

        const unSub = onSnapshot(qa, (snapshot) => {
          const allMsg = snapshot.docs.map((doc) => doc.data());

          if (allMsg.length > 0) {
            setUsers((prevUsers) => {
              // Ensure no duplicates before updating state
              if (!prevUsers.some((user) => user.userId === item.userId)) {
                return [...prevUsers, item];
              }
              return prevUsers;
            });
          }
        });

        // Add subscription to activeSubscriptions set
        setActiveSubscriptions((prevSet) => new Set(prevSet).add(item.userId));
      }
    });

    setIsLoading(false);
  };

  useEffect(() => {
    if (user?.uid) {
      getUsers();
    }
  }, [user]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      {isLoading ? (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <Loader size={hp(20)} />
        </View>
      ) : users.length > 0 ? (
        <ChatList users={users} currentUser={user} component={"chat"} />
      ) : (
        <View className="flex items-center justify-center flex-1">
          <Text>No conversations yet</Text>
        </View>
      )}
    </View>
  );
}
