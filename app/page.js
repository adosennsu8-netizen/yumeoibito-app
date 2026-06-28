"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CATEGORY_LABELS, PREFECTURES, getMonthlyRankingTop10, getSortedCreators } from "./data/creators";
import { useAuth } from "./AuthContext";

const PAGE_SIZE = 20;

export default function HomePage() {
  const [activeCat, setActiveCat] = useState("all");
  const [activePref, setActivePref] = useState("all");
  const [sortBy, setSortBy] = useState("new");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [prefOpen, setPrefOpen] = useState(false);
  const loadMoreRef = useRef(null);
  const { user, toggleFavorite, isFavorite, registeredCreators } = useAuth();
  const router = useRouter();

  const categories = ["all", "美容", "音楽", "スポーツ", "アート", "料理", "芸能", "起業", "クリエイター", "テクノロジー", "ファッション", "執筆・文学", "教育・指導", "農業・自然", "伝統工芸", "旅・冒険"];
  const top10 = getMonthlyRankingTop10();

  const sortedFiltered = useMemo(() => {
    const allCreators = [...registeredCreators.filter((c) => c.visible !== false), ...getSortedCreators(sortBy)];
    const sorted = sortBy === "new" ? allCreators : allCreators.sort((a, b) => (b.monthlySupportCount || 0) - (a.monthlySupportCount || 0));
    return sorted.filter((c) => {
      const matchesCat = activeCat === "all" || (c.categories || []).includes(activeCat);
      const matchesPref = activePref === "all" || c.prefecture === activePref;
      return matchesCat && matchesPref;
    });
  }, [sortBy, activeCat, activePref]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [sortBy, activeCat, activePref]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sortedFiltered.length));
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sortedFiltered.length]);

  const visibleCreators = sortedFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < sortedFiltered.length;

  function handleFavorite(e, creatorId) {
    e.preventDefault(); // カードへの遷移を止める
    e.stopPropagation();
    if (!user) {
      router.push(`/start?redirect=/`);
      return;
    }
    toggleFavorite(creatorId);
  }

  return (
    <div className="app-shell">
      <header className="top-header" style={{ textAlign: "center" }}>
        <Image
          src="/logo.png"
          alt="BLOSSOM"
          width={1717}
          height={916}
          style={{ width: 280, height: "auto", margin: "0 auto" }}
          priority
        />
      </header>

      <div className="page-content">
        <Link href="/search" className="search-box" style={{ display: "block" }}>
          <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
          <input type="text" placeholder="夢追い人を探す" style={{ pointerEvents: "none" }} readOnly />
        </Link>

        <div className="monthly-ranking">
          <p className="monthly-ranking-header">🏆 今月の応援ランキング TOP10</p>
          <div className="monthly-ranking-scroll">
            {top10.map((c, i) => {
              const isFirst = i === 0;
              return (
                <Link
                  key={c.id}
                  className={`ranking-chip rank-${i + 1}`}
                  href={`/profile/${c.id}`}
                  style={isFirst ? { width: 92 } : undefined}
                >
                  <span
                    className="rank-badge"
                    style={isFirst ? { width: 22, height: 22, fontSize: 12, background: "var(--amber)", boxShadow: "0 0 0 2px var(--paper)" } : undefined}
                  >
                    {i + 1}
                  </span>
                  <img
                    src={c.avatar}
                    alt=""
                    style={isFirst ? { width: 72, height: 72, border: "3px solid var(--amber)", boxShadow: "0 0 0 2px var(--paper), 0 4px 10px rgba(232,146,58,0.35)" } : undefined}
                  />
                  <p className="rc-name" style={isFirst ? { fontWeight: 700, fontSize: 11.5, color: "var(--text-main)" } : undefined}>
                    {c.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="cat-row">
          {categories.map((c) => (
            <button
              key={c}
              className={`cat-pill ${c === activeCat ? "active" : ""}`}
              onClick={() => setActiveCat(c)}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", marginBottom: 10 }}>
          <button
            onClick={() => setPrefOpen((v) => !v)}
            style={{ width: "100%", padding: "11px 13px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", background: "var(--paper)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: activePref === "all" ? "var(--text-faint)" : "var(--text-main)", cursor: "pointer" }}
          >
            <span>{activePref === "all" ? "都道府県で絞り込む（すべて）" : activePref}</span>
            <span>{prefOpen ? "▲" : "▼"}</span>
          </button>
          {prefOpen && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--paper)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", zIndex: 50, maxHeight: 240, overflowY: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <button
                onClick={() => { setActivePref("all"); setPrefOpen(false); }}
                style={{ width: "100%", padding: "11px 13px", textAlign: "left", fontSize: 13, background: activePref === "all" ? "var(--coral-light)" : "none", border: "none", color: activePref === "all" ? "var(--coral-dark)" : "var(--text-main)", cursor: "pointer" }}
              >
                すべて
              </button>
              {PREFECTURES.map((p) => (
                <button
                  key={p}
                  onClick={() => { setActivePref(p); setPrefOpen(false); }}
                  style={{ width: "100%", padding: "11px 13px", textAlign: "left", fontSize: 13, background: activePref === p ? "var(--coral-light)" : "none", border: "none", borderTop: "1px solid var(--border)", color: activePref === p ? "var(--coral-dark)" : "var(--text-main)", cursor: "pointer" }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "14px 0 6px" }}>
          <p style={{ fontSize: "11.5px", color: "var(--text-faint)", margin: 0 }}>
            {sortedFiltered.length}人の夢追い人
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => setSortBy("new")}
              className={`cat-pill ${sortBy === "new" ? "active" : ""}`}
              style={{ padding: "5px 12px", fontSize: 11.5 }}
            >
              新着順
            </button>
            <button
              onClick={() => setSortBy("popular")}
              className={`cat-pill ${sortBy === "popular" ? "active" : ""}`}
              style={{ padding: "5px 12px", fontSize: 11.5 }}
            >
              人気順
            </button>
          </div>
        </div>

        <div>
          {visibleCreators.length === 0 ? (
            <div className="empty-state">
              <p>該当する夢追い人が見つかりませんでした</p>
            </div>
          ) : (
            visibleCreators.map((c) => (
              <Link key={c.id} className="creator-card" href={`/profile/${c.id}`} style={{ position: "relative" }}>
                <button
                  onClick={(e) => handleFavorite(e, c.id)}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 2,
                    background: isFavorite(c.id) ? "var(--coral)" : "rgba(255,255,255,0.85)",
                    border: "none",
                    borderRadius: "50%",
                    width: 34,
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                  }}
                >
                  <span style={{ color: isFavorite(c.id) ? "#fff" : "var(--coral)" }}>
                    {isFavorite(c.id) ? "♥" : "♡"}
                  </span>
                </button>
                <div className="cover">
                  <img src={c.cover} alt="" />
                  <div className="cover-info">
                    <img src={c.avatar} alt="" />
                    <div>
                      <p className="name">{c.name}　{c.age}歳</p>
                      <p className="title">{c.title}　・　{c.prefecture}</p>
                    </div>
                  </div>
                </div>
                <p className="quote serif">「{c.quote}」</p>
              </Link>
            ))
          )}
        </div>

        {hasMore && (
          <div
            ref={loadMoreRef}
            style={{ textAlign: "center", padding: "16px 0", color: "var(--text-faint)", fontSize: 12 }}
          >
            読み込み中…
          </div>
        )}
      </div>
    </div>
  );
}
