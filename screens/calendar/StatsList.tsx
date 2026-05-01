import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAreas } from "@/contexts/AreasContext";
import { useCompletions } from "@/contexts/CompletionsContext";
import { getAreaCompletionsByDateRange } from "@/db/areaCompletions";
import { useFocusedAreas } from "@/contexts/FocusedAreasContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { colorIndexToHex } from "@/utils/colorIndexToHex";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface StatsListProps {
  month: Date;
}

export function StatsList({ month }: StatsListProps) {
  const { areas } = useAreas();
  const { completionsVersion } = useCompletions();
  const { isAreaFocused, toggleArea } = useFocusedAreas();
  const [completionCounts, setCompletionCounts] = useState<Record<number, number>>({});
  const animatedOpacities = useRef<Record<number, Animated.Value>>({});

  const textColor = useThemeColor({ light: "#5a4a3a", dark: "#ffffff" }, "text");
  const subtleColor = useThemeColor({ light: "#8e8e93", dark: "#8e8e93" }, "text");
  const rowBg = useThemeColor({ light: "#faf6f0", dark: "#2c2c2e" }, "background");

  useEffect(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const startDate = new Date(year, monthIndex, 1).toISOString().split("T")[0];
    const endDate = new Date(year, monthIndex + 1, 0).toISOString().split("T")[0];

    const completions = getAreaCompletionsByDateRange(startDate, endDate);

    const daySets: Record<number, Set<string>> = {};
    completions.forEach((c) => {
      if (!daySets[c.areaId]) daySets[c.areaId] = new Set();
      daySets[c.areaId].add(c.completedDate);
    });

    const counts: Record<number, number> = {};
    for (const [areaId, dates] of Object.entries(daySets)) {
      counts[Number(areaId)] = dates.size;
    }
    setCompletionCounts(counts);
  }, [month, completionsVersion]);

  const sortedAreas = [...areas].sort(
    (a, b) => (completionCounts[b.id] ?? 0) - (completionCounts[a.id] ?? 0),
  );

  // Initialize animated values for any area that doesn't have one yet
  sortedAreas.forEach((area) => {
    if (!animatedOpacities.current[area.id]) {
      animatedOpacities.current[area.id] = new Animated.Value(
        isAreaFocused(area.id) ? 1 : 0.35,
      );
    }
  });

  const handleToggle = (areaId: number) => {
    const currentlyFocused = isAreaFocused(areaId);
    Animated.timing(animatedOpacities.current[areaId], {
      toValue: currentlyFocused ? 0.35 : 1,
      duration: 120,
      useNativeDriver: true,
    }).start();
    toggleArea(areaId);
  };

  return (
    <View style={styles.container}>
      {sortedAreas.map((area) => {
        const count = completionCounts[area.id] ?? 0;
        const color = colorIndexToHex(area.color);
        return (
          <TouchableOpacity
            key={area.id}
            onPress={() => handleToggle(area.id)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[styles.row, { backgroundColor: rowBg, opacity: animatedOpacities.current[area.id] }]}
            >
              <View style={[styles.iconBadge, { backgroundColor: color }]}>
                <IconSymbol name={area.icon} size={18} color="#ffffff" />
              </View>
              <Text style={[styles.title, { color: textColor }]}>{area.title}</Text>
              <Text style={[styles.count, { color: subtleColor }]}>
                {count} {count === 1 ? "day" : "days"}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  count: {
    fontSize: 14,
    fontWeight: "500",
  },
});
