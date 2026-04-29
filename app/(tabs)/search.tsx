import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { SearchBar } from '@/screens/search/SearchBar';
import { DayList } from '@/screens/search/DayList';
import { FilterModal } from '@/screens/search/FilterModal';
import { getCrumbs, Crumb } from '@/db/crumbs';

const FILTER_STORAGE_KEY = '@search_filters';

export default function SearchScreen() {
  const backgroundColor = useThemeColor({ light: '#f4ead5', dark: '#2a2520' }, 'background');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [allCrumbs, setAllCrumbs] = useState<Crumb[]>([]);

  // Load filters from storage on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const savedFilters = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
        if (savedFilters) {
          const { startDate: savedStartDate, endDate: savedEndDate } = JSON.parse(savedFilters);
          if (savedStartDate) setStartDate(new Date(savedStartDate));
          if (savedEndDate) setEndDate(new Date(savedEndDate));
        }
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };

    loadFilters();
  }, []);

  const loadCrumbs = useCallback(() => {
    const crumbs = getCrumbs();
    setAllCrumbs(crumbs);
  }, []);

  // Load crumbs on mount
  useEffect(() => {
    loadCrumbs();
  }, [loadCrumbs]);

  // Reload crumbs when screen gains focus (e.g., after deleting a crumb)
  useFocusEffect(
    useCallback(() => {
      loadCrumbs();
    }, [loadCrumbs])
  );

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleRandomPress = () => {
    console.log('Random pressed');
  };

  const handleApplyFilters = async (newStartDate: Date | null, newEndDate: Date | null) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);

    // Save filters to storage
    try {
      const filters = {
        startDate: newStartDate?.toISOString() || null,
        endDate: newEndDate?.toISOString() || null,
      };
      await AsyncStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  };

  // Filter crumbs based on date range
  const filteredCrumbs = useMemo(() => {
    if (!startDate && !endDate) {
      return allCrumbs;
    }

    return allCrumbs.filter((crumb) => {
      const crumbDate = new Date(crumb.createdAt);

      // Set to start of day for comparison
      const crumbDayStart = new Date(crumbDate.getFullYear(), crumbDate.getMonth(), crumbDate.getDate());

      if (startDate && endDate) {
        const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        return crumbDayStart >= start && crumbDayStart <= end;
      } else if (startDate) {
        const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        return crumbDayStart >= start;
      } else if (endDate) {
        const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        return crumbDayStart <= end;
      }

      return true;
    });
  }, [allCrumbs, startDate, endDate]);

  // Group crumbs by date
  const dayGroups = useMemo(() => {
    const groups: { [key: string]: Crumb[] } = {};

    filteredCrumbs.forEach((crumb) => {
      const date = new Date(crumb.createdAt);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(crumb);
    });

    // Convert to array format expected by DayList
    return Object.entries(groups)
      .map(([dateKey, crumbs]) => {
        const firstCrumb = crumbs[0];
        const date = new Date(firstCrumb.createdAt);
        return {
          date,
          crumbs, // Pass full Crumb objects
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [filteredCrumbs]);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top']}>
        <SearchBar onFilterPress={handleFilterPress} onRandomPress={handleRandomPress} />
        <DayList dayGroups={dayGroups} />

        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          startDate={startDate}
          endDate={endDate}
          onApplyFilters={handleApplyFilters}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
