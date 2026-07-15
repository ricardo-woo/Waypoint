import { View, Text, Modal, Pressable } from "react-native";
import { Pencil, Trash2, X } from "lucide-react-native";
import { colors } from "../theme/colors"; // 👈 Imported colors theme

interface Props {
  visible: boolean;
  tripTitle: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TripActionSheet({
  visible,
  tripTitle,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/40 justify-end" onPress={onClose}>
        <Pressable
          className="rounded-t-3xl px-5 pt-3 pb-8"
          onPress={(e) => e.stopPropagation()}
          style={{ backgroundColor: colors.background }}
        >
          {/* Handle bar for bottom sheet look */}
          <View
            className="w-10 h-1 rounded-full self-center mb-4"
            style={{ backgroundColor: colors.border }}
          />

          <View className="flex-row items-center justify-between mb-5">
            <Text
              className="text-lg font-bold flex-1 mr-2"
              style={{ color: colors.text }}
              numberOfLines={1}
            >
              {tripTitle}
            </Text>
            <Pressable onPress={onClose} className="p-1">
              <X size={20} color={colors.muted} />
            </Pressable>
          </View>

          <Pressable
            onPress={onEdit}
            className="flex-row items-center py-4 active:opacity-70"
          >
            <View className="w-9 items-center">
              <Pencil size={19} color={colors.primary} strokeWidth={2.25} />
            </View>
            <Text
              className="ml-2 text-base font-semibold"
              style={{ color: colors.text }}
            >
              Edit trip
            </Text>
          </Pressable>

          <View
            className="h-[1px] ml-11"
            style={{ backgroundColor: colors.border }}
          />

          <Pressable
            onPress={onDelete}
            className="flex-row items-center py-4 active:opacity-70"
          >
            <View className="w-9 items-center">
              <Trash2
                size={19}
                color={colors.error || "#DC2626"}
                strokeWidth={2.25}
              />
            </View>
            <Text
              className="ml-2 text-base font-semibold"
              style={{ color: colors.error || "#DC2626" }}
            >
              Delete trip
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
