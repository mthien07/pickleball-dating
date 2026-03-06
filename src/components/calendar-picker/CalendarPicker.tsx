import React, { useState, useMemo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInRight, SlideInLeft } from 'react-native-reanimated';
import { colors } from '../../theme/tokens';
import { styles } from './calendar-styles';
import { CalendarDay } from './CalendarDay';
import { WEEKDAYS, MONTHS, isSameDay, buildCalendarDays } from './calendar-helpers';

export interface CalendarPickerProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
}

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
    return buildCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth());
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
    if (date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) {
      return true;
    }
    if (maxDate && date > maxDate) {
      return true;
    }
    return disabledDates.some((d) => isSameDay(d, date));
  };

  const canGoPrev = () => {
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    return prevMonth >= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={goToPrevMonth}
          style={({ pressed }) => [
            styles.navButton,
            !canGoPrev() && styles.navButtonDisabled,
            pressed && canGoPrev() && { opacity: 0.7 },
          ]}
          disabled={!canGoPrev()}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={canGoPrev() ? colors.textPrimary : colors.textTertiary}
          />
        </Pressable>

        <Animated.Text
          key={`${currentMonth.getMonth()}-${currentMonth.getFullYear()}`}
          entering={direction === 'right' ? SlideInRight.duration(200) : SlideInLeft.duration(200)}
          style={styles.monthTitle}
        >
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Animated.Text>

        <Pressable
          onPress={goToNextMonth}
          style={({ pressed }) => [styles.navButton, pressed && { opacity: 0.7 }]}
          android_ripple={{ color: 'rgba(37, 99, 235, 0.15)' }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-forward" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.weekdaysRow}>
        {WEEKDAYS.map((day, index) => (
          <View key={index} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{day}</Text>
          </View>
        ))}
      </View>

      <Animated.View
        key={`${currentMonth.getMonth()}-${currentMonth.getFullYear()}`}
        entering={FadeIn.duration(200)}
        style={styles.daysGrid}
      >
        {calendarDays.map((date, index) => (
          <View key={index} style={styles.dayCell}>
            {date ? (
              <CalendarDay
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

export default CalendarPicker;
