import { View, Text } from "react-native";
import { colors } from "../theme/colors";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeHeader() {
  return (
    <View className="mt-6 mb-6">
      <Text className="text-3xl font-bold" style={{ color: colors.text }}>
        {getGreeting()}
      </Text>

      <Text className="text-lg mt-1" style={{ color: colors.muted }}>
        Where are you going next?
      </Text>
    </View>
  );
}
