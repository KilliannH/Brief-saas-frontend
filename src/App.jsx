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
import { ToastContainer } from "react-toastify";
import { useAuth } from "./services/auth";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/public/briefs/:uuid" element={<PublicBrief />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        {isAuthenticated ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/briefs/new" element={<CreateBrief />} />
            <Route path="/briefs/:id/edit" element={<EditBrief />} />
            <Route path="*" element={<Dashboard />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Landing />} />
          </>
        )}
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
}

export default App;