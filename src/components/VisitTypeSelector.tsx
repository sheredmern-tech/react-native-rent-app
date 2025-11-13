import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VisitType } from '../types';
import { Colors, Fonts } from '../constants';

interface VisitTypeSelectorProps {
  selectedType: VisitType;
  onSelectType: (type: VisitType) => void;
}

interface VisitTypeOption {
  type: VisitType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

const VISIT_TYPE_OPTIONS: VisitTypeOption[] = [
  {
    type: 'in-person',
    label: 'In-Person Visit',
    icon: 'home-outline',
    description: 'Visit the property physically',
  },
  {
    type: 'virtual',
    label: 'Virtual Tour',
    icon: 'videocam-outline',
    description: 'Video call with property owner',
  },
];

export const VisitTypeSelector: React.FC<VisitTypeSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Visit Type</Text>
      <View style={styles.optionsContainer}>
        {VISIT_TYPE_OPTIONS.map((option) => {
          const isSelected = selectedType === option.type;
          return (
            <TouchableOpacity
              key={option.type}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonActive,
              ]}
              onPress={() => onSelectType(option.type)}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.iconContainer,
                    isSelected && styles.iconContainerActive,
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={24}
                    color={isSelected ? Colors.primary : Colors.text.secondary}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
              </View>
              {isSelected && (
                <View style={styles.checkmarkContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={Colors.primary}
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}08`,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconContainerActive: {
    backgroundColor: `${Colors.primary}15`,
  },
  textContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: Fonts.family.semiBold,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  optionLabelActive: {
    color: Colors.primary,
  },
  optionDescription: {
    fontSize: 13,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
  },
  checkmarkContainer: {
    marginLeft: 8,
  },
});
