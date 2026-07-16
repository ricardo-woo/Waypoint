import { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  Text,
  Alert,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DatePickerModal } from "react-native-paper-dates";
import { router, useLocalSearchParams } from "expo-router";
import { CalendarDays } from "lucide-react-native";

import { getTrip, updateTrip } from "../api/trips";
import FormField from "../components/Formfield";
import AppButton from "../components/AppButton";
import DestinationSearchModal, {
  DestinationSuggestion,
} from "../components/DestinationSearchModal";
import PressableField from "../components/PressableField";
import { colors } from "../theme/colors";

interface FormErrors {
  title?: string;
  location?: string;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayRange(start: Date, end: Date) {
  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();

  const monthDay = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  if (sameMonth) {
    const month = start.toLocaleDateString("en-US", { month: "short" });
    return `${month} ${start.getDate()} – ${end.getDate()}`;
  }

  return `${monthDay(start)} – ${monthDay(end)}`;
}

function parseLocalDate(dateStr: string) {
  const d = new Date(dateStr);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export default function EditTrip() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showRangePicker, setShowRangePicker] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTrip = useCallback(async () => {
    try {
      const trip = await getTrip(id);
      setTitle(trip.title);
      setLocation(trip.location);
      setCountryCode(trip.countryCode ?? null);
      setOriginalCountryCode(trip.countryCode ?? null);
      setDescription(trip.description ?? "");
      setStartDate(parseLocalDate(trip.startDate));
      setEndDate(parseLocalDate(trip.endDate));
    } catch (err) {
      Alert.alert("Couldn't load trip", "Please try again.");
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTrip();
  }, [loadTrip]);

  function validate() {
    const nextErrors: FormErrors = {};
    if (!title.trim()) nextErrors.title = "Trip name is required";
    if (!location.trim()) nextErrors.location = "Location is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  const [originalCountryCode, setOriginalCountryCode] = useState<string | null>(
    null,
  );

  async function submit() {
    if (!validate()) return;

    const countryChanging = countryCode !== originalCountryCode;

    if (countryChanging) {
      Alert.alert(
        "Country changed",
        "Since the destination country changed, all planned activities for this trip will be removed. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Continue", style: "destructive", onPress: doSubmit },
        ],
      );
      return;
    }

    doSubmit();
  }

  async function doSubmit() {
    setIsSubmitting(true);
    try {
      await updateTrip(id, {
        title,
        description,
        location,
        countryCode: countryCode ?? undefined,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      });

      router.back();
    } catch (err) {
      Alert.alert("Couldn't update trip", "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSelectDestination = useCallback(
    (suggestion: DestinationSuggestion) => {
      setLocation(suggestion.formatted);
      setCountryCode(suggestion.countryCode ?? null);
      setErrors((prev) => ({ ...prev, location: undefined }));
    },
    [],
  );

  const onConfirmRange = useCallback(
    ({
      startDate: start,
      endDate: end,
    }: {
      startDate?: Date;
      endDate?: Date;
    }) => {
      setShowRangePicker(false);
      if (start) setStartDate(start);
      if (end) setEndDate(end);
    },
    [],
  );

  const handleOpenCalendar = () => {
    if (typeof requestIdleCallback !== "undefined") {
      requestIdleCallback(() => {
        setShowRangePicker(true);
      });
    } else {
      setTimeout(() => {
        setShowRangePicker(true);
      }, 1);
    }
  };

  const displayRangeText = useMemo(() => {
    return formatDisplayRange(startDate, endDate);
  }, [startDate, endDate]);

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
        edges={["top"]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      edges={["top"]}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, gap: 18 }}
      >
        <Text
          className="text-2xl font-bold mb-2"
          style={{ color: colors.heading }}
        >
          Edit trip
        </Text>

        <FormField
          label="Trip name"
          value={title}
          placeholder=""
          onChangeText={(value: string) => {
            setTitle(value);
            if (errors.title)
              setErrors((prev) => ({ ...prev, title: undefined }));
          }}
          error={errors.title}
        />

        <PressableField
          label="Destination"
          value={location}
          placeholder=""
          onPress={() => setShowDestinationModal(true)}
          error={errors.location}
        />

        <FormField
          label="Description"
          value={description}
          placeholder="What's this trip about? (optional)"
          onChangeText={setDescription}
          multiline
        />

        <View>
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: colors.muted }}
          >
            Dates
          </Text>

          <Pressable
            onPress={handleOpenCalendar}
            className="flex-row items-center justify-center border rounded-xl h-14 px-4"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <CalendarDays size={18} color={colors.primary} strokeWidth={2.25} />
            <Text
              className="ml-2 text-base font-semibold"
              style={{ color: colors.heading }}
            >
              {displayRangeText}
            </Text>
          </Pressable>
        </View>

        {showRangePicker && (
          <DatePickerModal
            locale="en"
            mode="range"
            visible={showRangePicker}
            startDate={startDate}
            endDate={endDate}
            onConfirm={onConfirmRange}
            onDismiss={() => setShowRangePicker(false)}
            presentationStyle="pageSheet"
          />
        )}

        <DestinationSearchModal
          visible={showDestinationModal}
          onClose={() => setShowDestinationModal(false)}
          onSelect={handleSelectDestination}
        />

        <AppButton
          title="Save Changes"
          onPress={submit}
          loading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
