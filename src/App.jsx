import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CreateBrief from "./pages/CreateBrief";
import EditBrief from "./pages/EditBrief";
import PublicBrief from "./pages/PublicBrief";
import LogIn from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./components/NotFound";
import Legal from "./pages/Legal";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./services/auth";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <>
  <Navbar />
  <Routes>
    {/* Pages publiques */}
    <Route path="/" element={<Landing />} />
    <Route path="/public/briefs/:uuid" element={<PublicBrief />} />
    <Route path="/verify" element={<VerifyEmail />} />
    <Route path="/payment/success" element={<PaymentSuccess />} />
    <Route path="/payment/cancel" element={<PaymentCancel />} />
    <Route path="/legal" element={<Legal />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/privacy" element={<Privacy />} />

    {/* Auth routes */}
    {isAuthenticated ? (
      <>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/briefs/new" element={<CreateBrief />} />
        <Route path="/briefs/:id/edit" element={<EditBrief />} />
      </>
    ) : (
      <>
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
      </>
    )}

    {/* Page 404 globale */}
    <Route path="*" element={<NotFound />} />
  </Routes>

  <ToastContainer position="bottom-right" autoClose={3000} />
  <footer className="text-center text-xs text-gray-500 py-6 border-t bg-white">
    <p className="mb-1">
      <a href="/legal" className="hover:underline">{t("footer.legal")}</a> |{" "}
      <a href="/terms" className="hover:underline">{t("footer.terms")}</a> |{" "}
      <a href="/privacy" className="hover:underline">{t("footer.privacy")}</a>
    </p>
    <p className="text-[11px]">&copy; {new Date().getFullYear()} BriefMate</p>
  </footer>
</>
  );
}

export default App;