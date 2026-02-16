import { Routes, Route, Navigate, Link } from "react-router-dom";
<<<<<<< Updated upstream
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
=======
import { useState } from "react";
import UploadPage from "./pages/UploadPage";
import BoulderPage from "./pages/BoulderPage";
import Auth from "./components/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

function InfoPopup({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 999,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          maxWidth: 400,
          width: "90%",
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>About Boulder Buddy</h2>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: 24,
              cursor: "pointer",
              padding: 0,
              color: "#666",
            }}
          >
            ×
          </button>
        </div>
        <div style={{ color: "#444", lineHeight: 1.6, fontSize: 14 }}>
          <p style={{ marginTop: 0 }}>
            <strong>Boulder Buddy</strong> uses computer vision to detect climbing holds on your boulder wall and AI to provide route analysis and tips.
          </p>
          <p style={{ fontStyle: "italic", fontSize: 13, margin: "8px 0 4px 0", color: "#755cb0" }}>
            this app is a passion project in early development<br />
            for any issues/business inquiries contact <a href="mailto:daniel.cherno9@gmail.com" style={{ color: "#544bad" }}>daniel.cherno9@gmail.com</a>
          </p>
          <p>
            <strong>How to use:</strong>
          </p>
          <ol style={{ paddingLeft: 20, margin: "8px 0" }}>
            <li>Upload a photo of your climbing wall</li>
            <li>Click on a hold to detect holds of that color</li>
            <li>Review detected holds and edit if needed</li>
            <li>Generate AI-powered route analysis</li>
          </ol>
          <p style={{ fontSize: 12, color: "#666", marginBottom: 0 }}>
            Built with Django, React, OpenCV, and Groq AI
          </p>
          <p style={{ fontSize: 12, color: "#888", marginBottom: 0, marginTop: 8 }}>
            made by cherno:{" "}
            <a href="https://www.linkedin.com/in/daniel-cherno" target="_blank" rel="noopener noreferrer" style={{ color: "#2875c6" }}>
              https://www.linkedin.com/in/daniel-cherno
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

function AppContent() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial" }}>
      <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#111", fontWeight: 700 }}>
            Boulder Buddy
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setShowInfo(true)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 4,
                fontSize: 18,
                color: "#666",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="About Boulder Buddy"
            >
              ℹ️
            </button>
            <Auth />
          </div>
        </div>
      </header>

      {showInfo && <InfoPopup onClose={() => setShowInfo(false)} />}

      <main style={{ padding: 16 }}>
        <div style={{ maxWidth: 480, margin: "0 auto" }}>
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            } />
            <Route path="/boulder/:id" element={
              <ProtectedRoute>
                <BoulderPage />
              </ProtectedRoute>
            } />
>>>>>>> Stashed changes
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
<<<<<<< Updated upstream
=======

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
>>>>>>> Stashed changes
