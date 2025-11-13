import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../types';
import { Colors, Fonts } from '../constants';
import { useUser } from '../context/UserContext';
import { useFavorites } from '../context/FavoritesContext';
import { useBookings } from '../context/BookingContext';
import { MenuButton } from '../components/MenuButton';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'Profile'>>();
  const { user } = useUser();
  const { favorites } = useFavorites();
  const { getUpcomingBookings } = useBookings();

  // Get user initials for avatar
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Format joined date
  const formatJoinedDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));

    if (months === 0) {
      return 'Joined this month';
    } else if (months === 1) {
      return 'Member since 1 month ago';
    } else {
      return `Member since ${months} months ago`;
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleMyBookings = () => {
    navigation.navigate('MyBookings');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleAbout = () => {
    navigation.navigate('About');
  };

  const handleTerms = () => {
    navigation.navigate('Terms');
  };

  const handlePrivacy = () => {
    navigation.navigate('Privacy');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            console.log('User logged out');
            Alert.alert('Logged Out', 'You have been logged out successfully');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <View style={styles.avatar}>
                {/* In real app, would use <Image source={{ uri: user.avatar }} /> */}
                <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
              </View>
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
              </View>
            )}
            {/* Edit button overlay */}
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handleEditProfile}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={16} color={Colors.text.inverse} />
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.memberSince}>{formatJoinedDate(user.joinedDate)}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="heart" size={32} color={Colors.primary} />
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="eye" size={32} color={Colors.primary} />
            <Text style={styles.statNumber}>{user.viewedProperties}</Text>
            <Text style={styles.statLabel}>Viewed</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="calendar" size={32} color={Colors.primary} />
            <Text style={styles.statNumber}>{getUpcomingBookings(user.id).length}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <MenuButton
            icon="person-outline"
            label="Edit Profile"
            onPress={handleEditProfile}
          />
          <MenuButton
            icon="calendar-outline"
            label="My Bookings"
            onPress={handleMyBookings}
          />
          <MenuButton
            icon="settings-outline"
            label="Settings"
            onPress={handleSettings}
          />
          <MenuButton
            icon="information-circle-outline"
            label="About"
            onPress={handleAbout}
          />
          <MenuButton
            icon="document-text-outline"
            label="Terms & Conditions"
            onPress={handleTerms}
          />
          <MenuButton
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={handlePrivacy}
          />
          <MenuButton
            icon="log-out-outline"
            label="Logout"
            onPress={handleLogout}
            color={Colors.danger}
            showChevron={false}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: Colors.surface,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 36,
    fontFamily: Fonts.family.bold,
    color: Colors.text.inverse,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  userName: {
    fontSize: 24,
    fontFamily: Fonts.family.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 12,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 28,
    fontFamily: Fonts.family.bold,
    color: Colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  menuContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bottomSpacing: {
    height: 32,
  },
});