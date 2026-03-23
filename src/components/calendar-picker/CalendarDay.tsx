import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import { createStyles } from './calendar-styles';

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
    const colors = useThemeColors();
    const styles = useThemedStyles(createStyles);
    if (isSelected) {
      return (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => pressed && { opacity: 0.8 }}
          android_ripple={{ color: 'rgba(255, 255, 255, 0.3)' }}
        >
          <View style={[styles.daySelected, { backgroundColor: colors.primary }]}>
            <Text style={styles.dayTextSelected}>{date.getDate()}</Text>
          </View>
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
        android_ripple={!isDisabled ? { color: 'rgba(59, 89, 152, 0.15)' } : undefined}
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
