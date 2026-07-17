import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAdminAuth } from "./useAdminAuth";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUniversities from "./pages/AdminUniversities";
import AdminDirectory from "./pages/AdminDirectory";
import AdminMajors from "./pages/AdminMajors";
import AdminFaqs from "./pages/AdminFaqs";
import AdminContent from "./pages/AdminContent";
import AdminLeads from "./pages/AdminLeads";
import AdminBlog from "./pages/AdminBlog";
import AdminSeo from "./pages/AdminSeo";

export default function AdminApp() {
  const { unlocked, booting } = useAdminAuth();

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5">
        <p className="text-sm" style={{ color: "#64748B" }}>Checking admin session…</p>
      </div>
    );
  }

  if (!unlocked) return <AdminLogin />;

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="universities" element={<AdminUniversities />} />
        <Route path="directory" element={<AdminDirectory />} />
        <Route path="majors" element={<AdminMajors />} />
        <Route path="faqs" element={<AdminFaqs />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="seo" element={<AdminSeo />} />
      </Routes>
    </AdminLayout>
  );
}
