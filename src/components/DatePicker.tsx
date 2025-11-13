import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants';

interface DatePickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onSelectDate,
  minDate = new Date(),
  maxDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date < today) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;

    return false;
  };

  const isSameDay = (date1: Date | null, date2: Date): boolean => {
    if (!date1) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDatePress = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );

    if (!isDateDisabled(date)) {
      onSelectDate(date);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return (
      <View style={styles.calendarGrid}>
        {days.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day
          );
          const disabled = isDateDisabled(date);
          const selected = isSameDay(selectedDate, date);
          const today = isToday(date);

          return (
            <TouchableOpacity
              key={`day-${day}`}
              style={[
                styles.dayCell,
                disabled && styles.dayCellDisabled,
                selected && styles.dayCellSelected,
                today && !selected && styles.dayCellToday,
              ]}
              onPress={() => handleDatePress(day)}
              disabled={disabled}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayText,
                  disabled && styles.dayTextDisabled,
                  selected && styles.dayTextSelected,
                  today && !selected && styles.dayTextToday,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const canGoPrevious = () => {
    const previousMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    const today = new Date();
    return previousMonth >= new Date(today.getFullYear(), today.getMonth(), 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Date</Text>
      <View style={styles.calendarContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handlePreviousMonth}
            disabled={!canGoPrevious()}
            style={styles.navigationButton}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={canGoPrevious() ? Colors.primary : Colors.text.disabled}
            />
          </TouchableOpacity>
          <Text style={styles.monthYear}>
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          <TouchableOpacity
            onPress={handleNextMonth}
            style={styles.navigationButton}
          >
            <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Days of week */}
        <View style={styles.daysOfWeekContainer}>
          {DAYS_OF_WEEK.map((day) => (
            <View key={day} style={styles.dayOfWeekCell}>
              <Text style={styles.dayOfWeekText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        {renderCalendar()}

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendDotToday]} />
            <Text style={styles.legendText}>Today</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.legendDotSelected]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  calendarContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navigationButton: {
    padding: 4,
  },
  monthYear: {
    fontSize: 18,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
  },
  daysOfWeekContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayOfWeekCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayOfWeekText: {
    fontSize: 12,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.secondary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  dayCellDisabled: {
    opacity: 0.3,
  },
  dayCellSelected: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  dayCellToday: {
    backgroundColor: `${Colors.primary}15`,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    fontFamily: Fonts.family.medium,
    color: Colors.text.primary,
  },
  dayTextDisabled: {
    color: Colors.text.disabled,
  },
  dayTextSelected: {
    color: Colors.text.inverse,
    fontFamily: Fonts.family.bold,
  },
  dayTextToday: {
    color: Colors.primary,
    fontFamily: Fonts.family.bold,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendDotToday: {
    backgroundColor: `${Colors.primary}15`,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  legendDotSelected: {
    backgroundColor: Colors.primary,
  },
  legendText: {
    fontSize: 12,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
  },
});
