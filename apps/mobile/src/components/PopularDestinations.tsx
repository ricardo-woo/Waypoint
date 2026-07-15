import { View, Text, Pressable, Image, ScrollView } from "react-native";
import { router } from "expo-router";
import { colors } from "../theme/colors";

interface Destination {
  name: string;
  image: string;
}

const DESTINATIONS: Destination[] = [
  {
    name: "Bangkok, Thailand",
    image:
      "https://images.pexels.com/photos/31436464/pexels-photo-31436464.jpeg",
  },
  {
    name: "Paris, France",
    image: "https://images.pexels.com/photos/4015462/pexels-photo-4015462.jpeg",
  },
  {
    name: "Hong Kong, China",
    image:
      "https://images.pexels.com/photos/20306805/pexels-photo-20306805.jpeg",
  },
  {
    name: "Bali, Indonesia",
    image: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg",
  },
  {
    name: "Rome, Italy",
    image:
      "https://images.pexels.com/photos/27541217/pexels-photo-27541217.jpeg",
  },
];

export default function PopularDestinations() {
  return (
    <View>
      <View className="flex-row items-center mb-4">
        {/* Rendered the imported Compass icon here */}

        <Text
          className="ml-2 text-2xl font-bold"
          style={{ color: colors.text }}
        >
          Popular Destinations
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 14, paddingBottom: 4 }}
      >
        {DESTINATIONS.map((destination) => (
          <Pressable
            key={destination.name}
            className="w-40 border overflow-hidden active:opacity-90"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: 16,
              shadowColor: colors.text,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
            onPress={() =>
              router.push({
                pathname: "/create-trip",
                params: { suggestedLocation: destination.name },
              })
            }
          >
            <Image
              source={{ uri: destination.image }}
              className="w-full h-28"
              resizeMode="cover"
            />
            <View className="px-3 py-3">
              <Text
                className="text-sm font-semibold"
                style={{ color: colors.text }}
                numberOfLines={2}
              >
                {destination.name}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
