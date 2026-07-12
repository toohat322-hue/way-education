import React from "react";
import { C } from "../theme/tokens";

export default function GlassCard({ children, className = "", style = {}, ...rest }) {
  return (
    <div
      {...rest}
      className={`rounded-3xl border ${className}`}
      style={{
        background: C.glass,
        borderColor: C.glassBorder,
        backdropFilter: "blur(16px)",
        boxShadow: "0 8px 30px rgba(15,23,60,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
