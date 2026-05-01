import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AreasProvider } from '@/contexts/AreasContext';
import { CompletionsProvider } from '@/contexts/CompletionsContext';
import { FocusedAreasProvider } from '@/contexts/FocusedAreasContext';
import { initializeDatabase, seedDefaultAreas } from '@/db/schema';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Initialize database and seed default areas on app startup
    try {
      console.log('Initializing database...');
      initializeDatabase();
      console.log('Database initialized');

      console.log('Seeding default areas...');
      seedDefaultAreas();
      console.log('Default areas seeded');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AreasProvider>
        <CompletionsProvider>
          <FocusedAreasProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="crumb-details/[id]"
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar style="auto" />
          </FocusedAreasProvider>
        </CompletionsProvider>
      </AreasProvider>
    </ThemeProvider>
  );
}
