import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants';

interface ComparisonRowProps {
  label: string;
  values: (string | number | boolean)[];
  highlightBest?: boolean;
  highlightIndex?: number;
  isAlternate?: boolean;
}

export const ComparisonRow: React.FC<ComparisonRowProps> = ({
  label,
  values,
  highlightBest = false,
  highlightIndex,
  isAlternate = false,
}) => {
  const renderValue = (value: string | number | boolean, index: number) => {
    const isHighlighted = highlightBest && highlightIndex === index;

    if (typeof value === 'boolean') {
      return (
        <View
          style={[
            styles.valueContainer,
            isHighlighted && styles.highlightedContainer,
          ]}
        >
          <Ionicons
            name={value ? 'checkmark' : 'close'}
            size={24}
            color={value ? '#2E7D32' : '#C62828'}
          />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.valueContainer,
          isHighlighted && styles.highlightedContainer,
        ]}
      >
        <Text
          style={[
            styles.valueText,
            isHighlighted && styles.highlightedText,
          ]}
        >
          {value}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.row, isAlternate && styles.alternateRow]}>
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      {values.map((value, index) => (
        <View key={index} style={styles.valueColumn}>
          {renderValue(value, index)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    minHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  alternateRow: {
    backgroundColor: '#F5F5F5',
  },
  labelContainer: {
    width: '40%',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 8,
  },
  labelText: {
    fontSize: 14,
    fontFamily: Fonts.family.medium,
    color: Colors.text.primary,
  },
  valueColumn: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  valueContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  highlightedContainer: {
    backgroundColor: '#E8F5E9',
  },
  valueText: {
    fontSize: 14,
    fontFamily: Fonts.family.regular,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  highlightedText: {
    color: '#2E7D32',
    fontFamily: Fonts.family.semiBold,
  },
});