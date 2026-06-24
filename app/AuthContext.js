"use client";

import { createContext, useContext, useState } from "react";
import { CURRENT_USER } from "./data/creators";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [vipList, setVipList] = useState([]);
  const [supportHistory, setSupportHistory] = useState([]);
  const [creatorPosts, setCreatorPosts] = useState([]);
  function login() {
    const u = { ...CURRENT_USER };
    setUser(u);
    setVipList([...u.vip]);
    setSupportHistory([...u.supportHistory]);
  }

  function loginAsCreator(profile) {
    setUser({
      ...profile,
      isCreator: true,
      joinedLabel: "夢追い人として登録",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=f9a8a8&color=fff`,
      vip: [],
      supportHistory: [],
    });
    setVipList([]);
    setSupportHistory([]);
  }

  function logout() {
    setUser(null);
    setFavorites([]);
    setVipList([]);
    setSupportHistory([]);
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
  return (
    <AuthContext.Provider value={{
      user, login, loginAsCreator, logout,
      favorites, toggleFavorite, isFavorite,
      vipList, isVip, cancelVip, addVip,
      supportHistory, addSupport, isSupporting,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}