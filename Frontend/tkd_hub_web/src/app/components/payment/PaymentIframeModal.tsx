import React from "react";
import GenericButton from "../common/actionButtons/GenericButton";

interface PaymentIframeModalProps {
  paymentUrl: string;
  onClose: () => void;
}

const PaymentIframeModal: React.FC<PaymentIframeModalProps> = ({
  paymentUrl,
  onClose,
}) => {
  if (!paymentUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 relative w-full max-w-2xl">
        <GenericButton
          type="button"
          variant="secondary"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl min-w-0 w-10 h-10 flex items-center justify-center"
          aria-label="Close"
        >
          &times;
        </GenericButton>
        <iframe
          src={paymentUrl}
          title="MercadoPago Payment"
          className="w-full h-[600px] border-0 rounded"
          allow="payment"
        />
      </div>
    </div>
  );
};

export default PaymentIframeModal;
