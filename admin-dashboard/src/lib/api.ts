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

export type OrderItem = {
  menu_id: number
  menu_name: string
  quantity: number
  unit_price: number
}

export type Order = {
  id: number;
  total_amount: number;
  customer_email: string | null;
  customer_phone: string | null;
  status: string;
  created_at: string;
  customer_name?: string | null;
  items: OrderItem[];
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

export type User = {
  id: number;
  name: string;
  email: string;
  phone_no?: string | null;
  role: string;
  created_at: string;
};

export async function fetchUsers(config?: ApiConfig) {
  return request<{ data: User[] }>("/users", config);
}

export type Subscriber = {
  id: number;
  email: string;
  subscribed_at: string;
};

export async function fetchSubscribers() {
  // Replace with your actual backend URL logic
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subscribers`);
  if (!response.ok) throw new Error("Failed to fetch registry");
  return response.json();
}


