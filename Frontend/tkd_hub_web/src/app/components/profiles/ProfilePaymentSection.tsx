import PaymentIframeModal from "../payment/PaymentIframeModal";
import GenericButton from "../common/actionButtons/GenericButton";

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
    <GenericButton
      type="button"
      variant="neutral-dark"
      onClick={onPay}
      disabled={paymentLoading}
      className="mt-4 px-6 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-50"
    >
      {paymentLoading ? "Processing..." : "Pay Membership"}
    </GenericButton>
    {paymentError && <div className="text-red-600 mt-2">{paymentError}</div>}
    {paymentUrl && (
      <PaymentIframeModal paymentUrl={paymentUrl} onClose={onCloseIframe} />
    )}
  </>
);

export default ProfilePaymentSection;
