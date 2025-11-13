import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RootStackNavigationProp } from '../types';
import { Colors, Fonts } from '../constants';

type HomeScreenProps = {
  navigation: RootStackNavigationProp<'Home'>;
};

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Rent App</Text>
      <Text style={styles.subtitle}>Your home rental solution</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: Fonts.size.xxxl,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Fonts.size.lg,
    fontWeight: Fonts.weight.regular,
    color: Colors.text.secondary,
  },
});
