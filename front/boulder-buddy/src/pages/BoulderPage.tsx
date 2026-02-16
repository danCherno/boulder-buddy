<<<<<<< Updated upstream
// src/pages/BoulderPage.tsx
=======
>>>>>>> Stashed changes
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { getBoulder, summarizeBoulder } from "../lib/api";
import type { Boulder } from "../lib/types";

type HoldPx = { x: number; y: number };

function parsePositions(positions: any): HoldPx[] {
  if (!Array.isArray(positions)) return [];
  return positions
    .map((p) => {
      if (Array.isArray(p) && p.length >= 2) return { x: Number(p[0]), y: Number(p[1]) };
      if (p && typeof p === "object" && "x" in p && "y" in p) return { x: Number((p as any).x), y: Number((p as any).y) };
      return null;
    })
    .filter(Boolean) as HoldPx[];
}

function PixelHoldsOverlay({
  imgRef,
  holds,
  radiusPx = 1,
  onDelete,
  onAddHold,
}: {
  imgRef: React.RefObject<HTMLImageElement | null>;
  holds: HoldPx[];
  radiusPx?: number;
  onDelete?: (index: number) => void;
  onAddHold?: (pos: HoldPx) => void;
}) {
  const [dims, setDims] = useState<{ nw: number; nh: number; dw: number; dh: number } | null>(null);

  useEffect(() => {
    function update() {
      const img = imgRef.current;
      if (!img) return;

      const nw = img.naturalWidth || 0;
      const nh = img.naturalHeight || 0;

      const rect = img.getBoundingClientRect();
      const dw = rect.width;
      const dh = rect.height;

      if (nw && nh && dw && dh) setDims({ nw, nh, dw, dh });
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [imgRef]);

  if (!dims) return null;

  const sx = dims.dw / dims.nw;
  const sy = dims.dh / dims.nh;
  const r = Math.max(radiusPx * Math.min(sx, sy), 4);

  const handleSvgClick = onAddHold
    ? (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      const xPx = clickX / sx;
      const yPx = clickY / sy;
      onAddHold({ x: Math.round(xPx), y: Math.round(yPx) });
    }
    : undefined;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        cursor: onDelete || onAddHold ? (onAddHold ? "crosshair" : "pointer") : "default"
      }}
      viewBox={`0 0 ${dims.dw} ${dims.dh}`}
      preserveAspectRatio="none"
      onClick={handleSvgClick}
    >
      {holds.map((h, i) => (
        <circle
          key={i}
          cx={h.x * sx}
          cy={h.y * sy}
          r={r}
          fill="red"
          stroke={onDelete ? "#333" : undefined}
          strokeWidth={onDelete ? 1 : undefined}
          style={{
            cursor: onDelete ? "pointer" : onAddHold ? "crosshair" : "default",
            opacity: onDelete ? 0.85 : 1,
            transition: "opacity 0.1s",
          }}
          onClick={onDelete
            ? (e) => {
                e.stopPropagation();
                onDelete(i);
              }
            : undefined}
        />
      ))}
<<<<<<< Updated upstream
      {/* Optionally show a tip? */}
=======
>>>>>>> Stashed changes
    </svg>
  );
}

async function commitHolds(boulderId: string, holds: HoldPx[]) {
  const API_BASE = import.meta.env.VITE_API_BASE as string;
<<<<<<< Updated upstream
  const response = await fetch(`${API_BASE}/boulder/${boulderId}/`, {
=======
  const response = await fetch(`${API_BASE}/api/boulder/${boulderId}/`, {
>>>>>>> Stashed changes
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      positions: holds.map((h) => [h.x, h.y])
    }),
<<<<<<< Updated upstream
=======
    credentials: 'include',
>>>>>>> Stashed changes
  });
  if (!response.ok) {
    let data;
    try {
      data = await response.json();
    } catch {
      data = { error: response.statusText };
    }
    throw new Error(data?.error || "Failed to save holds");
  }
  return await response.json();
}

