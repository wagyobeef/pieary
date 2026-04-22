import { useThemeColor } from "@/hooks/use-theme-color";
import { useAreas } from "@/contexts/AreasContext";
import { getAreaCompletionsByDateRange } from "@/db/areaCompletions";
import { colorIndexToHex } from "@/utils/colorIndexToHex";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

interface DayPieData {
  completed: boolean[];
}

interface CalendarProps {
  month: Date;
}

export function Calendar({ month }: CalendarProps) {
  const { areas } = useAreas();
  const [dayData, setDayData] = useState<Record<string, DayPieData>>({});
  const backgroundColor = useThemeColor(
    { light: "#f4ead5", dark: "#2a2520" },
    "background",
  );
  const textColor = useThemeColor(
    { light: "#5a4a3a", dark: "#ffffff" },
    "text",
  );
  const grayTextColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text",
  );

  // Load area completions for the entire month
  useEffect(() => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    // Get first and last day of the month
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);

    const startDate = firstDay.toISOString().split('T')[0];
    const endDate = lastDay.toISOString().split('T')[0];

    // Fetch all completions for this month range
    const completions = getAreaCompletionsByDateRange(startDate, endDate);

    // Organize completions by date
    const dataByDate: Record<string, DayPieData> = {};

    completions.forEach((completion) => {
      const dateKey = completion.completedDate;

      if (!dataByDate[dateKey]) {
        // Initialize array with false for all areas
        dataByDate[dateKey] = {
          completed: Array(areas.length).fill(false),
        };
      }

      // Find the index of this area
      const areaIndex = areas.findIndex((area) => area.id === completion.areaId);
      if (areaIndex !== -1) {
        dataByDate[dateKey].completed[areaIndex] = true;
      }
    });

    setDayData(dataByDate);
  }, [month, areas]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(month);

  const renderDayPie = (day: number) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth() + 1;
    const dateKey = `${year}-${String(monthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const data = dayData[dateKey];
    const pieSize = 32;
    const center = pieSize / 2;
    const radius = 12;
    const sectors = 6;

    if (!data) {
      // Empty pie - just show outline
      return (
        <Svg width={pieSize} height={pieSize}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#d4a574"
            strokeWidth={1.5}
            opacity={0.3}
          />
        </Svg>
      );
    }

    // Calculate completion percentage
    const completedCount = data.completed.filter(Boolean).length;
    const completionPercentage = completedCount / sectors;

    return (
      <Svg width={pieSize} height={pieSize}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="#d4a574"
          strokeWidth={1.5}
          opacity={0.3}
        />
        {/* Filled sectors */}
        {data.completed.map((completed, i) => {
          if (!completed) return null;

          const startAngle = (i / sectors) * 2 * Math.PI - Math.PI / 2;
          const endAngle = ((i + 1) / sectors) * 2 * Math.PI - Math.PI / 2;

          const x1 = center + radius * Math.cos(startAngle);
          const y1 = center + radius * Math.sin(startAngle);
          const x2 = center + radius * Math.cos(endAngle);
          const y2 = center + radius * Math.sin(endAngle);

          const largeArcFlag = 0;
          const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

          const area = areas[i];
          const color = area ? colorIndexToHex(area.color) : "#8e8e93";

          return (
            <Path key={i} d={path} fill={color} opacity={0.9} />
          );
        })}
      </Svg>
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDayOfWeek + 1;
      const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;

      days.push(
        <View key={i} style={styles.dayCell}>
          {isValidDay ? (
            <>
              <Text style={[styles.dayNumber, { color: textColor }]}>
                {dayNumber}
              </Text>
              {renderDayPie(dayNumber)}
            </>
          ) : null}
        </View>,
      );
    }

    return days;
  };

  const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Week day headers */}
      <View style={styles.weekHeader}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekDayCell}>
            <Text style={[styles.weekDayText, { color: grayTextColor }]}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>{renderCalendarDays()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 16,
  },
  weekHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "lowercase",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
});
