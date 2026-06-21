"use client";

import { createContext, useContext, useState } from "react";
import { CURRENT_USER } from "./data/creators";

/* ===========================================================
   ログイン状態を管理する仕組み（ダミー版）
   本番ではここをFirebase Authentication等に差し替える想定。
   画面側（ヘッダー・マイページ等）は useAuth() を呼ぶだけで
   良いように設計しているため、差し替え時の影響を抑えられる。
=========================================================== */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 最初は「未ログイン」の状態からスタートする
  const [user, setUser] = useState(null);

  function login() {
    // 本番ではここでFirebase等の本物の認証処理を行う想定。
    // 今はダミーとして、固定のユーザー情報をログイン状態にする。
    setUser(CURRENT_USER);
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
