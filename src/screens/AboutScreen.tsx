import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants';

export const AboutScreen: React.FC = () => {
  const handleEmail = () => {
    Linking.openURL('mailto:support@rentapp.com').catch(() => {
      Alert.alert('Error', 'Could not open email client');
    });
  };

  const handleWebsite = () => {
    Alert.alert('Website', 'Opening www.rentapp.com');
  };

  const handleSocial = (platform: string) => {
    Alert.alert(platform, `Opening ${platform} page`);
  };

  const handleRateUs = () => {
    Alert.alert('Rate Us', 'Thank you for rating our app!');
  };

  const handleShareApp = () => {
    Alert.alert('Share App', 'Share functionality will open here');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Ionicons name="home" size={60} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>Rent App</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Your trusted companion for finding the perfect rental property in
            Indonesia. Browse thousands of apartments, houses, and villas with
            ease. Our platform connects property seekers with verified owners,
            making your search simple and secure.
          </Text>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT US</Text>
          <View style={styles.contactContainer}>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleEmail}
              activeOpacity={0.7}
            >
              <Ionicons name="mail-outline" size={24} color={Colors.primary} />
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>support@rentapp.com</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleWebsite}
              activeOpacity={0.7}
            >
              <Ionicons name="globe-outline" size={24} color={Colors.primary} />
              <View style={styles.contactText}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>www.rentapp.com</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={Colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Media */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FOLLOW US</Text>
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocial('Facebook')}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-facebook" size={32} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocial('Twitter')}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-twitter" size={32} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocial('Instagram')}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-instagram" size={32} color="#E4405F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRateUs}
            activeOpacity={0.8}
          >
            <Ionicons name="star-outline" size={24} color={Colors.primary} />
            <Text style={styles.actionButtonText}>Rate Us</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShareApp}
            activeOpacity={0.8}
          >
            <Ionicons
              name="share-social-outline"
              size={24}
              color={Colors.primary}
            />
            <Text style={styles.actionButtonText}>Share App</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Rent App. All rights reserved.
          </Text>
          <Text style={styles.footerSubtext}>
            Made with ❤️ in Indonesia
          </Text>
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
  scrollContent: {
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    fontWeight: Fonts.weight.regular,
    color: Colors.text.secondary,
  },
  descriptionContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  description: {
    fontSize: 15,
    fontWeight: Fonts.weight.regular,
    color: Colors.text.primary,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: Fonts.weight.semiBold,
    color: Colors.text.secondary,
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  contactContainer: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  contactText: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: Fonts.weight.regular,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: Fonts.weight.medium,
    color: Colors.text.primary,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: Fonts.weight.semiBold,
    color: Colors.primary,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 12,
    fontWeight: Fonts.weight.regular,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontWeight: Fonts.weight.regular,
    color: Colors.text.secondary,
  },
  bottomSpacing: {
    height: 20,
  },
});