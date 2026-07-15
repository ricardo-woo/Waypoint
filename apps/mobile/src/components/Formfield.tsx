import { View, Text, StyleSheet } from "react-native";

import AppInput from "./AppInput";
import { colors } from "../theme/colors";

interface Props {
  label: string;

  error?: string | boolean;

  [key: string]: any;
}

export default function FormField({ label, error, ...inputProps }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <AppInput {...inputProps} error={!!error} />
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

  errorText: {
    fontSize: 12,
    color: colors.error,
  },
});
