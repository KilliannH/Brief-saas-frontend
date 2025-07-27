import { XCircle } from "lucide-react";

export default function PaymentCancel() {
  return (
    <div className="max-w-xl mx-auto text-center p-10">
      <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-red-700 mb-2">Paiement annulé</h1>
      <p className="text-gray-700">
        Le processus de paiement a été annulé. Vous pouvez réessayer à tout moment.
      </p>
    </div>
  );
}