import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, RootStackNavigationProp } from '../types/navigation';
import { Colors, Fonts } from '../constants';
import { RecommendationCard, EmptyState } from '../components';
import { useRecommendations } from '../context/RecommendationContext';

type SimilarPropertiesScreenRouteProp = RouteProp<
  RootStackParamList,
  'SimilarProperties'
>;

export const SimilarPropertiesScreen: React.FC = () => {
  const navigation =
    useNavigation<RootStackNavigationProp<'SimilarProperties'>>();
  const route = useRoute<SimilarPropertiesScreenRouteProp>();
  const { propertyId } = route.params;

  const { getSimilarProperties } = useRecommendations();
  const similarProperties = getSimilarProperties(propertyId);

  const handleCardPress = (property: any) => {
    navigation.push('PropertyDetail', { property: property.property });
  };

  if (similarProperties.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="home-outline"
          title="No Similar Properties"
          message="We couldn't find properties similar to this one at the moment"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          Found {similarProperties.length} similar{' '}
          {similarProperties.length === 1 ? 'property' : 'properties'}
        </Text>

        <View style={styles.grid}>
          {similarProperties.map((recommendation) => (
            <View key={recommendation.property.id} style={styles.cardWrapper}>
              <RecommendationCard
                recommendation={recommendation}
                onPress={() => handleCardPress(recommendation)}
                width={undefined}
              />
            </View>
          ))}
        </View>
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
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.family.regular,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  grid: {
    gap: 16,
  },
  cardWrapper: {
    width: '100%',
  },
});
