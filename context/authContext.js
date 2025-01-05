import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { setDoc, doc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        updateUserData(user.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unSub;
  }, []);

  const updateUserData = async (userId) => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUser((prevUser) => ({
          ...prevUser,
          username: data.username,
          profileUrl: data.profileUrl,
          userId: data.userId,
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const login = async (mail, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, mail, password);
      return { success: true };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/internal-error)")) msg = "No Internet";
      if (msg.includes("(auth/invalid-login-credentials)"))
        msg = "Invalid Credentials";
      return { success: false, msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (e) {
      return { success: false, msg: e.message, error: e };
    }
  };
  const register = async (mail, password, username, profileUrl) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        mail,
        password
      );
      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        profileUrl,
        userId: response?.user?.uid,
      });
      return { success: true, data: response?.user };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/internal-error)")) msg = "No Internet";
      if (msg.includes("(auth/invalid-email)")) msg = "Invalid email";
      if (msg.includes("(auth/email-already-in-use"))
        msg = "This email already in use";
      return { success: false, msg };
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }
  return value;
};
