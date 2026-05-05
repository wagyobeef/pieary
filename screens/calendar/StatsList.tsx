import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAreas } from "@/contexts/AreasContext";
import { useCompletions } from "@/contexts/CompletionsContext";
import { getAreaCompletionsByDateRange } from "@/db/areaCompletions";
import { useThemeColor } from "@/hooks/use-theme-color";
import { colorIndexToHex } from "@/utils/colorIndexToHex";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatsListProps {
  month: Date;
}

export function StatsList({ month }: StatsListProps) {
  const { areas } = useAreas();
  const { completionsVersion } = useCompletions();
  const [completionCounts, setCompletionCounts] = useState<Record<number, number>>({});

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

  return (
    <View style={styles.container}>
      {areas.map((area) => {
        const count = completionCounts[area.id] ?? 0;
        const color = colorIndexToHex(area.color);
        return (
          <View key={area.id} style={[styles.row, { backgroundColor: rowBg }]}>
            <View style={[styles.iconBadge, { backgroundColor: color }]}>
              <IconSymbol name={area.icon} size={18} color="#ffffff" />
            </View>
            <Text style={[styles.title, { color: textColor }]}>{area.title}</Text>
            <Text style={[styles.count, { color: subtleColor }]}>
              {count === 0 ? "--" : `${count} ${count === 1 ? "day" : "days"}`}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 16,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 7,
    paddingLeft: 7,
    paddingRight: 11,
    borderRadius: 100,
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
  },
  count: {
    fontSize: 14,
    fontWeight: "500",
  },
});
