import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { processImage } from "../lib/api";
import { ClickablePreview } from "../components/clickablePreview";

export default function UploadPage() {
  const nav = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pick, setPick] = useState<{ x: number; y: number } | null>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  async function onProcess() {
    if (!file || !pick) return;
    setBusy(true);
    setErr(null);
    try {
      const boulder = await processImage(file, pick);
      nav(`/boulder/${boulder.id}`, { state: { previewUrl } });
    } catch (e: any) {
      setErr(e?.message ?? "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Upload</h1>
      <p style={{ color: "#666", marginTop: 0, marginBottom: 16 }}>
        Pick an image (camera supported on mobile).
      </p>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        style={{ width: "100%", padding: 12, border: "1px solid #ddd", borderRadius: 12 }}
      />

      {previewUrl && (
        <ClickablePreview
          previewUrl={previewUrl}
          onPick={(p) => {
            setPick(p)
          }}
        />
      )}

      <button
        onClick={onProcess}
        disabled={!file || !pick || busy}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "14px 16px",
          borderRadius: 12,
          border: "none",
          fontWeight: 700,
          background: !file || !pick || busy ? "#ddd" : "#111",
          color: !file || !pick || busy ? "#666" : "#fff",
        }}
      >
        {busy ? "Processing..." : "Process image"}
      </button>

      {err && (
        <div style={{ marginTop: 12, padding: 12, background: "#fff3f3", border: "1px solid #ffd1d1", borderRadius: 6 }}>
          <b style={{ color: "#b00020" }}>Error:</b> {err}
        </div>
      )}
    </div>
  );
}
