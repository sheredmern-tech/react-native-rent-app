import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../constants';

export const TermsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.lastUpdated}>Last updated: November 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to Rent App. These Terms and Conditions govern your use of our
            mobile application and services. By accessing or using Rent App, you
            agree to be bound by these Terms. If you disagree with any part of these
            terms, you may not access the service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Use of Service</Text>
          <Text style={styles.paragraph}>
            Rent App provides a platform for users to search, view, and connect with
            property owners for rental properties in Indonesia. You agree to use our
            service only for lawful purposes and in accordance with these Terms.
          </Text>
          <Text style={styles.paragraph}>
            You are responsible for:
          </Text>
          <Text style={styles.bulletPoint}>• Maintaining the confidentiality of your account</Text>
          <Text style={styles.bulletPoint}>• All activities that occur under your account</Text>
          <Text style={styles.bulletPoint}>• Notifying us immediately of any unauthorized access</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Property Listings</Text>
          <Text style={styles.paragraph}>
            All property listings on Rent App are provided by third-party property
            owners. We do not guarantee the accuracy, completeness, or reliability of
            any listings. Users should conduct their own due diligence before entering
            into any rental agreements.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. User Content</Text>
          <Text style={styles.paragraph}>
            You retain ownership of any content you submit to Rent App. However, by
            submitting content, you grant us a worldwide, non-exclusive, royalty-free
            license to use, reproduce, and distribute your content in connection with
            the service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Prohibited Activities</Text>
          <Text style={styles.paragraph}>You may not:</Text>
          <Text style={styles.bulletPoint}>• Use the service for any illegal purpose</Text>
          <Text style={styles.bulletPoint}>• Attempt to gain unauthorized access to our systems</Text>
          <Text style={styles.bulletPoint}>• Transmit viruses or malicious code</Text>
          <Text style={styles.bulletPoint}>• Harass, abuse, or harm other users</Text>
          <Text style={styles.bulletPoint}>• Submit false or misleading information</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            Rent App shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use of or inability
            to use the service. We do not guarantee that the service will be
            uninterrupted, secure, or error-free.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these Terms at any time. We will notify
            users of any material changes via the app or email. Your continued use of
            the service after such modifications constitutes your acceptance of the
            updated Terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms shall be governed by and construed in accordance with the laws
            of Indonesia, without regard to its conflict of law provisions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about these Terms, please contact us at:
          </Text>
          <Text style={styles.contactText}>support@rentapp.com</Text>
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
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 6,
    paddingLeft: 8,
  },
  contactText: {
    fontSize: 15,
    fontFamily: Fonts.medium,
    color: Colors.primary,
    marginTop: 8,
  },
  bottomSpacing: {
    height: 20,
  },
});
