import { View, Text, StyleSheet } from "react-native";

import { colors } from "../theme/colors";

interface Props {
  title: string;

  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 36,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.heading,
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: colors.subheading,
    lineHeight: 21,
  },
});
