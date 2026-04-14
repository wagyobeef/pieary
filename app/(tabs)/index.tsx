import { StyleSheet, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { JournalInput } from '@/screens/journal/JournalInput';
import { DateBar } from '@/screens/journal/DateBar';
import { PieChecker } from '@/screens/journal/PieChecker';
import { CrumbList, type Crumb } from '@/screens/journal/CrumbList';
import { CrumbImage } from '@/screens/journal/CrumbImage';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {
  const backgroundColor = useThemeColor({ light: '#f4ead5', dark: '#2a2520' }, 'background');
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);

  const handleAddCrumb = (text: string) => {
    const newCrumb: Crumb = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
    };
    setCrumbs([...crumbs, newCrumb]);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={['top']}>
        <DateBar />
      </SafeAreaView>
      <ScrollView
        style={{ backgroundColor }}
        contentContainerStyle={styles.scrollContent}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ThemedView style={[styles.content, { backgroundColor }]}>
            <PieChecker />
            <CrumbList crumbs={crumbs} />
            {crumbs.length > 0 && <CrumbImage />}
          </ThemedView>
        </TouchableWithoutFeedback>
      </ScrollView>
      <JournalInput onSubmit={handleAddCrumb} />
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
