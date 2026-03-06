/**
 * SignupDesign sub-components
 * - RoleCard: selectable role option
 * - Checkbox: terms agreement toggle
 */

import React from 'react';
import { Pressable, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors } from '../../../theme/tokens';
import { styles } from './signup-design-styles';

interface RoleCardProps {
  icon: any;
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const RoleCard = React.memo<RoleCardProps>(({ icon: Icon, label, selected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.roleCard,
      selected && styles.roleCardSelected,
      pressed && { opacity: 0.7 },
    ]}
    android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
  >
    <Icon size={24} color={selected ? colors.primary : colors.textSecondary} strokeWidth={2} />
    <Text style={[styles.roleCardText, selected && styles.roleCardTextSelected]}>{label}</Text>
  </Pressable>
));

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
}

export const Checkbox = React.memo<CheckboxProps>(({ checked, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.checkbox,
      checked && styles.checkboxChecked,
      pressed && { opacity: 0.7 },
    ]}
    android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  >
    {checked && <Check size={14} color={colors.white} strokeWidth={3} />}
  </Pressable>
));
