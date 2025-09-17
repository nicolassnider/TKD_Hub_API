import React, { useState } from 'react';
import { createPreference } from '@/app/lib/mercadopago';
import { CreatePreferenceDTO, CreatePreferenceResponse } from '../types/Payment';


interface Props {
  request: CreatePreferenceDTO;
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

      // The backend may return different field names depending on env/version.
      const maybe = json as unknown;
      const isObj = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === 'object';
      let checkoutUrl: string | undefined;
      if (isObj(maybe)) {
        const p = maybe['preferenceUrl'] as unknown;
        const i = maybe['initPoint'] as unknown;
        const s = maybe['sandbox_init_point'] as unknown;
        if (typeof p === 'string') checkoutUrl = p;
        else if (typeof i === 'string') checkoutUrl = i;
        else if (typeof s === 'string') checkoutUrl = s;
      }
      if (!checkoutUrl) throw new Error('No checkout URL returned from server');

      const win = window.open(checkoutUrl as string, '_blank');
      if (win && typeof win.focus === 'function') win.focus();

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
