import "./globals.css";
import TabBar from "./TabBar";
import { AuthProvider } from "./AuthContext";

export const metadata = {
  title: "BLOSSOM｜彼の夢が、あなたの夢になる。",
  description: "夢追い人推し活プラットフォーム BLOSSOM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          {children}
          <TabBar />
        </AuthProvider>
      </body>
    </html>
  );
}
