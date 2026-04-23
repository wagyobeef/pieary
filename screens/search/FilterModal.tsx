import React, { useState, useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
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

export function FilterModal({
  visible,
  onClose,
  startDate: initialStartDate,
  endDate: initialEndDate,
  onApplyFilters,
}: FilterModalProps) {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Sync local state with parent state when props change
  useEffect(() => {
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

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
  const darkBrown = "#5a4a3a";

  const formatDate = (date: Date | null) => {
    if (!date) return "Not set";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleApply = () => {
    onApplyFilters(startDate, endDate);
    onClose();
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowStartPicker(false);
    }
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowEndPicker(false);
    }
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const confirmStartDate = () => {
    setShowStartPicker(false);
  };

  const confirmEndDate = () => {
    setShowEndPicker(false);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={[styles.modalContainer, { backgroundColor }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClear}>
              <Text style={[styles.clearButton, { color: secondaryTextColor }]}>
                Clear
              </Text>
            </TouchableOpacity>
            <View style={styles.headerSpacer} />
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={18} color={textColor} />
            </TouchableOpacity>
          </View>

          {/* Date Filters */}
          <View style={styles.content}>
            {/* Start Date */}
            <View style={styles.filterSection}>
              <Text style={[styles.label, { color: textColor }]}>Start Date</Text>
              <TouchableOpacity
                style={[styles.dateButton, { borderColor }]}
                onPress={() => setShowStartPicker(!showStartPicker)}
              >
                <Text style={[styles.dateText, { color: textColor }]}>
                  {formatDate(startDate)}
                </Text>
                <IconSymbol name="calendar" size={18} color={secondaryTextColor} />
              </TouchableOpacity>

              {/* Start Date Picker */}
              {showStartPicker && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleStartDateChange}
                  />
                  <TouchableOpacity
                    style={[styles.confirmButton, { backgroundColor: darkBrown }]}
                    onPress={confirmStartDate}
                  >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* End Date */}
            <View style={styles.filterSection}>
              <Text style={[styles.label, { color: textColor }]}>End Date</Text>
              <TouchableOpacity
                style={[styles.dateButton, { borderColor }]}
                onPress={() => setShowEndPicker(!showEndPicker)}
              >
                <Text style={[styles.dateText, { color: textColor }]}>
                  {formatDate(endDate)}
                </Text>
                <IconSymbol name="calendar" size={18} color={secondaryTextColor} />
              </TouchableOpacity>

              {/* End Date Picker */}
              {showEndPicker && (
                <View style={styles.pickerContainer}>
                  <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display="spinner"
                    onChange={handleEndDateChange}
                  />
                  <TouchableOpacity
                    style={[styles.confirmButton, { backgroundColor: darkBrown }]}
                    onPress={confirmEndDate}
                  >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Apply Button */}
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: darkBrown }]}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
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
  confirmButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
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
