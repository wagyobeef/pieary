import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface Crumb {
  id: string;
  text: string;
  timestamp: Date;
}

interface CrumbListProps {
  crumbs: Crumb[];
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const MAX_BUBBLE_WIDTH_PERCENT = 0.85;
const HORIZONTAL_PADDING = 24;

function CrumbBubble({ text, bubbleColor, textColor }: { text: string; bubbleColor: string; textColor: string }) {
  const [measuredWidth, setMeasuredWidth] = useState<number | null>(null);
  const bubblePadding = 14;
  const maxWidth = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2) * MAX_BUBBLE_WIDTH_PERCENT;

  return (
    <View style={styles.crumbContainer}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: bubbleColor,
            width: measuredWidth || undefined,
            maxWidth: maxWidth,
          }
        ]}
      >
        <Text
          style={[styles.crumbText, { color: textColor }]}
          onTextLayout={(e) => {
            if (measuredWidth === null && e.nativeEvent.lines.length > 0) {
              const lineWidths = e.nativeEvent.lines.map(l => l.width);
              const widestLine = Math.max(...lineWidths);
              setMeasuredWidth(Math.ceil(widestLine) + bubblePadding * 2);
            }
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}

export function CrumbList({ crumbs }: CrumbListProps) {
  const bubbleColor = useThemeColor({ light: '#faf6f0', dark: '#2c2c2e' }, 'background');
  const textColor = useThemeColor({ light: '#3d2f2a', dark: '#ffffff' }, 'text');

  const renderCrumb = ({ item }: { item: Crumb }) => (
    <CrumbBubble key={item.id} text={item.text} bubbleColor={bubbleColor} textColor={textColor} />
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
    paddingBottom: 8,
  },
  crumbContainer: {
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  crumbText: {
    fontSize: 16,
    lineHeight: 20,
  },
});
