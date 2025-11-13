import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Fonts } from '../constants';

export const NewListingBadge: React.FC = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="star" size={10} color="#FFA000" />
      <Text style={styles.text}>NEW</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#FFF9C4',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFA000',
  },
  text: {
    fontSize: 10,
    fontFamily: Fonts.family.bold,
    color: '#FFA000',
  },
});
