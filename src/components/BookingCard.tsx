import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../types';
import { Colors, Fonts } from '../constants';
import { BookingStatusBadge } from './BookingStatusBadge';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
}

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays === 0) return 'Today';
    if (absDays === 1) return 'Yesterday';
    return `${absDays} days ago`;
  } else {
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  }
};

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onPress }) => {
  const isUpcoming =
    booking.date >= new Date() &&
    booking.status !== 'cancelled' &&
    booking.status !== 'completed';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Property Image */}
      <Image source={{ uri: booking.propertyImage }} style={styles.image} />

      {/* Content */}
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.propertyTitle} numberOfLines={1}>
              {booking.propertyTitle}
            </Text>
            <View style={styles.locationContainer}>
              <Ionicons
                name="location-outline"
                size={14}
                color={Colors.text.secondary}
              />
              <Text style={styles.locationText} numberOfLines={1}>
                {booking.propertyLocation}
              </Text>
            </View>
          </View>
          <BookingStatusBadge status={booking.status} size="small" />
        </View>

        {/* Booking Details */}
        <View style={styles.detailsContainer}>
          {/* Date & Time */}
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={Colors.primary}
              />
              <View>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{formatDate(booking.date)}</Text>
                {isUpcoming && (
                  <Text style={styles.relativeTime}>{getRelativeTime(booking.date)}</Text>
                )}
              </View>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time-outline" size={16} color={Colors.primary} />
              <View>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{booking.timeSlot}</Text>
              </View>
            </View>
          </View>

          {/* Visit Type */}
          <View style={styles.visitTypeContainer}>
            <Ionicons
              name={
                booking.visitType === 'virtual'
                  ? 'videocam-outline'
                  : 'home-outline'
              }
              size={16}
              color={Colors.text.secondary}
            />
            <Text style={styles.visitTypeText}>
              {booking.visitType === 'virtual' ? 'Virtual Tour' : 'In-Person Visit'}
            </Text>
          </View>
        </View>

        {/* Notes (if available) */}
        {booking.notes && (
          <View style={styles.notesContainer}>
            <Ionicons
              name="chatbox-outline"
              size={14}
              color={Colors.text.secondary}
            />
            <Text style={styles.notesText} numberOfLines={2}>
              {booking.notes}
            </Text>
          </View>
        )}
      </View>

      {/* Arrow indicator */}
      <View style={styles.arrowContainer}>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={Colors.text.secondary}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: '100%',
    minHeight: 160,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  headerLeft: {
    flex: 1,
  },
  propertyTitle: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    flex: 1,
  },
  detailsContainer: {
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
  },
  relativeTime: {
    fontSize: 11,
    fontFamily: Fonts.family.medium,
    color: Colors.primary,
    marginTop: 2,
  },
  visitTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  visitTypeText: {
    fontSize: 12,
    fontFamily: Fonts.family.medium,
    color: Colors.text.secondary,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  notesText: {
    flex: 1,
    fontSize: 12,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingRight: 12,
  },
});
