"use client";

import { useState } from "react";
import Link from "next/link";
import { CREATORS } from "../data/creators";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const q = query.trim();
  const results = q === ""
    ? []
    : Object.values(CREATORS).filter(
        (c) =>
          c.name.includes(q) ||
          c.title.includes(q) ||
          c.prefecture.includes(q) ||
          c.categoryLabels.some((t) => t.includes(q))
      );

  return (
    <div className="app-shell">
      <div className="subpage-header">
        <Link className="back-btn" href="/">
          ←
        </Link>
        <div className="search-box" style={{ flex: 1, marginBottom: 0 }}>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
          <input
            type="text"
            placeholder="夢追い人を探す"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      <div className="page-content">
        <p style={{ fontSize: "12.5px", color: "var(--text-faint)", margin: "14px 0 12px" }}>
          {q === "" ? "夢追い人の名前やキーワードを入力してください" : `「${q}」の検索結果：${results.length}件`}
        </p>

        {q !== "" && results.length === 0 && (
          <div className="empty-state">
            <p>該当する夢追い人が見つかりませんでした</p>
          </div>
        )}

        {results.map((c) => (
          <Link key={c.id} className="creator-card" href={`/profile/${c.id}`}>
            <div className="cover">
              <img src={c.cover} alt="" />
              <div className="cover-info">
                <img src={c.avatar} alt="" />
                <div>
                  <p className="name">{c.name}</p>
                  <p className="title">{c.title}　・　{c.prefecture}</p>
                </div>
              </div>
            </div>
            <p className="quote serif">「{c.quote}」</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
