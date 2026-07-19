import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function renderOgImage(eyebrow: string, title: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#181c17",
          color: "#f5f1eb",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#97623b",
            display: "flex",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            fontSize: 64,
            marginTop: 24,
            lineHeight: 1.1,
            color: "#f5f1eb",
            maxWidth: 980,
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 28,
            color: "#d4af37",
            display: "flex",
          }}
        >
          Quantum AI Business Consultants
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
