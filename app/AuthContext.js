"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "./lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [vipList, setVipList] = useState([]);
  const [supportHistory, setSupportHistory] = useState([]);
  const [creatorPosts, setCreatorPosts] = useState([]);
  const [registeredCreators, setRegisteredCreators] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await firebaseUser.reload();
        setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || "user")}&background=f9a8a8&color=fff`,
          joinedLabel: "登録済みユーザー",
          vip: [],
          supportHistory: [],
          isCreator: false,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function signup(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setFavorites([]);
    setVipList([]);
    setSupportHistory([]);
    setCreatorPosts([]);
    setNotifications([]);
  }

  function loginAsCreator(profile) {
    setUser((prev) => ({
      ...prev,
      ...profile,
      isCreator: true,
      joinedLabel: "夢追い人として登録",
      avatar: profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=f9a8a8&color=fff`,
    }));
  }
　async function updateDisplayName(name) {
    const { updateProfile } = await import("firebase/auth");
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name });
      setUser((prev) => ({ ...prev, name }));
    }
  }
  function toggleFavorite(creatorId) {
    setFavorites((prev) =>
      prev.includes(creatorId)
        ? prev.filter((id) => id !== creatorId)
        : [...prev, creatorId]
    );
  }

  function isFavorite(creatorId) {
    return favorites.includes(creatorId);
  }

  function isVip(creatorId) {
    return vipList.some((v) => v.creatorId === creatorId);
  }

  function cancelVip(creatorId) {
    setVipList((prev) => prev.filter((v) => v.creatorId !== creatorId));
  }

  function addVip(creatorId) {
    if (!vipList.some((v) => v.creatorId === creatorId)) {
      const today = new Date();
      const next = new Date(today);
      next.setMonth(next.getMonth() + 1);
      const nextBilling = `${next.getFullYear()}年${next.getMonth() + 1}月${next.getDate()}日`;
      setVipList((prev) => [...prev, { creatorId, nextBilling, price: 500 }]);
    }
  }

  function addSupport(creatorId) {
    const today = new Date();
    const date = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    setSupportHistory((prev) => [{ creatorId, date }, ...prev]);
  }

  function isSupporting(creatorId) {
    return supportHistory.some((s) => s.creatorId === creatorId);
  }

  function addPost(post) {
    setCreatorPosts((prev) => [post, ...prev]);
  }

  function registerCreator(profile) {
    setRegisteredCreators((prev) => [profile, ...prev]);
  }

  function updateCreatorProfile(updatedProfile) {
    setUser((prev) => ({ ...prev, ...updatedProfile }));
    setRegisteredCreators((prev) =>
      prev.map((c) => c.id === updatedProfile.id ? { ...c, ...updatedProfile } : c)
    );
  }

  function addNotification(notification) {
    setNotifications((prev) => [{ ...notification, id: Date.now(), read: false, time: "たった今" }, ...prev]);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{
      user, login, loginWithGoogle, signup, logout, loginAsCreator,
      favorites, toggleFavorite, isFavorite,
      vipList, isVip, cancelVip, addVip,
      supportHistory, addSupport, isSupporting,
      creatorPosts, addPost,
      registeredCreators, registerCreator, updateCreatorProfile,
      notifications, addNotification, markAllRead,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}