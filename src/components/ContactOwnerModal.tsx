import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Property, ContactFormData } from '../types';
import { Colors, Fonts } from '../constants';
import { ContactMethodButton } from './ContactMethodButton';

interface ContactOwnerModalProps {
  visible: boolean;
  property: Property;
  onClose: () => void;
}

export const ContactOwnerModal: React.FC<ContactOwnerModalProps> = ({
  visible,
  property,
  onClose,
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};

    if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (+62 or 08...)';
    }

    if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Send message:', formData);
      Alert.alert(
        'Message Sent!',
        'The owner will contact you soon',
        [
          {
            text: 'OK',
            onPress: () => {
              setFormData({ name: '', email: '', phone: '', message: '' });
              setErrors({});
              onClose();
            },
          },
        ]
      );
    }
  };

  const handleWhatsApp = () => {
    console.log('Open WhatsApp:', property.owner.phone);
    Alert.alert('WhatsApp', `Opening WhatsApp to ${property.owner.phone}`);
  };

  const handleCall = () => {
    console.log('Call:', property.owner.phone);
    Alert.alert('Call', `Calling ${property.owner.phone}`);
  };

  const handleEmail = () => {
    console.log('Email:', property.owner.email);
    Alert.alert('Email', `Opening email to ${property.owner.email}`);
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isFormValid =
    formData.name.trim().length >= 3 &&
    validateEmail(formData.email) &&
    validatePhone(formData.phone) &&
    formData.message.trim().length >= 10;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <SafeAreaView edges={['top']}>
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={28} color={Colors.text.primary} />
              </TouchableOpacity>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scrollContent}
              >
                {/* Owner Header */}
                <View style={styles.header}>
                  <View style={styles.avatarContainer}>
                    {property.owner.avatar ? (
                      <Text>Image</Text>
                    ) : (
                      <Text style={styles.avatarInitials}>
                        {getInitials(property.owner.name)}
                      </Text>
                    )}
                  </View>
                  <View style={styles.ownerInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.ownerName}>{property.owner.name}</Text>
                      {property.owner.verified && (
                        <View style={styles.verifiedBadge}>
                          <Ionicons name="checkmark-circle" size={20} color="white" />
                        </View>
                      )}
                    </View>
                    <Text style={styles.responseTime}>
                      Usually responds {property.owner.responseTime.toLowerCase()}
                    </Text>
                  </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Quick Actions</Text>
                  <ContactMethodButton
                    icon="logo-whatsapp"
                    label="WhatsApp"
                    subtitle={property.owner.phone}
                    onPress={handleWhatsApp}
                    color="#25D366"
                  />
                  <ContactMethodButton
                    icon="call"
                    label="Call Owner"
                    subtitle={property.owner.phone}
                    onPress={handleCall}
                    color="#3B82F6"
                  />
                  <ContactMethodButton
                    icon="mail"
                    label="Send Email"
                    subtitle={property.owner.email}
                    onPress={handleEmail}
                    color="#F97316"
                  />
                </View>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Or send a message</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Contact Form */}
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Your name"
                      placeholderTextColor={Colors.text.disabled}
                      value={formData.name}
                      onChangeText={(text) => {
                        setFormData({...formData, name: text});
                        if (errors.name) setErrors({...errors, name: undefined});
                      }}
                    />
                    {errors.name && (
                      <Text style={styles.errorText}>{errors.name}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Your email"
                      placeholderTextColor={Colors.text.disabled}
                      value={formData.email}
                      onChangeText={(text) => {
                        setFormData({...formData, email: text});
                        if (errors.email) setErrors({...errors, email: undefined});
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Your phone"
                      placeholderTextColor={Colors.text.disabled}
                      value={formData.phone}
                      onChangeText={(text) => {
                        setFormData({...formData, phone: text});
                        if (errors.phone) setErrors({...errors, phone: undefined});
                      }}
                      keyboardType="phone-pad"
                    />
                    {errors.phone && (
                      <Text style={styles.errorText}>{errors.phone}</Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, styles.messageInput]}
                      placeholder="I'm interested in this property..."
                      placeholderTextColor={Colors.text.disabled}
                      value={formData.message}
                      onChangeText={(text) => {
                        setFormData({...formData, message: text});
                        if (errors.message) setErrors({...errors, message: undefined});
                      }}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                    {errors.message && (
                      <Text style={styles.errorText}>{errors.message}</Text>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={!isFormValid}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.submitButtonText}>Send Message</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInitials: {
    fontSize: 22,
    fontWeight: Fonts.weight.bold,
    color: Colors.white,
  },
  ownerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 20,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.primary,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  responseTime: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: Fonts.weight.semiBold,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginHorizontal: 16,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 0,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageInput: {
    height: 100,
    paddingTop: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.gray[300],
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: Fonts.weight.bold,
    color: Colors.white,
  },
});
