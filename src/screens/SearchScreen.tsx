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
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  RootStackNavigationProp,
  PropertyType,
  Property,
  SortOption,
  SearchFilters,
  FilterPreset,
} from '../types';
import { Colors, Fonts } from '../constants';
import { SearchBar, FilterButton, PropertyCard, EmptyState, SortModal, FilterChip, ComparisonButton } from '../components';
import { mockProperties } from '../data';
import { sortProperties, getSortLabel } from '../utils/sortProperties';
import { useLocation } from '../context/LocationContext';

type SearchScreenProps = {
  navigation: RootStackNavigationProp<'Search'>;
};

const FILTER_PRESETS: FilterPreset[] = [
  {
    id: 'all',
    name: 'All Properties',
    filters: {},
  },
  {
    id: 'budget',
    name: 'Budget Friendly',
    filters: {
      maxPrice: '5000000',
    },
  },
  {
    id: 'family',
    name: 'Family Homes',
    filters: {
      bedrooms: '3',
      hasParking: true,
    },
  },
  {
    id: 'pet',
    name: 'Pet Friendly',
    filters: {
      petFriendly: true,
    },
  },
  {
    id: 'luxury',
    name: 'Luxury',
    filters: {
      minPrice: '15000000',
      furnished: true,
    },
  },
];

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const { userLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<PropertyType>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('Any');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [furnished, setFurnished] = useState<boolean | null>(null);
  const [petFriendly, setPetFriendly] = useState<boolean | null>(null);
  const [hasParking, setHasParking] = useState<boolean | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showSortModal, setShowSortModal] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('all');

  const filteredProperties = useMemo(() => {
    let filtered = mockProperties.filter((property) => {
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

      // Furnished filter
      if (furnished !== null && property.furnished !== furnished) {
        return false;
      }

      // Pet friendly filter
      if (petFriendly !== null && property.petFriendly !== petFriendly) {
        return false;
      }

      // Parking filter
      if (hasParking !== null && property.hasParking !== hasParking) {
        return false;
      }

      return true;
    });

    // Apply sorting
    return sortProperties(filtered, sortOption, userLocation);
  }, [
    searchQuery,
    selectedType,
    minPrice,
    maxPrice,
    selectedBedrooms,
    availableOnly,
    furnished,
    petFriendly,
    hasParking,
    sortOption,
    userLocation,
  ]);

  const handlePropertyPress = (property: Property) => {
    navigation.navigate('PropertyDetail', { property });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBedrooms('Any');
    setAvailableOnly(false);
    setFurnished(null);
    setPetFriendly(null);
    setHasParking(null);
    setSortOption('newest');
    setActivePreset('all');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedType !== 'all' ||
    minPrice ||
    maxPrice ||
    selectedBedrooms !== 'Any' ||
    availableOnly ||
    furnished !== null ||
    petFriendly !== null ||
    hasParking !== null;

  const formatPriceInput = (value: string) => {
    const numeric = value.replace(/\D/g, '');
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleMinPriceChange = (value: string) => {
    const formatted = formatPriceInput(value);
    setMinPrice(formatted);
    setActivePreset('');
  };

  const handleMaxPriceChange = (value: string) => {
    const formatted = formatPriceInput(value);
    setMaxPrice(formatted);
    setActivePreset('');
  };

  const handlePresetSelect = (preset: FilterPreset) => {
    setActivePreset(preset.id);

    // Clear all filters first
    setSearchQuery('');
    setSelectedType('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedBedrooms('Any');
    setAvailableOnly(false);
    setFurnished(null);
    setPetFriendly(null);
    setHasParking(null);

    // Apply preset filters
    if (preset.filters.minPrice) {
      setMinPrice(formatPriceInput(preset.filters.minPrice));
    }
    if (preset.filters.maxPrice) {
      setMaxPrice(formatPriceInput(preset.filters.maxPrice));
    }
    if (preset.filters.bedrooms) {
      setSelectedBedrooms(preset.filters.bedrooms);
    }
    if (preset.filters.furnished !== undefined) {
      setFurnished(preset.filters.furnished);
    }
    if (preset.filters.petFriendly !== undefined) {
      setPetFriendly(preset.filters.petFriendly);
    }
    if (preset.filters.hasParking !== undefined) {
      setHasParking(preset.filters.hasParking);
    }
  };

  const toggleFurnished = () => {
    setFurnished((prev) => (prev === null ? true : prev === true ? false : null));
    setActivePreset('');
  };

  const togglePetFriendly = () => {
    setPetFriendly((prev) => (prev === null ? true : prev === true ? false : null));
    setActivePreset('');
  };

  const toggleHasParking = () => {
    setHasParking((prev) => (prev === null ? true : prev === true ? false : null));
    setActivePreset('');
  };

  const activeFiltersCount = [
    searchQuery,
    selectedType !== 'all',
    minPrice,
    maxPrice,
    selectedBedrooms !== 'Any',
    availableOnly,
    furnished !== null,
    petFriendly !== null,
    hasParking !== null,
  ].filter(Boolean).length;

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

      {/* Filter Presets */}
      <View style={styles.presetsSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetsScroll}
        >
          {FILTER_PRESETS.map((preset) => (
            <TouchableOpacity
              key={preset.id}
              style={[
                styles.presetChip,
                activePreset === preset.id && styles.presetChipActive,
              ]}
              onPress={() => handlePresetSelect(preset)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.presetChipText,
                  activePreset === preset.id && styles.presetChipTextActive,
                ]}
              >
                {preset.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <SearchBar
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setActivePreset('');
          }}
          placeholder="Search by location or title..."
        />
      </View>

      {/* Sort Section */}
      <View style={styles.sortSection}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="swap-vertical" size={20} color={Colors.primary} />
          <Text style={styles.sortButtonText}>{getSortLabel(sortOption)}</Text>
          <Ionicons name="chevron-down" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Active Filters Bar */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersSection}>
          <Text style={styles.activeFiltersText}>
            {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} active
          </Text>
          <TouchableOpacity onPress={handleClearFilters}>
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

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
            onPress={() => {
              setSelectedType('all');
              setActivePreset('');
            }}
          />
          <FilterButton
            label="Apartment"
            isActive={selectedType === 'apartment'}
            onPress={() => {
              setSelectedType('apartment');
              setActivePreset('');
            }}
          />
          <FilterButton
            label="House"
            isActive={selectedType === 'house'}
            onPress={() => {
              setSelectedType('house');
              setActivePreset('');
            }}
          />
          <FilterButton
            label="Villa"
            isActive={selectedType === 'villa'}
            onPress={() => {
              setSelectedType('villa');
              setActivePreset('');
            }}
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
            onPress={() => {
              setSelectedBedrooms('Any');
              setActivePreset('');
            }}
          />
          <FilterButton
            label="1"
            isActive={selectedBedrooms === '1'}
            onPress={() => {
              setSelectedBedrooms('1');
              setActivePreset('');
            }}
          />
          <FilterButton
            label="2"
            isActive={selectedBedrooms === '2'}
            onPress={() => {
              setSelectedBedrooms('2');
              setActivePreset('');
            }}
          />
          <FilterButton
            label="3"
            isActive={selectedBedrooms === '3'}
            onPress={() => {
              setSelectedBedrooms('3');
              setActivePreset('');
            }}
          />
          <FilterButton
            label="4+"
            isActive={selectedBedrooms === '4+'}
            onPress={() => {
              setSelectedBedrooms('4+');
              setActivePreset('');
            }}
          />
        </ScrollView>
      </View>

      {/* Availability Toggle */}
      <View style={styles.filterSection}>
        <View style={styles.availabilityRow}>
          <Text style={styles.filterLabel}>Available Only</Text>
          <Switch
            value={availableOnly}
            onValueChange={(value) => {
              setAvailableOnly(value);
              setActivePreset('');
            }}
            trackColor={{ false: Colors.gray[300], true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>
      </View>

      {/* Additional Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Additional Filters</Text>
        <View style={styles.filterChipsRow}>
          <FilterChip
            label="Furnished"
            isActive={furnished}
            onPress={toggleFurnished}
            icon="home"
          />
          <FilterChip
            label="Pet Friendly"
            isActive={petFriendly}
            onPress={togglePetFriendly}
            icon="paw"
          />
          <FilterChip
            label="Parking"
            isActive={hasParking}
            onPress={toggleHasParking}
            icon="car"
          />
        </View>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredProperties.length}{' '}
          {filteredProperties.length === 1 ? 'property' : 'properties'} found
        </Text>
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
            onPress={() => handlePropertyPress(item)}
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

      <SortModal
        visible={showSortModal}
        currentSort={sortOption}
        onSelectSort={setSortOption}
        onClose={() => setShowSortModal(false)}
      />
      <ComparisonButton />
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
  presetsSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  presetsScroll: {
    gap: 8,
  },
  presetChip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  presetChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presetChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  presetChipTextActive: {
    color: 'white',
  },
  searchSection: {
    marginTop: 0,
  },
  sortSection: {
    marginTop: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: 'white',
    gap: 8,
  },
  sortButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
    flex: 1,
  },
  activeFiltersSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: `${Colors.primary}10`,
    borderRadius: 8,
  },
  activeFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
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
  filterChipsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
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
});
