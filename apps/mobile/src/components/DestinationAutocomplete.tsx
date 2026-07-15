import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { colors } from "../theme/colors";

const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;
const DEBOUNCE_MS = 350;
const MIN_QUERY_LENGTH = 3;

export interface DestinationSuggestion {
  formatted: string;
  city?: string;
  country?: string;
  lat: number;
  lon: number;
}

interface DestinationAutocompleteProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (suggestion: DestinationSuggestion) => void;
  placeholder?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

export default function DestinationAutocomplete({
  label,
  value,
  onChangeText,
  onSelect,
  placeholder = "Where are you going?",
  error,
  style,
}: DestinationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<DestinationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const justSelectedRef = useRef(false);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    const query = value.trim();

    if (query.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setHasSearched(false);
      abortRef.current?.abort();
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  async function fetchSuggestions(query: string) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const requestId = ++requestIdRef.current;
    setIsLoading(true);

    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        query,
      )}&format=json&limit=5&apiKey=${GEOAPIFY_API_KEY}`;

      const response = await fetch(url, { signal: controller.signal });
      const data = await response.json();

      if (requestId !== requestIdRef.current) return;

      const results: DestinationSuggestion[] = (data.results ?? []).map(
        (r: any) => ({
          formatted: r.formatted,
          city: r.city,
          country: r.country,
          lat: r.lat,
          lon: r.lon,
        }),
      );

      setSuggestions(results);
      setHasSearched(true);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setSuggestions([]);
        setHasSearched(true);
      }
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }

  function handleSelect(suggestion: DestinationSuggestion) {
    justSelectedRef.current = true;
    onChangeText(suggestion.formatted);
    onSelect(suggestion);
    setSuggestions([]);
    setHasSearched(false);
  }

  const showDropdown =
    isFocused &&
    value.trim().length >= MIN_QUERY_LENGTH &&
    (isLoading || suggestions.length > 0 || hasSearched);

  return (
    <View style={[styles.field, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          autoCapitalize="words"
          autoCorrect={false}
          style={styles.input}
        />
        {isLoading && <ActivityIndicator size="small" color={colors.muted} />}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {showDropdown && (
        <View style={styles.dropdown}>
          {suggestions.length === 0 && !isLoading ? (
            <Text style={styles.emptyText}>No matches found</Text>
          ) : (
            suggestions.map((item, index) => (
              <Pressable
                key={`${item.lat}-${item.lon}-${index}`}
                onPress={() => handleSelect(item)}
                style={({ pressed }) => [
                  styles.suggestionRow,
                  index !== suggestions.length - 1 &&
                    styles.suggestionRowBorder,
                  pressed && styles.suggestionRowPressed,
                ]}
              >
                <Text style={styles.suggestionText}>{item.formatted}</Text>
              </Pressable>
            ))
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 0,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
  },
  dropdown: {
    marginTop: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestionRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  suggestionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionRowPressed: {
    backgroundColor: colors.background,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
});
