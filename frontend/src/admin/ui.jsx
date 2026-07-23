import React, { useEffect } from "react";
import { X } from "lucide-react";

export function Label({ children, htmlFor }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs text-[#525252] mb-2 font-medium font-body"
    >
      {children}
    </label>
  );
}

export function TextInput(props) {
  const { className = "", style = {}, ...rest } = props;
  return (
    <input
      {...rest}
      className={`carbon-input w-full px-3 py-2 text-sm border border-[#e0e0e0] bg-[#f4f4f4] text-[#161616] font-body focus:bg-white focus:border-[#0f62fe] focus:outline-none transition-all ${className}`}
      style={style}
    />
  );
}

export function TextArea(props) {
  const { className = "", style = {}, ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`carbon-input w-full px-3 py-2 text-sm border border-[#e0e0e0] bg-[#f4f4f4] text-[#161616] font-body focus:bg-white focus:border-[#0f62fe] focus:outline-none transition-all ${className}`}
      style={style}
    />
  );
}

export function Select({ children, className = "", style = {}, ...rest }) {
  return (
    <select
      {...rest}
      className={`carbon-input w-full px-3 py-2 text-sm border border-[#e0e0e0] bg-[#f4f4f4] text-[#161616] font-body focus:bg-white focus:border-[#0f62fe] focus:outline-none transition-all ${className}`}
      style={style}
    >
      {children}
    </select>
  );
}

export function Field({ label, id, children }) {
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      {id && React.isValidElement(children)
        ? React.cloneElement(children, { id })
        : children}
    </div>
  );
}

export function PrimaryButton({
  children,
  className = "",
  style = {},
  ...rest
}) {
  return (
    <button
      {...rest}
      className={`px-4 h-10 bg-[#0f62fe] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#0353e9] active:bg-[#002d9c] transition-colors font-body ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", style = {}, ...rest }) {
  return (
    <button
      {...rest}
      className={`px-4 h-10 bg-white text-[#161616] border border-[#e0e0e0] hover:bg-[#f4f4f4] active:bg-[#e0e0e0] transition-colors text-xs font-medium flex items-center justify-center gap-2 font-body ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  className = "",
  style = {},
  ...rest
}) {
  return (
    <button
      {...rest}
      className={`px-4 h-9 bg-[#fff1f1] text-[#da1e28] border border-[#ffb3b8] hover:bg-[#da1e28] hover:text-white transition-colors text-xs font-semibold flex items-center justify-center gap-1.5 font-body ${className}`}
      style={style}
    >
      {children}
    </button>
  );
}

export function Toggle({ checked, onChange, label, sub }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-3 p-3 bg-[#f4f4f4] border border-[#e0e0e0] text-left transition-colors hover:border-[#0f62fe]"
    >
      <span>
        <span className="block text-xs font-semibold text-[#161616]">
          {label}
        </span>
        {sub && (
          <span className="block text-[11px] text-[#6f6f6f] mt-0.5">
            {sub}
          </span>
        )}
      </span>
      <span
        className="relative w-10 h-5 rounded-full shrink-0 transition-colors duration-200"
        style={{ background: checked ? "#0f62fe" : "#c6c6c6" }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
          style={{ insetInlineStart: checked ? "calc(100% - 18px)" : "2px" }}
        />
      </span>
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

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        wide ? "items-start" : "items-start sm:items-center"
      } justify-center p-4 overflow-y-auto bg-black/40 backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`w-full ${
          wide ? "max-w-3xl" : "max-w-lg"
        } p-6 my-8 relative bg-white border border-[#e0e0e0] shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#e0e0e0]">
          <h3 className="font-semibold text-base text-[#161616] font-headline">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#f4f4f4] text-[#525252] hover:text-[#161616] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function PageHeader({ title, sub, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl sm:text-32px font-light text-[#161616] font-headline leading-tight">
          {title}
        </h1>
        {sub && (
          <p className="text-xs sm:text-sm text-[#6f6f6f] mt-1 font-body">
            {sub}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StatTile({ icon: Icon, label, value, subtext }) {
  return (
    <div className="bg-white p-4 border border-[#e0e0e0]">
      <span className="text-xs text-[#6f6f6f] font-medium uppercase tracking-wider font-body">
        {label}
      </span>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-24px font-semibold text-[#0f62fe] font-headline">
          {value}
        </span>
        {subtext && (
          <span className="text-[10px] text-[#198038] flex items-center gap-1 font-body">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
}
