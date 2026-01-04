import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { colors, spacing, typography } from './src/theme/tokens';
import Button from './src/components/Button';
import Input from './src/components/Input';
import Card from './src/components/Card'; // Default export object
import { ProfileCard, CourtCard, MatchCard } from './src/components/Card';
import Avatar from './src/components/Avatar'; // Default export object or named
import { Avatar as AvatarComponent } from './src/components/Avatar';
import EmptyState from './src/components/EmptyState';
import ProgressBar from './src/components/ProgressBar';
import LikeButton from './src/components/LikeButton';
import GlassView from './src/components/GlassView';
import { FadeIn, SlideIn, ZoomIn, StaggerContainer } from './src/components/Animations';
import { SkeletonList } from './src/components/SkeletonLoaders';

// Mock Data
import { MOCK_USERS, MOCK_COURTS, MOCK_MATCHES } from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'components' | 'animations'>('components');
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const toggleLoading = () => setLoading(!loading);

  if (activeTab === 'animations') {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Animations Demo</Text>
          <Button
            title="Switch to Components"
            variant="text"
            onPress={() => setActiveTab('components')}
          />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <StaggerContainer>
            <FadeIn style={styles.section}>
              <Text style={styles.sectionTitle}>Fade In</Text>
              <View style={styles.box} />
            </FadeIn>

            <SlideIn direction="left" style={styles.section}>
              <Text style={styles.sectionTitle}>Slide In (Left)</Text>
              <View style={[styles.box, { backgroundColor: colors.secondary }]} />
            </SlideIn>

            <SlideIn direction="right" delay={200} style={styles.section}>
              <Text style={styles.sectionTitle}>Slide In (Right)</Text>
              <View style={[styles.box, { backgroundColor: colors.accent }]} />
            </SlideIn>

            <ZoomIn style={styles.section}>
              <Text style={styles.sectionTitle}>Zoom In</Text>
              <View style={[styles.box, { borderRadius: 50, backgroundColor: colors.success }]} />
            </ZoomIn>
          </StaggerContainer>

          <Button
            title="Reload Animations"
            onPress={() => setActiveTab('components')} // Hack to reset
            style={{ marginTop: 20 }}
          />
        </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>UI Kit Demo</Text>
        <Button
          title="See Animations"
          variant="text"
          onPress={() => setActiveTab('animations')}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Buttons</Text>
          <View style={styles.row}>
            <Button title="Primary" onPress={() => {}} />
            <Button title="Secondary" variant="secondary" onPress={() => {}} />
          </View>
          <View style={styles.row}>
             <Button title="Loading" loading onPress={() => {}} />
             <Button title="Disabled" disabled onPress={() => {}} />
          </View>
        </View>

        {/* Inputs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inputs (Animated)</Text>
          <Input 
            label="Username" 
            placeholder="Type something..." 
            value={inputValue}
            onChangeText={setInputValue}
            clearable
          />
          <Input 
            label="Password" 
            placeholder="Secret..." 
            type="password"
            value="123456" 
            onChangeText={() => {}}
          />
        </View>

        {/* Interactive Elements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interactive</Text>
          <View style={[styles.row, { justifyContent: 'space-around' }]}>
            <LikeButton isActive={liked} onPress={() => setLiked(!liked)} size={40} />
            <View>
              <Text style={{ marginBottom: 5 }}>Progress</Text>
              <ProgressBar progress={0.7} style={{ width: 150 }} />
            </View>
          </View>
        </View>

        {/* Glass Effect */}
        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Glass View</Text>
           <View style={styles.imagePlaceholder}>
             <Text>Background Image</Text>
             <GlassView style={styles.glassCard} intensity={80}>
               <Text style={styles.glassText}>Frosted Glass Overlay</Text>
               <Button title="Action" size="small" onPress={() => {}} />
             </GlassView>
           </View>
        </View>

        {/* Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cards</Text>
          <Text style={styles.subTitle}>Court Card</Text>
          <CourtCard court={MOCK_COURTS[0]} onPress={() => {}} />
          
          <Text style={styles.subTitle}>Match Card</Text>
          <MatchCard match={MOCK_MATCHES[0]} onPress={() => {}} />
        </View>
        
        {/* Skeletons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skeletons</Text>
          <Button title="Toggle Loading" onPress={toggleLoading} size="small" style={{ marginBottom: 10 }} />
          {loading ? (
             <SkeletonList type="court" count={1} />
          ) : (
             <Text>Click toggle to see skeletons</Text>
          )}
        </View>

        {/* Empty State */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Empty State</Text>
          <EmptyState 
            title="No Matches" 
            message="Keep swiping to find your partner!" 
            icon="💔"
            actionLabel="Start Swiping"
            onAction={() => {}}
            style={{ padding: 0 }}
          />
        </View>

      </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.h3,
    color: colors.primary,
  },
  content: {
    padding: spacing.md,
    paddingBottom: 50,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subTitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  glassCard: {
    position: 'absolute',
    bottom: 20,
    width: '80%',
    padding: spacing.md,
    alignItems: 'center',
  },
  glassText: {
    ...typography.h4,
    marginBottom: spacing.sm,
  },
});
