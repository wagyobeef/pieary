import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Calendar } from "@/screens/calendar/Calendar";
import { MonthBar } from "@/screens/calendar/MonthBar";

export default function CalendarScreen() {
  const backgroundColor = useThemeColor(
    { light: "#f4ead5", dark: "#2a2520" },
    "background",
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock data - some days with completed sectors
  const mockDayData = {
    "2026-4-1": { completed: [true, true, false, false, false, false] },
    "2026-4-2": { completed: [true, true, true, true, false, false] },
    "2026-4-5": { completed: [true, true, true, true, true, true] },
    "2026-4-10": { completed: [true, false, true, false, true, false] },
    "2026-4-14": { completed: [true, true, true, false, false, false] },
    "2026-4-20": { completed: [false, false, true, true, false, false] },
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor }]}
        edges={["top"]}
      >
        <MonthBar selectedMonth={currentMonth} onMonthChange={setCurrentMonth} />
        <ScrollView style={{ backgroundColor }}>
          <Calendar month={currentMonth} dayData={mockDayData} />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
