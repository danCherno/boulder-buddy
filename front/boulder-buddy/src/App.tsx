import { Routes, Route, Navigate, Link } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import BoulderPage from "./pages/BoulderPage";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", justifyContent: "space-between" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#111", fontWeight: 700 }}>
            Boulder Buddy
          </Link>
          <a href="https://example.com" style={{ textDecoration: "none", color: "#666" }}>
          </a>
        </div>
      </header>

      <main style={{ padding: 16 }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/boulder/:id" element={<BoulderPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
