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

export default function AdminApp() {
  const { unlocked } = useAdminAuth();

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
      </Routes>
    </AdminLayout>
  );
}
