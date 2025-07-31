import { StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./services/auth";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
  <BrowserRouter>
    <HelmetProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HelmetProvider>
  </BrowserRouter>
</StrictMode>
);