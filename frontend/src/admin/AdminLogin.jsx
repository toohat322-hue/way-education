import React, { useState } from "react";
import { Lock, GraduationCap, Mail } from "lucide-react";
import { C, grad } from "../theme/tokens";
import GlassCard from "../components/GlassCard";
import { useAdminAuth } from "./useAdminAuth";

export default function AdminLogin() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState("admin@wayeducation.com");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const emailId = "admin-email";
  const passwordId = "admin-password";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const ok = await login({ email, password: pwd });
    setBusy(false);
    if (ok) {
      setError("");
      return;
    }
    setError("Login failed. Check backend credentials or auth endpoint.");
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
        <p className="text-sm mb-2" style={{ color: C.muted }}>Sign in to manage Way Education content.</p>
        <p className="text-[11px] mb-4" style={{ color: C.muted }}>
          Session is verified via backend auth endpoints.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor={emailId} className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: C.inkSoft }}>
            <Mail size={13} /> Email
          </label>
          <input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none mb-3"
            style={{ border: `1px solid ${C.border}` }}
            disabled={busy}
          />
          <label htmlFor={passwordId} className="text-xs font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: C.inkSoft }}>
            <Lock size={13} /> Password
          </label>
          <input
            id={passwordId}
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setError("");
            }}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none mb-2"
            style={{ border: `1px solid ${error ? C.orangeDark : C.border}` }}
            autoFocus
            disabled={busy}
          />
          {error && <p className="text-xs mb-3" style={{ color: C.orangeDark }}>{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white mt-3 transition-transform hover:scale-[1.02] active:scale-95"
            style={{ background: grad.cta, opacity: busy ? 0.8 : 1 }}
          >
            {busy ? "Signing in…" : "Unlock Dashboard"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
