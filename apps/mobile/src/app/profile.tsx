import { useCallback, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, router } from "expo-router";
import {
  LogOut,
  ChevronRight,
  Mail,
  Bell,
  Settings,
} from "lucide-react-native";
import { getCurrentUser } from "../api/user";
import { useAuthStore } from "../store/authStore";
import AppButton from "../components/AppButton";
import { colors } from "../theme/colors";

interface User {
  id: string;
  name: string;
  email: string;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  const logout = useAuthStore((state) => state.logout);

  const loadUser = useCallback(async () => {
    try {
      setHasError(false);
      const data = await getCurrentUser();
      setUser(data);
    } catch (error) {
      console.error("Profile error:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser]),
  );

  function onRefresh() {
    setIsRefreshing(true);
    loadUser();
  }

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (hasError) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center px-8"
        style={{ backgroundColor: colors.background }}
      >
        <Text
          className="text-base font-medium mb-4 text-center"
          style={{ color: colors.heading }}
        >
          Failed to load profile.
        </Text>
        <AppButton title="Try again" onPress={loadUser} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.primary }}
      edges={["top"]}
    >
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View
          className="items-center pb-16 pt-4"
          style={{ backgroundColor: colors.primary }}
        >
          <View
            className="w-24 h-24 rounded-full items-center justify-center border-4"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.accent,
            }}
          >
            <Text
              className="text-3xl font-bold"
              style={{ color: colors.primary }}
            >
              {user ? getInitials(user.name) : ""}
            </Text>
          </View>
        </View>

        <View
          className="rounded-t-3xl -mt-10 px-6 pt-8 flex-1"
          style={{ backgroundColor: colors.background }}
        >
          <Text
            className="text-2xl font-bold text-center"
            style={{ color: colors.heading }}
          >
            {user?.name}
          </Text>
          <View className="flex-row items-center justify-center mt-1 mb-8">
            <Mail size={14} color={colors.muted} />
            <Text className="ml-1.5 text-sm" style={{ color: colors.muted }}>
              {user?.email}
            </Text>
          </View>

          <View
            className="rounded-2xl border overflow-hidden mb-6"
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.border,
            }}
          >
            <ProfileRow
              icon={<Settings size={18} color={colors.muted} />}
              label="Account settings"
            />
            <View
              className="h-[1px] ml-14"
              style={{ backgroundColor: colors.border }}
            />
            <ProfileRow
              icon={<Bell size={18} color={colors.muted} />}
              label="Notifications"
            />
          </View>

          <AppButton title="Log out" onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View className="flex-row items-center px-4 py-4">
      <View className="w-8 items-center">{icon}</View>
      <Text
        className="flex-1 ml-2 font-medium"
        style={{ color: colors.heading }}
      >
        {label}
      </Text>
      <ChevronRight size={18} color={colors.placeholder} />
    </View>
  );
}
