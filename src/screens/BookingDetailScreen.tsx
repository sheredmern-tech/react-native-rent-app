import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, RootStackNavigationProp } from '../types/navigation';
import { Colors, Fonts } from '../constants';
import { BookingStatusBadge } from '../components';
import { useBookings } from '../context/BookingContext';

type BookingDetailScreenRouteProp = RouteProp<RootStackParamList, 'BookingDetail'>;

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

const formatDateTime = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('en-US', options);
};

export const BookingDetailScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'BookingDetail'>>();
  const route = useRoute<BookingDetailScreenRouteProp>();
  const { bookingId } = route.params;

  const { getBookingById, cancelBooking, canCancelBooking } = useBookings();
  const booking = getBookingById(bookingId);

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.danger} />
          <Text style={styles.errorText}>Booking not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const canCancel = canCancelBooking(booking);
  const isUpcoming =
    booking.date >= new Date() &&
    booking.status !== 'cancelled' &&
    booking.status !== 'completed';

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelBooking(bookingId);
            Alert.alert(
              'Booking Cancelled',
              'Your booking has been cancelled successfully.',
              [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
          },
        },
      ]
    );
  };

  const handleViewProperty = () => {
    navigation.navigate('PropertyDetail', { propertyId: booking.propertyId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Property Image */}
        <Image
          source={{ uri: booking.propertyImage }}
          style={styles.propertyImage}
        />

        {/* Main Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.propertyTitle}>{booking.propertyTitle}</Text>
              <BookingStatusBadge status={booking.status} size="medium" />
            </View>
            <View style={styles.locationContainer}>
              <Ionicons
                name="location-outline"
                size={16}
                color={Colors.text.secondary}
              />
              <Text style={styles.locationText}>{booking.propertyLocation}</Text>
            </View>
          </View>

          {/* Booking Details Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Details</Text>

            <View style={styles.detailsGrid}>
              {/* Date */}
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="calendar" size={24} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{formatDate(booking.date)}</Text>
                </View>
              </View>

              {/* Time */}
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="time" size={24} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Time</Text>
                  <Text style={styles.detailValue}>{booking.timeSlot}</Text>
                </View>
              </View>

              {/* Visit Type */}
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Ionicons
                    name={
                      booking.visitType === 'virtual'
                        ? 'videocam'
                        : 'home'
                    }
                    size={24}
                    color={Colors.primary}
                  />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Visit Type</Text>
                  <Text style={styles.detailValue}>
                    {booking.visitType === 'virtual'
                      ? 'Virtual Tour'
                      : 'In-Person Visit'}
                  </Text>
                </View>
              </View>

              {/* Booking ID */}
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Ionicons name="document-text" size={24} color={Colors.primary} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Booking ID</Text>
                  <Text style={styles.detailValue}>{booking.id}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Notes Section */}
          {booking.notes && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.notesCard}>
                <Ionicons
                  name="chatbox-outline"
                  size={20}
                  color={Colors.text.secondary}
                />
                <Text style={styles.notesText}>{booking.notes}</Text>
              </View>
            </View>
          )}

          {/* Timeline Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timeline</Text>
            <View style={styles.timelineCard}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>Booking Created</Text>
                  <Text style={styles.timelineValue}>
                    {formatDateTime(booking.createdAt)}
                  </Text>
                </View>
              </View>
              {booking.updatedAt && (
                <View style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineLabel}>Last Updated</Text>
                    <Text style={styles.timelineValue}>
                      {formatDateTime(booking.updatedAt)}
                    </Text>
                  </View>
                </View>
              )}
              {isUpcoming && (
                <View style={styles.timelineItem}>
                  <View style={[styles.timelineDot, styles.timelineDotFuture]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineLabel}>Scheduled Visit</Text>
                    <Text style={[styles.timelineValue, styles.timelineValueFuture]}>
                      {formatDateTime(booking.date)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Cancellation Policy */}
          {isUpcoming && (
            <View style={styles.policyCard}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.info} />
              <Text style={styles.policyText}>
                {canCancel
                  ? 'You can cancel this booking up to 24 hours before the scheduled visit.'
                  : 'This booking cannot be cancelled as it is less than 24 hours away.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {canCancel && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelBooking}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle-outline" size={20} color={Colors.danger} />
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.viewPropertyButton}
          onPress={handleViewProperty}
          activeOpacity={0.8}
        >
          <Ionicons name="home-outline" size={20} color={Colors.text.inverse} />
          <Text style={styles.viewPropertyButtonText}>View Property</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  propertyImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  propertyTitle: {
    flex: 1,
    fontSize: 24,
    fontFamily: Fonts.family.bold,
    color: Colors.text.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 15,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  detailsGrid: {
    gap: 12,
  },
  detailCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
  },
  notesCard: {
    backgroundColor: `${Colors.info}10`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${Colors.info}30`,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  notesText: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.family.regular,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  timelineDotFuture: {
    backgroundColor: Colors.success,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 14,
    fontFamily: Fonts.family.medium,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  timelineValue: {
    fontSize: 15,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
  },
  timelineValueFuture: {
    color: Colors.success,
  },
  policyCard: {
    backgroundColor: `${Colors.info}10`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${Colors.info}30`,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  policyText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.family.regular,
    color: Colors.text.primary,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.danger,
  },
  viewPropertyButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewPropertyButtonText: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.inverse,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.inverse,
  },
});
