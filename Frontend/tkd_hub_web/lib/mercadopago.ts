
import { fetchJson } from './api';
import { CreatePreferenceRequest, CreatePreferenceResponse } from './types';

export async function createPreference(body: CreatePreferenceRequest): Promise<CreatePreferenceResponse> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');

  return fetchJson<CreatePreferenceResponse>(`${base}/api/mercadopago/create-preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
