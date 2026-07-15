import { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { MapPin } from "lucide-react-native";

import { addItineraryItem } from "../api/trips";
import FormField from "../components/Formfield";
import AppButton from "../components/AppButton";
import DestinationSearchModal, {
  DestinationSuggestion,
} from "../components/DestinationSearchModal";

interface FormErrors {
  title?: string;
}

function formatDayLabel(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export default function AddItinerary() {
  const { tripId, date, countryCode } = useLocalSearchParams<{
    tripId: string;
    date: string;
    countryCode?: string;
  }>();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const resetForm = useCallback(() => {
    setTitle("");
    setLocation("");
    setTime("");
    setNotes("");
    setErrors({});
  }, []);

  useFocusEffect(
    useCallback(() => {
      resetForm();
      setIsReady(true);

      return () => {
        setIsReady(false);
      };
    }, [resetForm]),
  );

  function validate() {
    const nextErrors: FormErrors = {};
    if (!title.trim()) nextErrors.title = "Activity name is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSelectLocation(suggestion: DestinationSuggestion) {
    setLocation(suggestion.formatted);
  }

  async function save() {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await addItineraryItem({
        title,
        location,
        description: notes,
        date,
        time,
        tripId,
      });

      resetForm();
      router.back();
    } catch (err) {
      Alert.alert("Couldn't save activity", "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isReady) {
    return (
      <SafeAreaView
        className="flex-1 bg-[#F4F6F2] items-center justify-center"
        edges={["top"]}
      >
        <ActivityIndicator size="large" color="#2F5233" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F4F6F2]" edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
        <View>
          <Text className="text-2xl font-bold text-[#1C2B22] mb-1">
            Add activity
          </Text>
          <Text className="text-sm font-medium text-[#8C9A90]">
            {formatDayLabel(date)}
          </Text>
        </View>

        <FormField
          label="Activity name"
          value={title}
          placeholder=""
          onChangeText={(value: string) => {
            setTitle(value);
            if (errors.title)
              setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          error={errors.title}
        />

        <View>
          <Text className="text-sm font-medium text-[#5B6B5F] mb-1">
            Location
          </Text>
          <Pressable
            onPress={() => setShowLocationModal(true)}
            className="flex-row items-center bg-white rounded-2xl border border-[#DCE3D8] px-3.5 h-12"
          >
            <Text
              className="ml-2.5 text-base flex-1"
              style={{ color: location ? "#1C2B22" : "#8C9A90" }}
              numberOfLines={1}
            >
              {location || ""}
            </Text>
          </Pressable>
        </View>

        <FormField
          label="Notes"
          value={notes}
          placeholder=""
          onChangeText={setNotes}
          multiline
        />

        <AppButton title="Save" onPress={save} loading={isSubmitting} />

        <DestinationSearchModal
          visible={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onSelect={handleSelectLocation}
          countryCode={countryCode || undefined}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
