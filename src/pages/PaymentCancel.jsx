import CustomHelmet from "../components/CustomHelmet";
import { XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PaymentCancel() {
  const { t } = useTranslation();
  return (
    <>
      <CustomHelmet
        title={t("helmet.payment.cancel.title")}
        description={t("helmet.payment.cancel.description")}
        path="/payment/cancel"
      />
      <div className="max-w-xl mx-auto text-center p-10">
        <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-red-700 mb-2">{t("paymentCancel.title")}</h1>
        <p className="text-gray-700">
          {t("paymentCancel.description")}
        </p>
      </div>
    </>
  );
}