/**
 * Maps a color index (1-6) from the database to its corresponding hex color value.
 * These colors match the warm rainbow palette used in the pie chart.
 *
 * @param colorIndex - A number from 1 to 6 representing the color
 * @returns The hex color string
 */
export function colorIndexToHex(colorIndex: number): string {
  const colorMap: Record<number, string> = {
    1: "#FF9B9B", // warm pink/red
    2: "#FFBD7A", // warm orange
    3: "#FFD97A", // warm yellow
    4: "#B8C9A3", // warm sage green
    5: "#B5ACD4", // warm periwinkle/dusty mauve
    6: "#D4A5D4", // warm purple/lavender
  };

  return colorMap[colorIndex] || colorMap[1]; // Default to first color if invalid index
}
