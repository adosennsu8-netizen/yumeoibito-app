"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthContext";

const STATIC_TABS = [
  { id: "home", href: "/", icon: "🏠", label: "探す" },
  { id: "feed", href: "/feed", icon: "📋", label: "タイムライン" },
  { id: "notifications", href: "/notifications", icon: "🔔", label: "通知" },
];

export default function TabBar() {
  const pathname = usePathname();
  const { user } = useAuth();

  function isActive(href) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <div className="tab-bar">
      {STATIC_TABS.map((t) => (
        <Link key={t.id} href={t.href} className={isActive(t.href) ? "active" : ""}>
          <span style={{ fontSize: 21 }}>{t.icon}</span>
          <span>{t.label}</span>
        </Link>
      ))}

      {user ? (
        <Link href="/mypage" className={isActive("/mypage") ? "active" : ""}>
          <img
            src={user.avatar}
            alt=""
            style={{
              width: 21,
              height: 21,
              borderRadius: "50%",
              objectFit: "cover",
              border: isActive("/mypage") ? "1.5px solid var(--coral)" : "1.5px solid transparent",
            }}
          />
          <span>マイページ</span>
        </Link>
      ) : (
        <Link href="/login" className={isActive("/login") ? "active" : ""}>
          <span style={{ fontSize: 21 }}>🔓</span>
          <span>ログイン</span>
        </Link>
      )}
    </div>
  );
}
