import { View, Text, Modal, Pressable } from "react-native";
import { AlertTriangle } from "lucide-react-native";

interface Props {
  visible: boolean;
  title: string;
  message: string;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  visible,
  title,
  message,
  isDeleting,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-8">
        <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
          <View className="w-14 h-14 rounded-full bg-[#FEE2E2] items-center justify-center self-center mb-4">
            <AlertTriangle size={26} color="#DC2626" strokeWidth={2.25} />
          </View>

          <Text className="text-lg font-bold text-[#1C2B22] text-center mb-2">
            {title}
          </Text>

          <Text className="text-sm text-[#5B6B5F] text-center leading-5 mb-6">
            {message}
          </Text>

          <View className="flex-row gap-3">
            <Pressable
              onPress={onCancel}
              disabled={isDeleting}
              className="flex-1 rounded-xl py-3.5 items-center border border-[#DCE3D8] active:bg-[#F4F6F2]"
            >
              <Text className="text-sm font-semibold text-[#5B6B5F]">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={isDeleting}
              className="flex-1 rounded-xl py-3.5 items-center bg-[#DC2626] active:bg-[#B91C1C]"
              style={{ opacity: isDeleting ? 0.6 : 1 }}
            >
              <Text className="text-sm font-bold text-white">
                {isDeleting ? "Deleting..." : "Delete"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
