import { View, Text, Pressable } from "react-native";
import { colors } from "../theme/colors";

export type TripTabKey = "itinerary" | "budget" | "notes";

interface Props {
  activeTab: TripTabKey;
  onChange: (tab: TripTabKey) => void;
}

const TABS: { key: TripTabKey; label: string }[] = [
  { key: "itinerary", label: "Itinerary" },
  { key: "budget", label: "Budget" },
  { key: "notes", label: "Notes" },
];

export default function TripTabs({ activeTab, onChange }: Props) {
  return (
    <View className="flex-row border-b" style={{ borderColor: colors.border }}>
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            className="mr-6 pb-3"
          >
            <Text
              className="text-base"
              style={{
                fontWeight: isActive ? "700" : "600",
                color: isActive ? colors.primary : colors.muted,
              }}
            >
              {tab.label}
            </Text>
            {isActive && (
              <View
                className="h-[3px] rounded-full mt-2"
                style={{ backgroundColor: colors.primary }}
              />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
