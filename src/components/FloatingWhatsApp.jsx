import React from "react";
import { MessageCircle } from "lucide-react";
import { useData } from "../admin/useData";
import { useLanguage } from "../context/useLanguage";

export default function FloatingWhatsApp() {
  const { settings } = useData();
  const { isRtl } = useLanguage();

  if (!settings?.whatsapp) return null;

  return (
    <a
      href={`https://wa.me/${settings.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      style={{
        [isRtl ? "left" : "right"]: 20,
        background: "#25D366",
        boxShadow: "0 8px 24px rgba(37,211,102,0.45)",
      }}
    >
      <MessageCircle size={26} color="#fff" />
    </a>
  );
}
