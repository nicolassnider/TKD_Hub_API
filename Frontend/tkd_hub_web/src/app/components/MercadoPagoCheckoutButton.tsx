import React, { useState } from 'react';
import { CreatePreferenceRequest, CreatePreferenceResponse } from '../../../lib/types';
import { createPreference } from '../../../lib/mercadopago';


interface Props {
  request: CreatePreferenceRequest;
  onSuccess?: (result: CreatePreferenceResponse) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export default function MercadoPagoCheckoutButton({ request, onSuccess, onError, className }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const json = await createPreference(request);

      const checkoutUrl = json.preferenceUrl || json.initPoint || json.sandbox_init_point;
      if (!checkoutUrl) throw new Error('No checkout URL returned from server');

      const win = window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
      if (win) win.focus();

      setLoading(false);
      onSuccess?.(json);
    } catch (err: unknown) {
      setLoading(false);
      const error = err instanceof Error ? err : new Error(String(err));
      onError?.(error);
      console.error('MercadoPago create preference error', error);
      alert('Payment failed to start. Please try again.');
    }
  }

  return (
    <button className={className} onClick={handleClick} disabled={loading}>
      {loading ? 'Processing…' : 'Pay with MercadoPago'}
    </button>
  );
}
