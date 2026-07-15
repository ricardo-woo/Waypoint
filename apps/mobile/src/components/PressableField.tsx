import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { colors } from "../theme/colors";

interface PressableFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

export default function PressableField({
  label,
  value,
  placeholder,
  onPress,
  error,
  style,
}: PressableFieldProps) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>

      <Pressable onPress={onPress}>
        {({ pressed }) => (
          <View
            style={[
              styles.input,
              pressed && styles.inputFocused,
              !!error && styles.inputError,
            ]}
          >
            <Text
              style={[
                styles.value,
                { color: value ? colors.text : colors.placeholder },
              ]}
              numberOfLines={1}
            >
              {value || placeholder}
            </Text>
          </View>
        )}
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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

  input: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
  },

  inputFocused: {
    borderColor: colors.primary,
  },

  inputError: {
    borderColor: colors.error,
  },

  icon: {
    marginRight: 10,
  },

  value: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },

  valueWithIcon: {
    marginLeft: 0,
  },

  errorText: {
    fontSize: 12,
    color: colors.error,
  },
});
