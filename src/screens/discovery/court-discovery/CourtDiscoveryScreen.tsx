/**
 * Court Discovery Screen - Find and book pickleball courts
 */

import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { MOCK_COURTS } from '@data/mockData';
import { CourtsStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/tokens';
import { styles } from './court-discovery-styles';
import { CourtCard, MapPlaceholder, EmptyState } from './court-discovery-components';

type CourtDiscoveryNavigationProp = StackNavigationProp<CourtsStackParamList, 'CourtDiscovery'>;

export const CourtDiscoveryScreen = () => {
  const navigation = useNavigation<CourtDiscoveryNavigationProp>();
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

  const filteredCourts = courts.filter(
    (court) =>
      court.name.toLowerCase().includes(query.toLowerCase()) ||
      (court.address && court.address.toLowerCase().includes(query.toLowerCase()))
  );

  const handleBook = (courtId: string) => {
    navigation.navigate('CourtBooking', { courtId });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.screenTitle}>Tìm Sân</Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
            Danh sách
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
            Bản đồ
          </Text>
        </TouchableOpacity>
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
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {renderHeader()}

        <View style={styles.contentContainer}>
          {viewMode === 'list' ? (
            <FlatList
              data={filteredCourts}
              renderItem={({ item }) => (
                <CourtCard
                  court={item}
                  onPress={() => navigation.navigate('CourtDetail', { courtId: item.id })}
                  onBook={() => handleBook(item.id)}
                />
              )}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={!isLoading ? <EmptyState /> : null}
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
