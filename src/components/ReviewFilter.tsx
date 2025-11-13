import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReviewSortOption, ReviewFilterRating } from '../types';
import { Colors, Fonts } from '../constants';

interface ReviewFilterProps {
  sortBy: ReviewSortOption;
  filterRating: ReviewFilterRating;
  onSortChange: (sort: ReviewSortOption) => void;
  onFilterChange: (rating: ReviewFilterRating) => void;
}

const SORT_OPTIONS: { value: ReviewSortOption; label: string }[] = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'helpful', label: 'Most Helpful' },
  { value: 'highest', label: 'Highest Rating' },
  { value: 'lowest', label: 'Lowest Rating' },
];

const FILTER_OPTIONS: { value: ReviewFilterRating; label: string; icon?: string }[] = [
  { value: 'all', label: 'All Ratings' },
  { value: '5', label: '5 Stars', icon: 'star' },
  { value: '4', label: '4 Stars', icon: 'star' },
  { value: '3', label: '3 Stars', icon: 'star' },
  { value: '2', label: '2 Stars', icon: 'star' },
  { value: '1', label: '1 Star', icon: 'star' },
];

export const ReviewFilter: React.FC<ReviewFilterProps> = ({
  sortBy,
  filterRating,
  onSortChange,
  onFilterChange,
}) => {
  const [showSortOptions, setShowSortOptions] = React.useState(false);

  const getSortLabel = (): string => {
    const option = SORT_OPTIONS.find((opt) => opt.value === sortBy);
    return option?.label || 'Sort';
  };

  return (
    <View style={styles.container}>
      {/* Sort Dropdown */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortOptions(!showSortOptions)}
          activeOpacity={0.7}
        >
          <Ionicons name="filter-outline" size={18} color={Colors.primary} />
          <Text style={styles.sortButtonText}>{getSortLabel()}</Text>
          <Ionicons
            name={showSortOptions ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={Colors.text.secondary}
          />
        </TouchableOpacity>

        {showSortOptions && (
          <View style={styles.sortOptionsContainer}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sortOption,
                  sortBy === option.value && styles.sortOptionActive,
                ]}
                onPress={() => {
                  onSortChange(option.value);
                  setShowSortOptions(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === option.value && styles.sortOptionTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {sortBy === option.value && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.filterChip,
              filterRating === option.value && styles.filterChipActive,
            ]}
            onPress={() => onFilterChange(option.value)}
            activeOpacity={0.7}
          >
            {option.icon && (
              <Ionicons
                name={option.icon as any}
                size={14}
                color={
                  filterRating === option.value
                    ? Colors.text.inverse
                    : Colors.text.secondary
                }
                style={styles.filterIcon}
              />
            )}
            <Text
              style={[
                styles.filterChipText,
                filterRating === option.value && styles.filterChipTextActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sortButtonText: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.family.medium,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  sortOptionsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sortOptionActive: {
    backgroundColor: `${Colors.primary}10`,
  },
  sortOptionText: {
    fontSize: 15,
    fontFamily: Fonts.family.regular,
    color: Colors.text.primary,
  },
  sortOptionTextActive: {
    fontFamily: Fonts.family.semiBold,
    color: Colors.primary,
  },
  filtersScroll: {
    flexGrow: 0,
  },
  filtersContent: {
    gap: 8,
    paddingRight: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterIcon: {
    marginRight: 4,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: Fonts.family.medium,
    color: Colors.text.secondary,
  },
  filterChipTextActive: {
    color: Colors.text.inverse,
  },
});
