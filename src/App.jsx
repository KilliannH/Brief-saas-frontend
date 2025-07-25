import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import CreateBrief from "./pages/CreateBrief";

import { useState } from "react";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <BrowserRouter>
      {token && <Navbar onLogout={handleLogout} />}

      <Routes>
        {token ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/briefs/new" element={<CreateBrief />} />
            <Route path="*" element={<Dashboard />} />
          </>
        ) : (
          <Route path="*" element={<Login onLogin={setToken} />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}