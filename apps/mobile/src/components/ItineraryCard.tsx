import { View, Text, Pressable } from "react-native";
import { MapPin } from "lucide-react-native";
import { ItineraryItem } from "../api/trips";
import { colors } from "../theme/colors"; // 👈 Imported colors theme

interface Props {
  item: ItineraryItem;
  isLast?: boolean;
  onPress?: () => void;
}

export default function ItineraryCard({ item, isLast, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center border active:opacity-70 ${
        isLast ? "" : "mb-1.5"
      }`}
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
      }}
    >
      <View className="flex-1">
        <Text
          className="text-sm font-semibold"
          style={{ color: colors.text }}
          numberOfLines={1}
        >
          {item.title}
        </Text>

        {item.location ? (
          <View className="flex-row items-center mt-1">
            <MapPin size={11} color={colors.muted} strokeWidth={2.25} />
            <Text
              className="ml-1 text-xs"
              style={{ color: colors.muted }}
              numberOfLines={1}
            >
              {item.location}
            </Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
