import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { SearchBar } from '@/screens/search/SearchBar';
import { DayList } from '@/screens/search/DayList';

export default function SearchScreen() {
  const backgroundColor = useThemeColor({ light: '#f4ead5', dark: '#2a2520' }, 'background');

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const handleRandomPress = () => {
    console.log('Random pressed');
  };

  // Mock data for demonstration
  const mockDayGroups = [
    {
      date: new Date(2026, 3, 14), // April 14th
      crumbs: [
        { id: '1', text: 'had a great morning workout', timestamp: new Date() },
        { id: '2', text: 'finally finished that book i\'ve been reading', timestamp: new Date() },
        { id: '3', text: 'cooked a new recipe for dinner', timestamp: new Date() },
      ],
    },
    {
      date: new Date(2026, 3, 13), // April 13th
      crumbs: [
        { id: '4', text: 'productive day at work', timestamp: new Date() },
        { id: '5', text: 'went for a walk in the park', timestamp: new Date() },
      ],
    },
    {
      date: new Date(2026, 3, 12), // April 12th
      crumbs: [
        { id: '6', text: 'meditated for 20 minutes', timestamp: new Date() },
        { id: '7', text: 'called an old friend', timestamp: new Date() },
        { id: '8', text: 'organized my workspace', timestamp: new Date() },
      ],
    },
  ];

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top']}>
        <SearchBar onFilterPress={handleFilterPress} onRandomPress={handleRandomPress} />
        <DayList dayGroups={mockDayGroups} />
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
