const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.merakirestro.com/api";

export type ApiConfig = {
  baseUrl?: string;
  token?: string;
};

async function request<T>(path: string, config: ApiConfig = {}): Promise<T> {
  const { baseUrl = DEFAULT_BASE_URL, token } = config;

  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    cache: "no-store"
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export type Order = {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  customer_name?: string | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
};

export async function fetchAdminOrders(config?: ApiConfig) {
  return request<PaginatedResponse<Order>>("/orders", config);
}

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string | null;
};

export async function fetchMenu(config?: ApiConfig) {
  return request<PaginatedResponse<MenuItem>>("/menu", config);
}


