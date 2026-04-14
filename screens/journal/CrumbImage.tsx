import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export function CrumbImage() {
  const crumbColor = useThemeColor(
    { light: "#d4a574", dark: "#5a4a3a" },
    "background",
  );

  return (
    <View style={styles.container}>
      <Svg width={100} height={40} viewBox="0 0 100 40">
        {/* First crumb - small, angular */}
        <Path
          d="M 8,18 L 12,12 L 18,10 L 22,12 L 24,16 L 22,20 L 16,22 L 10,20 Z"
          fill={crumbColor}
          opacity={0.8}
        />

        {/* Second crumb - larger, more irregular */}
        <Path
          d="M 32,24 L 36,18 L 42,16 L 48,17 L 54,20 L 56,26 L 54,32 L 48,34 L 40,33 L 34,28 Z"
          fill={crumbColor}
          opacity={0.9}
        />

        {/* Third crumb - medium, angular */}
        <Path
          d="M 66,20 L 70,15 L 76,14 L 82,16 L 84,20 L 82,25 L 76,27 L 70,25 Z"
          fill={crumbColor}
          opacity={0.85}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingBottom: 12,
  },
});
