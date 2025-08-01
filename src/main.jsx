import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./services/auth";
import { HelmetProvider } from "react-helmet-async";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
  <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
  </BrowserRouter>
  </HelmetProvider>
</StrictMode>
);