import React from 'react';
import { Pressable, Text } from 'react-native';
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
        <Pressable
          onPress={onPress}
          style={({ pressed }) => pressed && { opacity: 0.8 }}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
        >
          <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.daySelected}>
            <Text style={styles.dayTextSelected}>{date.getDate()}</Text>
          </LinearGradient>
        </Pressable>
      );
    }

    return (
      <Pressable
        onPress={isDisabled ? undefined : onPress}
        style={({ pressed }) => [
          styles.day,
          isToday && styles.dayToday,
          isDisabled && styles.dayDisabled,
          !isDisabled && pressed && { opacity: 0.7 },
        ]}
        android_ripple={!isDisabled ? { color: 'rgba(37, 99, 235, 0.15)' } : undefined}
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
      </Pressable>
    );
  }
);

CalendarDay.displayName = 'CalendarDay';
