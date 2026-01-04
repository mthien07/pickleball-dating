/**
 * UI Kit Demo App
 *
 * Comprehensive demo of all UI components with improvements
 * Test all animations, interactions, and states
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Toast from 'react-native-toast-message';

// Components
import { Button, PrimaryButton, SecondaryButton } from './src/components/Button';
import { Input, SearchInput, PasswordInput } from './src/components/Input';
import { ProfileCard, CourtCard, MatchCard } from './src/components/Card';
import { Avatar } from './src/components/Avatar';
import { EmptyState } from './src/components/EmptyState';
import { SkeletonCourtCard, SkeletonProfileCard } from './src/components/SkeletonLoaders';
import { KeyboardView } from './src/components/KeyboardView';
import { ProgressBar } from './src/components/ProgressBar';
import { SwipeCard, SwipeCardRef } from './src/components/SwipeCard';
import { BottomSheet, BottomSheetRef } from './src/components/BottomSheet/BottomSheet';

// Services & Hooks
import { showSuccess, showError, showInfo, ToastMessages } from './src/services/toast';
import { toastConfig } from './src/config/toastConfig';
import { useAnimation } from './src/hooks/useAnimation';
import { useBottomSheet } from './src/hooks/useBottomSheet';

// Mock Data
import { MOCK_USERS, MOCK_COURTS, MOCK_MATCHES } from './data/mockData';

// Tokens
import { colors, spacing } from './src/theme/tokens';

export default function App() {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [password, setPassword] = useState('');
  const [showSkeletons, setShowSkeletons] = useState(false);
  const [progress, setProgress] = useState(65);

  // Refs
  const swipeCardRef = useRef<SwipeCardRef>(null);
  const { bottomSheetRef, open, close } = useBottomSheet();

  // Animation
  const { animatedStyle, scalePop, shake } = useAnimation({
    initialScale: 1,
    enableHaptic: true,
  });

  // Handlers
  const handleLike = () => {
    showSuccess('Liked!', 'Match Success');
    swipeCardRef.current?.swipe('right');
  };

  const handlePass = () => {
    showInfo('Passed', '');
    swipeCardRef.current?.swipe('left');
  };

  const handleError = () => {
    showError('Something went wrong!', 'Error');
    shake();
  };

  const toggleSkeletons = () => {
    setShowSkeletons(!showSkeletons);
  };

  const increaseProgress = () => {
    setProgress(Math.min(100, progress + 10));
  };

  const decreaseProgress = () => {
    setProgress(Math.max(0, progress - 10));
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <SafeAreaView style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.section}>
              <Text style={styles.title}>🎾 UI Kit Demo</Text>
              <Text style={styles.subtitle}>PickleBall Dating App Components</Text>
            </View>

            {/* Buttons */}
            <Section title="Buttons">
              <PrimaryButton
                title="Primary Button"
                onPress={() => {
                  scalePop();
                  showSuccess('Button pressed!');
                }}
                fullWidth
              />
              <SecondaryButton
                title="Secondary Button"
                onPress={() => showInfo('Secondary action')}
                fullWidth
              />
              <Button
                title="Loading Button"
                onPress={() => {}}
                loading={true}
                fullWidth
              />
              <Button
                title="Disabled Button"
                onPress={() => {}}
                disabled={true}
                fullWidth
              />
            </Section>

            {/* Inputs */}
            <Section title="Inputs">
              <SearchInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search courts..."
                clearable
              />
              <Input
                label="Email"
                type="email"
                value=""
                onChangeText={() => {}}
                placeholder="your@email.com"
                helperText="We'll never share your email"
              />
              <PasswordInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                error={password.length > 0 && password.length < 8 ? 'Min 8 characters' : ''}
              />
            </Section>

            {/* Avatars */}
            <Section title="Avatars">
              <View style={styles.row}>
                <Avatar
                  size="xs"
                  name="John Doe"
                  imageUrl={MOCK_USERS[0].avatar_urls[0]}
                />
                <Avatar
                  size="sm"
                  name="Jane Smith"
                  imageUrl={MOCK_USERS[1].avatar_urls[0]}
                  isOnline={true}
                />
                <Avatar
                  size="md"
                  name="Mike Chen"
                  imageUrl={MOCK_USERS[2].avatar_urls[0]}
                  isOnline={true}
                />
                <Avatar
                  size="lg"
                  name="Sarah Lee"
                  imageUrl={MOCK_USERS[3].avatar_urls[0]}
                />
                <Avatar
                  size="xl"
                  name="No Image"
                  isOnline={false}
                />
              </View>
            </Section>

            {/* Progress Bars */}
            <Section title="Progress Bars">
              <ProgressBar progress={progress} height={12} />
              <View style={styles.buttonRow}>
                <Button title="-10%" onPress={decreaseProgress} size="small" />
                <Button title="+10%" onPress={increaseProgress} size="small" />
              </View>
              {/* <Text style={styles.sectionSubtitle}>Skill Levels:</Text>
              <SkillProgress level="beginner" />
              <SkillProgress level="intermediate" />
              <SkillProgress level="advanced" />
              <SkillProgress level="pro" /> */}
            </Section>

            {/* Cards */}
            <Section title="Cards">
              {showSkeletons ? (
                <>
                  <SkeletonCourtCard />
                  <SkeletonProfileCard />
                </>
              ) : (
                <>
                  <CourtCard
                    court={MOCK_COURTS[0]}
                    onPress={() => Alert.alert('Court pressed')}
                    onBookPress={() => Alert.alert('Book pressed')}
                  />
                  <MatchCard
                    match={MOCK_MATCHES[0]}
                    onPress={() => Alert.alert('Match pressed')}
                  />
                </>
              )}
              <Button
                title={showSkeletons ? 'Show Cards' : 'Show Skeletons'}
                onPress={toggleSkeletons}
                variant="secondary"
                fullWidth
              />
            </Section>

            {/* Swipe Card */}
            <Section title="Swipe Card">
              <View style={styles.swipeContainer}>
                <SwipeCard
                  ref={swipeCardRef}
                  user={MOCK_USERS[0]}
                  onLike={() => showSuccess('Liked! 💚')}
                  onPass={() => showInfo('Passed')}
                  onSwipeComplete={() => console.log('Swipe complete')}
                />
              </View>
              <View style={styles.buttonRow}>
                <Button
                  title="👎 Pass"
                  onPress={handlePass}
                  variant="secondary"
                />
                <Button
                  title="💚 Like"
                  onPress={handleLike}
                  variant="primary"
                />
              </View>
            </Section>

            {/* Empty States */}
            <Section title="Empty States">
              <EmptyState
                title="No Courts Found"
                message="We couldn't find any courts in your area"
                icon="🎾"
                actionLabel="Retry"
                onAction={() => showInfo('Retrying...')}
              />
            </Section>

            {/* Toast Notifications */}
            <Section title="Toast Notifications">
              <Button
                title="Success Toast"
                onPress={() => ToastMessages.bookingSuccess()}
                variant="primary"
                fullWidth
              />
              <Button
                title="Error Toast"
                onPress={handleError}
                variant="secondary"
                fullWidth
              />
              <Button
                title="Info Toast"
                onPress={() => showInfo('This is an info message', 'Info')}
                variant="text"
                fullWidth
              />
            </Section>

            {/* Bottom Sheet */}
            <Section title="Bottom Sheet">
              <Button
                title="Open Bottom Sheet"
                onPress={open}
                fullWidth
              />
            </Section>

            {/* Spacer */}
            <View style={{ height: 50 }} />
          </ScrollView>

          {/* Bottom Sheet */}
          <BottomSheet
            ref={bottomSheetRef}
            snapPoints={['40%', '80%']}
            enablePanDownToClose
          >
            <View style={styles.bottomSheetContent}>
              <Text style={styles.bottomSheetTitle}>Filter Courts</Text>
              <Input
                label="Max Distance (km)"
                value=""
                onChangeText={() => {}}
                placeholder="10"
                type="number"
              />
              <Button
                title="Apply Filters"
                onPress={() => {
                  close();
                  showSuccess('Filters applied!');
                }}
                fullWidth
              />
            </View>
          </BottomSheet>

          {/* Toast */}
          <Toast config={toastConfig} />
          </SafeAreaView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

// Section Component
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between',
  },
  swipeContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  bottomSheetContent: {
    padding: spacing.md,
    gap: spacing.md,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});
