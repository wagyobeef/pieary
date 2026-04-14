import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

interface DayPieData {
  completed: boolean[];
}

interface CalendarProps {
  month: Date;
  dayData?: Record<string, DayPieData>;
}

export function Calendar({ month, dayData = {} }: CalendarProps) {
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

  const sectorColors = [
    "#FF9B9B", // warm pink/red
    "#FFBD7A", // warm orange
    "#FFD97A", // warm yellow
    "#B8C9A3", // warm sage green
    "#B5ACD4", // warm periwinkle
    "#D4A5D4", // warm purple/lavender
  ];

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
    const dateKey = `${month.getFullYear()}-${month.getMonth() + 1}-${day}`;
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

          return (
            <Path key={i} d={path} fill={sectorColors[i]} opacity={0.9} />
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
