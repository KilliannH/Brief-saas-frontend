import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import CookieNotice from "../components/CookieNotice";
import { Link } from "react-router-dom";

export default function PublicLayout() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />
      <Outlet />
      <ToastContainer position="bottom-right" autoClose={3000} />
      <footer className="text-center text-xs text-gray-500 py-6 border-t bg-white">
        <p className="mb-1">
          <Link to="/legal" className="hover:underline">{t("footer.legal")}</Link> |{" "}
          <Link to="/terms" className="hover:underline">{t("footer.terms")}</Link> |{" "}
          <Link to="/privacy" className="hover:underline">{t("footer.privacy")}</Link>
        </p>
        <p className="text-[11px]">&copy; {new Date().getFullYear()} BriefMate</p>
      </footer>
      <CookieNotice />
    </>
  );
}