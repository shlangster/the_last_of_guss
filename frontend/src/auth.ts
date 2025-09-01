import { create } from 'zustand';
import type { Me } from './api';
type AuthState = {
    me: Me | null;
    setMe: (me: Me | null) => void;
};

export const useAuth = create<AuthState>((set) => ({
    me: null, setMe: (me) => set({ me })
}));