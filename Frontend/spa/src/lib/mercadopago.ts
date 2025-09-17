import { fetchJson } from "./api";
import { CreatePreferenceDTO, CreatePreferenceResponse } from "./paymentTypes";

const base =
  typeof window !== "undefined" && window.location
    ? `${window.location.origin}`
    : "";

export async function createPreference(
  dto: CreatePreferenceDTO,
): Promise<CreatePreferenceResponse> {
  return fetchJson<CreatePreferenceResponse>(
    `${base}/MercadoPago/create-preference`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    },
  );
}
