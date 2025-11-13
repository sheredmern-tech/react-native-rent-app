import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackNavigationProp } from '../types/navigation';
import { Colors, Fonts } from '../constants';
import { BookingCard, EmptyState } from '../components';
import { useBookings } from '../context/BookingContext';
import { useUser } from '../context/UserContext';

type TabType = 'upcoming' | 'past';

export const MyBookingsScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'MyBookings'>>();
  const { user } = useUser();
  const { getUpcomingBookings, getPastBookings } = useBookings();

  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const upcomingBookings = getUpcomingBookings(user.id);
  const pastBookings = getPastBookings(user.id);

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleBookingPress = (bookingId: string) => {
    navigation.navigate('BookingDetail', { bookingId });
  };

  const renderBookingsList = () => {
    const bookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

    if (bookings.length === 0) {
      return (
        <EmptyState
          icon={activeTab === 'upcoming' ? 'calendar-outline' : 'time-outline'}
          title={
            activeTab === 'upcoming'
              ? 'No Upcoming Bookings'
              : 'No Past Bookings'
          }
          message={
            activeTab === 'upcoming'
              ? 'Schedule your first property visit to get started'
              : 'Your past bookings will appear here'
          }
        />
      );
    }

    return (
      <View style={styles.bookingsList}>
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onPress={() => handleBookingPress(booking.id)}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSubtitle}>
          {upcomingBookings.length} upcoming, {pastBookings.length} past
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color={
              activeTab === 'upcoming' ? Colors.primary : Colors.text.secondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.tabTextActive,
            ]}
          >
            Upcoming
          </Text>
          {upcomingBookings.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{upcomingBookings.length}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.tabActive]}
          onPress={() => setActiveTab('past')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="time-outline"
            size={20}
            color={
              activeTab === 'past' ? Colors.primary : Colors.text.secondary
            }
          />
          <Text
            style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}
          >
            Past
          </Text>
          {pastBookings.length > 0 && (
            <View style={[styles.badge, styles.badgeSecondary]}>
              <Text style={styles.badgeText}>{pastBookings.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary}
          />
        }
      >
        {renderBookingsList()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: Fonts.family.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontFamily: Fonts.family.medium,
    color: Colors.text.secondary,
  },
  tabTextActive: {
    fontFamily: Fonts.family.semiBold,
    color: Colors.primary,
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeSecondary: {
    backgroundColor: Colors.text.secondary,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: Fonts.family.bold,
    color: Colors.text.inverse,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  bookingsList: {
    paddingBottom: 20,
  },
});
