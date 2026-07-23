import React, { useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";
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
    setError("Login failed. Please check credentials or backend authentication.");
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-6 font-body">
      <div className="w-full max-w-md bg-white border border-[#e0e0e0] p-8 shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#e0e0e0]">
          <img
            src="/brand/logo.jpeg"
            alt="Way Education Logo"
            className="w-12 h-12 object-contain rounded-md border border-[#e0e0e0]"
          />
          <div>
            <h1 className="text-xl font-headline font-bold text-[#161616]">
              Way Education
            </h1>
            <p className="text-xs text-[#6f6f6f] uppercase tracking-wider font-semibold">
              Enterprise Admin Portal
            </p>
          </div>
        </div>

        <h2 className="text-lg font-headline font-semibold text-[#161616] mb-1">
          Way Education Admin Dashboard
        </h2>
        <p className="text-xs text-[#6f6f6f] mb-6 leading-relaxed">
          Sign in with your administrator credentials to access system controls.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor={emailId}
              className="block text-xs text-[#525252] mb-1.5 font-medium flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#6f6f6f]" /> Email Address
            </label>
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="carbon-input w-full px-3 py-2 text-sm"
              disabled={busy}
              required
            />
          </div>

          <div>
            <label
              htmlFor={passwordId}
              className="block text-xs text-[#525252] mb-1.5 font-medium flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#6f6f6f]" /> Password
            </label>
            <input
              id={passwordId}
              type="password"
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                setError("");
              }}
              className={`carbon-input w-full px-3 py-2 text-sm ${
                error ? "border-[#da1e28] focus:border-[#da1e28]" : ""
              }`}
              autoFocus
              disabled={busy}
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-[#fff1f1] border border-[#ffb3b8] text-[#da1e28] text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full h-11 bg-[#0f62fe] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#0353e9] active:bg-[#002d9c] transition-colors font-body mt-2"
          >
            {busy ? (
              "Verifying credentials..."
            ) : (
              <>
                Access Admin Dashboard <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-[#e0e0e0] text-center">
          <p className="text-[11px] text-[#6f6f6f]">
            Secured Session · Way Education Enterprise v4.2.1
          </p>
        </div>
      </div>
    </div>
  );
}
