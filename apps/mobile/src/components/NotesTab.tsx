import { useCallback, useEffect, useRef, useState } from "react";
import { View, TextInput, ActivityIndicator, Text } from "react-native";
import { useFocusEffect } from "expo-router";
import { getNote, saveNote } from "../api/notes";
import { colors } from "../theme/colors"; // 👈 Imported colors theme

interface Props {
  tripId: string;
}

const SAVE_DEBOUNCE_MS = 800;

export default function NotesTab({ tripId }: Props) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  const load = useCallback(async () => {
    try {
      const note = await getNote(tripId);
      isFirstLoad.current = true;
      setContent(note.content);
    } catch (err) {
      console.error("Load note error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    setSaveStatus("saving");

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveNote(tripId, content);
        setSaveStatus("saved");
      } catch (err) {
        console.error("Save note error:", err);
      }
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  if (isLoading) {
    return (
      <View className="pt-10 items-center">
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="pt-5 pb-6">
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Packing lists, reminders, things to book..."
        placeholderTextColor={colors.placeholder}
        multiline
        textAlignVertical="top"
        className="rounded-2xl border p-4 text-base"
        style={{
          minHeight: 300,
          backgroundColor: colors.surface,
          borderColor: colors.border,
          color: colors.text,
          ...({ outlineStyle: "none" } as any), // Standard web/hybrid resets if testing on web
        }}
      />
      {saveStatus === "saving" && (
        <Text className="text-xs mt-2" style={{ color: colors.muted }}>
          Saving...
        </Text>
      )}
      {saveStatus === "saved" && (
        <Text className="text-xs mt-2" style={{ color: colors.muted }}>
          Saved
        </Text>
      )}
    </View>
  );
}
