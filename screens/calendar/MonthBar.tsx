import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface MonthBarProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function MonthBar({ selectedMonth, onMonthChange }: MonthBarProps) {
  const backgroundColor = useThemeColor(
    { light: "#f4ead5", dark: "#2a2520" },
    "background",
  );
  const textColor = useThemeColor(
    { light: "#5a4a3a", dark: "#ffffff" },
    "text",
  );
  const chevronColor = useThemeColor(
    { light: "#5a4a3a", dark: "#d4a574" },
    "text",
  );

  const formatMonth = (date: Date) => {
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return (
      selectedMonth.getMonth() === today.getMonth() &&
      selectedMonth.getFullYear() === today.getFullYear()
    );
  };

  const handleTodayPress = () => {
    onMonthChange(new Date());
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity
        style={styles.chevronButton}
        onPress={handlePreviousMonth}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <IconSymbol name="chevron.left" size={22} color={chevronColor} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleTodayPress} disabled={isCurrentMonth()}>
        <ThemedText
          style={[styles.monthText, { color: textColor }]}
          type="defaultSemiBold"
        >
          {formatMonth(selectedMonth)}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.chevronButton}
        onPress={handleNextMonth}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <IconSymbol name="chevron.right" size={22} color={chevronColor} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  chevronButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
  },
});
