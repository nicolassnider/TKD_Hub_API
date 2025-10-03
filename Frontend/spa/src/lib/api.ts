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
      // Debug: show what Vite client env provides and what base we will use
      try {
        // avoid throwing if console is unavailable in some environments
        // eslint-disable-next-line no-console
        console.debug(
          "getApiBase: import.meta.env.VITE_PUBLIC_API_URL=",
          env?.VITE_PUBLIC_API_URL,
          "resolvedBaseCandidate=",
          v,
        );
      } catch (e) {
        // ignore
      }
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
  // Ensure Authorization header is present when a token exists in localStorage
  // and the caller didn't already provide an Authorization header.
  const finalInit: RequestInit = { ...(init || {}) };
  const finalHeaders: Record<string, string> = {};

  // Copy any provided headers (Headers | Record | array) into a plain object
  const provided = init?.headers;
  if (provided instanceof Headers) {
    provided.forEach((v, k) => (finalHeaders[k] = v));
  } else if (Array.isArray(provided)) {
    for (const [k, v] of provided as Array<[string, string]>)
      finalHeaders[k] = v;
  } else if (provided && typeof provided === "object") {
    Object.assign(finalHeaders, provided as Record<string, string>);
  }

  // If no Authorization was supplied, try to load token from localStorage.
  try {
    if (!finalHeaders["Authorization"]) {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (stored)
        finalHeaders["Authorization"] = stored.startsWith("Bearer ")
          ? stored
          : `Bearer ${stored}`;
    }
  } catch {
    // ignore any localStorage access errors
  }

  // Debug: help diagnose missing auth in dev by logging when we attach a token
  try {
    if (
      typeof window !== "undefined" &&
      (resolved as string).toLowerCase().includes("/api")
    ) {
      // Log presence and length (avoid printing the token itself) to help diagnose missing auth in dev
      const authPresent = !!finalHeaders["Authorization"];
      const authLen = finalHeaders["Authorization"]
        ? String(finalHeaders["Authorization"]).length
        : 0;
      console.debug(
        "fetchJson: url=",
        resolved,
        "authPresent=",
        authPresent,
        "authLen=",
        authLen,
      );
    }
  } catch {
    // ignore
  }

  finalInit.headers = finalHeaders;

  const res = await fetch(resolved, finalInit);

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

// ============================================================================
// PAGINATION UTILITIES
// ============================================================================

export interface PaginatedApiResponse<T> {
  data: T;
  pagination?: import("../types/api").PaginationMetadata;
}

/**
 * Enhanced fetch function that extracts pagination metadata from headers
 */
export async function fetchJsonWithPagination<T>(
  url: RequestInfo,
  init?: RequestInit,
): Promise<PaginatedApiResponse<T>> {
  const resolvedUrl = resolveUrl(url);
  const finalInit = { ...init };

  // Set up headers including auth
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...((init?.headers as Record<string, string>) || {}),
  };

  // Add auth token if available
  try {
    if (!finalHeaders["Authorization"]) {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (stored)
        finalHeaders["Authorization"] = stored.startsWith("Bearer ")
          ? stored
          : `Bearer ${stored}`;
    }
  } catch {
    // ignore any localStorage access errors
  }

  finalInit.headers = finalHeaders;

  const response = await fetch(resolvedUrl, finalInit);

  if (!response.ok) {
    let body: unknown = undefined;
    try {
      body = await response.json();
    } catch {
      try {
        if (!response.bodyUsed) {
          body = await response.text();
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
    msg = msg ?? `Request failed with status ${response.status}`;
    throw new ApiError(msg, response.status, body);
  }

  // Extract pagination metadata from headers
  let pagination: import("../types/api").PaginationMetadata | undefined;
  const paginationHeader = response.headers.get("X-Pagination");
  if (paginationHeader) {
    try {
      pagination = JSON.parse(paginationHeader);
    } catch (e) {
      console.warn("Failed to parse pagination header:", e);
    }
  }

  // Get the response data
  let data: T;
  if (response.status === 204) {
    data = undefined as unknown as T;
  } else {
    try {
      data = await response.json();
    } catch (e) {
      throw new ApiError(
        `Expected JSON but response body could not be read (status ${response.status})`,
        response.status,
      );
    }
  }

  return { data, pagination };
}

/**
 * Build query string from parameters
 */
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
