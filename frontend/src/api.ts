
export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000';

async function api<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);
    if (init?.body) {
        headers.set('Content-Type', 'application/json');
    }
    
    const res = await fetch(`${API_BASE}${path}`, {
        credentials: 'include',
        ...init,
        headers,
    });
    if (!res.ok) {
        let msg = 'Request failed';
        try { const j = await res.json(); msg = j?.error ?? msg; } catch { }
        throw new Error(msg);
    }
    return res.json();
}

export type Me = {
    id: string; 
    username: string; 
    role: 'admin' | 'survivor' | 'nikita'
};

export type RoundListItem = {
    id: string; 
    startsAt: string; 
    endsAt: string;
    status: 'cooldown' | 'active' | 'finished'
};

export type RoundInfo = {
    id: string; 
    startsAt: string; 
    endsAt: string; 
    status: string; 
    totalPoints: number;
    me: { points: number; taps: number };
    winner: null | { userId: string; username: string; points: number };
};

export const apiAuth = {
    me: () => api<Me>('/auth/me'),
    login: (username: string, password: string) => api<Me>('/auth/login', {
        method: 'POST', 
        body: JSON.stringify({ username, password })
    }),
    logout: () => api('/auth/logout', { method: 'POST' })
};

export const apiRounds = {
    list: () => api<RoundListItem[]>('/rounds'),
    create: () => api('/rounds', { method: 'POST' }),
    get: (id: string) => api<RoundInfo>(`/rounds/${id}`),
    tap: (id: string) => api<{ myPoints: number; myTaps: number }>(`/rounds/${id}/tap`, { method: 'POST' })
};