import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import {
  doc,
  getDocs,
  collection,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import WebView from "react-native-webview";
import { FAB } from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useAuth } from "../../context/authContext";
import logo from "../../assets/images/icon.png";

export default function Home() {
  const { user } = useAuth() || {};

  const [loader, setLoader] = useState(true);
  const [posts, setPosts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoader(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      const usersCollection = collection(db, "users");
      const querySnapshot = await getDocs(usersCollection);
      let postsData = [];

      // Collect all videos along with the user information
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.videos && data.profileUrl) {
          data.videos.forEach((video) => {
            postsData.push({
              userId: data.userId,
              username: data.username,
              profileUrl: data.profileUrl,
              bio: data.bio || "No bio available",
              videoUrl: video.url,
              videoTime: video.time.toDate(), // Assuming `video.time` is a timestamp field
            });
          });
        }
      });

      // Sort by video timestamp to ensure newest videos come first
      postsData.sort((a, b) => b.videoTime - a.videoTime);

      setPosts(postsData);
      setRefreshing(false); // Stop refreshing after data is loaded
    } catch (error) {
      console.error("Error fetching posts:", error);
      setRefreshing(false); // Stop refreshing in case of an error
    }
  };

  const handleSaveUrl = async () => {
    if (!newUrl.trim()) return; // Check if URL is not empty
    try {
      const userDocRef = doc(db, "users", user.userId);
      await updateDoc(userDocRef, {
        videos: arrayUnion({
          url: newUrl,
          time: new Date(),
        }),
      });

      setNewUrl("");
      setIsModalVisible(false);
      fetchAllPosts();
    } catch (error) {
      console.error("Error saving video URL:", error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllPosts(); // Refresh data
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {loader ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 30, fontWeight: "700" }}>Welcome!</Text>
          <Image style={{ height: hp(40), width: hp(40) }} source={logo} />
          <Text style={{ fontSize: 20, fontWeight: "600", color: "gray" }}>
            {new Date().getHours() < 12
              ? "Good Morning"
              : new Date().getHours() < 17
              ? "Good Afternoon"
              : "Good Evening"}
          </Text>
          <Text
            style={{
              color: "#7c1bbf",
              fontWeight: "500",
              fontSize: 20,
              marginTop: 20,
            }}
          >
            {user?.username}
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 20,
                padding: 10,
                backgroundColor: "#f9f9f9",
                borderRadius: 12,
              }}
            >
              {/* User Info Section */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "right",
                  marginBottom: 10,
                }}
              >
                <Image
                  source={{ uri: item.profileUrl }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 10,
                  }}
                />
                <View>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {item.username}
                  </Text>
                  <Text>{item.bio}</Text>
                </View>
              </View>

              {/* Video Section */}
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 12,
                }}
              >
                <View
                  style={{
                    width: wp(80),
                    height: hp(40),
                    marginBottom: 10,
                    borderRadius: 12,
                  }}
                >
                  <WebView
                    source={{ uri: item.videoUrl }}
                    javaScriptEnabled
                    domStorageEnabled
                  />
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={{ padding: 20 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      <FAB
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor: "#7c1bbf",
        }}
        icon="plus"
        color="white" // Change icon color to white
        onPress={() => setIsModalVisible(true)}
      />

      {/* Modal for Adding Video URL */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "90%",
              backgroundColor: "white",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
            >
              Post Video
            </Text>
            <TextInput
              value={newUrl}
              onChangeText={setNewUrl}
              placeholder="Enter YouTube URL"
              style={{
                borderWidth: 1,
                borderColor: "gray",
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
              }}
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={() => setIsModalVisible(false)}
                style={{
                  backgroundColor: "gray",
                  padding: 12,
                  borderRadius: 8,
                  flex: 1,
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveUrl}
                style={{
                  backgroundColor: "#7c1bbf",
                  padding: 12,
                  borderRadius: 8,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  Post
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
