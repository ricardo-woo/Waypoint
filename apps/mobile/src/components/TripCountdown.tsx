import { View, Text } from "react-native";
import { Clock } from "lucide-react-native";
import { colors } from "../theme/colors"; // 👈 Imported colors theme

function getDaysBetween(a: Date, b: Date) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcB - utcA) / msPerDay);
}

export function getCountdownLabel(
  startDate: string,
  endDate: string,
): string | null {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const daysUntilStart = getDaysBetween(today, start);
  const daysUntilEnd = getDaysBetween(today, end);

  if (daysUntilStart > 0) {
    return daysUntilStart === 1
      ? "Starts tomorrow"
      : `Starts in ${daysUntilStart} days`;
  }

  if (daysUntilEnd >= 0) {
    if (daysUntilEnd === 0) return "Last day";
    return daysUntilEnd === 1 ? "Ends tomorrow" : `${daysUntilEnd} days left`;
  }

  return null;
}

interface TripCountdownProps {
  startDate: string;
  endDate: string;
  className?: string;
}

export default function TripCountdown({
  startDate,
  endDate,
  className = "",
}: TripCountdownProps) {
  const label = getCountdownLabel(startDate, endDate);
  if (!label) return null;

  return (
    <View
      className={`flex-row items-center self-start rounded-full px-3 py-1.5 ${className}`}
      style={{
        backgroundColor: `${colors.primary}1A`,
      }}
    >
      <Clock size={13} color={colors.primary} strokeWidth={2.5} />
      <Text
        className="ml-1.5 text-xs font-semibold"
        style={{ color: colors.primary }}
      >
        {label}
      </Text>
    </View>
  );
}
