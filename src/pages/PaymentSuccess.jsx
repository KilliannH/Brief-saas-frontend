import CustomHelmet from "../components/CustomHelmet";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PaymentSuccess() {
  const { t } = useTranslation();
  return (
    <>
      <CustomHelmet
        title={t("helmet.payment.success.title")}
        description={t("helmet.payment.success.description")}
        path="/payment/success"
      />
      <div className="max-w-xl mx-auto text-center p-10">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-green-700 mb-2">{t("paymentSuccess.title")}</h1>
        <p className="text-gray-700">
          {t("paymentSuccess.description")}
        </p>
      </div>
    </>
  );
}