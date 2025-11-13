import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../types';
import { Colors, Fonts } from '../constants';
import { useComparison } from '../context/ComparisonContext';

export const ComparisonButton: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'Home'>>();
  const { getComparisonCount } = useComparison();
  const count = getComparisonCount();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (count > 0) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [count]);

  if (count === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Comparison')}
        activeOpacity={0.8}
      >
        <Ionicons name="git-compare-outline" size={28} color="#FFFFFF" />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    zIndex: 999,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: Fonts.family.bold,
    color: '#FFFFFF',
  },
});