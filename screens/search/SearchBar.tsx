import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

interface SearchBarProps {
  onFilterPress: () => void;
  onRandomPress: () => void;
  filterText?: string;
}

export function SearchBar({ onFilterPress, onRandomPress, filterText = "all crumbs" }: SearchBarProps) {
  const backgroundColor = useThemeColor(
    { light: "#f4ead5", dark: "#2a2520" },
    "background",
  );
  const iconColor = useThemeColor(
    { light: "#5a4a3a", dark: "#d4a574" },
    "text",
  );
  const textColor = useThemeColor(
    { light: "#5a4a3a", dark: "#ffffff" },
    "text",
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onFilterPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <IconSymbol name="slider.horizontal.3" size={28} color={iconColor} />
      </TouchableOpacity>

      <View style={styles.middle}>
        <Text style={[styles.filterText, { color: textColor }]}>{filterText}</Text>
      </View>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={onRandomPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <IconSymbol name="die.face.5" size={28} color={iconColor} />
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
    paddingBottom: 12,
  },
  iconButton: {
    padding: 8,
  },
  middle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: {
    fontSize: 18,
    fontWeight: "600",
  },
});
