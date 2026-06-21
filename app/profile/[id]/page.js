"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CREATORS } from "../../data/creators";

export default function ProfilePage() {
  const params = useParams();
  const id = params.id;
  const c = CREATORS[id];

  if (!c) {
    return (
      <div className="app-shell">
        <div className="page-content">
          <div className="empty-state">
            <p>夢追い人が見つかりませんでした</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div
        className="profile-cover"
        style={{
          position: "relative",
          height: 220,
          background: "var(--border)",
        }}
      >
        <img
          src={c.cover}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(26,21,48,0) 40%, rgba(26,21,48,0.78) 100%)",
          }}
        />
        <Link
          href="/"
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            zIndex: 2,
            background: "rgba(26,21,48,0.4)",
            color: "#fff",
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ←
        </Link>
        <div
          style={{
            position: "absolute",
            left: 18,
            bottom: 16,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <img
            src={c.avatar}
            alt=""
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "2.5px solid #fff",
              objectFit: "cover",
            }}
          />
          <div>
            <p style={{ color: "#fff", fontSize: 19, fontWeight: 700, margin: 0 }}>
              {c.name}　<span style={{ fontSize: 14, fontWeight: 400 }}>{c.age}歳</span>
            </p>
            <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 13, margin: "3px 0 0" }}>
              {c.title}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.88)",
                fontSize: 13,
                margin: "3px 0 0",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              📍{c.prefecture}
            </p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div>
          {c.categoryLabels.map((t, i) => (
            <span key={t} className={`tag ${i === 0 ? "tag-coral" : "tag-amber"}`}>
              {t}
            </span>
          ))}
        </div>

        <p
          className="serif"
          style={{ fontSize: 17, lineHeight: 1.85, margin: "14px 0 16px" }}
        >
          「{c.quote}」
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.85, color: "var(--text-sub)", margin: "0 0 18px" }}>
          {c.bio}
        </p>

        <div className="vip-count-row">
          <span>👑</span>
          <span>VIP {c.vipCount}人が応援中</span>
        </div>

        <div className="card card-pad" style={{ marginBottom: 18 }}>
          <p className="section-title">🏆 応援ランキング</p>
          {c.ranking.map((r, i) => (
            <div
              key={r.name}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0" }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  width: 18,
                  color: i === 0 ? "var(--amber)" : "var(--text-faint)",
                }}
              >
                {i + 1}
              </span>
              <img
                src={r.avatar}
                alt=""
                style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover" }}
              />
              <span style={{ fontSize: 13, flex: 1 }}>{r.name}さん</span>
            </div>
          ))}
          <p className="text-faint" style={{ fontSize: 11, margin: "10px 0 0" }}>
            ※金額は非公開です
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <Link className="btn btn-coral" style={{ flex: 1 }} href={`/support/${c.id}`}>
            ❤️ 応援する
          </Link>
          <Link className="btn btn-outline-purple" style={{ flex: 1 }} href={`/vip/${c.id}`}>
            👑 VIPで話す
          </Link>
        </div>
      </div>
    </div>
  );
}
