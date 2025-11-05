import { loadingAtom } from "@/stores/loading";
import { useAtomValue } from "jotai";
import React from "react";
import { Spin } from "antd";

export default function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const loading = useAtomValue(loadingAtom);

  return (
    <div style={{ position: "relative" }}>
      {/* Nội dung chính */}
      <div
        style={{
          pointerEvents: loading ? "none" : "auto", // tránh click khi đang loading
          transition: "filter 0.3s ease",
        }}
      >
        {children}
      </div>

      {/* Overlay loading */}
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            zIndex: 1000,
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}
