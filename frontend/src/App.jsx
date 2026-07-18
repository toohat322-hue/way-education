import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { DataProvider } from "./admin/DataContext";
import { AdminAuthProvider } from "./admin/AdminAuth";
import { ToastProvider } from "./admin/Toast";
import { C, grad } from "./theme/tokens";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Home from "./pages/Home";
import Universities from "./pages/Universities";
import UniversityDetail from "./pages/UniversityDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin dashboard code only ever runs for the small number of people who
// visit /admin -- lazy-load it into its own chunk so regular site visitors
// don't download it.
const AdminApp = lazy(() => import("./admin/AdminApp"));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: grad.hero }}>

      <div className="text-sm font-medium" style={{ color: C.muted }}>Loading dashboard…</div>
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div style={{ minHeight: "100vh" }}>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/universities" element={<Universities />} />
        <Route
          path="/university/:id"
          element={
            <AdminAuthProvider>
              <UniversityDetail />
            </AdminAuthProvider>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/admin/*"
          element={
            <AdminAuthProvider>
              <Suspense fallback={<AdminFallback />}>
                <AdminApp />
              </Suspense>
            </AdminAuthProvider>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingWhatsApp />}
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <LanguageProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </ToastProvider>
      </LanguageProvider>
    </DataProvider>
  );
}
