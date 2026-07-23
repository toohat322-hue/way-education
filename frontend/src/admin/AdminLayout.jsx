import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  ListTree,
  BookOpen,
  HelpCircle,
  Type,
  Inbox,
  LogOut,
  ExternalLink,
  FileText,
  Search,
  Bell,
  Settings,
} from "lucide-react";
import { useAdminAuth } from "./useAdminAuth";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/universities", label: "Universities", icon: Building2 },
  { to: "/admin/directory", label: "Directory", icon: ListTree },
  { to: "/admin/majors", label: "Majors", icon: BookOpen },
  { to: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { to: "/admin/content", label: "Site Copy", icon: Type },
  { to: "/admin/blog", label: "Blog", icon: FileText },
  { to: "/admin/seo", label: "SEO", icon: Search },
  { to: "/admin/leads", label: "Leads", icon: Inbox },
];

function NavItem({ item, compact }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm transition-all duration-150 cursor-pointer ${
          compact ? "shrink-0 rounded-lg" : ""
        } ${
          isActive
            ? "text-[#0f62fe] font-semibold border-r-4 border-[#0f62fe] bg-[#f4f4f4]"
            : "text-[#525252] hover:text-[#161616] hover:bg-[#f4f4f4]"
        }`
      }
    >
      <item.icon className="w-4 h-4 mr-3 shrink-0" />
      <span className="font-body whitespace-nowrap">{item.label}</span>
    </NavLink>
  );
}

export default function AdminLayout({ children }) {
  const { logout } = useAdminAuth();

  return (
    <div className="bg-[#ffffff] text-[#161616] flex min-h-screen font-body">
      {/* SideNavBar */}
      <aside className="flex flex-col h-screen left-0 w-64 bg-white border-r border-[#e0e0e0] flex-shrink-0 z-50 overflow-y-auto fixed lg:static">
        {/* Logo & Brand Header */}
        <div className="px-4 py-6 flex items-center gap-3 border-b border-[#e0e0e0]">
          <img
            src="/brand/logo.jpeg"
            alt="Way Education Logo"
            className="w-9 h-9 object-contain rounded-md border border-[#e0e0e0]"
          />
          <div className="flex flex-col">
            <span className="text-lg font-headline font-bold text-[#161616] leading-tight">
              Way Education
            </span>
            <span className="font-body text-[10px] font-medium text-[#6f6f6f] uppercase tracking-wider">
              Enterprise Admin
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 mt-4 space-y-0.5">
          {NAV.map((item) => (
            <NavItem key={item.to} item={item} />
          ))}
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-[#e0e0e0] bg-[#f4f4f4]/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0f62fe] text-white flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#161616]">Admin User</span>
              <span className="text-[10px] text-[#6f6f6f]">System Controller</span>
            </div>
          </div>
        </div>

        {/* View Site & Logout */}
        <div className="p-4 border-t border-[#e0e0e0] flex flex-col gap-2 mt-auto">
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-body text-[#6f6f6f] hover:text-[#161616] hover:bg-[#f4f4f4] transition-colors"
          >
            <span>View site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={logout}
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-body text-[#da1e28] hover:bg-[#fff1f1] transition-colors font-medium text-left"
          >
            <span>Log out</span>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#ffffff]">
        {/* TopNavBar Header */}
        <header className="flex justify-between items-center w-full px-6 h-14 sticky top-0 z-40 bg-white border-b border-[#e0e0e0]">
          {/* Header Title & Search */}
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <img
                src="/brand/logo.jpeg"
                alt="Way Education Logo"
                className="w-7 h-7 object-contain rounded border border-[#e0e0e0] lg:hidden"
              />
              <h1 className="text-base sm:text-lg font-semibold text-[#161616] tracking-tight whitespace-nowrap">
                Way Education Admin Dashboard
              </h1>
            </div>

            <div className="hidden sm:flex items-center bg-[#f4f4f4] px-3 h-8 w-full max-w-md border border-[#e0e0e0] focus-within:ring-1 focus-within:ring-[#0f62fe] transition-all">
              <Search className="w-4 h-4 text-[#6f6f6f] mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Global search entities..."
                className="bg-transparent border-none focus:outline-none text-xs w-full font-body text-[#161616]"
              />
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4 ml-4">
            <button className="flex items-center justify-center w-8 h-8 hover:bg-[#f4f4f4] transition-colors text-[#525252] rounded" aria-label="Notifications">
              <Bell className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-center w-8 h-8 hover:bg-[#f4f4f4] transition-colors text-[#525252] rounded" aria-label="Settings">
              <Settings className="w-4 h-4" />
            </button>
            <div className="h-8 w-8 bg-[#e0e0e0] overflow-hidden border border-[#e0e0e0] flex items-center justify-center shrink-0">
              <img
                src="/brand/logo.jpeg"
                alt="Admin Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Mobile Nav Bar */}
        <div className="lg:hidden sticky top-14 z-30 flex items-center gap-1 px-4 py-2 bg-[#f4f4f4] border-b border-[#e0e0e0] overflow-x-auto hide-scroll">
          {NAV.map((item) => (
            <NavItem key={item.to} item={item} compact />
          ))}
        </div>

        {/* Scrollable Canvas Page Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
