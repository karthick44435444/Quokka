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

export default function Friends() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUsers = async () => {
    // Get all users except the current one
    const q = query(usersRef, where("userId", "!=", user?.uid));
    const querySnapshot = await getDocs(q);
    let data = [];

    // Populate user data
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data() });
    });

    for (const item of data) {
      let roomId = getRoomId(user?.uid, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const msgRef = collection(docRef, "messages");
      const qa = query(msgRef, orderBy("createdAT", "asc"));

      const unSub = onSnapshot(qa, (snapshot) => {
        const allMsg = snapshot.docs.map((doc) => doc.data());
        if (allMsg.length == 0) {
          const duplicateUser = users.filter(
            (value) => value.userId === item.userId
          );

          if (duplicateUser.length === 0) {
            setUsers((prevUsers) => [...prevUsers, item]);
          }
        }
      });
    }
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
        <ChatList users={users} currentUser={user} component={"friends"} />
      ) : (
        <View className="flex items-center justify-center flex-1">
          <Text>No friends yet</Text>
        </View>
      )}
    </View>
  );
}
