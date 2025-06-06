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
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
