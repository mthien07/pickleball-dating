/**
 * CalendarPicker Component
 *
 * Custom calendar for date selection in booking flow
 * Features month navigation, disabled dates, and selected date highlight
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInRight, SlideInLeft } from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius } from '../theme/tokens';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_SIZE = (SCREEN_WIDTH - spacing.lg * 2 - spacing.xs * 12) / 7;

// ============================================
// TYPES
// ============================================

export interface CalendarPickerProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
}

// ============================================
// HELPERS
// ============================================

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTHS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  // Return 0-6 where 0 is Monday
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

// ============================================
// DAY COMPONENT
// ============================================

interface DayProps {
  date: Date;
  isSelected: boolean;
  isDisabled: boolean;
  isToday: boolean;
  onPress: () => void;
}

const Day: React.FC<DayProps> = ({ date, isSelected, isDisabled, isToday, onPress }) => {
  if (isSelected) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.daySelected}>
          <Text style={styles.dayTextSelected}>{date.getDate()}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={isDisabled ? undefined : onPress}
      style={[styles.day, isToday && styles.dayToday, isDisabled && styles.dayDisabled]}
      activeOpacity={isDisabled ? 1 : 0.7}
    >
      <Text
        style={[
          styles.dayText,
          isToday && styles.dayTextToday,
          isDisabled && styles.dayTextDisabled,
        ]}
      >
        {date.getDate()}
      </Text>
    </TouchableOpacity>
  );
};

// ============================================
// COMPONENT
// ============================================

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  selectedDate,
  onDateSelect,
  minDate = new Date(),
  maxDate,
  disabledDates = [],
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const today = new Date();

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [currentMonth]);

  const goToPrevMonth = () => {
    setDirection('left');
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setDirection('right');
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isDateDisabled = (date: Date): boolean => {
    // Before min date
    if (date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) {
      return true;
    }
    // After max date
    if (maxDate && date > maxDate) {
      return true;
    }
    // In disabled dates list
    return disabledDates.some((d) => isSameDay(d, date));
  };

  const canGoPrev = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prevMonth >= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goToPrevMonth}
          style={[styles.navButton, !canGoPrev() && styles.navButtonDisabled]}
          disabled={!canGoPrev()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={canGoPrev() ? colors.textPrimary : colors.textTertiary}
          />
        </TouchableOpacity>

        <Animated.Text
          key={`${currentMonth.getMonth()}-${currentMonth.getFullYear()}`}
          entering={direction === 'right' ? SlideInRight.duration(200) : SlideInLeft.duration(200)}
          style={styles.monthTitle}
        >
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Animated.Text>

        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Weekday Headers */}
      <View style={styles.weekdaysRow}>
        {WEEKDAYS.map((day, index) => (
          <View key={index} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <Animated.View
        key={`${currentMonth.getMonth()}-${currentMonth.getFullYear()}`}
        entering={FadeIn.duration(200)}
        style={styles.daysGrid}
      >
        {calendarDays.map((date, index) => (
          <View key={index} style={styles.dayCell}>
            {date ? (
              <Day
                date={date}
                isSelected={selectedDate ? isSameDay(date, selectedDate) : false}
                isDisabled={isDateDisabled(date)}
                isToday={isSameDay(date, today)}
                onPress={() => onDateSelect(date)}
              />
            ) : null}
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  monthTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },

  // Weekdays
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    ...typography.label,
    color: colors.textSecondary,
  },

  // Days
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  day: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  dayToday: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  dayDisabled: {
    opacity: 0.4,
  },
  daySelected: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.full,
  },
  dayText: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  dayTextToday: {
    color: colors.primary,
    fontWeight: '600',
  },
  dayTextDisabled: {
    color: colors.textTertiary,
  },
  dayTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default CalendarPicker;
