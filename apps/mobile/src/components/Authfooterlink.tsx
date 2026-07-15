import { View, Text, Pressable, StyleSheet } from "react-native";

import { colors } from "../theme/colors";

interface Props {
  text: string;

  linkText: string;

  onPress: () => void;
}

export default function AuthFooterLink({ text, linkText, onPress }: Props) {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{text}</Text>

      <Pressable onPress={onPress} hitSlop={8}>
        <Text style={styles.footerLink}>{linkText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 32,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },

  footerText: {
    fontSize: 14,
    color: colors.muted,
  },

  footerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.accent,
  },
});
