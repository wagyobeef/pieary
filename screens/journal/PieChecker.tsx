import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { G, Path } from "react-native-svg";

export function PieChecker() {
  const crustColor = useThemeColor(
    { light: "#d4a574", dark: "#5a4a3a" },
    "background",
  );
  const dividerColor = useThemeColor(
    { light: "#d4a574", dark: "#5a4a3a" },
    "background",
  );

  const pieSize = 240;
  const padding = 50;
  const size = pieSize + padding * 2;
  const center = size / 2;
  const radius = pieSize / 2;
  const sectors = 6;

  // Warm rainbow color palette for sectors
  const sectorColors = [
    "#FF9B9B", // warm pink/red
    "#FFBD7A", // warm orange
    "#FFD97A", // warm yellow
    "#B8C9A3", // warm sage green
    "#B5ACD4", // warm periwinkle/dusty mauve
    "#D4A5D4", // warm purple/lavender
  ];

  // Icons for each sector (placeholder icons for now)
  const sectorIcons = [
    "heart.fill",
    "fork.knife",
    "moon.stars.fill",
    "figure.walk",
    "book.fill",
    "brain.head.profile",
  ];

  // Track which sectors are checked (filled)
  const [checkedSectors, setCheckedSectors] = useState<boolean[]>(
    Array(sectors).fill(false),
  );

  const toggleSector = (index: number) => {
    const newCheckedSectors = [...checkedSectors];
    newCheckedSectors[index] = !newCheckedSectors[index];
    setCheckedSectors(newCheckedSectors);
  };

  // Generate wavy crust path with smooth inner edge
  const generateCrustPath = () => {
    const waves = 24; // Number of waves around the circle
    let outerPath = "";

    // Create outer wavy edge
    for (let i = 0; i < waves; i++) {
      const angle = (i / waves) * 2 * Math.PI;
      const nextAngle = ((i + 0.5) / waves) * 2 * Math.PI;

      // Outer point of wave
      const outerRadius = radius + 10;
      const x1 = center + outerRadius * Math.cos(angle);
      const y1 = center + outerRadius * Math.sin(angle);

      // Control point for curve
      const controlRadius = radius + 17;
      const cx = center + controlRadius * Math.cos(nextAngle);
      const cy = center + controlRadius * Math.sin(nextAngle);

      // Next outer point
      const nextOuterAngle = ((i + 1) / waves) * 2 * Math.PI;
      const x2 = center + outerRadius * Math.cos(nextOuterAngle);
      const y2 = center + outerRadius * Math.sin(nextOuterAngle);

      if (i === 0) {
        outerPath += `M ${x1.toFixed(2)} ${y1.toFixed(2)}`;
      }
      outerPath += ` Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`;
    }

    // Create smooth inner circle (counterclockwise to create a donut)
    const innerCircle = `
      M ${center + radius} ${center}
      A ${radius} ${radius} 0 1 0 ${center - radius} ${center}
      A ${radius} ${radius} 0 1 0 ${center + radius} ${center}
      Z
    `;

    return outerPath + " Z " + innerCircle;
  };

  const generateSectorPath = (index: number) => {
    const startAngle = (index / sectors) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((index + 1) / sectors) * 2 * Math.PI - Math.PI / 2;

    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);

    const largeArcFlag = 0; // Always 0 for equal sectors of 6

    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const getIconPosition = (index: number) => {
    const angle = ((index + 0.5) / sectors) * 2 * Math.PI - Math.PI / 2;
    const iconRadius = radius * 0.65; // Position icons 65% from center
    const iconSize = 24;
    // Calculate position in the SVG coordinate system, then account for container centering
    const x = iconRadius * Math.cos(angle) - iconSize / 2;
    const y = iconRadius * Math.sin(angle) - iconSize / 2;
    return { x, y };
  };

  return (
    <View style={styles.container}>
      <View style={styles.pieWrapper}>
        <Svg width={size} height={size}>
          {/* Wavy crust border */}
          <Path d={generateCrustPath()} fill={crustColor} fillRule="evenodd" />
          {/* Colored sectors */}
          {Array.from({ length: sectors }).map((_, i) => (
            <G key={i}>
              <Path
                d={generateSectorPath(i)}
                fill={sectorColors[i]}
                opacity={checkedSectors[i] ? 1 : 0.25}
                onPress={() => toggleSector(i)}
              />
            </G>
          ))}
        </Svg>
        {/* Icons overlay */}
        {Array.from({ length: sectors }).map((_, i) => {
          const pos = getIconPosition(i);
          return (
            <View
              key={`icon-${i}`}
              style={[
                styles.iconContainer,
                {
                  left: size / 2 + pos.x,
                  top: size / 2 + pos.y,
                },
              ]}
              pointerEvents="none"
            >
              <IconSymbol name={sectorIcons[i]} size={24} color="#ffffff" />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginVertical: -12,
  },
  pieWrapper: {
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    width: 24,
    height: 24,
  },
});
