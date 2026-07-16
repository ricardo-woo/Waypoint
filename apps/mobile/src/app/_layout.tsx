import "../../global.css";
import { useEffect } from "react";
import { registerTranslation, en } from "react-native-paper-dates";

registerTranslation("en", en);

import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";

import { Platform, View, ActivityIndicator } from "react-native";
import { Tabs, useRouter, useSegments } from "expo-router";
import { House, Map, User } from "lucide-react-native";

import { useAuthStore } from "../store/authStore";
import { colors } from "../theme/colors"; // 👈 Imported colors theme

export default function TabsLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const hydrate = useAuthStore((state) => state.hydrate);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const currentRoute = segments[segments.length - 1];
    const publicRoutes = ["login", "register", "index"];
    const isPublicRoute = publicRoutes.includes(currentRoute);

    if (!token && !isPublicRoute) {
      router.replace("/login");
    }

    if (token && (currentRoute === "login" || currentRoute === "register")) {
      router.replace("/home");
    }
  }, [token, isHydrated, segments]);

  if (!fontsLoaded || !isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Tabs
      initialRouteName="login"
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          height: 70,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: colors.surface, // 👈 Linked tab bar bg
          borderTopWidth: 1,
          borderTopColor: colors.border, // 👈 Linked top border
          ...Platform.select({
            ios: {
              shadowColor: colors.text, // 👈 Linked iOS shadow color
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
            },
            android: {
              elevation: 8,
            },
          }),
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },

        tabBarActiveTintColor: colors.primary, // 👈 Linked active item
        tabBarInactiveTintColor: colors.placeholder, // 👈 Linked inactive item
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <House size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="trips"
        options={{
          title: "Trips",
          tabBarIcon: ({ color, focused }) => (
            <Map size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <User size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tabs.Screen
        name="login"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen
        name="register"
        options={{ href: null, tabBarStyle: { display: "none" } }}
      />
      <Tabs.Screen name="create-trip" options={{ href: null }} />
      <Tabs.Screen name="trip-details" options={{ href: null }} />
      <Tabs.Screen name="add-itinerary" options={{ href: null }} />
    </Tabs>
  );
}
