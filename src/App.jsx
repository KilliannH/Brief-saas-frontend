import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./services/auth";
import { useTranslation } from "react-i18next";

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
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import PublicLayout from "./layouts/PublicLayout";

function App() {
  const { t } = useTranslation();
  const { ready  } = useAuth();

  if (!ready) return null;

  return (
    <Routes>
      <p>Version: HELMET CLEAN ✅</p>
      {/* Public Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/public/briefs/:uuid" element={<PublicBrief />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      {/* Authenticated Layout */}
      <Route element={<AuthenticatedLayout />}>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/briefs/new" element={<CreateBrief />} />
          <Route path="/briefs/:id/edit" element={<EditBrief />} />
        </Route>
      </Route>

      {/* 404 global */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;