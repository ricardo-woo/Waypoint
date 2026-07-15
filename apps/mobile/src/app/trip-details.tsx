import { useCallback, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Image } from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { MapPin, Calendar, ImageOff } from "lucide-react-native";

import { getTrip, getTripItinerary, ItineraryItem } from "../api/trips";
import AppButton from "../components/AppButton";
import TripCountdown from "../components/TripCountdown";
import TripTabs, { TripTabKey } from "../components/TripTabs";
import ItineraryTab from "../components/ItineraryTab";
import BudgetTab from "../components/BudgetTab";
import NotesTab from "../components/NotesTab";
import { colors } from "../theme/colors";

interface Trip {
  id: string;
  title: string;
  location: string;
  description?: string;
  countryCode?: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const isValid = !isNaN(start.getTime()) && !isNaN(end.getTime());
  if (!isValid) return `${startDate} – ${endDate}`;

  const sameMonth =
    start.getUTCMonth() === end.getUTCMonth() &&
    start.getUTCFullYear() === end.getUTCFullYear();

  const monthDay = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });

  if (sameMonth) {
    const month = start.toLocaleDateString("en-US", {
      month: "short",
      timeZone: "UTC",
    });
    return `${month} ${start.getUTCDate()}–${end.getUTCDate()}`;
  }

  return `${monthDay(start)} – ${monthDay(end)}`;
}

export default function TripDetails() {
  const { id } = useLocalSearchParams();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState<TripTabKey>("itinerary");

  const load = useCallback(async () => {
    try {
      setHasError(false);
      const [tripData, itineraryData] = await Promise.all([
        getTrip(id as string),
        getTripItinerary(id as string),
      ]);
      setTrip(tripData);
      setItems(itineraryData);
    } catch (error) {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  if (isLoading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (hasError || !trip) {
    return (
      <View
        className="flex-1 items-center justify-center px-8"
        style={{ backgroundColor: colors.background }}
      >
        <Text
          className="text-base font-medium mb-4 text-center"
          style={{ color: colors.text }}
        >
          Failed to load trip.
        </Text>
        <AppButton title="Try again" onPress={load} />
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Banner area fallback background matches primary dark slate blue */}
        <View className="h-56" style={{ backgroundColor: colors.primary }}>
          {trip.imageUrl ? (
            <Image
              source={{ uri: trip.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <ImageOff size={28} color={colors.border} strokeWidth={1.75} />
            </View>
          )}
        </View>

        <View
          className="rounded-t-3xl -mt-6 px-5 pt-6 flex-1"
          style={{ backgroundColor: colors.background }}
        >
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            {trip.title}
          </Text>

          <View className="flex-row items-center mt-2">
            <MapPin size={15} color={colors.accent} strokeWidth={2.25} />
            <Text
              className="ml-1.5 text-sm font-medium"
              style={{ color: colors.muted }}
            >
              {trip.location}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-1.5">
            <View className="flex-row items-center">
              <Calendar
                size={15}
                color={colors.placeholder}
                strokeWidth={2.25}
              />
              <Text
                className="ml-1.5 text-sm font-medium"
                style={{ color: colors.placeholder }}
              >
                {formatDateRange(trip.startDate, trip.endDate)}
              </Text>
            </View>

            <TripCountdown
              startDate={trip.startDate}
              endDate={trip.endDate}
              className="-mt-2"
            />
          </View>

          {trip.description ? (
            <Text
              className="text-sm mt-4 leading-5"
              style={{ color: colors.muted }}
            >
              {trip.description}
            </Text>
          ) : null}

          <View className="mt-6">
            <TripTabs activeTab={activeTab} onChange={setActiveTab} />
          </View>

          {activeTab === "itinerary" && (
            <ItineraryTab
              items={items}
              tripStartDate={trip.startDate}
              tripEndDate={trip.endDate}
              onAddActivity={(date) =>
                router.push({
                  pathname: "/add-itinerary",
                  params: {
                    tripId: id,
                    date,
                    countryCode: trip.countryCode ?? "",
                  },
                })
              }
            />
          )}

          {activeTab === "budget" && <BudgetTab tripId={id as string} />}
          {activeTab === "notes" && <NotesTab tripId={id as string} />}
        </View>
      </ScrollView>
    </View>
  );
}
