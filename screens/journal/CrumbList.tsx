import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export interface Crumb {
  id: string;
  text: string;
  timestamp: Date;
}

interface CrumbListProps {
  crumbs: Crumb[];
}

export function CrumbList({ crumbs }: CrumbListProps) {
  const bubbleColor = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  const timestampColor = useThemeColor({ light: '#8e8e93', dark: '#8e8e93' }, 'text');
  const borderColor = useThemeColor({ light: '#d4a574', dark: '#5a4a3a' }, 'background');

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes}${ampm}`;
  };

  const renderCrumb = ({ item }: { item: Crumb }) => (
    <View style={styles.crumbContainer}>
      <View style={[styles.bubble, { backgroundColor: bubbleColor, borderColor }]}>
        <Text style={[styles.crumbText, { color: textColor }]}>{item.text}</Text>
      </View>
    </View>
  );

  if (crumbs.length === 0) {
    return null;
  }

  return (
    <FlatList
      data={crumbs}
      renderItem={renderCrumb}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  crumbContainer: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    width: '100%',
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
