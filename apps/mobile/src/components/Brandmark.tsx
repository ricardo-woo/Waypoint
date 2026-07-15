import { View, Text, StyleSheet } from "react-native";

import { colors } from "../theme/colors";

export default function BrandMark() {
  return (
    <View style={styles.wrapper}>
      {/* Pure Typographic Branding — No Logo */}
      <Text style={styles.brandText}>Waypoint</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: 32,
    justifyContent: "center",
  },
  brandText: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.heading,
    letterSpacing: -0.75,
  },
});
