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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, RootStackNavigationProp } from '../types/navigation';
import { ReviewFormData } from '../types';
import { Colors, Fonts } from '../constants';
import { StarRating, LoadingSpinner } from '../components';
import { useReviews } from '../context/ReviewContext';

type EditReviewScreenRouteProp = RouteProp<RootStackParamList, 'EditReview'>;

const MIN_COMMENT_LENGTH = 10;
const MAX_COMMENT_LENGTH = 500;

export const EditReviewScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'EditReview'>>();
  const route = useRoute<EditReviewScreenRouteProp>();
  const { reviewId, propertyId } = route.params;

  const { reviews, updateReview, deleteReview } = useReviews();

  const existingReview = reviews.find((r) => r.id === reviewId);

  const [formData, setFormData] = useState<ReviewFormData>({
    rating: existingReview?.rating || 0,
    comment: existingReview?.comment || '',
  });

  const [errors, setErrors] = useState<Partial<ReviewFormData>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!existingReview) {
      Alert.alert('Error', 'Review not found', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  }, [existingReview, navigation]);

  const validateForm = (): boolean => {
    const newErrors: Partial<ReviewFormData> = {};

    if (formData.rating === 0) {
      newErrors.rating = 0;
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

  const handleSave = () => {
    if (validateForm()) {
      setLoading(true);

      updateReview(reviewId, {
        rating: formData.rating,
        comment: formData.comment.trim(),
      });

      setTimeout(() => {
        setLoading(false);
        Alert.alert(
          'Review Updated',
          'Your review has been updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }, 500);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteReview(reviewId);
            Alert.alert(
              'Review Deleted',
              'Your review has been deleted',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleCancel = () => {
    const hasChanges =
      formData.rating !== existingReview?.rating ||
      formData.comment.trim() !== existingReview?.comment;

    if (hasChanges) {
      Alert.alert(
        'Discard Changes?',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Continue Editing', style: 'cancel' },
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

  if (!existingReview) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <LoadingSpinner message="Loading review..." />
      </SafeAreaView>
    );
  }

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
            <Text style={styles.title}>Edit Review</Text>
            {existingReview.createdAt && (
              <Text style={styles.dateText}>
                Originally posted on{' '}
                {existingReview.createdAt.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            )}
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
          </View>

          {/* Delete Button */}
          <View style={styles.deleteSection}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={20} color={Colors.danger} />
              <Text style={styles.deleteButtonText}>Delete Review</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.8}
            disabled={loading}
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
  dateText: {
    fontSize: 14,
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
  deleteSection: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: `${Colors.danger}10`,
    borderWidth: 1,
    borderColor: `${Colors.danger}30`,
  },
  deleteButtonText: {
    fontSize: 15,
    fontFamily: Fonts.family.semiBold,
    color: Colors.danger,
    marginLeft: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 0 : 16,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
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
