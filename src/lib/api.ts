const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? "/api";

export async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem("astral_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers ?? {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw Object.assign(new Error(err.error || "API Error"), { status: res.status });
  }
  return res.json();
}

export async function apiPost(path: string, body: unknown) {
  return apiFetch(path, { method: "POST", body: JSON.stringify(body) });
}

export async function apiPatch(path: string, body: unknown) {
  return apiFetch(path, { method: "PATCH", body: JSON.stringify(body) });
}

export const BOT_WA =
  (import.meta as any).env?.VITE_BOT_WA ?? "https://wa.me/2349012345678";

const _rawGroups = (import.meta as any).env?.VITE_WA_GROUPS;
export const WHATSAPP_GROUPS: { name: string; members: string; link: string }[] =
  _rawGroups
    ? JSON.parse(_rawGroups)
    : [
        { name: "Astral of the Sun — Main", members: "248", link: "https://chat.whatsapp.com/group1" },
        { name: "Astral of the Sun — Overflow", members: "117", link: "https://chat.whatsapp.com/group2" },
      ];
