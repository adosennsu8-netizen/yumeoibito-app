"use client";

import { createContext, useContext, useState } from "react";
import { CURRENT_USER } from "./data/creators";

/* ===========================================================
   ログイン状態・お気に入りを管理する仕組み（ダミー版）
   本番ではここをFirebase Authentication等に差し替える想定。
=========================================================== */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]); // お気に入りの夢追い人IDリスト
  const [vipList, setVipList] = useState([]); // VIP加入リスト

  function login() {
    const u = { ...CURRENT_USER };
    setUser(u);
    setVipList([...u.vip]); // VIPリストをstateに展開
  }

  function logout() {
    setUser(null);
    setFavorites([]);
    setVipList([]);
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

  return (
    <AuthContext.Provider value={{ user, login, logout, favorites, toggleFavorite, isFavorite, vipList, isVip, cancelVip }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}