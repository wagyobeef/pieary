import React, { useState, useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  onApplyFilters: (startDate: Date | null, endDate: Date | null) => void;
}

const SHEET_OFFSET = 500;

export function FilterModal({
  visible,
  onClose,
  startDate: initialStartDate,
  endDate: initialEndDate,
  onApplyFilters,
}: FilterModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [openPicker, setOpenPicker] = useState<"start" | "end" | null>(null);

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_OFFSET)).current;

  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  useEffect(() => {
    if (visible) {
      overlayOpacity.setValue(0);
      sheetTranslateY.setValue(SHEET_OFFSET);
      setModalVisible(true);
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
    }
  }, [visible]);

  const animateClose = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SHEET_OFFSET,
        duration: 220,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      callback();
    });
  };

  const handleClose = () => {
    setOpenPicker(null);
    animateClose(onClose);
  };

  const handleApply = () => {
    setOpenPicker(null);
    animateClose(() => {
      onApplyFilters(startDate, endDate);
      onClose();
    });
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setOpenPicker(null);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setOpenPicker(null);
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setOpenPicker(null);
    if (selectedDate) setEndDate(selectedDate);
  };

  const backgroundColor = useThemeColor(
    { light: "#faf6f0", dark: "#2c2c2e" },
    "background"
  );
  const textColor = useThemeColor(
    { light: "#5a4a3a", dark: "#ffffff" },
    "text"
  );
  const secondaryTextColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text"
  );
  const borderColor = useThemeColor(
    { light: "#e5e5e7", dark: "#3a3a3c" },
    "background"
  );

  const formatDate = (date: Date | null) => {
    if (!date) return "not set";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalRoot}>
        {/* Fading backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: overlayOpacity }]}>
          <TouchableOpacity
            style={styles.backdropTap}
            activeOpacity={1}
            onPress={handleClose}
          />
        </Animated.View>

        {/* Sliding sheet */}
        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor, transform: [{ translateY: sheetTranslateY }] },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClear}>
              <Text style={[styles.clearButton, { color: secondaryTextColor }]}>
                clear
              </Text>
            </TouchableOpacity>
            <View style={styles.headerSpacer} />
            <TouchableOpacity onPress={handleClose}>
              <IconSymbol name="xmark" size={18} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Date Filters */}
          <View style={styles.content}>
            {/* Start Date */}
            <View style={styles.filterSection}>
              <Text style={[styles.label, { color: textColor }]}>start date</Text>
              <TouchableOpacity
                style={[styles.dateButton, { borderColor }]}
                onPress={() => setOpenPicker(openPicker === "start" ? null : "start")}
              >
                <Text style={[styles.dateText, { color: textColor }]}>
                  {formatDate(startDate)}
                </Text>
                <IconSymbol name="calendar" size={18} color={secondaryTextColor} />
              </TouchableOpacity>
              {openPicker === "start" && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleStartDateChange}
                  />
                </View>
              )}
            </View>

            {/* End Date */}
            <View style={styles.filterSection}>
              <Text style={[styles.label, { color: textColor }]}>end date</Text>
              <TouchableOpacity
                style={[styles.dateButton, { borderColor }]}
                onPress={() => setOpenPicker(openPicker === "end" ? null : "end")}
              >
                <Text style={[styles.dateText, { color: textColor }]}>
                  {formatDate(endDate)}
                </Text>
                <IconSymbol name="calendar" size={18} color={secondaryTextColor} />
              </TouchableOpacity>
              {openPicker === "end" && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleEndDateChange}
                  />
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: "#5a4a3a" }]}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>apply filters</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerSpacer: {
    flex: 1,
  },
  clearButton: {
    fontSize: 16,
  },
  content: {
    marginBottom: 24,
  },
  filterSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  dateText: {
    fontSize: 16,
  },
  pickerContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
