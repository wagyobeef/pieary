import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DaySection } from './DaySection';

interface Crumb {
  id: string;
  text: string;
  timestamp: Date;
}

interface DayGroup {
  date: Date;
  crumbs: Crumb[];
}

interface DayListProps {
  dayGroups: DayGroup[];
}

export function DayList({ dayGroups }: DayListProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {dayGroups.map((dayGroup, index) => (
        <DaySection
          key={`${dayGroup.date.toISOString()}-${index}`}
          date={dayGroup.date}
          crumbs={dayGroup.crumbs}
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
