import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MonthBarProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

const MONTHS = [
  "january", "february", "march", "april",
  "may", "june", "july", "august",
  "september", "october", "november", "december",
];

const SHEET_HEIGHT = 300;

export function MonthBar({ selectedMonth, onMonthChange }: MonthBarProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(selectedMonth.getFullYear());

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  const backgroundColor = useThemeColor(
    { light: "#f4ead5", dark: "#2a2520" },
    "background",
  );
  const sheetBg = useThemeColor(
    { light: "#faf6f0", dark: "#2c2c2e" },
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
  const activeBg = useThemeColor(
    { light: "#5a4a3a", dark: "#d4a574" },
    "background",
  );

  const formatMonth = (date: Date) =>
    `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

  const openPicker = () => {
    setPickerYear(selectedMonth.getFullYear());
    overlayOpacity.setValue(0);
    sheetTranslateY.setValue(SHEET_HEIGHT);
    setShowPicker(true);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closePicker = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SHEET_HEIGHT,
        duration: 220,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPicker(false);
      callback?.();
    });
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

  const handlePickerSelect = (monthIndex: number) => {
    closePicker(() => onMonthChange(new Date(pickerYear, monthIndex, 1)));
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

      <TouchableOpacity onPress={openPicker}>
        <ThemedText style={[styles.monthText, { color: textColor }]} type="defaultSemiBold">
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

      <Modal
        visible={showPicker}
        transparent
        animationType="none"
        onRequestClose={() => closePicker()}
      >
        <View style={styles.modalRoot}>
          {/* Fading backdrop */}
          <Animated.View
            style={[styles.backdrop, { opacity: overlayOpacity }]}
          >
            <TouchableOpacity
              style={styles.backdropTap}
              activeOpacity={1}
              onPress={() => closePicker()}
            />
          </Animated.View>

          {/* Sliding sheet */}
          <Animated.View
            style={[
              styles.sheet,
              { backgroundColor: sheetBg, transform: [{ translateY: sheetTranslateY }] },
            ]}
          >
            {/* Year selector */}
            <View style={styles.yearRow}>
              <TouchableOpacity
                onPress={() => setPickerYear((y) => y - 1)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <IconSymbol name="chevron.left" size={20} color={chevronColor} />
              </TouchableOpacity>
              <Text style={[styles.yearText, { color: textColor }]}>{pickerYear}</Text>
              <TouchableOpacity
                onPress={() => setPickerYear((y) => y + 1)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <IconSymbol name="chevron.right" size={20} color={chevronColor} />
              </TouchableOpacity>
            </View>

            {/* Month grid */}
            <View style={styles.monthGrid}>
              {MONTHS.map((name, i) => {
                const today = new Date();
                const isSelected =
                  i === selectedMonth.getMonth() &&
                  pickerYear === selectedMonth.getFullYear();
                const isCurrentMonth =
                  i === today.getMonth() &&
                  pickerYear === today.getFullYear();
                return (
                  <TouchableOpacity
                    key={name}
                    style={[
                      styles.monthCell,
                      isSelected && { backgroundColor: activeBg },
                    ]}
                    onPress={() => handlePickerSelect(i)}
                  >
                    <Text
                      style={[
                        styles.monthCellText,
                        { color: isSelected ? "#ffffff" : textColor },
                        isCurrentMonth && { fontWeight: "700" },
                      ]}
                    >
                      {name.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        </View>
      </Modal>
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
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  backdropTap: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  yearRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginBottom: 20,
  },
  yearText: {
    fontSize: 18,
    fontWeight: "600",
    minWidth: 50,
    textAlign: "center",
  },
  monthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  monthCell: {
    width: "30%",
    flexGrow: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  monthCellText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
