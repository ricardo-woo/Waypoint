import { Pressable, GestureResponderEvent } from "react-native";
import { Plus } from "lucide-react-native";
import { colors } from "../theme/colors";

interface AddButtonProps {
  onPress: (event: GestureResponderEvent) => void;
}

export default function AddButton({ onPress }: AddButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        position: "absolute",
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: pressed ? colors.primaryPressed : colors.primary,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
      })}
    >
      <Plus size={26} color="#FFFFFF" strokeWidth={2.5} />
    </Pressable>
  );
}
