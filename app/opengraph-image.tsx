import { ImageResponse } from "next/og";
import { palette } from "@/content/tokens";

export const alt = "Kinocut — the edit bay on retainer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: palette.ink950,
          color: palette.white,
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: palette.blue300 }}>
          00:00:00:01 · KINOCUT
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 0.95, letterSpacing: -3 }}>
          <span>Drop the rushes.</span>
          <span style={{ color: palette.green300 }}>Leave with the film.</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: palette.ink300 }}>
          Unlimited video editing. One flat monthly fee.
        </div>
      </div>
    ),
    { ...size },
  );
}
