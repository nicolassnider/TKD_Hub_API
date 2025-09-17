// Shared payment types used by PaymentContext and components
export interface CreatePreferenceDTO {
  amount: number; // in cents
  description: string;
  payerEmail?: string;
}

export interface CreatePreferenceResponse {
  checkoutUrl?: string; // normalized field we prefer
  init_point?: string; // MercadoPago production URL
  sandbox_init_point?: string; // MercadoPago sandbox URL
  preferenceId?: string;
  [key: string]: unknown;
}

export function getCheckoutUrl(resp: CreatePreferenceResponse): string | undefined {
  return (
    (resp.checkoutUrl as string) ||
    (resp.init_point as string) ||
    (resp.sandbox_init_point as string)
  );
}
