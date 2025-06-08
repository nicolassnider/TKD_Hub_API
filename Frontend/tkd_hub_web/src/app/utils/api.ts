type GetTokenFn = () => string | null;

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
  getToken?: GetTokenFn
): Promise<T> {
  const token = getToken ? getToken() : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Try to parse error, but handle empty body
      let errorMessage = 'API request failed';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch {
        // Ignore JSON parse error for empty body
      }
      throw new Error(errorMessage);
    }

    // Handle 204 No Content (e.g. DELETE)
    if (response.status === 204) {
      // @ts-expect-error: T may be void for 204
      return undefined;
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
