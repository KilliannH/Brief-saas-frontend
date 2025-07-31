import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function PublicLayout() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <Outlet />
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