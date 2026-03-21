/**
 * edit-profile-form-section
 *
 * Bio, display name, skill level, and play style form fields for EditProfileScreen.
 * Includes sanitizeInput utility for stripping HTML/SQL patterns from user text.
 */

import React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useThemeColors } from '../../../contexts/ThemeContext';
import { useThemedStyles } from '../../../hooks/useThemedStyles';
import { createStyles } from './edit-profile-styles';

/** Strip HTML tags and SQL-like injection patterns from profile text fields */
export const sanitizeInput = (text: string): string => {
  let sanitized = text.replace(/<[^>]*>/g, '');
  sanitized = sanitized.replace(/;/g, '');
  sanitized = sanitized.replace(
    /\b(DROP|DELETE|INSERT|UPDATE|SELECT|TRUNCATE|ALTER|CREATE)\b\s+\b(TABLE|FROM|INTO|DATABASE|INDEX)\b/gi,
    ''
  );
  return sanitized.replace(/--/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
};

const SKILL_LEVELS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Mid' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'pro', label: 'Pro' },
];

const PLAY_STYLES = [
  { id: 'competitive', label: 'Competitive' },
  { id: 'casual', label: 'Casual' },
  { id: 'social', label: 'Social' },
];

interface Props {
  name: string;
  onNameChange: (text: string) => void;
  nameFocused: boolean;
  onNameFocus: () => void;
  onNameBlur: () => void;
  bio: string;
  onBioChange: (text: string) => void;
  bioFocused: boolean;
  onBioFocus: () => void;
  onBioBlur: () => void;
  skillLevel: string;
  onSkillLevelChange: (id: string) => void;
  playStyle: string;
  onPlayStyleChange: (id: string) => void;
}

export const FormSection = React.memo(
  ({
    name,
    onNameChange,
    nameFocused,
    onNameFocus,
    onNameBlur,
    bio,
    onBioChange,
    bioFocused,
    onBioFocus,
    onBioBlur,
    skillLevel,
    onSkillLevelChange,
    playStyle,
    onPlayStyleChange,
  }: Props) => {
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    const bioLength = bio.length;
    const isNearLimit = bioLength >= 270;

    return (
      <>
        {/* About Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.inputLabel}>Display Name</Text>
          <TextInput
            style={[styles.inputField, nameFocused && styles.inputFieldFocused]}
            value={name}
            onChangeText={onNameChange}
            placeholder="Your name"
            placeholderTextColor={colors.textTertiary}
            onFocus={onNameFocus}
            onBlur={onNameBlur}
          />
        </View>

        {/* Bio Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Bio</Text>
          <TextInput
            style={[styles.inputField, styles.bioInput, bioFocused && styles.inputFieldFocused]}
            value={bio}
            onChangeText={onBioChange}
            placeholder="Tell others about yourself..."
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={300}
            textAlignVertical="top"
            onFocus={onBioFocus}
            onBlur={onBioBlur}
          />
          <Text style={[styles.charCounter, isNearLimit && styles.charCounterWarning]}>
            {bioLength}/300
          </Text>
        </View>

        {/* Skill Level */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Skill Level</Text>
          <View style={styles.segmentedControl}>
            {SKILL_LEVELS.map((level) => (
              <Pressable
                key={level.id}
                style={[styles.segmentItem, skillLevel === level.id && styles.segmentItemActive]}
                onPress={() => onSkillLevelChange(level.id)}
              >
                <Text
                  style={[styles.segmentText, skillLevel === level.id && styles.segmentTextActive]}
                >
                  {level.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Play Style */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Play Style</Text>
          <View style={styles.pillRow}>
            {PLAY_STYLES.map((s) => (
              <Pressable
                key={s.id}
                style={[styles.pill, playStyle === s.id && styles.pillActive]}
                onPress={() => onPlayStyleChange(s.id)}
              >
                <Text style={[styles.pillText, playStyle === s.id && styles.pillTextActive]}>
                  {s.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </>
    );
  }
);

FormSection.displayName = 'FormSection';
