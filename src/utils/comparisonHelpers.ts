import { Property } from '../types';
import { ComparisonProperty } from '../types/comparison';

export const calculatePricePerSqm = (price: number, area: number): number => {
  if (area === 0) return 0;
  return Math.round(price / area);
};

export const getBestValueIndex = (
  values: number[],
  lowest: boolean = false
): number => {
  if (values.length === 0) return -1;

  if (lowest) {
    const minValue = Math.min(...values);
    return values.indexOf(minValue);
  } else {
    const maxValue = Math.max(...values);
    return values.indexOf(maxValue);
  }
};

export const formatComparisonValue = (value: any): string => {
  if (typeof value === 'boolean') {
    return value ? '✓' : '✗';
  }

  if (typeof value === 'number') {
    return value.toLocaleString('id-ID');
  }

  return String(value);
};

export const getPropertyForComparison = (
  property: Property
): ComparisonProperty => {
  return {
    id: property.id,
    title: property.title,
    location: property.location,
    price: property.price,
    imageUrl: property.imageUrls[0] || '',
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    type: property.type,
    furnished: property.furnished,
    petFriendly: property.petFriendly,
    hasParking: property.hasParking,
    features: property.features,
  };
};

export const formatPrice = (price: number): string => {
  return `Rp ${(price / 1000000).toFixed(1)} jt`;
};

export const formatArea = (area: number): string => {
  return `${area} m²`;
};

export const getPropertyTypeLabel = (type: string): string => {
  const labels: { [key: string]: string } = {
    apartment: 'Apartemen',
    house: 'Rumah',
    villa: 'Villa',
  };
  return labels[type] || type;
};
