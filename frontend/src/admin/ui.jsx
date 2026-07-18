import React, { useEffect } from "react";
import { X } from "lucide-react";
import { C, grad } from "../theme/tokens";
import GlassCard from "../components/GlassCard";

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="text-xs font-semibold mb-1.5 block" style={{ color: C.inkSoft }}>
      {children}
    </label>
  );
}

export function TextInput(props) {
  const { className = "", style = {}, ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white ${className}`}
      style={{ border: `1px solid ${C.border}`, color: C.ink, ...style }}
    />
  );
}

export function TextArea(props) {
  const { className = "", style = {}, ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white ${className}`}
      style={{ border: `1px solid ${C.border}`, color: C.ink, ...style }}
    />
  );
}

export function Select({ children, className = "", style = {}, ...rest }) {
  return (
    <select
      {...rest}
      className={`w-full px-3.5 py-2.5 rounded-xl text-sm outline-none bg-white ${className}`}
      style={{ border: `1px solid ${C.border}`, color: C.ink, ...style }}
    >
      {children}
    </select>
  );
}

export function Field({ label, id, children }) {
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      {id && React.isValidElement(children) ? React.cloneElement(children, { id }) : children}
    </div>
  );
}

export function PrimaryButton({ children, className = "", style = {}, ...rest }) {
  return (
    <button
      {...rest}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 ${className}`}
      style={{ background: grad.primary, ...style }}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", style = {}, ...rest }) {
  return (
    <button
      {...rest}
      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-95 ${className}`}
      style={{ border: `1px solid ${C.border}`, color: C.inkSoft, background: "#fff", ...style }}
    >
      {children}
    </button>
  );
}

// Simple controlled on/off switch for boolean settings (e.g. "Featured",
// "Active"). Pass `checked` + `onChange(nextBoolean)`; it's not a native
// <input type="checkbox"> under the hood so it can be styled as a pill.
export function Toggle({ checked, onChange, label, sub }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-3 p-3.5 rounded-xl text-start"
      style={{ background: C.bgAlt, border: `1px solid ${C.border}` }}
    >
      <span>
        <span className="block text-sm font-semibold" style={{ color: C.ink }}>{label}</span>
        {sub && <span className="block text-xs mt-0.5" style={{ color: C.muted }}>{sub}</span>}
      </span>
      <span
        className="relative w-11 h-6 rounded-full shrink-0 transition-colors duration-200"
        style={{ background: checked ? grad.primary : C.border }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
          style={{ insetInlineStart: checked ? "calc(100% - 22px)" : "2px" }}
        />
      </span>
    </button>
  );
}

export function DangerButton({ children, className = "", style = {}, ...rest }) {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-transform hover:scale-[1.02] active:scale-95 ${className}`}
      style={{ background: "#FFF1EE", color: "#E8501A", ...style }}
    >
      {children}
    </button>
  );
}

export function AdminModal({ title, onClose, children, wide = false }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Centering a taller-than-viewport flex item (sm:items-center) makes the
  // portion above the fold permanently unreachable by scrolling -- a well
  // known flexbox quirk. `wide` modals (currently just the University editor)
  // can get tall enough to hit this, so they stay top-aligned instead; the
  // shorter modals keep the nicer vertically-centered look.
  return (
    <div
      className={`fixed inset-0 z-100 flex ${wide ? "items-start" : "items-start sm:items-center"} justify-center p-4 overflow-y-auto`}
      style={{ background: "rgba(11,18,48,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <GlassCard
        className={`w-full ${wide ? "max-w-3xl" : "max-w-lg"} p-6 my-8 relative fade-up`}
        style={{ background: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg" style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}>
            {title}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full" style={{ background: C.bgAlt }} aria-label="Close">
            <X size={16} color={C.inkSoft} />
          </button>
        </div>
        {children}
      </GlassCard>
    </div>
  );
}

export function PageHeader({ title, sub, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}>
          {title}
        </h1>
        {sub && <p className="text-sm" style={{ color: C.muted }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatTile({ icon: Icon, label, value }) {
  return (
    <GlassCard className="p-5" style={{ background: "#fff" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: grad.primarySoft }}>
        <Icon size={18} color={C.blue} />
      </div>
      <div className="text-2xl font-extrabold mb-0.5" style={{ fontFamily: "Poppins, sans-serif", color: C.ink }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: C.muted }}>{label}</div>
    </GlassCard>
  );
}
