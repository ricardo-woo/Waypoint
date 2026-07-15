import { api } from "./client";

export interface User {
  id: string;
  name: string;
  email: string;
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}
