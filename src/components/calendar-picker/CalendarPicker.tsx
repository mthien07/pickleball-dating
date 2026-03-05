import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
