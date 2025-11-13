import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, RootStackNavigationProp } from '../types/navigation';
import { ReviewFormData } from '../types';
import { Colors, Fonts } from '../constants';
import { StarRating } from '../components';
import { useReviews } from '../context/ReviewContext';
import { useUser } from '../context/UserContext';

type WriteReviewScreenRouteProp = RouteProp<RootStackParamList, 'WriteReview'>;

const MIN_COMMENT_LENGTH = 10;
const MAX_COMMENT_LENGTH = 500;

export const WriteReviewScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'WriteReview'>>();
  const route = useRoute<WriteReviewScreenRouteProp>();
  const { propertyId, propertyTitle } = route.params;

  const { user } = useUser();
  const { addReview } = useReviews();

  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    comment: '',
  });

  const [errors, setErrors] = useState<Partial<ReviewFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ReviewFormData> = {};

    if (formData.rating === 0) {
      newErrors.rating = 0; // Will show error state
      Alert.alert('Rating Required', 'Please select a star rating');
      return false;
    }

    const commentLength = formData.comment.trim().length;

    if (commentLength < MIN_COMMENT_LENGTH) {
      newErrors.comment = `Comment must be at least ${MIN_COMMENT_LENGTH} characters`;
    }

    if (commentLength > MAX_COMMENT_LENGTH) {
      newErrors.comment = `Comment must not exceed ${MAX_COMMENT_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      addReview({
        propertyId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        rating: formData.rating,
        comment: formData.comment.trim(),
        verifiedStay: false, // In real app, this would be determined by backend
      });

      Alert.alert(
        'Review Submitted',
        'Thank you for your review!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }
  };

  const handleCancel = () => {
    if (formData.rating > 0 || formData.comment.trim().length > 0) {
      Alert.alert(
        'Discard Review?',
        'Are you sure you want to discard your review?',
        [
          { text: 'Continue Writing', style: 'cancel' },
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

  const handleRatingChange = (rating: number) => {
    setFormData({ ...formData, rating });
    if (errors.rating !== undefined) {
      setErrors({ ...errors, rating: undefined });
    }
  };

  const handleCommentChange = (text: string) => {
    setFormData({ ...formData, comment: text });
    if (errors.comment) {
      setErrors({ ...errors, comment: undefined });
    }
  };

  const commentLength = formData.comment.length;
  const isCommentValid = commentLength >= MIN_COMMENT_LENGTH && commentLength <= MAX_COMMENT_LENGTH;

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
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Write a Review</Text>
            <Text style={styles.propertyTitle}>{propertyTitle}</Text>
          </View>

          {/* Rating Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Rating *</Text>
            <View style={styles.ratingContainer}>
              <StarRating
                rating={formData.rating}
                size={40}
                interactive
                onRatingChange={handleRatingChange}
              />
              {formData.rating > 0 && (
                <Text style={styles.ratingText}>
                  {formData.rating === 5 && 'Excellent!'}
                  {formData.rating === 4 && 'Very Good'}
                  {formData.rating === 3 && 'Good'}
                  {formData.rating === 2 && 'Fair'}
                  {formData.rating === 1 && 'Poor'}
                </Text>
              )}
            </View>
          </View>

          {/* Comment Section */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.sectionTitle}>Your Review *</Text>
              <Text
                style={[
                  styles.characterCount,
                  !isCommentValid && commentLength > 0 && styles.characterCountError,
                  isCommentValid && styles.characterCountValid,
                ]}
              >
                {commentLength}/{MAX_COMMENT_LENGTH}
              </Text>
            </View>
            <TextInput
              style={[styles.input, errors.comment && styles.inputError]}
              value={formData.comment}
              onChangeText={handleCommentChange}
              placeholder={`Share your experience (minimum ${MIN_COMMENT_LENGTH} characters)`}
              placeholderTextColor={Colors.text.secondary}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              maxLength={MAX_COMMENT_LENGTH}
            />
            {errors.comment && (
              <Text style={styles.errorText}>{errors.comment}</Text>
            )}
            {!errors.comment && (
              <Text style={styles.hintText}>
                Help others by sharing details about your experience
              </Text>
            )}
          </View>

          {/* Guidelines */}
          <View style={styles.guidelinesContainer}>
            <Text style={styles.guidelinesTitle}>Review Guidelines:</Text>
            <Text style={styles.guidelineItem}>• Be honest and constructive</Text>
            <Text style={styles.guidelineItem}>• Focus on your actual experience</Text>
            <Text style={styles.guidelineItem}>• Avoid offensive language</Text>
            <Text style={styles.guidelineItem}>• Respect privacy (no personal info)</Text>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Submit Review</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.family.bold,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  propertyTitle: {
    fontSize: 16,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  ratingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: Fonts.family.medium,
    color: Colors.primary,
    marginTop: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  characterCount: {
    fontSize: 13,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
  },
  characterCountError: {
    color: Colors.danger,
  },
  characterCountValid: {
    color: Colors.success,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: Fonts.family.regular,
    color: Colors.text.primary,
    minHeight: 150,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.family.regular,
    color: Colors.danger,
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  guidelinesContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    backgroundColor: `${Colors.info}10`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${Colors.info}30`,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  guidelineItem: {
    fontSize: 13,
    fontFamily: Fonts.family.regular,
    color: Colors.text.primary,
    marginBottom: 4,
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
