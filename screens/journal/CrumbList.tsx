import { IconSymbol } from "@/components/ui/icon-symbol";
import { useAreas } from "@/contexts/AreasContext";
import { Crumb } from "@/db/crumbs";
import { useThemeColor } from "@/hooks/use-theme-color";
import { colorIndexToHex } from "@/utils/colorIndexToHex";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CrumbListProps {
  crumbs: Crumb[];
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const MAX_BUBBLE_WIDTH_PERCENT = 0.85;
const HORIZONTAL_PADDING = 24;

function CrumbBubble({
  crumb,
  bubbleColor,
  textColor,
  areas,
}: {
  crumb: Crumb;
  bubbleColor: string;
  textColor: string;
  areas: any[];
}) {
  const router = useRouter();
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
  const bubblePadding = 14;
  const maxWidth =
    (SCREEN_WIDTH - HORIZONTAL_PADDING * 2) * MAX_BUBBLE_WIDTH_PERCENT;

  // Reset width when content changes
  useEffect(() => {
    setMeasuredWidth(null);
  }, [crumb.content]);

  // Determine which icon to display and its color
  const getIconInfo = () => {
    if (crumb.areaId) {
      const area = areas.find((a) => a.id === crumb.areaId);
      if (area) {
        return {
          icon: area.icon,
          color: colorIndexToHex(area.color),
        };
      }
    } else if (crumb.icon) {
      return {
        icon: crumb.icon,
        color: "#8e8e93", // Gray for generic icons
      };
    }
    return null;
  };

  const iconInfo = getIconInfo();
  const hasIcon = iconInfo !== null;

  return (
    <View style={styles.crumbContainer}>
      <TouchableOpacity
        onPress={() => router.push(`/crumb-details/${crumb.id}`)}
        activeOpacity={0.7}
        style={[
          styles.bubble,
          {
            backgroundColor: bubbleColor,
            width: measuredWidth || undefined,
            maxWidth: maxWidth,
            paddingHorizontal: bubblePadding,
          },
        ]}
      >
        {/* Icon tag (if exists) */}
        {hasIcon && iconInfo && (
          <View style={[styles.iconTag, { backgroundColor: iconInfo.color }]}>
            <IconSymbol name={iconInfo.icon} size={14} color="#ffffff" />
          </View>
        )}

        <Text
          style={[styles.crumbText, { color: textColor }]}
          onTextLayout={(e) => {
            if (measuredWidth === null && e.nativeEvent.lines.length > 0) {
              const lineWidths = e.nativeEvent.lines.map((l) => l.width);
              const widestLine = Math.max(...lineWidths);
              setMeasuredWidth(Math.ceil(widestLine) + bubblePadding * 2);
            }
          }}
        >
          {crumb.content}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function CrumbList({ crumbs }: CrumbListProps) {
  const { areas } = useAreas();
  const bubbleColor = useThemeColor(
    { light: "#faf6f0", dark: "#2c2c2e" },
    "background",
  );
  const textColor = useThemeColor(
    { light: "#3d2f2a", dark: "#ffffff" },
    "text",
  );

  const renderCrumb = ({ item }: { item: Crumb }) => (
    <CrumbBubble
      key={item.id}
      crumb={item}
      bubbleColor={bubbleColor}
      textColor={textColor}
      areas={areas}
    />
  );

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <View style={styles.listContainer}>
      {[...crumbs].reverse().map((item) => renderCrumb({ item }))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 0,
    paddingTop: 0,
    // paddingBottom: 8,
  },
  crumbContainer: {
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  bubble: {
    position: "relative",
    paddingVertical: 10,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconTag: {
    position: "absolute",
    left: -6, // Negative value to hang off the edge
    top: -6, // Negative value to position at top edge
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  crumbText: {
    fontSize: 16,
    lineHeight: 20,
  },
});
