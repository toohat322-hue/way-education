import React, { useCallback, useRef, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { ToastContext } from "./useToast";

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, tone = "success") => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, tone, key: Date.now() });
    timerRef.current = setTimeout(() => setToast(null), 2600);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div className="fixed bottom-6 inset-x-0 z-200 flex justify-center px-4 pointer-events-none">
          <div
            key={toast.key}
            className="fade-up flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium text-white pointer-events-auto"
            style={{
              background: toast.tone === "error" ? "#E8501A" : "#16A34A",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            {toast.tone === "error" ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
            {toast.message}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
