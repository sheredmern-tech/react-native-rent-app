import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../constants';

export const PrivacyScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last updated: November 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            At Rent App, we take your privacy seriously. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you use
            our mobile application. Please read this privacy policy carefully.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information that you provide directly to us, including:
          </Text>
          <Text style={styles.bulletPoint}>• Name and contact information</Text>
          <Text style={styles.bulletPoint}>• Email address and phone number</Text>
          <Text style={styles.bulletPoint}>• Profile information and preferences</Text>
          <Text style={styles.bulletPoint}>• Search history and saved properties</Text>
          <Text style={styles.bulletPoint}>• Communication with property owners</Text>
          <Text style={styles.paragraph}>
            We also automatically collect certain information when you use our app:
          </Text>
          <Text style={styles.bulletPoint}>• Device information and identifiers</Text>
          <Text style={styles.bulletPoint}>• Usage data and analytics</Text>
          <Text style={styles.bulletPoint}>• Location data (with your permission)</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use your information to:
          </Text>
          <Text style={styles.bulletPoint}>• Provide and improve our services</Text>
          <Text style={styles.bulletPoint}>• Connect you with property owners</Text>
          <Text style={styles.bulletPoint}>• Send notifications about new listings</Text>
          <Text style={styles.bulletPoint}>• Personalize your experience</Text>
          <Text style={styles.bulletPoint}>• Analyze usage patterns and trends</Text>
          <Text style={styles.bulletPoint}>• Communicate important updates</Text>
          <Text style={styles.bulletPoint}>• Prevent fraud and ensure security</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Information Sharing</Text>
          <Text style={styles.paragraph}>
            We do not sell your personal information. We may share your information
            with:
          </Text>
          <Text style={styles.bulletPoint}>• Property owners when you contact them</Text>
          <Text style={styles.bulletPoint}>• Service providers who assist our operations</Text>
          <Text style={styles.bulletPoint}>• Law enforcement when required by law</Text>
          <Text style={styles.paragraph}>
            All third parties are obligated to protect your information and use it only
            for the purposes we specify.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement appropriate technical and organizational measures to protect
            your personal information against unauthorized access, alteration,
            disclosure, or destruction. However, no method of transmission over the
            Internet is 100% secure, and we cannot guarantee absolute security.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Your Rights</Text>
          <Text style={styles.paragraph}>
            You have the right to:
          </Text>
          <Text style={styles.bulletPoint}>• Access your personal information</Text>
          <Text style={styles.bulletPoint}>• Correct inaccurate data</Text>
          <Text style={styles.bulletPoint}>• Request deletion of your data</Text>
          <Text style={styles.bulletPoint}>• Opt-out of marketing communications</Text>
          <Text style={styles.bulletPoint}>• Export your data</Text>
          <Text style={styles.paragraph}>
            To exercise these rights, please contact us at support@rentapp.com.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Cookies and Tracking</Text>
          <Text style={styles.paragraph}>
            We use cookies and similar tracking technologies to collect usage
            information and improve our services. You can control cookies through your
            device settings, but disabling them may limit functionality.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
          <Text style={styles.paragraph}>
            Our service is not intended for users under the age of 18. We do not
            knowingly collect personal information from children. If you believe we have
            collected information from a child, please contact us immediately.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of
            any changes by posting the new policy on this page and updating the "Last
            updated" date. Your continued use of the app constitutes acceptance of the
            updated policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions or concerns about this Privacy Policy, please contact
            us:
          </Text>
          <Text style={styles.contactText}>Email: support@rentapp.com</Text>
          <Text style={styles.contactText}>Website: www.rentapp.com</Text>
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
    marginTop: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});
