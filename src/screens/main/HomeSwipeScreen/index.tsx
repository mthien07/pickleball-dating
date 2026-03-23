/**
 * HomeSwipeScreen
 *
 * Hinge-style editorial vertical feed.
 * Orchestrator: header + EditorialProfileFeed.
 */

import React from 'react';
import { View, Text, Pressable, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

import { EmptyState } from '../../../components/EmptyState';
import { showInfo } from '../../../services/toast';
import { useTheme, useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { useResponsive } from '../../../hooks/useResponsive';
import { webStyles } from '../../../theme/webStyles';
import { useDiscoveryProfiles } from '../../../hooks/use-discovery-profiles';
import { createStyles } from './styles';
import { EditorialProfileFeed } from './editorial-profile-feed';

export const HomeSwipeScreen = () => {
  const { isDark } = useTheme();
  const themeColors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  const { isDesktop, containerPadding } = useResponsive();

  const { currentProfile, hasMore, handleSwipe, reload } = useDiscoveryProfiles();

  if (!hasMore) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <SafeAreaView style={styles.safeArea}>
          <EmptyState
            title="Hết rồi!"
            message="Hết rồi! Quay lại sau nhé"
            icon={<Ionicons name="tennisball" size={48} color={themeColors.accent} />}
            actionLabel="Tải lại"
            onAction={reload}
          />
        </SafeAreaView>
      </View>
    );
  }

  const containerStyle = isDesktop
    ? [styles.container, webStyles.centeredContainer, { paddingHorizontal: containerPadding }]
    : styles.container;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.safeArea}>
        <View style={containerStyle}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>
                <Text style={styles.logoPrimary}>PICKLE</Text>
                <Text style={styles.logoAccent}>MATCH</Text>
              </Text>
            </View>
            <View style={styles.headerActions}>
              {/* Bug 10: removed non-functional filter/notifications buttons */}
              <Pressable
                style={({ pressed }) => [styles.profileButton, pressed && { opacity: 0.7 }]}
                onPress={() => showInfo('View profile')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <User size={24} color={themeColors.textPrimary} strokeWidth={2} />
              </Pressable>
            </View>
          </View>

          <EditorialProfileFeed
            profile={currentProfile}
            onPass={() => handleSwipe('pass')}
            onLike={() => handleSwipe('like')}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};
