import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../types';
import { Colors, Fonts } from '../constants';
import { useComparison } from '../context/ComparisonContext';
import { ComparisonRow } from '../components/ComparisonRow';
import { mockProperties } from '../data';
import {
  calculatePricePerSqm,
  getBestValueIndex,
  formatPrice,
  formatArea,
  getPropertyTypeLabel,
} from '../utils/comparisonHelpers';
import { MAX_COMPARISON_ITEMS } from '../types/comparison';

export const ComparisonScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'Comparison'>>();
  const { comparisonList, removeFromComparison, clearComparison } =
    useComparison();

  const comparisonProperties = mockProperties.filter((p) =>
    comparisonList.includes(p.id)
  );

  const handleClearAll = () => {
    Alert.alert(
      'Hapus Semua',
      'Apakah Anda yakin ingin menghapus semua properti dari perbandingan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: clearComparison,
        },
      ]
    );
  };

  const handleRemoveProperty = (propertyId: string) => {
    removeFromComparison(propertyId);
  };

  const handleViewDetail = (propertyId: string) => {
    navigation.navigate('PropertyDetail', { propertyId });
  };

  const handleBrowseProperties = () => {
    navigation.navigate('Home');
  };

  // Empty state
  if (comparisonProperties.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="git-compare-outline"
            size={80}
            color={Colors.textSecondary}
          />
          <Text style={styles.emptyTitle}>
            Belum Ada Properti untuk Dibandingkan
          </Text>
          <Text style={styles.emptyDescription}>
            Pilih hingga {MAX_COMPARISON_ITEMS} properti untuk dibandingkan
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={handleBrowseProperties}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyButtonText}>Telusuri Properti</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Prepare comparison data
  const prices = comparisonProperties.map((p) => p.price);
  const bedrooms = comparisonProperties.map((p) => p.bedrooms);
  const bathrooms = comparisonProperties.map((p) => p.bathrooms);
  const areas = comparisonProperties.map((p) => p.area);
  const pricesPerSqm = comparisonProperties.map((p) =>
    calculatePricePerSqm(p.price, p.area)
  );

  const bestPriceIndex = getBestValueIndex(prices, true);
  const bestBedroomIndex = getBestValueIndex(bedrooms);
  const bestBathroomIndex = getBestValueIndex(bathrooms);
  const bestAreaIndex = getBestValueIndex(areas);
  const bestPricePerSqmIndex = getBestValueIndex(pricesPerSqm, true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bandingkan Properti</Text>
          <Text style={styles.headerSubtitle}>
            {comparisonProperties.length} dari {MAX_COMPARISON_ITEMS} properti
            dipilih
          </Text>
          {comparisonProperties.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearAll}
              activeOpacity={0.7}
            >
              <Text style={styles.clearButtonText}>Hapus Semua</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Property Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cardsScrollView}
          contentContainerStyle={styles.cardsContainer}
        >
          {comparisonProperties.map((property) => (
            <View key={property.id} style={styles.propertyCard}>
              <Image
                source={{ uri: property.imageUrls[0] }}
                style={styles.propertyImage}
              />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveProperty(property.id)}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={28} color="#FF3B30" />
              </TouchableOpacity>
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle} numberOfLines={2}>
                  {property.title}
                </Text>
                <Text style={styles.propertyLocation} numberOfLines={1}>
                  {property.location}
                </Text>
                <Text style={styles.propertyPrice}>
                  {formatPrice(property.price)}/bulan
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Comparison Table */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Detail Perbandingan</Text>

          <ComparisonRow
            label="Tipe Properti"
            values={comparisonProperties.map((p) =>
              getPropertyTypeLabel(p.type)
            )}
            isAlternate={false}
          />
          <ComparisonRow
            label="Kamar Tidur"
            values={bedrooms}
            highlightBest
            highlightIndex={bestBedroomIndex}
            isAlternate
          />
          <ComparisonRow
            label="Kamar Mandi"
            values={bathrooms}
            highlightBest
            highlightIndex={bestBathroomIndex}
            isAlternate={false}
          />
          <ComparisonRow
            label="Luas"
            values={comparisonProperties.map((p) => formatArea(p.area))}
            highlightBest
            highlightIndex={bestAreaIndex}
            isAlternate
          />
          <ComparisonRow
            label="Harga per m²"
            values={pricesPerSqm.map((p) => `Rp ${(p / 1000).toFixed(0)}k`)}
            highlightBest
            highlightIndex={bestPricePerSqmIndex}
            isAlternate={false}
          />
          <ComparisonRow
            label="Furnished"
            values={comparisonProperties.map((p) => p.furnished)}
            isAlternate
          />
          <ComparisonRow
            label="Pet Friendly"
            values={comparisonProperties.map((p) => p.petFriendly)}
            isAlternate={false}
          />
          <ComparisonRow
            label="Parkir"
            values={comparisonProperties.map((p) => p.hasParking)}
            isAlternate
          />

          {/* Features Row */}
          <View style={[styles.featuresRow, styles.alternateRow]}>
            <View style={styles.featuresLabel}>
              <Text style={styles.labelText}>Fitur</Text>
            </View>
            {comparisonProperties.map((property, index) => (
              <View key={index} style={styles.featuresColumn}>
                <View style={styles.featuresList}>
                  {property.features && property.features.length > 0 ? (
                    property.features.slice(0, 3).map((feature, fIndex) => (
                      <Text key={fIndex} style={styles.featureItem}>
                        • {feature}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.noFeatures}>-</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {comparisonProperties.map((property, index) => (
            <TouchableOpacity
              key={property.id}
              style={[
                styles.detailButton,
                comparisonProperties.length === 1 && styles.detailButtonFull,
                comparisonProperties.length === 2 && styles.detailButtonHalf,
              ]}
              onPress={() => handleViewDetail(property.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.detailButtonText} numberOfLines={1}>
                Lihat Properti {index + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: Colors.card,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  emptyButtonText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  clearButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.error,
  },
  cardsScrollView: {
    marginVertical: 20,
  },
  cardsContainer: {
    paddingHorizontal: 16,
  },
  propertyCard: {
    width: 250,
    height: 300,
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: 150,
    backgroundColor: Colors.border,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.card,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 22,
  },
  propertyLocation: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  propertyPrice: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.primary,
  },
  tableContainer: {
    marginHorizontal: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tableTitle: {
    fontSize: 18,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  featuresRow: {
    flexDirection: 'row',
    minHeight: 80,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.card,
  },
  alternateRow: {
    backgroundColor: '#F5F5F5',
  },
  featuresLabel: {
    width: '40%',
    justifyContent: 'flex-start',
    paddingTop: 12,
    paddingLeft: 16,
    paddingRight: 8,
  },
  labelText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.text,
  },
  featuresColumn: {
    width: '20%',
    justifyContent: 'flex-start',
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  featuresList: {
    alignItems: 'flex-start',
  },
  featureItem: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginBottom: 4,
    textAlign: 'left',
  },
  noFeatures: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  detailButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  detailButtonFull: {
    flex: 1,
  },
  detailButtonHalf: {
    flex: 1,
  },
  detailButtonText: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.card,
  },
  bottomSpacing: {
    height: 32,
  },
});