export default function BoulderPage() {
  const { id = "" } = useParams();
  const loc = useLocation();
  const previewUrl = (loc.state as any)?.previewUrl as string | undefined;

  const imgRef = useRef<HTMLImageElement>(null);

  const [boulder, setBoulder] = useState<Boulder | null>(null);
  const [busy, setBusy] = useState(false);
  const [sumBusy, setSumBusy] = useState(false);
  const [commitBusy, setCommitBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

<<<<<<< Updated upstream
  // Editable holds, initial from boulder?.positions, but updated as user removes/adds dots.
  const [editableHolds, setEditableHolds] = useState<HoldPx[] | null>(null);

  // Reset editable holds whenever we get a new boulder (id change or refetch)
=======
  const [editableHolds, setEditableHolds] = useState<HoldPx[] | null>(null);

>>>>>>> Stashed changes
  useEffect(() => {
    setEditableHolds(null);
  }, [id, boulder?.positions]);

  const holds = useMemo(() => {
    if (editableHolds !== null) return editableHolds;
    return parsePositions(boulder?.positions);
  }, [editableHolds, boulder?.positions]);

<<<<<<< Updated upstream
  // Actually update boulder.positions only if you want to sync with backend.
  // For now: only update client-side (just in editableHolds state).

=======
>>>>>>> Stashed changes
  const handleDeleteHold = useCallback((index: number) => {
    setEditableHolds((prev) => {
      const prevHolds = prev !== null ? prev : parsePositions(boulder?.positions);
      if (index < 0 || index >= prevHolds.length) return prevHolds;
      const next = [...prevHolds];
      next.splice(index, 1);
      return next;
    });
  }, [boulder?.positions]);

  const handleAddHold = useCallback((pos: HoldPx) => {
    setEditableHolds((prev) => {
      const prevHolds = prev !== null ? prev : parsePositions(boulder?.positions);
<<<<<<< Updated upstream
      // Optionally avoid adding duplicates within a pixel or two
=======
>>>>>>> Stashed changes
      if (prevHolds.some(h => Math.abs(h.x - pos.x) < 2 && Math.abs(h.y - pos.y) < 2)) return prevHolds;
      return [...prevHolds, pos];
    });
  }, [boulder?.positions]);

  async function refresh() {
    setBusy(true);
    setErr(null);
    try {
      setBoulder(await getBoulder(id));
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load boulder");
    } finally {
      setBusy(false);
    }
  }

  async function onSummarize() {
<<<<<<< Updated upstream
    // Only allow summarization if not in edit mode
=======
>>>>>>> Stashed changes
    if (editableHolds !== null) return;
    setSumBusy(true);
    setErr(null);
    try {
      setBoulder(await summarizeBoulder(id));
      setEditableHolds(null);
    } catch (e: any) {
      setErr(e?.message ?? "Summarize failed");
    } finally {
      setSumBusy(false);
    }
  }

  async function onCommitDots() {
    if (!boulder || !boulder.id || !editableHolds) return;
    setCommitBusy(true);
    setErr(null);
    try {
      const newData = await commitHolds(boulder.id.toString(), editableHolds);
      setBoulder(newData);
      setEditableHolds(null);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to save holds");
    } finally {
      setCommitBusy(false);
    }
  }

  useEffect(() => {
    refresh();
<<<<<<< Updated upstream
    // eslint-disable-next-line react-hooks/exhaustive-deps
=======
>>>>>>> Stashed changes
  }, [id]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h1 style={{ fontSize: 20, margin: 0 }}>Boulder {id}</h1>
        <button
          onClick={refresh}
          disabled={busy}
<<<<<<< Updated upstream
          style={{ border: "none", background: "transparent", color: "#444", padding: 8 }}
=======
          style={{ border: "none", background: "transparent", color: "#444", padding: 8, cursor: busy ? "not-allowed" : "pointer" }}
>>>>>>> Stashed changes
        >
          {busy ? "…" : "Refresh"}
        </button>
      </div>

      {err && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            background: "#fff3f3",
            border: "1px solid #ffd1d1",
            borderRadius: 12,
          }}
        >
          <b style={{ color: "#b00020" }}>Error:</b> {err}
        </div>
      )}

      <div style={{ marginTop: 12, color: "#666", fontSize: 14 }}>
        Holds detected: <b>{holds.length}</b>
        {editableHolds !== null && (
          <span style={{ marginLeft: 10, fontSize: 13, color: "#555" }}>
            (edit mode:
            <span style={{ marginLeft: 4 }}>
              <b>click a dot to delete</b>
            </span>
            <span style={{ marginLeft: 8 }}>
<<<<<<< Updated upstream
              <b>
                {"click image to add new dot"}
              </b>
=======
              <b>click image to add new dot</b>
>>>>>>> Stashed changes
            </span>
            <button
              style={{
                marginLeft: 6,
                fontSize: 12,
                color: "#006",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0
              }}
<<<<<<< Updated upstream
              onClick={() => { setEditableHolds(null); }}
=======
              onClick={() => setEditableHolds(null)}
>>>>>>> Stashed changes
              disabled={commitBusy}
            >
              Reset
            </button>
            <button
              style={{
                marginLeft: 12,
                fontSize: 12,
                color: "#004",
                background: commitBusy ? "#ddd" : "#cfd",
                border: "1px solid #042",
                borderRadius: 6,
<<<<<<< Updated upstream
                cursor: commitBusy ? "default" : "pointer",
=======
                cursor: commitBusy ? "not-allowed" : "pointer",
>>>>>>> Stashed changes
                textDecoration: "none",
                padding: "4px 12px",
                fontWeight: 600,
                transition: "background 0.1s"
              }}
              onClick={onCommitDots}
              disabled={commitBusy}
            >
              {commitBusy ? "Saving..." : "Save changes"}
            </button>
          </span>
        )}
        {editableHolds === null && holds.length > 0 && (
          <span style={{ marginLeft: 10 }}>
            <button
              style={{
                fontSize: 12,
                color: "#006",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0
              }}
<<<<<<< Updated upstream
              onClick={() => { setEditableHolds(holds); }}
=======
              onClick={() => setEditableHolds(holds)}
>>>>>>> Stashed changes
            >
              Edit dots
            </button>
          </span>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        {previewUrl ? (
<<<<<<< Updated upstream
          <>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "3 / 4",
                borderRadius: 14,
                overflow: "hidden",
                border: "1px solid #eee",
                background: "#f4f4f4",
              }}
            >
              <img
                ref={imgRef}
                src={previewUrl}
                alt="uploaded"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                // If we want visual feedback on addMode, e.g. crosshair cursor on img
                // Not strictly necessary as SVG overlays the image
              />
              {holds.length > 0 || (editableHolds && editableHolds.length === 0) ? (
                <PixelHoldsOverlay
                  imgRef={imgRef}
                  holds={holds}
                  radiusPx={2}
                  onDelete={editableHolds !== null ? handleDeleteHold : undefined}
                  onAddHold={editableHolds !== null ? handleAddHold : undefined}
                />
              ) : null}
            </div>

            <div style={{ marginTop: 8, color: "#666", fontSize: 13 }}>
              This image is a local preview (backend doesn't store images yet).
            </div>
          </>
=======
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid #eee",
              background: "#f4f4f4",
            }}
          >
            <img
              ref={imgRef}
              src={previewUrl}
              alt="uploaded"
              style={{ width: "100%", height: "auto", objectFit: "cover", display: "block" }}
            />
            {holds.length > 0 || (editableHolds && editableHolds.length === 0) ? (
              <PixelHoldsOverlay
                imgRef={imgRef}
                holds={holds}
                radiusPx={2}
                onDelete={editableHolds !== null ? handleDeleteHold : undefined}
                onAddHold={editableHolds !== null ? handleAddHold : undefined}
              />
            ) : null}
          </div>
>>>>>>> Stashed changes
        ) : (
          <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12, color: "#666" }}>
            No image preview available. Upload again to view overlay on the same device/session.
          </div>
        )}
      </div>

      <button
        onClick={onSummarize}
        disabled={sumBusy || editableHolds !== null}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "14px 16px",
          borderRadius: 12,
          border: "1px solid #111",
          fontWeight: 700,
          background: sumBusy || editableHolds !== null ? "#eee" : "#fff",
          cursor: sumBusy || editableHolds !== null ? "not-allowed" : "pointer",
        }}
      >
<<<<<<< Updated upstream
        {sumBusy ? "Generating..." : boulder?.summary?.trim() ? "Re-generate summary (not available in beta)" : "Generate summary"}
=======
        {sumBusy ? "Generating..." : boulder?.summary?.trim() ? "Re-generate summary" : "Generate summary"}
>>>>>>> Stashed changes
        {editableHolds !== null && (
          <span style={{ color: "#b00020", marginLeft: 8, fontSize: 13 }}>
            (Finish editing to generate summary)
          </span>
        )}
      </button>

      <div style={{ marginTop: 12, padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Summary</div>
        <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.4, color: boulder?.summary?.trim() ? "#111" : "#666" }}>
          {boulder?.summary?.trim() ? boulder.summary : "No summary yet."}
        </div>
      </div>

      <details style={{ marginTop: 12 }}>
        <summary style={{ cursor: "pointer", color: "#444" }}>Raw Boulder JSON</summary>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            fontSize: 12,
            padding: 12,
            background: "#fafafa",
            borderRadius: 12,
            border: "1px solid #eee",
            marginTop: 8,
          }}
        >
          {JSON.stringify(boulder, null, 2)}
        </pre>
      </details>
    </div>
  );
}