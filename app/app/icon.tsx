import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Фавикон: три наклонные полосы — тот же знак, что в шапке. */
export default function Icon() {
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
          gap: 5,
          background: "#0b1015",
        }}
      >
        {[30, 22, 14].map((width) => (
          <div
            key={width}
            style={{
              width,
              height: 6,
              borderRadius: 3,
              background: "#e8eff5",
              transform: "skewX(-25deg)",
              marginRight: 30 - width,
            }}
          />
        ))}
      </div>
    ),
    size,
  );
}
