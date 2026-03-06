import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, Pressable, Text, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { MOCK_COACHES, Coach } from '@data/mockData';
import { showInfo } from '../../../services/toast';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createStyles } from './coach-directory-styles';
import { CoachCard, EmptyState } from './coach-directory-components';
import { SkeletonList } from '../../../components/SkeletonLoaders';

export const CoachDirectoryScreen = () => {
  const navigation = useNavigation();
  const themeColors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [query, setQuery] = useState('');
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setCoaches(MOCK_COACHES);
      setIsLoading(false);
    }, 500);
  }, []);

  // Memoize filtered list - avoids re-running filter on every render
  const filteredCoaches = useMemo(
    () =>
      coaches.filter(
        (coach) =>
          coach.display_name.toLowerCase().includes(query.toLowerCase()) ||
          coach.location.address.toLowerCase().includes(query.toLowerCase())
      ),
    [coaches, query]
  );

  const handleBook = useCallback((coachId: string) => {
    showInfo('Booking flow starting...');
  }, []);

  // Stable renderItem - prevents CoachCard memo from being defeated by inline arrows
  const renderItem = useCallback(
    ({ item }: { item: Coach }) => (
      <CoachCard coach={item} onPress={() => {}} onBook={() => handleBook(item.id)} />
    ),
    [handleBook]
  );

  const renderHeader = () => (
    <View style={[styles.headerContainer, { backgroundColor: themeColors.background }]}>
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>Find a Coach 🧢</Text>
        <Pressable
          style={({ pressed }) => [styles.filterButton, pressed && { opacity: 0.7 }]}
          onPress={() => showInfo('Filters coming soon')}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="options-outline" size={24} color={themeColors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={themeColors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or location..."
          placeholderTextColor={themeColors.textTertiary}
          value={query}
          onChangeText={setQuery}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {renderHeader()}

        {isLoading ? (
          <SkeletonList type="court" count={4} />
        ) : (
          <FlatList
            data={filteredCoaches}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState />}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default CoachDirectoryScreen;
