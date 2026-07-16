import { api } from "./client";
export interface Trip {
  id: string;
  title: string;
  location: string;
  description?: string;
  countryCode?: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  _count?: {
    itinerary: number;
  };
}

export interface CreateItineraryItemPayload {
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  tripId: string;
}

export interface ItineraryItem {
  id: string;
  title: string;
  location?: string;
  date: string;
  time?: string;
  notes?: string;
}

export async function getTrips() {
  const response = await api.get("/trips");

  return response.data;
}

export async function createTrip(payload: {
  title: string;
  location: string;
  description?: string;
  countryCode?: string;
  startDate: string;
  endDate: string;
}): Promise<Trip> {
  const { data } = await api.post<Trip>("/trips", payload);
  return data;
}

export async function updateTrip(
  id: string,
  payload: {
    title?: string;
    location?: string;
    description?: string;
    countryCode?: string;
    startDate?: string;
    endDate?: string;
  },
): Promise<Trip> {
  const { data } = await api.patch<Trip>(`/trips/${id}`, payload);
  return data;
}

export async function getTripItinerary(tripId: string) {
  const response = await api.get(`/itinerary?tripId=${tripId}`);

  return response.data;
}

export async function addItineraryItem(data: CreateItineraryItemPayload) {
  const response = await api.post("/itinerary", data);
  return response.data;
}

export async function getTrip(id: string): Promise<Trip> {
  const { data } = await api.get<Trip>(`/trips/${id}`);
  return data;
}

export async function deleteTrip(id: string) {
  const response = await api.delete(`/trips/${id}`);
  return response.data;
}
