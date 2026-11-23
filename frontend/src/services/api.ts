const API_BASE = import.meta.env.VITE_API_BASE;

interface LoginResponse {
  token: string;
  email: string;
}

export interface Employee {
  id: number;
  full_name: string;
  position: string;
  department: string;
  created_at: string;
}

function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Ошибка входа');
  }

  return res.json();
}

export async function register(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Ошибка регистрации');
  }

  return res.json();
}

export async function getEmployees(): Promise<Employee[]> {
  const res = await fetch(`${API_BASE}/employees`, {
    headers: getAuthHeader(),
  });

  if (!res.ok) {
    throw new Error('Ошибка загрузки списка сотрудников');
  }

  return res.json();
}

export async function addEmployee(full_name: string, position: string, department: string): Promise<Employee> {
  const res = await fetch(`${API_BASE}/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ full_name, position, department }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Ошибка добавления сотрудника');
  }

  return res.json();
}
