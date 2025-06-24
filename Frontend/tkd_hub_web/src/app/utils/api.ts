import { useApiConfig } from "@/app/context/ApiConfigContext";
import { useAuth } from "../context/AuthContext";

type GetTokenFn = () => string | null;

export function useApiRequest() {
  const { baseUrl } = useApiConfig();
  const { getToken } = useAuth();

  const apiRequest = async <T>(
    url: string,
    options: RequestInit = {},
    customGetToken?: GetTokenFn
  ): Promise<T> => {
    const token = customGetToken ? customGetToken() : getToken ? getToken() : null;
    const fullUrl = url.startsWith("http")
      ? url
      : `${baseUrl}${url.startsWith("/") ? url : "/" + url}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = 'API request failed';
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch {
          // Ignore JSON parse error for empty body
        }
        if (response.status === 0) {
          errorMessage += ' (Possible CORS error: check your backend CORS settings)';
        }
        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        // @ts-expect-error: T may be void for 204
        return undefined;
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return { apiRequest };
}
