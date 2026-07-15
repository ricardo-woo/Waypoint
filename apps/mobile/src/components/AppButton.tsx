import { useState } from "react";
import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";

import { colors } from "../theme/colors";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function AppButton({
  title,
  onPress,
  loading,
  disabled,
}: Props) {
  const [isPressed, setIsPressed] = useState(false);
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.button,
        isPressed && !isDisabled && styles.buttonPressed,
        isDisabled && styles.buttonDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPressed: {
    backgroundColor: colors.primaryPressed,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
