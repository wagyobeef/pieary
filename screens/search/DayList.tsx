import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DaySection } from './DaySection';
import { Crumb } from '@/db/crumbs';

interface DayGroup {
  date: Date;
  crumbs: Crumb[];
}

interface DayListProps {
  dayGroups: DayGroup[];
  onFavoriteToggle?: () => void;
}

export function DayList({ dayGroups, onFavoriteToggle }: DayListProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {dayGroups.map((dayGroup, index) => (
        <DaySection
          key={`${dayGroup.date.toISOString()}-${index}`}
          date={dayGroup.date}
          crumbs={dayGroup.crumbs}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});
