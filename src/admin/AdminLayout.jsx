import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard, Building2, ListTree, BookOpen, HelpCircle, Type, Inbox,
  LogOut, ExternalLink, GraduationCap,
} from "lucide-react";
import { C, grad } from "../theme/tokens";
import { useAdminAuth } from "./useAdminAuth";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/universities", label: "Universities", icon: Building2 },
  { to: "/admin/directory", label: "Directory", icon: ListTree },
  { to: "/admin/majors", label: "Majors", icon: BookOpen },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/content", label: "Site Copy", icon: Type },
  { to: "/admin/leads", label: "Leads", icon: Inbox },
];

function NavItem({ item, compact }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={compact ? "shrink-0" : ""}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: compact ? "8px 14px" : "10px 14px",
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 500,
        whiteSpace: "nowrap",
        background: isActive ? "rgba(255,255,255,0.14)" : "transparent",
        color: isActive ? "#fff" : "rgba(255,255,255,0.65)",
      })}
    >
      <item.icon size={16} /> {item.label}
    </NavLink>
  );
}

export default function AdminLayout({ children }) {
  const { logout } = useAdminAuth();

  return (
    <div className="min-h-screen flex" style={{ background: C.bg }}>
      <aside className="w-64 shrink-0 hidden md:flex flex-col p-5" style={{ background: grad.navy }}>
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: grad.primary }}>
            <GraduationCap size={18} color="#fff" />
          </div>
          <span className="text-lg font-bold text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
            Way <span style={{ color: C.cyan }}>Education</span>
          </span>
        </Link>
        <nav className="flex-1 flex flex-col gap-1">
          {NAV.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>
        <div className="flex flex-col gap-1 pt-4 mt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <a href="/" className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
            <ExternalLink size={16} /> View site
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-left"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="md:hidden sticky top-0 z-40 flex items-center gap-2 px-4 py-3 overflow-x-auto hide-scroll" style={{ background: grad.navy }}>
          {NAV.map((item) => (
            <NavItem key={item.to} item={item} compact />
          ))}
          <button onClick={logout} className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
            <LogOut size={15} />
          </button>
        </div>

        <main className="flex-1 min-w-0">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 md:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
