import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../constants';
import { useUser } from '../context/UserContext';
import { SettingItem } from '../components/SettingItem';

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings } = useUser();

  const handlePushNotifications = () => {
    updateSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        push: !settings.notifications.push,
      },
    });
  };

  const handleEmailNotifications = () => {
    updateSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        email: !settings.notifications.email,
      },
    });
  };

  const handleLanguage = () => {
    Alert.alert(
      'Language',
      'Choose your preferred language',
      [
        {
          text: 'English',
          onPress: () =>
            updateSettings({
              ...settings,
              preferences: { ...settings.preferences, language: 'en' },
            }),
        },
        {
          text: 'Bahasa Indonesia',
          onPress: () =>
            updateSettings({
              ...settings,
              preferences: { ...settings.preferences, language: 'id' },
            }),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCurrency = () => {
    Alert.alert(
      'Currency',
      'Choose your preferred currency',
      [
        {
          text: 'IDR (Indonesian Rupiah)',
          onPress: () =>
            updateSettings({
              ...settings,
              preferences: { ...settings.preferences, currency: 'IDR' },
            }),
        },
        {
          text: 'USD (US Dollar)',
          onPress: () =>
            updateSettings({
              ...settings,
              preferences: { ...settings.preferences, currency: 'USD' },
            }),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDistanceUnit = () => {
    Alert.alert(
      'Distance Unit',
      'Choose your preferred distance unit',
      [
        {
          text: 'Kilometers',
          onPress: () =>
            updateSettings({
              ...settings,
              preferences: { ...settings.preferences, distanceUnit: 'km' },
            }),
        },
        {
          text: 'Miles',
          onPress: () =>
            updateSettings({
              ...settings,
              preferences: { ...settings.preferences, distanceUnit: 'mi' },
            }),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDarkMode = () => {
    updateSettings({
      ...settings,
      darkMode: !settings.darkMode,
    });
    if (!settings.darkMode) {
      Alert.alert('Coming Soon', 'Dark mode will be available in the next update!');
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const getLanguageLabel = (): string => {
    return settings.preferences.language === 'en' ? 'English' : 'Bahasa Indonesia';
  };

  const getDistanceLabel = (): string => {
    return settings.preferences.distanceUnit === 'km' ? 'Kilometers' : 'Miles';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="notifications-outline"
              label="Push Notifications"
              rightComponent={
                <Switch
                  value={settings.notifications.push}
                  onValueChange={handlePushNotifications}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.surface}
                />
              }
            />
            <SettingItem
              icon="mail-outline"
              label="Email Notifications"
              rightComponent={
                <Switch
                  value={settings.notifications.email}
                  onValueChange={handleEmailNotifications}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.surface}
                />
              }
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="language-outline"
              label="Language"
              value={getLanguageLabel()}
              onPress={handleLanguage}
            />
            <SettingItem
              icon="cash-outline"
              label="Currency"
              value={settings.preferences.currency}
              onPress={handleCurrency}
            />
            <SettingItem
              icon="speedometer-outline"
              label="Distance Unit"
              value={getDistanceLabel()}
              onPress={handleDistanceUnit}
            />
          </View>
        </View>

        {/* App Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              icon="moon-outline"
              label="Dark Mode"
              rightComponent={
                <Switch
                  value={settings.darkMode}
                  onValueChange={handleDarkMode}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={Colors.surface}
                />
              }
            />
            <SettingItem
              icon="trash-outline"
              label="Cache Size"
              value="2.4 MB"
              onPress={handleClearCache}
            />
            <SettingItem
              icon="information-circle-outline"
              label="App Version"
              value="1.0.0"
            />
          </View>
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
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.secondary,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bottomSpacing: {
    height: 32,
  },
});