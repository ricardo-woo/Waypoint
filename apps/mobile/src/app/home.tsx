import "../../global.css";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  Pressable,
  RefreshControl,
  ScrollView,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { getTrips } from "../api/trips";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../theme/colors";

import HomeHeader from "../components/HomeHeader";
import TripCard from "../components/TripCard";
import TripCountdown from "../components/TripCountdown";
import PopularDestinations from "../components/PopularDestinations";
import AppButton from "@/components/AppButton";

interface Trip {
  id: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  _count?: {
    itinerary: number;
  };
}

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [latestTrip, setLatestTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function loadTrips() {
    try {
      setHasError(false);
      const data: Trip[] = await getTrips();
      setTrips(data);
      setLatestTrip(data[0] ?? null);
    } catch (err) {
      setHasError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadTrips();
    }, []),
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadTrips();
  }, []);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      edges={["top"]}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <HomeHeader />

        <View className="mb-8">
          <AppButton
            title="+ Create New Trip"
            onPress={() => router.push("/create-trip")}
          />
        </View>

        <View className="flex-row items-center justify-between mb-4">
          <Text
            className="text-2xl font-bold"
            style={{ color: colors.heading }}
          >
            Latest Trip
          </Text>

          {latestTrip && (
            <Pressable
              onPress={() => router.push("/trips")}
              className="flex-row items-center"
            >
              <Text
                className="text-sm font-semibold mr-0.5"
                style={{ color: colors.primary }}
              >
                See all
              </Text>
              <ChevronRight
                size={16}
                color={colors.primary}
                strokeWidth={2.25}
              />
            </Pressable>
          )}
        </View>

        {hasError && (
          <Text className="mb-4" style={{ color: colors.error }}>
            Couldn't load your trips. Pull down to try again.
          </Text>
        )}

        {!isLoading && !hasError && !latestTrip && (
          <View className="items-center mt-2 mb-8">
            <Text
              className="text-base text-center"
              style={{ color: colors.muted }}
            >
              No trips yet — plan your first adventure!
            </Text>
          </View>
        )}

        {latestTrip && (
          <View className="mb-8">
            <TripCard
              title={latestTrip.title}
              location={latestTrip.location}
              startDate={latestTrip.startDate}
              endDate={latestTrip.endDate}
              imageUrl={latestTrip.imageUrl}
              itineraryCount={latestTrip._count?.itinerary}
              onPress={() =>
                router.push({
                  pathname: "/trip-details",
                  params: { id: latestTrip.id },
                })
              }
              onLongPress={() => void 0}
            />

            <TripCountdown
              startDate={latestTrip.startDate}
              endDate={latestTrip.endDate}
              className="-mt-2"
            />
          </View>
        )}

        <PopularDestinations />
      </ScrollView>
    </SafeAreaView>
  );
}
