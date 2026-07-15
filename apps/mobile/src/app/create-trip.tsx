import { useState, useCallback, useMemo } from "react";
import { View, ScrollView, Text, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DatePickerModal } from "react-native-paper-dates";
import { useFocusEffect, router, useLocalSearchParams } from "expo-router";
import { CalendarDays } from "lucide-react-native";

import { createTrip } from "../api/trips";
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

type PresetKey = "week" | "twoWeeks" | "custom";

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

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

const PRESETS: { key: PresetKey; label: string; days: number | null }[] = [
  { key: "week", label: "1 Week", days: 7 },
  { key: "twoWeeks", label: "2 Weeks", days: 14 },
  { key: "custom", label: "Custom", days: null },
];

export default function CreateTrip() {
  const { suggestedLocation } = useLocalSearchParams<{
    suggestedLocation?: string;
  }>();
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState(suggestedLocation ?? "");
  const [description, setDescription] = useState("");

  const [startDate, setStartDate] = useState<Date>(() => new Date());
  const [endDate, setEndDate] = useState<Date>(() => addDays(new Date(), 7));

  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("week");
  const [showRangePicker, setShowRangePicker] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setTitle("");
    setLocation(suggestedLocation ?? "");
    setCoords(null);
    setCountryCode(null);
    setDescription("");
    setStartDate(new Date());
    setEndDate(addDays(new Date(), 7));
    setSelectedPreset("week");
    setErrors({});
  }, [suggestedLocation]);

  useFocusEffect(
    useCallback(() => {
      resetForm();
    }, [resetForm]),
  );

  ("en");
  function validate() {
    const nextErrors: FormErrors = {};
    if (!title.trim()) nextErrors.title = "Trip name is required";
    if (!location.trim()) nextErrors.location = "Location is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await createTrip({
        title,
        description,
        location,
        countryCode: countryCode ?? undefined,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      });
      resetForm();
      router.replace("/trips");
    } catch (err) {
      Alert.alert("Couldn't create trip", "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSelectDestination = useCallback(
    (suggestion: DestinationSuggestion) => {
      setLocation(suggestion.formatted);
      setCoords({ lat: suggestion.lat, lon: suggestion.lon });
      setCountryCode(suggestion.countryCode ?? null);
      setErrors((prev) => ({ ...prev, location: undefined }));
    },
    [],
  );

  function applyPreset(preset: (typeof PRESETS)[number]) {
    setSelectedPreset(preset.key);
    if (preset.days === null) {
      handleOpenCalendar();
      return;
    }
    const newStart = new Date();
    setStartDate(newStart);
    setEndDate(addDays(newStart, preset.days));
  }

  const onConfirmRange = useCallback(
    ({
      startDate: start,
      endDate: end,
    }: {
      startDate?: Date;
      endDate?: Date;
    }) => {
      setShowRangePicker(false);
      setSelectedPreset("custom");
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
          Plan a new trip
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

        <View>
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: colors.muted }}
          >
            Dates
          </Text>

          <View className="flex-row gap-2 mb-3">
            {PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.key;
              return (
                <Pressable
                  key={preset.key}
                  onPress={() => applyPreset(preset)}
                  style={{
                    flex: 1,
                    borderRadius: 999,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    minHeight: 36,
                    paddingHorizontal: 4,
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: isSelected ? "#FFFFFF" : colors.muted,
                      textAlign: "center",
                    }}
                  >
                    {preset.label.replace(" ", "\u00A0")}
                  </Text>
                </Pressable>
              );
            })}
          </View>

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
          title="Create Trip"
          onPress={submit}
          loading={isSubmitting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
