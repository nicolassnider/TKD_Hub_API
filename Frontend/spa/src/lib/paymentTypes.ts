// Payment types used by PaymentContext and components in the SPA
export interface CreatePreferenceDTO {
  amount: number; // in cents
  description: string;
  payerEmail?: string;
}

export interface CreatePreferenceResponse {
  checkoutUrl?: string;
  init_point?: string;
  sandbox_init_point?: string;
  preferenceId?: string;
  [key: string]: unknown;
}

export function getCheckoutUrl(
  resp: CreatePreferenceResponse,
): string | undefined {
  return (
    (resp.checkoutUrl as string) ||
    (resp.init_point as string) ||
    (resp.sandbox_init_point as string)
  );
}
