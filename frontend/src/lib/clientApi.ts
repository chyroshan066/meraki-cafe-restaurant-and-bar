'use client';

const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://api.merakirestro.com/api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function storeAuth(token: string, user: unknown) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

async function clientRequest<T>(path: string): Promise<T> {
  const baseUrl = DEFAULT_BASE_URL;
  const token = getStoredToken();

  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export { type Order, type MenuItem, type PaginatedResponse } from './api';

export async function fetchAdminOrdersClient() {
  return clientRequest<import('./api').PaginatedResponse<import('./api').Order>>(
    '/orders'
  );
}

export type GalleryImage = {
  id: number;
  title: string | null;
  image_url: string;
};

export async function fetchGalleryClient() {
  return clientRequest<import('./api').PaginatedResponse<GalleryImage>>(
    '/gallery'
  );
}

export type Reservation = {
  id: number;
  user_id: number;
  date: string;
  time: string;
  number_of_guests: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
};

export async function fetchReservationsClient() {
  return clientRequest<
    import('./api').PaginatedResponse<Reservation>
  >('/reservations');
}

