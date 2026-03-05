import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../../theme/tokens';
import { MOCK_COACHES, Coach } from '@data/mockData';
import { showInfo } from '../../../services/toast';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { styles } from './coach-directory-styles';
import { CoachCard, EmptyState } from './coach-directory-components';

export const CoachDirectoryScreen = () => {
  const navigation = useNavigation();
  const themeColors = useThemeColors();
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

  const filteredCoaches = coaches.filter(
    (coach) =>
      coach.display_name.toLowerCase().includes(query.toLowerCase()) ||
      coach.location.address.toLowerCase().includes(query.toLowerCase())
  );

  const handleBook = (coachId: string) => {
    showInfo('Booking flow starting...');
  };

  const renderHeader = () => (
    <View style={[styles.headerContainer, { backgroundColor: themeColors.background }]}>
      <View style={styles.titleRow}>
        <Text style={styles.screenTitle}>Find a Coach 🧢</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => showInfo('Filters coming soon')}
        >
          <Ionicons name="options-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or location..."
          placeholderTextColor={colors.textTertiary}
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

        <FlatList
          data={filteredCoaches}
          renderItem={({ item }) => (
            <CoachCard coach={item} onPress={() => {}} onBook={() => handleBook(item.id)} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!isLoading ? <EmptyState /> : null}
        />
      </SafeAreaView>
    </View>
  );
};

export default CoachDirectoryScreen;
