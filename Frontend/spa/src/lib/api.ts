export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 500, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function getApiBase(): string {
  // Prefer Vite client env when running in the browser. Use process.env for node (tests/dev server).
  try {
    if (typeof window !== "undefined") {
      const env = (import.meta as any).env;
      const v = env && (env.VITE_PUBLIC_API_URL || env.VITE_API_HOST || "");
      return (v || "").replace(/\/$/, "");
    }
  } catch {
    // ignore
  }

  // fallback for Node (tests / tooling)
  // Use globalThis to avoid referencing Node-specific 'process' in browser typings.
  const nodeVal = (globalThis as any).process?.env?.API_HOST || "";
  return (nodeVal || "").replace(/\/$/, "");
}

function resolveUrl(input: RequestInfo): RequestInfo {
  if (typeof input === "string") {
    // If it's a relative API path like `/api/...`, prefix with base when configured
    if (input.startsWith("/api")) {
      const base = getApiBase();
      if (base) return `${base}${input}`;
    }
  }
  return input;
}

export async function fetchJson<T = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const resolved = resolveUrl(input);
  const res = await fetch(resolved, init);

  if (!res.ok) {
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {
      try {
        // if it's not JSON, capture the text (likely an HTML error page)
        // Only attempt to read text if the body hasn't already been consumed by another reader.
        if (!res.bodyUsed) {
          body = await res.text();
        } else {
          body = undefined;
        }
      } catch {
        body = undefined;
      }
    }
    let msg: string | undefined;
    if (body && typeof body === "object") {
      const b = body as Record<string, unknown>;
      if (typeof b.message === "string") msg = b.message;
    }
    msg = msg ?? `Request failed with status ${res.status}`;
    throw new ApiError(msg, res.status, body);
  }

  if (res.status === 204) return undefined as unknown as T;

  try {
    return (await res.json()) as Promise<T>;
  } catch (e) {
    // not JSON — try to return text to help debugging but guard against body already used
    try {
      let text: string | undefined = undefined;
      if (!res.bodyUsed) {
        text = await res.text();
      }
      // If the response looks like HTML (starts with <), throw a helpful error
      if (text && text.trim().startsWith("<")) {
        throw new ApiError(
          `Expected JSON but received HTML response (status ${res.status}). Response starts with: ${text.trim().slice(0, 100)}`,
          res.status,
          text,
        );
      }
      // otherwise return the raw text as unknown (or undefined if body was already used)
      return (text ?? "") as unknown as T;
    } catch (err) {
      // If we can't read text either, throw a generic error
      throw new ApiError(
        `Expected JSON but response body could not be read (status ${res.status})`,
        res.status,
      );
    }
  }
}
