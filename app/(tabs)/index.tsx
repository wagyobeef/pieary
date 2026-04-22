import { StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { JournalInput } from '@/screens/journal/JournalInput';
import { DateBar } from '@/screens/journal/DateBar';
import { PieChecker } from '@/screens/journal/PieChecker';
import { CrumbList } from '@/screens/journal/CrumbList';
import { CrumbImage } from '@/screens/journal/CrumbImage';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getCrumbsByDate, Crumb } from '@/db/crumbs';

export default function HomeScreen() {
  const backgroundColor = useThemeColor({ light: '#f4ead5', dark: '#2a2520' }, 'background');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);

  const loadCrumbs = () => {
    const dateString = selectedDate.toISOString().split('T')[0];
    const fetchedCrumbs = getCrumbsByDate(dateString);
    setCrumbs(fetchedCrumbs);
  };

  useEffect(() => {
    loadCrumbs();
  }, [selectedDate]);

  const handleCrumbSubmit = () => {
    // Reload crumbs after a new one is submitted
    loadCrumbs();
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top']}>
        <DateBar selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </SafeAreaView>
      <ScrollView
        style={{ backgroundColor }}
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ThemedView style={[styles.content, { backgroundColor }]}>
            <PieChecker selectedDate={selectedDate} />
            <CrumbList crumbs={crumbs} />
            {crumbs.length > 0 && <CrumbImage />}
          </ThemedView>
        </TouchableWithoutFeedback>
      </ScrollView>
      <JournalInput selectedDate={selectedDate} onSubmit={handleCrumbSubmit} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
});
