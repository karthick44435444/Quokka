import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import MessagesItem from "./MessagesItem";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function MessagesList({ roomId, currectUser, scrollViewRef }) {
  const [messages, setMessages] = useState([]);
  const [lastSeenUpdated, setLastSeenUpdated] = useState(false);

  const updateLastMessageSeen = async () => {
    if (!messages.length) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.userId !== currectUser?.userId && !lastMessage?.seen) {
      try {
        const docRef = doc(db, "rooms", roomId, "messages", lastMessage?.id);

        await updateDoc(docRef, { seen: true });
        setLastSeenUpdated(true); // Avoid re-updating
      } catch (error) {
        console.error("Error updating seen status:", error);
      }
    }
  };

  useEffect(() => {
    const messagesRef = collection(db, "rooms", roomId, "messages");
    const q = query(messagesRef, orderBy("createdAT", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    updateLastMessageSeen();
  }, [messages, lastSeenUpdated]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 10,
      }}
      ref={scrollViewRef}
    >
      {messages.map((msg, index) => {
        const isLastMessage = index === messages.length - 1; // Check if it's the last message
        const seenStatus = isLastMessage ? msg?.seen : null; // Use `seen` status only for the last message

        return (
          <MessagesItem
            message={msg}
            key={index}
            currectUser={currectUser}
            isLastMessage={isLastMessage}
            seenStatus={seenStatus}
          />
        );
      })}
    </ScrollView>
  );
}
