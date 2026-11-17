import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          background: "#0b1015",
          color: "#e8eff5",
          fontSize: 68,
          fontWeight: 700,
          letterSpacing: -3,
        }}
      >
        WEO
      </div>
    ),
    size,
  );
}
