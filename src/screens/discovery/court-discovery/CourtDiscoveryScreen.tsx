/**
 * Court Discovery Screen - Find and book pickleball courts
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, FlatList, Pressable, Text, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { MOCK_COURTS } from '@data/mockData';
import { CourtsStackParamList } from '../../../navigation/types';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createStyles } from './court-discovery-styles';
import { CourtCard, MapPlaceholder, EmptyState } from './court-discovery-components';
import { SkeletonList } from '../../../components/SkeletonLoaders';

type CourtDiscoveryNavigationProp = StackNavigationProp<CourtsStackParamList, 'CourtDiscovery'>;

export const CourtDiscoveryScreen = () => {
  const navigation = useNavigation<CourtDiscoveryNavigationProp>();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [query, setQuery] = useState('');
  const [courts, setCourts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setCourts(MOCK_COURTS);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Memoize filtered list - avoids re-running filter on every render
  const filteredCourts = useMemo(
    () =>
      courts.filter(
        (court) =>
          court.name.toLowerCase().includes(query.toLowerCase()) ||
          (court.address && court.address.toLowerCase().includes(query.toLowerCase()))
      ),
    [courts, query]
  );

  const handleBook = useCallback(
    (courtId: string) => {
      navigation.navigate('CourtBooking', { courtId });
    },
    [navigation]
  );

  const handleCourtPress = useCallback(
    (courtId: string) => {
      navigation.navigate('CourtDetail', { courtId });
    },
    [navigation]
  );

  // Stable renderItem - prevents CourtCard memo from being defeated by inline arrows
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <CourtCard
        court={item}
        onPress={() => handleCourtPress(item.id)}
        onBook={() => handleBook(item.id)}
      />
    ),
    [handleCourtPress, handleBook]
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.screenTitle}>Tìm Sân</Text>

      <View style={styles.toggleContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.toggleButton,
            viewMode === 'list' && styles.toggleButtonActive,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => setViewMode('list')}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
            Danh sách
          </Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.toggleButton,
            viewMode === 'map' && styles.toggleButtonActive,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => setViewMode('map')}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
            Bản đồ
          </Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons
            name="search"
            size={20}
            color={colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm sân..."
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <Pressable
          style={({ pressed }) => [styles.filterButton, pressed && { opacity: 0.7 }]}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {renderHeader()}

        <View style={styles.contentContainer}>
          {isLoading ? (
            <SkeletonList type="court" count={5} />
          ) : viewMode === 'list' ? (
            <FlatList
              data={filteredCourts}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={<EmptyState />}
            />
          ) : (
            <MapPlaceholder />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CourtDiscoveryScreen;
