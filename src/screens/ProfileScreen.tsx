import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants';
import { useUser } from '../context/UserContext';
import { useFavorites } from '../context/FavoritesContext';
import { EditProfileModal } from '../components/EditProfileModal';
import { User } from '../types';

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  showArrow = true,
  rightElement,
  danger = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIconContainer, danger && styles.dangerIconContainer]}>
          <Ionicons
            name={icon}
            size={22}
            color={danger ? Colors.error : Colors.primary}
          />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, danger && styles.dangerText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {rightElement || (showArrow && (
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      ))}
    </TouchableOpacity>
  );
};

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ title, children }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
};

export const ProfileScreen: React.FC = () => {
  const { user, settings, updateUser, updateNotificationSettings, updatePreferences } = useUser();
  const { favorites } = useFavorites();
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleSaveProfile = (updates: Partial<User>) => {
    updateUser(updates);
  };

  const handleNotificationToggle = (key: keyof typeof settings.notifications) => {
    updateNotificationSettings({ [key]: !settings.notifications[key] });
  };

  const handleDarkModeToggle = () => {
    updatePreferences({ darkMode: !settings.preferences.darkMode });
    Alert.alert('Coming Soon', 'Dark mode will be implemented in the next update!');
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Language',
      'Choose your preferred language',
      [
        {
          text: 'English',
          onPress: () => updatePreferences({ language: 'en' }),
        },
        {
          text: 'Bahasa Indonesia',
          onPress: () => updatePreferences({ language: 'id' }),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCurrencyChange = () => {
    Alert.alert(
      'Currency',
      'Choose your preferred currency',
      [
        {
          text: 'IDR (Indonesian Rupiah)',
          onPress: () => updatePreferences({ currency: 'IDR' }),
        },
        {
          text: 'USD (US Dollar)',
          onPress: () => updatePreferences({ currency: 'USD' }),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Settings', 'Privacy settings screen will open here');
  };

  const handleSecurity = () => {
    Alert.alert('Security', 'Security settings screen will open here');
  };

  const handleHelp = () => {
    Alert.alert('Help & Support', 'Help center will open here');
  };

  const handleAbout = () => {
    Alert.alert(
      'About Rent App',
      'Version 1.0.0\n\nA modern rental property finder for Indonesia\n\n© 2024 Rent App',
      [{ text: 'OK' }]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
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

  const memberSince = user.joinedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={50} color={Colors.textSecondary} />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          {user.location && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.userLocation}>{user.location}</Text>
            </View>
          )}
          {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}
          <Text style={styles.memberSince}>Member since {memberSince}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={18} color={Colors.primary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Viewed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
        </View>

        {/* Notifications */}
        <SettingSection title="Notifications">
          <SettingItem
            icon="notifications-outline"
            title="New Properties"
            subtitle="Get notified about new listings"
            showArrow={false}
            rightElement={
              <Switch
                value={settings.notifications.newProperties}
                onValueChange={() => handleNotificationToggle('newProperties')}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.card}
              />
            }
          />
          <SettingItem
            icon="pricetag-outline"
            title="Price Drops"
            subtitle="Alert when prices decrease"
            showArrow={false}
            rightElement={
              <Switch
                value={settings.notifications.priceDrops}
                onValueChange={() => handleNotificationToggle('priceDrops')}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.card}
              />
            }
          />
          <SettingItem
            icon="chatbubble-outline"
            title="Messages"
            subtitle="Property owner messages"
            showArrow={false}
            rightElement={
              <Switch
                value={settings.notifications.messages}
                onValueChange={() => handleNotificationToggle('messages')}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.card}
              />
            }
          />
          <SettingItem
            icon="mail-outline"
            title="Newsletter"
            subtitle="Receive our weekly newsletter"
            showArrow={false}
            rightElement={
              <Switch
                value={settings.notifications.newsletter}
                onValueChange={() => handleNotificationToggle('newsletter')}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.card}
              />
            }
          />
        </SettingSection>

        {/* Preferences */}
        <SettingSection title="Preferences">
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Coming soon"
            showArrow={false}
            rightElement={
              <Switch
                value={settings.preferences.darkMode}
                onValueChange={handleDarkModeToggle}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor={Colors.card}
              />
            }
          />
          <SettingItem
            icon="language-outline"
            title="Language"
            subtitle={settings.preferences.language === 'id' ? 'Bahasa Indonesia' : 'English'}
            onPress={handleLanguageChange}
          />
          <SettingItem
            icon="cash-outline"
            title="Currency"
            subtitle={settings.preferences.currency}
            onPress={handleCurrencyChange}
          />
        </SettingSection>

        {/* Account & Security */}
        <SettingSection title="Account & Security">
          <SettingItem
            icon="shield-checkmark-outline"
            title="Privacy Settings"
            onPress={handlePrivacy}
          />
          <SettingItem
            icon="lock-closed-outline"
            title="Security"
            subtitle="Password & authentication"
            onPress={handleSecurity}
          />
        </SettingSection>

        {/* Support */}
        <SettingSection title="Support">
          <SettingItem
            icon="help-circle-outline"
            title="Help & Support"
            onPress={handleHelp}
          />
          <SettingItem
            icon="information-circle-outline"
            title="About"
            subtitle="Version 1.0.0"
            onPress={handleAbout}
          />
        </SettingSection>

        {/* Logout */}
        <View style={styles.section}>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="log-out-outline"
              title="Logout"
              onPress={handleLogout}
              showArrow={false}
              danger
            />
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      <EditProfileModal
        visible={editModalVisible}
        user={user}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveProfile}
      />
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  userName: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userLocation: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  userBio: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  memberSince: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dangerIconContainer: {
    backgroundColor: `${Colors.error}15`,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  dangerText: {
    color: Colors.error,
  },
  settingSubtitle: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bottomSpacing: {
    height: 20,
  },
});
