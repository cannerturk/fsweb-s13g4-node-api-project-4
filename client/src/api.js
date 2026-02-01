const BASE_URL = import.meta.env.VITE_API_URL;

export async function registerUser(payload) {
  const res = await fetch(`${BASE_URL}/api/kayitol`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Register failed');
  return data;
}

export async function loginUser(payload) {
  const res = await fetch(`${BASE_URL}/api/giris`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Login failed');
  return data;
}

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/api/kullanicilar`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || 'Get users failed');
  return data;
}
