import { View, Text, Pressable, Image } from "react-native";
import { MapPin, Calendar, ImageOff, ListChecks } from "lucide-react-native";
import { colors } from "../theme/colors"; // 👈 Imported colors theme

interface Props {
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
  itineraryCount?: number;
  onPress: () => void;
  onLongPress: () => void;
}

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const isValid = !isNaN(start.getTime()) && !isNaN(end.getTime());
  if (!isValid) return `${startDate} – ${endDate}`;

  const sameMonth =
    start.getUTCMonth() === end.getUTCMonth() &&
    start.getUTCFullYear() === end.getUTCFullYear();

  const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
  const thisYear = new Date().getUTCFullYear();

  const monthDay = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });

  const withYear = (d: Date) => `${monthDay(d)}, ${d.getUTCFullYear()}`;

  const needsYear =
    start.getUTCFullYear() !== thisYear || end.getUTCFullYear() !== thisYear;

  if (sameMonth) {
    const month = start.toLocaleDateString("en-US", {
      month: "short",
      timeZone: "UTC",
    });

    const range = `${month} ${start.getUTCDate()}–${end.getUTCDate()}`;
    return needsYear ? `${range}, ${start.getUTCFullYear()}` : range;
  }

  if (sameYear && !needsYear) {
    return `${monthDay(start)} – ${monthDay(end)}`;
  }

  return `${withYear(start)} – ${withYear(end)}`;
}

export default function TripCard({
  title,
  location,
  startDate,
  endDate,
  imageUrl,
  itineraryCount,
  onPress,
  onLongPress,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={350}
      className="active:opacity-95 active:scale-[0.99]"
    >
      <View
        className="rounded-2xl mb-4 border overflow-hidden"
        style={{
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 2,
        }}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-36"
            resizeMode="cover"
          />
        ) : (
          <View
            className="w-full h-36 items-center justify-center"
            style={{ backgroundColor: `${colors.primary}1A` }} // Soft 10% primary tint
          >
            <ImageOff size={22} color={colors.muted} strokeWidth={1.75} />
          </View>
        )}

        <View className="p-5">
          <Text
            className="text-lg font-semibold tracking-tight"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {title}
          </Text>

          <View className="flex-row items-center mt-2">
            <MapPin size={14} color={colors.accent} strokeWidth={2.25} />
            <Text
              className="ml-1.5 text-sm font-medium"
              style={{ color: colors.muted }}
              numberOfLines={1}
            >
              {location}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-1.5">
            <View className="flex-row items-center">
              <Calendar
                size={14}
                color={colors.placeholder}
                strokeWidth={2.25}
              />
              <Text
                className="ml-1.5 text-xs font-medium tracking-wide"
                style={{ color: colors.placeholder }}
              >
                {formatDateRange(startDate, endDate)}
              </Text>
            </View>

            {itineraryCount !== undefined && (
              <View className="flex-row items-center">
                <ListChecks
                  size={14}
                  color={colors.placeholder}
                  strokeWidth={2.25}
                />
                <Text
                  className="ml-1.5 text-xs font-medium"
                  style={{ color: colors.placeholder }}
                >
                  {itineraryCount === 1
                    ? "1 activity"
                    : `${itineraryCount} activities`}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}
