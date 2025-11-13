import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackNavigationProp } from '../types';
import { Colors, Fonts } from '../constants';
import { PropertyCard, EmptyState } from '../components';
import { useFavorites } from '../context/FavoritesContext';

type FavoritesScreenProps = {
  navigation: RootStackNavigationProp<'Favorites'>;
};

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  navigation,
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const { getFavoriteProperties } = useFavorites();
  const favoriteProperties = getFavoriteProperties();

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handlePropertyPress = (propertyId: string) => {
    navigation.navigate('PropertyDetail', { propertyId });
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>My Favorites</Text>
      <Text style={styles.subtitle}>
        {favoriteProperties.length}{' '}
        {favoriteProperties.length === 1 ? 'property' : 'properties'} saved
      </Text>
    </View>
  );

  if (favoriteProperties.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderHeader()}
        <EmptyState
          icon="heart-outline"
          title="No Favorites Yet"
          message="Start adding properties you love!"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={favoriteProperties}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PropertyCard
            property={item}
            onPress={() => handlePropertyPress(item.id)}
            index={index}
          />
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Fonts.size.md,
    fontWeight: Fonts.weight.regular,
    color: Colors.text.secondary,
  },
});
