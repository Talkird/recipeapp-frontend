import axios from "axios";
import { create } from "zustand";

interface UserStore {
  loading: boolean;
  error: string | null;
  email: string | null;
  userId: string | null;
  token: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  loading: false,
  error: null,
  email: null,
  userId: null,
  token: null,
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/login", { email, password });
      const { userId, token } = response.data;
      set({ email, userId, token });
    } catch (error) {
      set({ error: "Login failed" });
    } finally {
      set({ loading: false });
    }
  },
  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/register", { email, password });
      const { userId, token } = response.data;
      set({ email, userId, token });
    } catch (error) {
      set({ error: "Registration failed" });
    } finally {
      set({ loading: false });
    }
  },
  logout: () => {
    set({ email: null, userId: null, token: null });
  },
}));

export default useUserStore;
