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
      variant="warning"
      onClick={onPay}
      disabled={paymentLoading}
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
