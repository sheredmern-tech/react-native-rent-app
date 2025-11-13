import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimeSlot } from '../types';
import { Colors, Fonts } from '../constants';

interface TimeSlotPickerProps {
  selectedTimeSlot: string | null;
  availableTimeSlots: TimeSlot[];
  onSelectTimeSlot: (timeSlot: string) => void;
}

interface TimeSlotGroup {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  slots: TimeSlot[];
}

const groupTimeSlots = (timeSlots: TimeSlot[]): TimeSlotGroup[] => {
  const morning: TimeSlot[] = [];
  const afternoon: TimeSlot[] = [];
  const evening: TimeSlot[] = [];

  timeSlots.forEach((slot) => {
    const hour = parseInt(slot.time.split(':')[0], 10);
    if (hour < 12) {
      morning.push(slot);
    } else if (hour < 17) {
      afternoon.push(slot);
    } else {
      evening.push(slot);
    }
  });

  return [
    { label: 'Morning', icon: 'sunny-outline' as const, slots: morning },
    { label: 'Afternoon', icon: 'partly-sunny-outline' as const, slots: afternoon },
    { label: 'Evening', icon: 'moon-outline' as const, slots: evening },
  ].filter((group) => group.slots.length > 0);
};

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  selectedTimeSlot,
  availableTimeSlots,
  onSelectTimeSlot,
}) => {
  const groupedSlots = groupTimeSlots(availableTimeSlots);
  const hasAvailableSlots = availableTimeSlots.some((slot) => slot.available);

  if (availableTimeSlots.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Select Time</Text>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="time-outline"
            size={48}
            color={Colors.text.secondary}
          />
          <Text style={styles.emptyText}>Select a date to view time slots</Text>
        </View>
      </View>
    );
  }

  if (!hasAvailableSlots) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Select Time</Text>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="close-circle-outline"
            size={48}
            color={Colors.danger}
          />
          <Text style={styles.emptyText}>
            No available time slots for this date
          </Text>
          <Text style={styles.emptySubtext}>Please select another date</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Time</Text>
      {groupedSlots.map((group) => (
        <View key={group.label} style={styles.groupContainer}>
          <View style={styles.groupHeader}>
            <Ionicons name={group.icon} size={20} color={Colors.text.secondary} />
            <Text style={styles.groupLabel}>{group.label}</Text>
          </View>
          <View style={styles.slotsContainer}>
            {group.slots.map((slot) => {
              const isSelected = selectedTimeSlot === slot.time;
              const isAvailable = slot.available;

              return (
                <TouchableOpacity
                  key={slot.time}
                  style={[
                    styles.slotButton,
                    isSelected && styles.slotButtonSelected,
                    !isAvailable && styles.slotButtonDisabled,
                  ]}
                  onPress={() => onSelectTimeSlot(slot.time)}
                  disabled={!isAvailable}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.slotText,
                      isSelected && styles.slotTextSelected,
                      !isAvailable && styles.slotTextDisabled,
                    ]}
                  >
                    {slot.time}
                  </Text>
                  {!isAvailable && (
                    <View style={styles.bookedBadge}>
                      <Text style={styles.bookedText}>Booked</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
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
  groupContainer: {
    marginBottom: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  groupLabel: {
    fontSize: 14,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.secondary,
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotButton: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  slotButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  slotButtonDisabled: {
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    opacity: 0.5,
  },
  slotText: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
  },
  slotTextSelected: {
    color: Colors.text.inverse,
  },
  slotTextDisabled: {
    color: Colors.text.disabled,
  },
  bookedBadge: {
    marginTop: 4,
    backgroundColor: Colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  bookedText: {
    fontSize: 10,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.inverse,
  },
  emptyContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.family.medium,
    color: Colors.text.secondary,
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
