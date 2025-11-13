import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useRecentViews } from '../context/RecentViewsContext';
import { mockProperties } from '../data';
import { PropertyCard } from '../components';
import { Colors, Fonts } from '../constants';
import { Property } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const RecentViewsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { recentViews, clearRecentViews, loading } = useRecentViews();

  // Get properties with details
  const recentProperties = recentViews
    .map((view) => {
      const property = mockProperties.find((p) => p.id === view.propertyId);
      return property ? { property, view } : null;
    })
    .filter((item): item is { property: Property; view: any } => item !== null);

  const handleClearAll = () => {
    Alert.alert(
      'Clear Recent Views?',
      'This will remove all your recently viewed properties.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearRecentViews();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handlePropertyPress = (property: Property) => {
    navigation.navigate('PropertyDetail', { property });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="eye-off-outline" size={64} color={Colors.text.disabled} />
      <Text style={styles.emptyTitle}>No Recently Viewed Properties</Text>
      <Text style={styles.emptyText}>
        Properties you view will appear here for quick access
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>
        {recentProperties.length} {recentProperties.length === 1 ? 'Property' : 'Properties'}
      </Text>
      {recentProperties.length > 0 && (
        <TouchableOpacity
          onPress={handleClearAll}
          style={styles.clearButton}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color="#F44336" />
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Recent Views</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <FlatList
        data={recentProperties}
        keyExtractor={(item) => item.view.propertyId}
        renderItem={({ item }) => (
          <PropertyCard
            property={item.property}
            onPress={() => handlePropertyPress(item.property)}
          />
        )}
        ListHeaderComponent={recentProperties.length > 0 ? renderHeader : null}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        contentContainerStyle={
          recentProperties.length === 0 ? styles.emptyListContent : styles.listContent
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  backButton: {
    padding: 8,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.primary,
  },
  headerRight: {
    width: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: Fonts.weight.semibold,
    color: Colors.text.primary,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: Fonts.weight.semibold,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
