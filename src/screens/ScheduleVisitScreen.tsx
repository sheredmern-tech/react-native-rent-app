import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, RootStackNavigationProp } from '../types/navigation';
import { BookingFormData, VisitType } from '../types';
import { Colors, Fonts } from '../constants';
import {
  DatePicker,
  TimeSlotPicker,
  VisitTypeSelector,
} from '../components';
import { useBookings } from '../context/BookingContext';
import { useUser } from '../context/UserContext';

type ScheduleVisitScreenRouteProp = RouteProp<RootStackParamList, 'ScheduleVisit'>;

export const ScheduleVisitScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'ScheduleVisit'>>();
  const route = useRoute<ScheduleVisitScreenRouteProp>();
  const { property } = route.params;

  const { user } = useUser();
  const { createBooking, getAvailableTimeSlots } = useBookings();

  const [formData, setFormData] = useState<BookingFormData>({
    date: null,
    timeSlot: '',
    visitType: 'in-person',
    notes: '',
  });

  const [availableSlots, setAvailableSlots] = useState<
    ReturnType<typeof getAvailableTimeSlots>
  >([]);

  useEffect(() => {
    if (formData.date) {
      const slots = getAvailableTimeSlots(formData.date);
      setAvailableSlots(slots);

      // Reset time slot if previously selected slot is no longer available
      if (formData.timeSlot && !slots.find(s => s.time === formData.timeSlot && s.available)) {
        setFormData(prev => ({ ...prev, timeSlot: '' }));
      }
    } else {
      setAvailableSlots([]);
    }
  }, [formData.date]);

  const validateForm = (): boolean => {
    if (!formData.date) {
      Alert.alert('Date Required', 'Please select a date for your visit');
      return false;
    }

    if (!formData.timeSlot) {
      Alert.alert('Time Required', 'Please select a time slot for your visit');
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      createBooking({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyLocation: property.location,
        propertyImage: property.imageUrls[0],
        userId: user.id,
        userName: user.name,
        date: formData.date!,
        timeSlot: formData.timeSlot,
        visitType: formData.visitType,
        notes: formData.notes.trim() || undefined,
      });

      Alert.alert(
        'Booking Requested',
        'Your visit has been scheduled. You will receive a confirmation soon.',
        [
          {
            text: 'View Bookings',
            onPress: () => {
              navigation.navigate('MyBookings');
            },
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  const handleCancel = () => {
    if (
      formData.date ||
      formData.timeSlot ||
      formData.notes.trim().length > 0
    ) {
      Alert.alert(
        'Discard Booking?',
        'Are you sure you want to discard this booking?',
        [
          { text: 'Continue Booking', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const canSubmit = formData.date && formData.timeSlot;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Property Card */}
          <View style={styles.propertyCard}>
            <Image
              source={{ uri: property.imageUrls[0] }}
              style={styles.propertyImage}
            />
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyTitle}>{property.title}</Text>
              <View style={styles.locationContainer}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={Colors.text.secondary}
                />
                <Text style={styles.locationText}>{property.location}</Text>
              </View>
              <Text style={styles.priceText}>Rp {property.price.toLocaleString()}/month</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Visit Type Selector */}
            <VisitTypeSelector
              selectedType={formData.visitType}
              onSelectType={(visitType) =>
                setFormData({ ...formData, visitType })
              }
            />

            {/* Date Picker */}
            <DatePicker
              selectedDate={formData.date}
              onSelectDate={(date) => setFormData({ ...formData, date })}
            />

            {/* Time Slot Picker */}
            <TimeSlotPicker
              selectedTimeSlot={formData.timeSlot}
              availableTimeSlots={availableSlots}
              onSelectTimeSlot={(timeSlot) =>
                setFormData({ ...formData, timeSlot })
              }
            />

            {/* Notes */}
            <View style={styles.notesSection}>
              <Text style={styles.notesLabel}>Additional Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                value={formData.notes}
                onChangeText={(notes) => setFormData({ ...formData, notes })}
                placeholder="Any questions or special requests?"
                placeholderTextColor={Colors.text.secondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={200}
              />
              <Text style={styles.characterCount}>
                {formData.notes.length}/200
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!canSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Schedule Visit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  propertyCard: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  propertyImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  propertyInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  propertyTitle: {
    fontSize: 18,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
  },
  priceText: {
    fontSize: 16,
    fontFamily: Fonts.family.bold,
    color: Colors.primary,
  },
  formContainer: {
    padding: 20,
  },
  notesSection: {
    marginBottom: 20,
  },
  notesLabel: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  notesInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: Fonts.family.regular,
    color: Colors.text.primary,
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    marginTop: 4,
    textAlign: 'right',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.text.disabled,
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.inverse,
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
  },
});
