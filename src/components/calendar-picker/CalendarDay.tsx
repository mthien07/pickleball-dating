import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/tokens';
import { styles } from './calendar-styles';

interface DayProps {
  date: Date;
  isSelected: boolean;
  isDisabled: boolean;
  isToday: boolean;
  onPress: () => void;
}

/** Single day cell in the calendar grid */
export const CalendarDay: React.FC<DayProps> = React.memo(
  ({ date, isSelected, isDisabled, isToday, onPress }) => {
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
  }
);

CalendarDay.displayName = 'CalendarDay';
