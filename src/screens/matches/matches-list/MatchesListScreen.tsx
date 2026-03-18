/**
 * MatchesListScreen - Tinder Style
 *
 * Tinder-inspired messaging UI with new matches horizontal strip
 * and clean conversation list with unread indicators
 */

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, Pressable, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { EmptyState } from '../../../components/EmptyState';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { MOCK_MATCHES, Match } from '@data/mockData';
import { createStyles } from './matches-list-styles';
import { NewMatchItem, ConversationItem } from './matches-list-items';
import { SkeletonList } from '../../../components/SkeletonLoaders';

export const MatchesListScreen = () => {
  const navigation = useNavigation<any>();
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const newMatches = useMemo(() => MOCK_MATCHES.filter((m) => !m.last_message), []);
  const conversations = useMemo(() => MOCK_MATCHES.filter((m) => m.last_message), []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handleMatchPress = useCallback(
    (match: Match) => {
      navigation.navigate('ChatScreen', { matchId: match.id, userId: match.matched_user_id });
    },
    [navigation]
  );

  const renderNewMatchItem = useCallback(
    ({ item, index }: { item: Match; index: number }) => (
      <NewMatchItem match={item} index={index} onPress={() => handleMatchPress(item)} />
    ),
    [handleMatchPress]
  );

  const renderConversationItem = useCallback(
    ({ item, index }: { item: Match; index: number }) => (
      <ConversationItem match={item} index={index} onPress={() => handleMatchPress(item)} />
    ),
    [handleMatchPress]
  );

  const renderHeader = useCallback(
    () => (
      <>
        {/* New Matches horizontal strip */}
        {newMatches.length > 0 && (
          <View style={styles.newMatchesSection}>
            <Text style={styles.sectionTitle}>New Matches</Text>
            <FlatList
              horizontal
              data={newMatches}
              keyExtractor={(item) => item.id}
              renderItem={renderNewMatchItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.newMatchesList}
            />
          </View>
        )}

        {/* Messages section label */}
        <View style={styles.messagesHeader}>
          <Text style={styles.messagesTitle}>Messages</Text>
        </View>
      </>
    ),
    [newMatches, renderNewMatchItem]
  );

  if (MOCK_MATCHES.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Messages</Text>
          </View>
          <EmptyState
            title="No Messages Yet"
            message="Match with players to start chatting!"
            actionLabel="Find Players"
            onAction={() => navigation.navigate('HomeTab')}
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header - Tinder style */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <Pressable
            style={({ pressed }) => [styles.headerButton, pressed && { opacity: 0.7 }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="search" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        {isLoading ? (
          <SkeletonList type="match" count={6} />
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id}
            renderItem={renderConversationItem}
            ListHeaderComponent={renderHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default MatchesListScreen;
