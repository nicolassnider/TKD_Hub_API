import PaymentIframeModal from "../payment/PaymentIframeModal";

type Props = {
  paymentLoading: boolean;
  paymentError: string | null;
  paymentUrl: string | null;
  onPay: () => void;
  onCloseIframe: () => void;
};

const ProfilePaymentSection = ({
  paymentLoading,
  paymentError,
  paymentUrl,
  onPay,
  onCloseIframe,
}: Props) => (
  <>
    <button
      onClick={onPay}
      disabled={paymentLoading}
      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      {paymentLoading ? "Processing..." : "Pay Membership"}
    </button>
    {paymentError && (
      <div className="text-red-500 mt-2">{paymentError}</div>
    )}
    {paymentUrl && (
      <PaymentIframeModal paymentUrl={paymentUrl} onClose={onCloseIframe} />
    )}
  </>
);

export default ProfilePaymentSection;
