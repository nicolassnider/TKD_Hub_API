export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 500, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function fetchJson<T = unknown>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);

  if (!res.ok) {
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {
      // ignore
    }
    let msg: string | undefined;
    if (body && typeof body === 'object') {
      const b = body as Record<string, unknown>;
      if (typeof b.message === 'string') msg = b.message;
    }
    msg = msg ?? `Request failed with status ${res.status}`;
    throw new ApiError(msg, res.status, body);
  }

  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}
