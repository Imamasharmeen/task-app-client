/* eslint-disable react/prop-types */
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { app } from "../firebase/firebase.config";
import useAxios from "../hooks/useAxios";

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const api = useAxios();

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = async () => {
    setLoading(true);
    return signOut(auth);
  };

  // onAuthStateChange
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userInfo = {
          uid: currentUser.uid,
          displayName: currentUser?.displayName,
          email: currentUser?.email,
        };

        const saveUser = async () => {
          try {
            await api.post("/user", userInfo);
          } catch (error) {
            // console.error("Error saving user:", error);
          }
        };
        saveUser();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [api]);

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    signInWithGoogle,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;