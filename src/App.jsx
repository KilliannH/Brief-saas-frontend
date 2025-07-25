import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateBrief from "./pages/CreateBrief";
import Login from "./pages/Login";
import PublicBrief from "./pages/PublicBrief";
import EditBrief from "./pages/EditBrief";
import Navbar from "./components/Navbar";
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
        <Route path="/public/briefs/:uuid" element={<PublicBrief />} />

        {token ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/briefs/:id/edit" element={<EditBrief />} />
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