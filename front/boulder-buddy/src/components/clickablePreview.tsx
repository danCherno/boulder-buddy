import { useRef, useState } from "react";

type Pick = { x: number; y: number }; // natural image pixel coords

export function ClickablePreview({
  previewUrl,
  onPick,
}: {
  previewUrl: string;
  onPick?: (p: Pick) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);

  // store pick in *percent* so the dot stays correct even if the image resizes
  const [pickPct, setPickPct] = useState<{ xPct: number; yPct: number } | null>(null);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const img = imgRef.current;
    if (!img) return;
    if (!img.naturalWidth || !img.naturalHeight) return;


    const rect = img.getBoundingClientRect();

    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;

    const clampedX = Math.max(0, Math.min(dx, rect.width));
    const clampedY = Math.max(0, Math.min(dy, rect.height));

    // percent for rendering the dot
    const xPct = (clampedX / rect.width) * 100;
    const yPct = (clampedY / rect.height) * 100;
    setPickPct({ xPct, yPct });

    // convert to natural pixel coords for backend/OpenCV
    const x = Math.round((clampedX / rect.width) * img.naturalWidth);
    const y = Math.round((clampedY / rect.height) * img.naturalHeight);

    onPick?.({ x, y });
  }

  return (
    <div
      style={{
        marginTop: 12,
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid #eee",
        position: "relative",
        touchAction: "manipulation",
      }}
      onPointerDown={handlePointerDown}
    >
      <img
        ref={imgRef}
        src={previewUrl}
        alt="preview"
        style={{ width: "100%", display: "block" }}
        draggable={false}
      />

      {/* Dot */}
      {pickPct && (
        <div
          style={{
            position: "absolute",
            left: `${pickPct.xPct}%`,
            top: `${pickPct.yPct}%`,
            transform: "translate(-50%, -50%)",
            width: 8,
            height: 8,
            borderRadius: 999,
            background: "red",
            boxShadow: "0 0 0 2px rgba(255,0,0,0.20)",
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
