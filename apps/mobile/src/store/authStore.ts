import { create } from "zustand";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";

interface AuthState {
  token: string | null;
  isHydrated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

// --- Platform-Safe Storage Helpers ---

async function getSecureItem(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
}

async function setSecureItem(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function removeSecureItem(key: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

// --- Zustand Auth Store ---

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isHydrated: false,

  login: async (token) => {
    // Swapped SecureStore for setSecureItem
    await setSecureItem(TOKEN_KEY, token);
    set({ token });
  },

  logout: async () => {
    // Swapped SecureStore for removeSecureItem
    await removeSecureItem(TOKEN_KEY);
    set({ token: null });
  },

  hydrate: async () => {
    // Swapped SecureStore for getSecureItem
    const token = await getSecureItem(TOKEN_KEY);
    set({ token, isHydrated: true });
  },
}));
