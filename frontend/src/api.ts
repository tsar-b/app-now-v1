const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = configuredBaseUrl || 'http://localhost:5000';

export type ApiHealth = {
  ok: boolean;
};

export type CatalogResponse = {
  subtypes: unknown[];
  options: unknown[];
  pricings: unknown[];
  assets: unknown[];
  timeSlots: unknown[];
  serviceTypes: unknown[];
};

export type LoginResponse = {
  token: string;
};

export type BookingDraft = {
  app_name: string;
  template_id: string;
  market: string;
  platform: string;
  language_mode: string;
  source: string;
  status?: string;
};

export type ApiError = {
  message: string;
  code?: string;
  status?: number;
};

type RequestOptions = RequestInit & {
  token?: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await readPayload(response);

  if (!response.ok) {
    const errorPayload = payload as Partial<ApiError> | null;
    throw {
      message: errorPayload?.message || response.statusText || 'Request failed',
      code: errorPayload?.code,
      status: response.status,
    } satisfies ApiError;
  }

  return payload as T;
}

async function readPayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { message: text };
  }
}

export function checkHealth() {
  return request<ApiHealth>('/health');
}

export function loadCatalog() {
  return request<CatalogResponse>('/api/catalog/initialize');
}

export function login(email: string, password: string) {
  return request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function createBooking(draft: BookingDraft, token: string) {
  return request<Record<string, unknown>>('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(draft),
    token,
  });
}
