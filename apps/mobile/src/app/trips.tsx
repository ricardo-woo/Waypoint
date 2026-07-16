import { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";

import { getTrips, deleteTrip } from "../api/trips";
import TripCard from "../components/TripCard";
import TripActionSheet from "../components/TripActionSheet";
import AddButton from "../components/AddButton";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import SearchBar from "../components/SearchBar";
import { colors } from "../theme/colors";

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

export default function Trips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [tripPendingDelete, setTripPendingDelete] = useState<Trip | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  async function loadTrips() {
    try {
      setHasError(false);
      const data = await getTrips();
      setTrips(data);
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

  const filteredTrips = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return trips;

    return trips.filter(
      (trip) =>
        trip.title.toLowerCase().includes(query) ||
        trip.location.toLowerCase().includes(query),
    );
  }, [trips, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  function closeActionSheet() {
    setSelectedTrip(null);
  }

  function handleEdit() {
    const trip = selectedTrip;
    closeActionSheet();
    if (!trip) return;

    router.push({
      pathname: "/edit-trip" as any,
      params: { id: trip.id },
    });
  }

  function handleDeletePress() {
    const trip = selectedTrip;
    closeActionSheet();
    if (!trip) return;

    setTimeout(() => setTripPendingDelete(trip), 300);
  }

  async function handleConfirmDelete() {
    const trip = tripPendingDelete;
    if (!trip) return;

    setIsDeleting(true);
    try {
      await deleteTrip(trip.id);
      setTrips((prev) => prev.filter((t) => t.id !== trip.id));
      setTripPendingDelete(null);
    } catch (err) {
      Alert.alert("Couldn't delete trip", "Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        edges={["top"]}
      >
        <FlatList
          className="flex-1"
          contentContainerStyle={{ padding: 20, flexGrow: 1 }}
          data={filteredTrips}
          keyExtractor={(trip) => trip.id}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListHeaderComponent={
            <>
              <Text
                className="text-2xl font-bold mb-4"
                style={{ color: colors.heading }}
              >
                My Trips
              </Text>

              {trips.length > 0 && (
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search by trip or destination"
                  className="mb-4"
                />
              )}

              {hasError && (
                <Text className="mb-4" style={{ color: colors.error }}>
                  Couldn't load your trips. Pull down to try again.
                </Text>
              )}
            </>
          }
          renderItem={({ item }) => (
            <TripCard
              title={item.title}
              location={item.location}
              startDate={item.startDate}
              endDate={item.endDate}
              imageUrl={item.imageUrl}
              itineraryCount={item._count?.itinerary}
              onPress={() =>
                router.push({
                  pathname: "/trip-details",
                  params: { id: item.id },
                })
              }
              onLongPress={() => setSelectedTrip(item)}
            />
          )}
          ListEmptyComponent={
            isLoading ? (
              <View className="items-center mt-10">
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            ) : hasError ? null : isSearching ? (
              <View className="items-center mt-10">
                <Text
                  className="text-base text-center"
                  style={{ color: colors.muted }}
                >
                  No trips match "{searchQuery.trim()}".
                </Text>
              </View>
            ) : (
              <View className="items-center mt-10">
                <Text
                  className="text-base text-center"
                  style={{ color: colors.muted }}
                >
                  No trips yet — create your first one below.
                </Text>
              </View>
            )
          }
        />
      </SafeAreaView>

      <AddButton onPress={() => router.push("/create-trip")} />

      <TripActionSheet
        visible={selectedTrip !== null}
        tripTitle={selectedTrip?.title ?? ""}
        onClose={closeActionSheet}
        onEdit={handleEdit}
        onDelete={handleDeletePress}
      />

      <ConfirmDeleteModal
        visible={tripPendingDelete !== null}
        title="Delete trip?"
        message={
          tripPendingDelete
            ? `This will permanently delete "${tripPendingDelete.title}" and its itinerary.`
            : ""
        }
        isDeleting={isDeleting}
        onCancel={() => setTripPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </View>
  );
}
