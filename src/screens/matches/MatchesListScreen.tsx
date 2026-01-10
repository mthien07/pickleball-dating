/**
 * MatchesListScreen
 *
 * Displays new matches and conversations
 * Features horizontal scroll for new matches and vertical list for chats
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { Avatar } from '../../components/Avatar';
import { MatchCard } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { colors, spacing, typography, borderRadius } from '../../theme/tokens';
import { MOCK_MATCHES, Match } from '@data/mockData';

// ============================================
// NEW MATCHES SECTION
// ============================================

interface NewMatchItemProps {
  match: Match;
  index: number;
  onPress: () => void;
}

const NewMatchItem: React.FC<NewMatchItemProps> = ({ match, index, onPress }) => (
  <Animated.View entering={FadeInRight.delay(index * 100).duration(300)}>
    <TouchableOpacity style={styles.newMatchItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.newMatchAvatarContainer}>
        <Avatar
          size="lg"
          imageUrl={match.matched_user.avatar_urls[0]}
          name={match.matched_user.display_name}
          isOnline={match.matched_user.is_online}
          showBorder
          borderColor={colors.primary}
        />
        {match.is_new && <View style={styles.newBadge} />}
      </View>
      <Text style={styles.newMatchName} numberOfLines={1}>
        {match.matched_user.display_name.split(' ')[0]}
      </Text>
    </TouchableOpacity>
  </Animated.View>
);

// ============================================
// SCREEN COMPONENT
// ============================================

export const MatchesListScreen = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);

  // Filter new matches (no messages yet)
  const newMatches = MOCK_MATCHES.filter((m) => !m.last_message);
  const conversations = MOCK_MATCHES.filter((m) => m.last_message);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleMatchPress = (match: Match) => {
    navigation.navigate('ChatScreen', { matchId: match.id, userId: match.matched_user_id });
  };

  const renderConversation = ({ item, index }: { item: Match; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
      <MatchCard match={item} onPress={() => handleMatchPress(item)} />
    </Animated.View>
  );

  const renderHeader = () => (
    <>
      {/* New Matches Section */}
      {newMatches.length > 0 && (
        <View style={styles.newMatchesSection}>
          <Text style={styles.sectionTitle}>New Matches</Text>
          <FlatList
            horizontal
            data={newMatches}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <NewMatchItem match={item} index={index} onPress={() => handleMatchPress(item)} />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newMatchesList}
          />
        </View>
      )}

      {/* Messages Section Title */}
      {conversations.length > 0 && (
        <Text style={[styles.sectionTitle, styles.messagesTitle]}>Messages</Text>
      )}
    </>
  );

  if (MOCK_MATCHES.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Matches</Text>
          </View>
          <EmptyState
            title="No Matches Yet"
            message="Keep swiping to find your perfect pickleball partner!"
            icon="🎾"
            actionLabel="Start Swiping"
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Matches</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Conversations List */}
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
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
      </SafeAreaView>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  searchButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // New Matches
  newMatchesSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  newMatchesList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  newMatchItem: {
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  newMatchAvatarContainer: {
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.background,
  },
  newMatchName: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    maxWidth: 80,
    textAlign: 'center',
  },

  // Messages
  messagesTitle: {
    marginTop: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing['2xl'],
  },
});

export default MatchesListScreen;
