import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackNavigationProp, PropertyType, Property } from '../types';
import { Colors, Fonts } from '../constants';
import { SearchBar, FilterButton, PropertyCard, EmptyState } from '../components';
import { mockProperties } from '../data';

type SearchScreenProps = {
  navigation: RootStackNavigationProp<'Search'>;
};

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PropertyType>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('Any');
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = property.title.toLowerCase().includes(query);
        const matchesLocation = property.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLocation) {
          return false;
        }
      }

      // Property type filter
      if (selectedType !== 'all' && property.type !== selectedType) {
        return false;
      }

      // Price range filter
      if (minPrice) {
        const min = parseFloat(minPrice.replace(/\./g, ''));
        if (property.price < min) {
          return false;
        }
      }
      if (maxPrice) {
        const max = parseFloat(maxPrice.replace(/\./g, ''));
        if (property.price > max) {
          return false;
        }
      }

      // Bedrooms filter
      if (selectedBedrooms !== 'Any') {
        if (selectedBedrooms === '4+') {
          if (property.bedrooms < 4) {
            return false;
          }
        } else {
          if (property.bedrooms !== parseInt(selectedBedrooms)) {
            return false;
          }
        }
      }

      // Availability filter
      if (availableOnly && !property.isAvailable) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedType, minPrice, maxPrice, selectedBedrooms, availableOnly]);

  const handlePropertyPress = (propertyId: string) => {
    navigation.navigate('PropertyDetail', { propertyId });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBedrooms('Any');
    setAvailableOnly(false);
  };

  const hasActiveFilters =
    searchQuery ||
    selectedType !== 'all' ||
    minPrice ||
    maxPrice ||
    selectedBedrooms !== 'Any' ||
    availableOnly;

  const formatPriceInput = (value: string) => {
    // Remove non-numeric characters
    const numeric = value.replace(/\D/g, '');
    // Format with thousand separator
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleMinPriceChange = (value: string) => {
    const formatted = formatPriceInput(value);
    setMinPrice(formatted);
  };

  const handleMaxPriceChange = (value: string) => {
    const formatted = formatPriceInput(value);
    setMaxPrice(formatted);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Back Button and Title */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Search Properties</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by location or title..."
        />
      </View>

      {/* Property Type Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Property Type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
        >
          <FilterButton
            label="All"
            isActive={selectedType === 'all'}
            onPress={() => setSelectedType('all')}
          />
          <FilterButton
            label="Apartment"
            isActive={selectedType === 'apartment'}
            onPress={() => setSelectedType('apartment')}
          />
          <FilterButton
            label="House"
            isActive={selectedType === 'house'}
            onPress={() => setSelectedType('house')}
          />
          <FilterButton
            label="Villa"
            isActive={selectedType === 'villa'}
            onPress={() => setSelectedType('villa')}
          />
        </ScrollView>
      </View>

      {/* Price Range */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Price Range</Text>
        <View style={styles.priceInputRow}>
          <View style={styles.priceInputContainer}>
            <Text style={styles.pricePrefix}>Rp</Text>
            <TextInput
              style={styles.priceInput}
              value={minPrice}
              onChangeText={handleMinPriceChange}
              placeholder="Min"
              placeholderTextColor={Colors.text.disabled}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.priceSeparator}>-</Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.pricePrefix}>Rp</Text>
            <TextInput
              style={styles.priceInput}
              value={maxPrice}
              onChangeText={handleMaxPriceChange}
              placeholder="Max"
              placeholderTextColor={Colors.text.disabled}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Bedrooms Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Bedrooms</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
        >
          <FilterButton
            label="Any"
            isActive={selectedBedrooms === 'Any'}
            onPress={() => setSelectedBedrooms('Any')}
          />
          <FilterButton
            label="1"
            isActive={selectedBedrooms === '1'}
            onPress={() => setSelectedBedrooms('1')}
          />
          <FilterButton
            label="2"
            isActive={selectedBedrooms === '2'}
            onPress={() => setSelectedBedrooms('2')}
          />
          <FilterButton
            label="3"
            isActive={selectedBedrooms === '3'}
            onPress={() => setSelectedBedrooms('3')}
          />
          <FilterButton
            label="4+"
            isActive={selectedBedrooms === '4+'}
            onPress={() => setSelectedBedrooms('4+')}
          />
        </ScrollView>
      </View>

      {/* Availability Toggle */}
      <View style={styles.filterSection}>
        <View style={styles.availabilityRow}>
          <Text style={styles.filterLabel}>Available Only</Text>
          <Switch
            value={availableOnly}
            onValueChange={setAvailableOnly}
            trackColor={{ false: Colors.gray[300], true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
        </Text>
        {hasActiveFilters && (
          <TouchableOpacity
            onPress={handleClearFilters}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <PropertyCard
            property={item}
            onPress={() => handlePropertyPress(item.id)}
            index={index}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No Properties Found"
            message="Try adjusting your search filters"
            actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
            onAction={hasActiveFilters ? handleClearFilters : undefined}
          />
        }
        contentContainerStyle={styles.contentContainer}
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
  contentContainer: {
    paddingBottom: 20,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.primary,
  },
  searchSection: {
    marginTop: 16,
  },
  filterSection: {
    marginTop: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: Fonts.weight.bold,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  filterScrollView: {
    flexGrow: 0,
  },
  priceInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  pricePrefix: {
    fontSize: Fonts.size.md,
    fontWeight: Fonts.weight.medium,
    color: Colors.text.secondary,
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    fontSize: Fonts.size.md,
    color: Colors.text.primary,
    padding: 0,
  },
  priceSeparator: {
    fontSize: Fonts.size.md,
    color: Colors.text.secondary,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: Fonts.size.md,
    fontWeight: Fonts.weight.semiBold,
    color: Colors.text.primary,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: Fonts.size.sm,
    fontWeight: Fonts.weight.semiBold,
    color: Colors.primary,
  },
});
