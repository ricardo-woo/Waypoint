import { View, Text, Pressable } from "react-native";
import { Plus } from "lucide-react-native";
import { ItineraryItem } from "../api/trips";
import ItineraryCard from "./ItineraryCard";
import { colors } from "../theme/colors"; // 👈 Imported colors theme

interface Props {
  items: ItineraryItem[];
  tripStartDate: string;
  tripEndDate: string;
  onAddActivity: (date: string) => void;
}

function parseLocalDate(dateStr: string) {
  const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getDaysInRange(start: Date, end: Date) {
  const days: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function getItemDayKey(item: ItineraryItem) {
  const d = new Date(item.date);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate(),
  ).padStart(2, "0")}`;
}

export default function ItineraryTab({
  items,
  tripStartDate,
  tripEndDate,
  onAddActivity,
}: Props) {
  const start = parseLocalDate(tripStartDate);
  const end = parseLocalDate(tripEndDate);
  const days = getDaysInRange(start, end);

  const itemsByDay = new Map<string, ItineraryItem[]>();
  for (const item of items) {
    const key = getItemDayKey(item);
    if (!itemsByDay.has(key)) itemsByDay.set(key, []);
    itemsByDay.get(key)!.push(item);
  }

  return (
    <View className="pt-4">
      {days.map((day, index) => {
        const dayKey = formatLocalDate(day);
        const dayItems = itemsByDay.get(dayKey) ?? [];

        return (
          <View
            key={dayKey}
            className={index !== days.length - 1 ? "mb-4" : "mb-2"}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text
                className="text-sm font-bold"
                style={{ color: colors.text }}
              >
                {formatDayLabel(day)}
              </Text>

              <Pressable
                onPress={() => onAddActivity(dayKey)}
                className="flex-row items-center active:opacity-60"
              >
                <Plus size={14} color={colors.primary} strokeWidth={2.5} />
                <Text
                  className="ml-1 text-xs font-semibold"
                  style={{ color: colors.primary }}
                >
                  Add
                </Text>
              </Pressable>
            </View>

            {dayItems.length === 0 ? (
              <View
                className="rounded-xl px-3 py-2.5 border border-dashed"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                <Text className="text-xs" style={{ color: colors.muted }}>
                  Nothing planned yet
                </Text>
              </View>
            ) : (
              dayItems.map((item, i) => (
                <ItineraryCard
                  key={item.id}
                  item={item}
                  isLast={i === dayItems.length - 1}
                />
              ))
            )}
          </View>
        );
      })}
    </View>
  );
}
