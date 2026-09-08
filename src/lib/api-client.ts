const DEFAULT_API_BASE_URL = "http://localhost:4002/api";

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function getApiBaseUrl() {
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
  return base.endsWith("/") ? base : `${base}/`;
}

export function buildApiUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  const normalizedPath = path.replace(/^\//, "");
  const url = new URL(normalizedPath, getApiBaseUrl());

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function parseError(response: Response): Promise<ApiError> {
  let errorBody: unknown;
  try {
    errorBody = await response.json();
  } catch {
    errorBody = undefined;
  }

  const message =
    typeof errorBody === "object" &&
    errorBody &&
    "message" in errorBody &&
    (typeof (errorBody as { message: unknown }).message === "string" ||
      Array.isArray((errorBody as { message: unknown }).message))
      ? Array.isArray((errorBody as { message: unknown }).message)
        ? ((errorBody as { message: string[] }).message).join(", ")
        : String((errorBody as { message: string }).message)
      : `Request failed with status ${response.status}`;

  return new ApiError(message, response.status, errorBody);
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const response = await fetch(buildApiUrl(path, params));
  if (!response.ok) throw await parseError(response);
  return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(buildApiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw await parseError(response);
  return response.json() as Promise<T>;
}
