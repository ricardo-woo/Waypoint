import { useCallback, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { Plus, Trash2 } from "lucide-react-native";
import FormField from "./Formfield";
import AppButton from "../components/AppButton";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  Expense,
} from "../api/expenses";
import { colors } from "../theme/colors"; // 👈 Imported colors theme

interface Props {
  tripId: string;
}

export default function BudgetTab({ tripId }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getExpenses(tripId);
      setExpenses(data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  }, [tripId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  async function addExpense() {
    const parsed = parseFloat(amount);
    if (!label.trim() || isNaN(parsed) || parsed <= 0) return;

    setIsSaving(true);
    try {
      const created = await createExpense({
        label: label.trim(),
        amount: parsed,
        tripId,
      });
      setExpenses((prev) => [...prev, created]);
      setLabel("");
      setAmount("");
      setIsAdding(false);
    } catch (err) {
    } finally {
      setIsSaving(false);
    }
  }

  async function removeExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    try {
      await deleteExpense(id);
    } catch (err) {
      load();
    }
  }

  if (isLoading) {
    return (
      <View className="pt-10 items-center">
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="pt-5">
      <View
        className="rounded-2xl p-5 mb-5 border"
        style={{ backgroundColor: colors.surface, borderColor: colors.border }}
      >
        <Text
          className="text-sm font-medium mb-1"
          style={{ color: colors.muted }}
        >
          Total spent
        </Text>
        <Text className="text-3xl font-bold" style={{ color: colors.text }}>
          ${total.toFixed(2)}
        </Text>
      </View>

      {expenses.map((expense) => (
        <View
          key={expense.id}
          className="flex-row items-center rounded-2xl p-4 mb-2.5 border"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <Text
            className="flex-1 text-base font-medium"
            style={{ color: colors.text }}
          >
            {expense.label}
          </Text>
          <Text
            className="text-base font-semibold mr-3"
            style={{ color: colors.text }}
          >
            ${expense.amount.toFixed(2)}
          </Text>
          <Pressable onPress={() => removeExpense(expense.id)} hitSlop={8}>
            <Trash2 size={17} color={colors.primary} strokeWidth={2.25} />
          </Pressable>
        </View>
      ))}

      {isAdding ? (
        <View
          className="rounded-2xl p-4 border mt-2"
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}
        >
          <FormField
            label="What for?"
            value={label}
            placeholder="e.g. Hotel, Flights"
            onChangeText={setLabel}
          />
          <View className="mt-2">
            <FormField
              label="Amount"
              value={amount}
              placeholder="0.00"
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <View className="flex-row gap-2 mt-4">
            <Pressable
              onPress={() => setIsAdding(false)}
              className="flex-1 rounded-xl py-3 items-center border"
              style={{ borderColor: colors.border }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: colors.muted }}
              >
                Cancel
              </Text>
            </Pressable>

            <Pressable
              onPress={addExpense}
              disabled={isSaving}
              className="flex-1 rounded-xl py-3 items-center"
              style={{
                backgroundColor: colors.primary,
                opacity: isSaving ? 0.6 : 1,
              }}
            >
              <Text className="text-sm font-bold text-white">
                {isSaving ? "Adding..." : "Add"}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <AppButton title="Add expense" onPress={() => setIsAdding(true)} />
      )}
    </View>
  );
}
