import { api } from "./client";

export interface Expense {
  id: string;
  label: string;
  amount: number;
  tripId: string;
  createdAt: string;
}

export async function getExpenses(tripId: string): Promise<Expense[]> {
  const { data } = await api.get<Expense[]>(`/expenses/trip/${tripId}`);
  return data;
}

export async function createExpense(payload: {
  label: string;
  amount: number;
  tripId: string;
}): Promise<Expense> {
  const { data } = await api.post<Expense>("/expenses", payload);
  return data;
}

export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}
