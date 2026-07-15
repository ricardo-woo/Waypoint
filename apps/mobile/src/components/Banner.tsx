import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../theme/colors";

type BannerType = "success" | "error" | "warning";

interface Props {
  type: BannerType;

  message: string;

  onDismiss?: () => void;
}

const VARIANTS: Record<
  BannerType,
  { background: string; color: string; icon: string }
> = {
  success: {
    background: colors.background,
    color: colors.success,
    icon: "check-circle",
  },

  error: {
    background: colors.background,
    color: colors.error,
    icon: "alert-circle",
  },

  warning: {
    background: colors.background,
    color: colors.warning,
    icon: "alert-triangle",
  },
};

export default function Banner({ type, message, onDismiss }: Props) {
  const variant = VARIANTS[type];

  return (
    <View style={[styles.banner, { backgroundColor: variant.background }]}>
      <Feather name={variant.icon as any} size={18} color={variant.color} />

      <Text style={[styles.message, { color: variant.color }]}>{message}</Text>

      {onDismiss && (
        <Pressable onPress={onDismiss} hitSlop={8}>
          <Feather name="x" size={16} color={variant.color} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },

  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
});
