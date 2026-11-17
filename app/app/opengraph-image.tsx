import { ImageResponse } from "next/og";

export const alt = "WEO Detailing — детейлинг-студия в Москве";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Карточка для мессенджеров: тот же тёмный язык, что и на сайте. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0a1a28 0%, #05070a 55%, #030405 100%)",
          color: "#f2f6f8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ width: 44, height: 7, borderRadius: 4, background: "#e8eff5" }} />
            <div style={{ width: 32, height: 7, borderRadius: 4, background: "#e8eff5", marginLeft: 6 }} />
            <div style={{ width: 22, height: 7, borderRadius: 4, background: "#e8eff5", marginLeft: 12 }} />
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>WEO Detailing</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 86, lineHeight: 1, letterSpacing: -3, fontWeight: 600, maxWidth: 900 }}>
            Машина снова своя.
          </div>
          <div style={{ marginTop: 26, fontSize: 30, color: "#9db0bf" }}>
            Мойка, химчистка и полировка · Москва, Хамовники
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, fontSize: 22, color: "#c6d5e0" }}>
          <div style={{ padding: "12px 20px", border: "1px solid #2b3d4c", borderRadius: 10 }}>Ежедневно 09:00–21:00</div>
          <div style={{ padding: "12px 20px", border: "1px solid #2b3d4c", borderRadius: 10 }}>Стоимость согласуем заранее</div>
        </div>
      </div>
    ),
    size,
  );
}
