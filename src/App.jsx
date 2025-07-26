import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CreateBrief from "./pages/CreateBrief";
import EditBrief from "./pages/EditBrief";
import PublicBrief from "./pages/PublicBrief";
import LogIn from "./pages/Login";
import { ToastContainer } from "react-toastify";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored !== token) setToken(stored);
  }, [location.pathname]);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Accessible à tous */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LogIn onLogin={() => setToken(localStorage.getItem("token"))} />} />
        <Route path="/public/briefs/:uuid" element={<PublicBrief />} />

        {/* Authenticated routes */}
        {token ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/briefs/:id/edit" element={<EditBrief />} />
            <Route path="/briefs/new" element={<CreateBrief />} />
            <Route path="*" element={<Dashboard />} />
          </>
        ) : (
          <Route path="*" element={<Landing />} />
        )}
      </Routes>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;