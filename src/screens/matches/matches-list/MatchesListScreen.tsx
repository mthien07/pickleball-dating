/**
 * MatchesListScreen - Instagram DM Style
 *
 * Clean messaging interface with stories-like horizontal scroll
 * and minimal conversation list design
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { EmptyState } from '../../../components/EmptyState';
import { colors } from '../../../theme/tokens';
import { MOCK_MATCHES, Match } from '@data/mockData';
import { styles } from './matches-list-styles';
import { StoryMatchItem, ConversationItem } from './matches-list-items';

export const MatchesListScreen = () => {
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Memoize derived lists - avoids re-filtering every render
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

  // Stable renderItem callbacks so memoized list items don't re-render
  const renderStoryItem = useCallback(
    ({ item, index }: { item: Match; index: number }) => (
      <StoryMatchItem match={item} index={index} onPress={() => handleMatchPress(item)} />
    ),
    [handleMatchPress]
  );

  const renderConversationItem = useCallback(
    ({ item, index }: { item: Match; index: number }) => (
      <ConversationItem match={item} index={index} onPress={() => handleMatchPress(item)} />
    ),
    [handleMatchPress]
  );

  // Stable ListHeaderComponent - avoids FlatList header remounting on every render
  const renderHeader = useCallback(
    () => (
      <>
        {/* Search Bar - Instagram style */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={16} color={colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm"
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Stories/New Matches Section */}
        {newMatches.length > 0 && (
          <View style={styles.storiesSection}>
            <FlatList
              horizontal
              data={newMatches}
              keyExtractor={(item) => item.id}
              renderItem={renderStoryItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.storiesList}
            />
          </View>
        )}

        {/* Tin Nhắn header */}
        <View style={styles.messagesHeader}>
          <Text style={styles.messagesTitle}>Tin nhắn</Text>
          <Text style={styles.requestsLink}>Yêu cầu</Text>
        </View>
      </>
    ),
    [searchQuery, newMatches, renderStoryItem]
  );

  if (MOCK_MATCHES.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Tin Nhắn</Text>
          </View>
          <EmptyState
            title="Chưa Có Tin Nhắn"
            message="Ghép đôi với người chơi để bắt đầu trò chuyện!"
            actionLabel="Tìm Người Chơi"
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
        {/* Header - Instagram style */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Tin Nhắn</Text>
            <Ionicons name="chevron-down" size={20} color={colors.textPrimary} />
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="videocam-outline" size={26} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="create-outline" size={26} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Conversations List */}
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
      </SafeAreaView>
    </View>
  );
};

export default MatchesListScreen;
