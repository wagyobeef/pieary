import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function DateBar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
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

  const formatDate = (date: Date) => {
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = String(date.getFullYear()).slice(-2);

    // Add ordinal suffix (st, nd, rd, th)
    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${month} ${day}${getOrdinalSuffix(day)}`;
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  const handleTodayPress = () => {
    setSelectedDate(new Date());
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity
        style={styles.chevronButton}
        onPress={handlePreviousDay}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <IconSymbol name="chevron.left" size={22} color={chevronColor} />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleTodayPress} disabled={isToday()}>
        <ThemedText
          style={[styles.dateText, { color: textColor }]}
          type="defaultSemiBold"
        >
          {formatDate(selectedDate)}
        </ThemedText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.chevronButton}
        onPress={handleNextDay}
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
    paddingBottom: 4,
  },
  chevronButton: {
    padding: 8,
  },
  dateText: {
    fontSize: 18,
  },
});
