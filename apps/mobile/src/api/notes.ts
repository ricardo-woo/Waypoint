import { api } from "./client";

export interface Note {
  content: string;
}

export async function getNote(tripId: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/trip/${tripId}`);
  return data;
}

export async function saveNote(tripId: string, content: string): Promise<Note> {
  const { data } = await api.put<Note>(`/notes/trip/${tripId}`, { content });
  return data;
}
