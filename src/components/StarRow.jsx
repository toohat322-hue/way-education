import React from "react";
import { Star } from "lucide-react";

export default function StarRow({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          fill={i <= Math.round(rating) ? "#FF6A2B" : "none"}
          color={i <= Math.round(rating) ? "#FF6A2B" : "#D8DEEE"}
        />
      ))}
    </div>
  );
}
