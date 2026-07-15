import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin, X, Search } from "lucide-react-native";
import { colors } from "../theme/colors";
import AppInput from "./AppInput"; // Adjust path as necessary

const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;
const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 3;

type SearchMode = "city" | "country";

export interface DestinationSuggestion {
  formatted: string;
  city?: string;
  country?: string;
  countryCode?: string;
  lat: number;
  lon: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (suggestion: DestinationSuggestion) => void;
  countryCode?: string;
}

const resultCache = new Map<string, DestinationSuggestion[]>();

export default function DestinationSearchModal({
  visible,
  onClose,
  onSelect,
  countryCode,
}: Props) {
  const [mode, setMode] = useState<SearchMode>("city");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<DestinationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setMode("city");
      setQuery("");
      setSuggestions([]);
      setHasSearched(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [visible]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setHasSearched(false);
      abortRef.current?.abort();
      return;
    }

    const cacheKey = `${mode}:${countryCode ?? "any"}:${trimmed.toLowerCase()}`;
    const cached = resultCache.get(cacheKey);
    if (cached) {
      setSuggestions(cached);
      setHasSearched(true);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(trimmed, mode);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, mode, countryCode]);

  function handleModeChange(newMode: SearchMode) {
    if (newMode === mode) return;
    setMode(newMode);
    setSuggestions([]);
    setHasSearched(false);

    if (query.trim().length >= MIN_QUERY_LENGTH) {
      const cacheKey = `${newMode}:${query.trim().toLowerCase()}`;
      const cached = resultCache.get(cacheKey);
      if (cached) {
        setSuggestions(cached);
        setHasSearched(true);
      } else {
        fetchSuggestions(query.trim(), newMode);
      }
    }
  }

  async function fetchSuggestions(text: string, searchMode: SearchMode) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const requestId = ++requestIdRef.current;
    setIsLoading(true);

    try {
      const filterParam = countryCode
        ? `&filter=countrycode:${countryCode.toLowerCase()}`
        : "";

      const typeParam = countryCode ? "" : `&type=${searchMode}`;

      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        text,
      )}${typeParam}${filterParam}&format=json&limit=8&apiKey=${GEOAPIFY_API_KEY}`;

      const response = await fetch(url, { signal: controller.signal });
      const data = await response.json();

      if (requestId !== requestIdRef.current) return;

      const results: DestinationSuggestion[] = (data.results ?? []).map(
        (r: any) => ({
          formatted: r.formatted,
          city: r.city,
          country: r.country,
          countryCode: r.country_code,
          lat: r.lat,
          lon: r.lon,
        }),
      );

      const cacheKey = `${searchMode}:${countryCode ?? "any"}:${text.toLowerCase()}`;
      resultCache.set(cacheKey, results);
      setSuggestions(results);
      setHasSearched(true);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Geoapify autocomplete error:", err);
        setSuggestions([]);
        setHasSearched(true);
      }
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }

  function handleSelect(suggestion: DestinationSuggestion) {
    onSelect(suggestion);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={styles.sheet}>
          <SafeAreaView style={styles.container} edges={["bottom"]}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Where to?</Text>
              <Pressable
                onPress={onClose}
                hitSlop={10}
                style={styles.closeButton}
              >
                <X size={22} color={colors.muted} />
              </Pressable>
            </View>

            {!countryCode && (
              <View style={styles.modeRow}>
                <Pressable
                  onPress={() => handleModeChange("city")}
                  style={[
                    styles.modePill,
                    mode === "city" && styles.modePillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.modePillText,
                      mode === "city" && styles.modePillTextActive,
                    ]}
                  >
                    Cities
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => handleModeChange("country")}
                  style={[
                    styles.modePill,
                    mode === "country" && styles.modePillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.modePillText,
                      mode === "country" && styles.modePillTextActive,
                    ]}
                  >
                    Countries
                  </Text>
                </Pressable>
              </View>
            )}

            <View style={styles.searchRow}>
              <AppInput
                ref={inputRef}
                value={query}
                onChangeText={setQuery}
                placeholder={
                  mode === "city" ? "Search a city" : "Search a country"
                }
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="search"
                leftIcon={
                  <Search size={20} color={colors.muted} strokeWidth={2.25} />
                }
              />
            </View>

            <FlatList
              data={suggestions}
              keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.listContent}
              getItemLayout={(_, index) => ({
                length: 68,
                offset: 68 * index,
                index,
              })}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item)}
                  style={({ pressed }) => [
                    styles.suggestionRow,
                    pressed && styles.suggestionRowPressed,
                  ]}
                >
                  <MapPin size={16} color={colors.accent} strokeWidth={2.25} />
                  <View style={styles.suggestionTextWrapper}>
                    <Text style={styles.suggestionCity} numberOfLines={1}>
                      {countryCode
                        ? item.formatted
                        : mode === "city"
                          ? (item.city ?? item.formatted)
                          : (item.country ?? item.formatted)}
                    </Text>
                    {!countryCode && mode === "city" && item.country && (
                      <Text style={styles.suggestionCountry} numberOfLines={1}>
                        {item.country}
                      </Text>
                    )}
                  </View>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListEmptyComponent={
                hasSearched && !isLoading ? (
                  <Text style={styles.emptyText}>No matches found</Text>
                ) : query.trim().length > 0 &&
                  query.trim().length < MIN_QUERY_LENGTH ? (
                  <Text style={styles.emptyText}>Keep typing to search</Text>
                ) : null
              }
            />
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    height: "92%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modeRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  modePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  modePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modePillText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
  },
  modePillTextActive: {
    color: "#FFFFFF",
  },
  searchRow: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    flexGrow: 1,
    paddingBottom: 20,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    height: 68,
  },
  suggestionRowPressed: {
    opacity: 0.6,
  },
  suggestionTextWrapper: {
    flex: 1,
  },
  suggestionCity: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  suggestionCountry: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.muted,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    marginTop: 32,
  },
});
