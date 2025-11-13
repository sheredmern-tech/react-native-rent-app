import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Text } from 'react-native';
import { Colors } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = 350;

interface ImageCarouselProps {
  images: string[];
  onImagePress: (index: number) => void;
  currentIndex?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  onImagePress,
  currentIndex = 0,
}) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({});
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const renderImage = ({ item, index }: { item: string; index: number }) => {
    const isLoading = imageLoading[index];
    const hasError = imageError[index];

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onImagePress(index)}
        style={styles.imageWrapper}
      >
        {!hasError ? (
          <>
            <Image
              source={{ uri: item }}
              style={styles.image}
              resizeMode="cover"
              onLoadStart={() => {
                setImageLoading(prev => ({ ...prev, [index]: true }));
              }}
              onLoadEnd={() => {
                setImageLoading(prev => ({ ...prev, [index]: false }));
              }}
              onError={() => {
                setImageLoading(prev => ({ ...prev, [index]: false }));
                setImageError(prev => ({ ...prev, [index]: true }));
              }}
            />
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            )}
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Image unavailable</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderImage}
        keyExtractor={(item, index) => `image-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToAlignment="center"
        decelerationRate="fast"
      />

      {/* Image Counter */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          {activeIndex + 1}/{images.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: IMAGE_HEIGHT,
    backgroundColor: Colors.surface,
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  errorContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray[100],
  },
  errorText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  counterContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  counterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
