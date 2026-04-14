import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface Crumb {
  id: string;
  text: string;
  timestamp: Date;
}

interface DaySectionProps {
  date: Date;
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
    <View style={styles.crumbWrapper}>
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

export function DaySection({ date, crumbs }: DaySectionProps) {
  const bubbleColor = useThemeColor({ light: '#faf6f0', dark: '#2c2c2e' }, 'background');
  const crumbTextColor = useThemeColor({ light: '#3d2f2a', dark: '#ffffff' }, 'text');
  const grayTextColor = useThemeColor({ light: '#8e8e93', dark: '#8e8e93' }, 'text');

  const formatDate = (date: Date) => {
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();

    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${month} ${day}${getOrdinalSuffix(day)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.dateText, { color: grayTextColor }]}>
        {formatDate(date)}
      </Text>
      <View style={styles.crumbsContainer}>
        {crumbs.map((crumb) => (
          <CrumbBubble
            key={crumb.id}
            text={crumb.text}
            bubbleColor={bubbleColor}
            textColor={crumbTextColor}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  crumbsContainer: {
    gap: 8,
  },
  crumbWrapper: {
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
