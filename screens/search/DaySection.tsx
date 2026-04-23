import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Crumb } from '@/components/Crumb';
import { Crumb as CrumbType } from '@/db/crumbs';

interface DaySectionProps {
  date: Date;
  crumbs: CrumbType[];
}

export function DaySection({ date, crumbs }: DaySectionProps) {
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
          <Crumb key={`crumb-${crumb.id}`} crumb={crumb} />
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
    marginBottom: 4,
    paddingHorizontal: 24,
  },
  crumbsContainer: {
    // Crumb component handles its own spacing
  },
});
