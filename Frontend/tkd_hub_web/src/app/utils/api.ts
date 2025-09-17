import { useApiConfig } from "@/app/context/ApiConfigContext";
import { useAuth } from "../context/AuthContext";
import { fetchJson, ApiError } from "@/app/lib/api";

type GetTokenFn = () => string | null;

type ApiRequestOptions = RequestInit & {
  allowAnonymous?: boolean;
};

export function useApiRequest() {
  const { baseUrl } = useApiConfig();
  const { getToken } = useAuth();

  const apiRequest = async <T>(url: string, options: ApiRequestOptions = {}, customGetToken?: GetTokenFn): Promise<T> => {
    const token = options.allowAnonymous
      ? null
      : customGetToken
      ? customGetToken()
      : getToken
      ? getToken()
      : null;

    const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url.startsWith("/") ? url : "/" + url}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      return await fetchJson<T>(fullUrl, { ...options, headers });
    } catch (err) {
      if (err instanceof ApiError) {
        // rethrow ApiError so callers can inspect status/details
        console.error('API Error:', err.message, err.details);
        throw err;
      }
      console.error('API unexpected error:', err);
      throw err;
    }
  };

  return { apiRequest };
}

