import { useRef } from "react";
import { View, TextInput, Pressable, TextInputProps } from "react-native";
import { Search, X } from "lucide-react-native";
import { colors } from "../theme/colors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search",
  className = "",
  autoFocus = false,
  onSubmitEditing,
}: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);

  function handleClear() {
    onChangeText("");
    inputRef.current?.focus();
  }

  return (
    <View
      className={`flex-row items-center rounded-2xl border px-3.5 h-12 ${className}`}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
      }}
    >
      <Search size={18} color={colors.muted} strokeWidth={2.25} />

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        className="flex-1 ml-2.5 text-base"
        style={{
          paddingVertical: 0,
          color: colors.text,
          ...({ outlineStyle: "none" } as any),
        }}
      />

      {value.length > 0 && (
        <Pressable
          onPress={handleClear}
          hitSlop={8}
          className="ml-2 w-5 h-5 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.border }}
        >
          <X size={12} color={colors.muted} strokeWidth={2.5} />
        </Pressable>
      )}
    </View>
  );
}
