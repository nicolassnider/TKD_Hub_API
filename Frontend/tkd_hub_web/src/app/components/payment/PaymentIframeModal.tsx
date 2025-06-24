import React from "react";

interface PaymentIframeModalProps {
    paymentUrl: string;
    onClose: () => void;
}

const PaymentIframeModal: React.FC<PaymentIframeModalProps> = ({ paymentUrl, onClose }) => {
    if (!paymentUrl) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 relative w-full max-w-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl"
                    aria-label="Close"
                >
                    &times;
                </button>
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
