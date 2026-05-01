import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Calendar } from "@/screens/calendar/Calendar";
import { MonthBar } from "@/screens/calendar/MonthBar";
import { StatsList } from "@/screens/calendar/StatsList";

export default function CalendarScreen() {
  const backgroundColor = useThemeColor(
    { light: "#f4ead5", dark: "#2a2520" },
    "background",
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor }]}
        edges={["top"]}
      >
        <MonthBar selectedMonth={currentMonth} onMonthChange={setCurrentMonth} />
        <ScrollView style={{ backgroundColor }}>
          <Calendar month={currentMonth} />
          <StatsList month={currentMonth} />
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
