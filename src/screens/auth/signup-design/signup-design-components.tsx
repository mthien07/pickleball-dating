/**
 * SignupDesign sub-components
 * - RoleCard: selectable role option
 * - Checkbox: terms agreement toggle
 */

import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
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
  <TouchableOpacity
    onPress={onPress}
    style={[styles.roleCard, selected && styles.roleCardSelected]}
    activeOpacity={0.7}
  >
    <Icon size={24} color={selected ? colors.primary : colors.textSecondary} strokeWidth={2} />
    <Text style={[styles.roleCardText, selected && styles.roleCardTextSelected]}>{label}</Text>
  </TouchableOpacity>
));

interface CheckboxProps {
  checked: boolean;
  onPress: () => void;
}

export const Checkbox = React.memo<CheckboxProps>(({ checked, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.checkbox, checked && styles.checkboxChecked]}
    activeOpacity={0.7}
  >
    {checked && <Check size={14} color={colors.white} strokeWidth={3} />}
  </TouchableOpacity>
));
