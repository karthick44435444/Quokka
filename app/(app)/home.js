import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ChatList from "../../components/ChatList";
import { StatusBar } from "expo-status-bar";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/authContext";
import { getDocs, query, where } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";

export default function Home() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const q = query(usersRef, where("userId", "!=", user?.uid));
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data() });
    });
    setUsers(data);
  };

  useEffect(() => {
    if (user?.uid) getUsers();
  }, [user]);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      {users?.length > 0 ? (
        <ChatList users={users} currentUser={user} />
      ) : (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <Loader size={hp(20)} />
        </View>
      )}
    </View>
  );
}
