/**
 * CourtFilterModal - Bottom sheet filter for court discovery
 */

import React from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';

import { useThemeColors } from '../../../contexts/ThemeContext';
import { spacing, borderRadius, typography } from '../../../theme/tokens';

export interface FilterState {
  maxPrice: number | null; // VND per hour
  maxDistance: number | null; // km
  minRating: number | null;
}

const PRICE_OPTIONS = [
  { label: 'Tất cả', value: null },
  { label: '≤ 100k', value: 100000 },
  { label: '≤ 150k', value: 150000 },
  { label: '≤ 200k', value: 200000 },
];

const DISTANCE_OPTIONS = [
  { label: 'Tất cả', value: null },
  { label: '≤ 3 km', value: 3 },
  { label: '≤ 5 km', value: 5 },
  { label: '≤ 10 km', value: 10 },
];

const RATING_OPTIONS = [
  { label: 'Tất cả', value: null },
  { label: '≥ 4★', value: 4 },
  { label: '≥ 4.5★', value: 4.5 },
];

interface ChipRowProps {
  options: { label: string; value: number | null }[];
  selected: number | null;
  onSelect: (v: number | null) => void;
}

const ChipRow = ({ options, selected, onSelect }: ChipRowProps) => {
  const colors = useThemeColors();
  return (
    <View
      style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg }}
    >
      {options.map((opt) => (
        <Pressable
          key={String(opt.value)}
          onPress={() => onSelect(opt.value)}
          style={{
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.full,
            backgroundColor: selected === opt.value ? colors.primary : colors.surface,
            borderWidth: 1,
            borderColor: selected === opt.value ? colors.primary : colors.border,
          }}
        >
          <Text
            style={{
              ...typography.label,
              color: selected === opt.value ? colors.white : colors.textPrimary,
            }}
          >
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

interface CourtFilterModalProps {
  visible: boolean;
  filter: FilterState;
  resultCount: number;
  onFilterChange: (f: FilterState) => void;
  onClose: () => void;
}

export const CourtFilterModal = ({
  visible,
  filter,
  resultCount,
  onFilterChange,
  onClose,
}: CourtFilterModalProps) => {
  const colors = useThemeColors();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={onClose} />
      <View
        style={{
          backgroundColor: colors.background,
          borderTopLeftRadius: borderRadius.xl,
          borderTopRightRadius: borderRadius.xl,
          padding: spacing.lg,
          paddingBottom: spacing['2xl'],
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.lg,
          }}
        >
          <Text style={{ ...typography.h3, color: colors.textPrimary }}>Bộ lọc</Text>
          <Pressable
            onPress={() => onFilterChange({ maxPrice: null, maxDistance: null, minRating: null })}
          >
            <Text style={{ ...typography.body, color: colors.primary }}>Xóa tất cả</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text
            style={{ ...typography.label, color: colors.textSecondary, marginBottom: spacing.sm }}
          >
            GIÁ / GIỜ
          </Text>
          <ChipRow
            options={PRICE_OPTIONS}
            selected={filter.maxPrice}
            onSelect={(v) => onFilterChange({ ...filter, maxPrice: v })}
          />

          <Text
            style={{ ...typography.label, color: colors.textSecondary, marginBottom: spacing.sm }}
          >
            KHOẢNG CÁCH
          </Text>
          <ChipRow
            options={DISTANCE_OPTIONS}
            selected={filter.maxDistance}
            onSelect={(v) => onFilterChange({ ...filter, maxDistance: v })}
          />

          <Text
            style={{ ...typography.label, color: colors.textSecondary, marginBottom: spacing.sm }}
          >
            ĐÁNH GIÁ TỐI THIỂU
          </Text>
          <ChipRow
            options={RATING_OPTIONS}
            selected={filter.minRating}
            onSelect={(v) => onFilterChange({ ...filter, minRating: v })}
          />
        </ScrollView>

        <Pressable
          onPress={onClose}
          style={({ pressed }) => ({
            backgroundColor: colors.primary,
            paddingVertical: spacing.md,
            borderRadius: borderRadius.lg,
            alignItems: 'center',
            opacity: pressed ? 0.8 : 1,
            marginTop: spacing.sm,
          })}
        >
          <Text style={{ ...typography.button, color: colors.white }}>
            Xem {resultCount} kết quả
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};
