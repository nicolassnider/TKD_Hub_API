export class ApiError extends Error {
  public status: number;
  public body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export async function fetchJson<T = unknown>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);

  const text = await res.text();
  let body: unknown = undefined;
  try {
    if (text) body = JSON.parse(text);
  } catch {
    body = text;
  }

  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status} ${res.statusText}`, res.status, body);
  }

  return body as T;
}
