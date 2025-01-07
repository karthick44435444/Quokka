import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { blurhash } from "../utils/commom";
import { useAuth } from "../context/authContext";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ProfileHeader from "../components/profileHeader"; // Import the ProfileHeader component

export default function Profile() {
  const { user, logout } = useAuth();

  // State variables
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileUrl] = useState(user?.profileUrl || ""); // Static profile image
  const [bio, setBio] = useState("Hey! There, I am a Quokka user."); // Default bio
  const [isEditing, setIsEditing] = useState(false); // Single edit mode toggle

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(db, "users", user?.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUsername(userData.username || "");
          setEmail(userData.email || "");
          setBio(userData.bio || "Hey! There, I am a Quokka user.");
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user?.uid]);

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Handle save profile changes
  const handleSave = async () => {
    try {
      const userDoc = doc(db, "users", user?.uid);
      await updateDoc(userDoc, {
        username,
        bio,
      });

      Alert.alert("Success", "Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setUsername(user?.username);
    setBio(user?.bio || "Hey! There, I am a Quokka user.");
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ProfileHeader title="My Profile" /> {/* Profile Header with title */}
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: profileUrl }}
          placeholder={{ blurhash }}
          transition={500}
        />
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
          />
        ) : (
          <Text style={styles.usernameText}>{username}</Text>
        )}
        {isEditing ? (
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={(text) => {
              if (text.length <= 100) setBio(text);
            }}
            placeholder="Write your bio"
            maxLength={100}
          />
        ) : (
          <Text style={styles.bioText}>
            {bio || "Hey! There, I am a Quokka user."}
          </Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {isEditing ? (
          <>
            <TouchableOpacity
              onPress={handleCancelEdit}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.button, styles.saveButton]}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={[styles.button, styles.editButton]}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.button, styles.logoutButton]}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  profileContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImage: {
    height: hp(30),
    width: hp(30),
    borderRadius: 25,
    marginBottom: 10,
  },
  input: {
    fontSize: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: wp(80),
    marginBottom: 20,
  },
  bioInput: {
    textAlignVertical: "top",
    height: hp(10),
  },
  usernameText: {
    fontSize: 25,
    fontWeight: "500",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  bioText: {
    fontSize: 16,
    color: "#666",
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
  editButton: {
    backgroundColor: "#800080",
  },
  logoutButton: {
    backgroundColor: "gray",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
});
