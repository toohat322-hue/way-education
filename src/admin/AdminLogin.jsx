import React, { useState } from "react";
import { Lock, GraduationCap } from "lucide-react";
import { C, grad } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import { useAdminAuth } from "./useAdminAuth";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = login(pwd);
    setError(!ok);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{ background: grad.hero }}>
      <GlassCard className="w-full max-w-sm p-8 fade-up" style={{ background: "#fff" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: grad.primary }}>
          <GraduationCap size={22} color="#fff" />
        </div>
        <h1 className="text-xl font-bold mb-1" style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}>
          Admin Dashboard
        </h1>
        <p className="text-sm mb-6" style={{ color: C.muted }}>Sign in to manage Way Education content.</p>
        <form onSubmit={handleSubmit}>
          <label className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: C.inkSoft }}>
            <Lock size={13} /> Password
          </label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setError(false);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none mb-2"
            style={{ border: `1px solid ${error ? C.orangeDark : C.border}` }}
            autoFocus
          />
          {error && <p className="text-xs mb-3" style={{ color: C.orangeDark }}>Incorrect password.</p>}
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-3 transition-transform hover:scale-[1.02] active:scale-95"
            style={{ background: grad.cta }}
          >
            Unlock Dashboard
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
