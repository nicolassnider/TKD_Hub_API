export interface CreatePreferenceRequest {
  amountCents: number;
  description?: string;
}

export interface CreatePreferenceResponse {
  preferenceUrl?: string;
  initPoint?: string;
  sandbox_init_point?: string;
  [key: string]: unknown;
}
