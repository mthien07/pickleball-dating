/**
 * EmailSignup reusable sub-components
 * - RoleCard: selectable role option with gradient highlight
 * - TermsCheckbox: agreement checkbox with terms text
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';
import { colors } from '../../../theme/tokens';
import { styles } from './email-signup-styles';

export type Role = 'player' | 'owner' | 'coach';

interface RoleCardProps {
  value: Role;
  label: string;
  Icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  selected: boolean;
  onSelect: (value: Role) => void;
}

export const RoleCard = React.memo(({ value, label, Icon, selected, onSelect }: RoleCardProps) => {
  const cardContent = (
    <View style={[styles.roleCard, selected && styles.roleCardSelected]}>
      <Icon size={28} color={selected ? colors.primary : colors.textSecondary} strokeWidth={2} />
      <Text style={[styles.roleLabel, selected && styles.roleLabelSelected]}>{label}</Text>
    </View>
  );

  return (
    <TouchableOpacity
      onPress={() => onSelect(value)}
      activeOpacity={0.8}
      style={styles.roleCardTouchable}
    >
      {selected ? (
        <LinearGradient
          colors={[colors.bentoLight, colors.surface]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.roleCardGradient, { borderColor: colors.primary }]}
        >
          {cardContent}
        </LinearGradient>
      ) : (
        cardContent
      )}
    </TouchableOpacity>
  );
});

interface TermsCheckboxProps {
  agreed: boolean;
  onToggle: () => void;
}

export const TermsCheckbox = React.memo(({ agreed, onToggle }: TermsCheckboxProps) => (
  <TouchableOpacity style={styles.termsContainer} onPress={onToggle} activeOpacity={0.8}>
    <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
      {agreed && <Check size={14} color={colors.white} strokeWidth={3} />}
    </View>
    <Text style={styles.termsText}>
      Tôi đồng ý với <Text style={styles.link}>Điều khoản sử dụng</Text>
    </Text>
  </TouchableOpacity>
));
