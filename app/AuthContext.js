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
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "./lib/firebase";

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
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        const userObj = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || "user")}&background=f9a8a8&color=fff`,
          joinedLabel: "登録済みユーザー",
          isCreator: userData.isCreator || false,
          title: userData.title || "",
          prefecture: userData.prefecture || "",
          quote: userData.quote || "",
          bio: userData.bio || "",
          categories: userData.categories || [],
          categoryLabels: userData.categoryLabels || [],
          ...userData,
        };
        setUser(userObj);
        setFavorites(userData.favorites || []);
        setVipList(userData.vipList || []);
        setSupportHistory(userData.supportHistory || []);
        setNotifications(userData.notifications || []);
        setBlockList(userData.blockList || []);
      } else {
        setUser(null);
        setFavorites([]);
        setVipList([]);
        setSupportHistory([]);
        setNotifications([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Firestoreからクリエイター一覧をリアルタイム取得
  useEffect(() => {
    const q = query(collection(db, "users"), where("isCreator", "==", true));
    const unsub = onSnapshot(q, (snap) => {
      setRegisteredCreators(snap.docs.map((d) => ({ ...d.data(), id: d.id })));
    });
    return () => unsub();
  }, []);

  async function saveUserData(uid, data) {
    await setDoc(doc(db, "users", uid), data, { merge: true });
  }

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  async function signup(email, password, displayName) {
    const { updateProfile } = await import("firebase/auth");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
      await saveUserData(userCredential.user.uid, {
        name: displayName,
        email,
        isCreator: false,
        favorites: [],
        vipList: [],
        supportHistory: [],
        notifications: [],
      });
      setUser({
        id: userCredential.user.uid,
        name: displayName,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=f9a8a8&color=fff`,
        joinedLabel: "登録済みユーザー",
        isCreator: false,
      });
    }
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
    setBlockList([]);
  }

  async function loginAsCreator(profile) {
    const updatedUser = {
      ...user,
      ...profile,
      isCreator: true,
      joinedLabel: "夢追い人として登録",
      avatar: profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=f9a8a8&color=fff`,
    };
    setUser(updatedUser);
    if (user?.id) {
      await saveUserData(user.id, { ...profile, isCreator: true });
    }
  }

  async function toggleFavorite(creatorId) {
    const isFav = favorites.includes(creatorId);
    const newFavorites = isFav
      ? favorites.filter((id) => id !== creatorId)
      : [...favorites, creatorId];
    setFavorites(newFavorites);
    if (user?.id) {
      await saveUserData(user.id, { favorites: newFavorites });
    }
  }

  function isFavorite(creatorId) {
    return favorites.includes(creatorId);
  }

  function isVip(creatorId) {
    return vipList.some((v) => v.creatorId === creatorId);
  }

  const [blockList, setBlockList] = useState([]);

  function isBlocked(creatorId) {
    return blockList.includes(creatorId);
  }

  async function addBlock(creatorId) {
    const newBlockList = [...blockList, creatorId];
    setBlockList(newBlockList);
    if (user?.id) {
      await saveUserData(user.id, { blockList: newBlockList });
    }
  }

  async function removeBlock(creatorId) {
    const newBlockList = blockList.filter((id) => id !== creatorId);
    setBlockList(newBlockList);
    if (user?.id) {
      await saveUserData(user.id, { blockList: newBlockList });
    }
  }

  async function cancelVip(creatorId) {
    const newVipList = vipList.filter((v) => v.creatorId !== creatorId);
    setVipList(newVipList);
    if (user?.id) {
      await saveUserData(user.id, { vipList: newVipList });
    }
  }

  async function addVip(creatorId) {
    if (!vipList.some((v) => v.creatorId === creatorId)) {
      const today = new Date();
      const next = new Date(today);
      next.setMonth(next.getMonth() + 1);
      const nextBilling = `${next.getFullYear()}年${next.getMonth() + 1}月${next.getDate()}日`;
      const newVip = { creatorId, nextBilling, price: 500 };
      const newVipList = [...vipList, newVip];
      setVipList(newVipList);
      if (user?.id) {
        await saveUserData(user.id, { vipList: newVipList });
      }
      // 夢追い人に通知を送る
      try {
        const creatorRef = doc(db, "users", creatorId);
        const creatorDoc = await getDoc(creatorRef);
        if (creatorDoc.exists()) {
          const creatorNotifs = creatorDoc.data().notifications || [];
          const newNotif = {
            id: Date.now(),
            type: "vip",
            text: `${user?.name || "誰か"}さんがVIPに加入しました`,
            read: false,
            time: "たった今",
          };
          await setDoc(creatorRef, { notifications: [newNotif, ...creatorNotifs] }, { merge: true });
        }
      } catch (e) {
        console.log("通知送信エラー", e);
      }
    }
  }

  async function addSupport(creatorId) {
    const today = new Date();
    const date = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    const newSupport = { creatorId, date };
    const newHistory = [newSupport, ...supportHistory];
    setSupportHistory(newHistory);
    if (user?.id) {
      await saveUserData(user.id, { supportHistory: newHistory });
    }
    // 夢追い人に通知を送る
    try {
      const creatorRef = doc(db, "users", creatorId);
      const creatorDoc = await getDoc(creatorRef);
      if (creatorDoc.exists()) {
        const creatorNotifs = creatorDoc.data().notifications || [];
        const newNotif = {
          id: Date.now(),
          type: "support",
          text: `${user?.name || "誰か"}さんが応援してくれました`,
          read: false,
          time: "たった今",
        };
        await setDoc(creatorRef, { notifications: [newNotif, ...creatorNotifs] }, { merge: true });
      }
    } catch (e) {
      console.log("通知送信エラー", e);
    }
  }

  function isSupporting(creatorId) {
    return supportHistory.some((s) => s.creatorId === creatorId);
  }

  function addPost(post) {
    setCreatorPosts((prev) => [post, ...prev]);
  }

  async function registerCreator(profile) {
    setRegisteredCreators((prev) => [profile, ...prev]);
    if (user?.id) {
      await saveUserData(user.id, { ...profile, isCreator: true });
    }
  }

  async function updateCreatorProfile(updatedProfile) {
    setUser((prev) => ({ ...prev, ...updatedProfile }));
    setRegisteredCreators((prev) =>
      prev.map((c) => c.id === updatedProfile.id ? { ...c, ...updatedProfile } : c)
    );
    if (user?.id) {
      await saveUserData(user.id, updatedProfile);
    }
  }

  async function addNotification(notification) {
    const newNotif = { ...notification, id: Date.now(), read: false, time: "たった今" };
    const newNotifications = [newNotif, ...notifications];
    setNotifications(newNotifications);
    if (user?.id) {
      await saveUserData(user.id, { notifications: newNotifications });
    }
  }

  async function markAllRead() {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    if (user?.id) {
      await saveUserData(user.id, { notifications: updated });
    }
  }
 　async function updateUserName(newName, avatarUrl, coverUrl) {
    const newAvatar = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=f9a8a8&color=fff`;
    const updates = { name: newName, avatar: newAvatar };
    if (coverUrl) updates.cover = coverUrl;
    setUser((prev) => ({ ...prev, ...updates }));
    if (user?.id) {
      await saveUserData(user.id, updates);
    }
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
      notifications, addNotification, markAllRead,updateUserName,
      blockList, isBlocked, addBlock, removeBlock,
   }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}