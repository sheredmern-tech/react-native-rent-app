import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants';

const THUMBNAIL_SIZE = 80;

interface ImageThumbnailGridProps {
  images: string[];
  onThumbnailPress: (index: number) => void;
  selectedIndex?: number;
}

export const ImageThumbnailGrid: React.FC<ImageThumbnailGridProps> = ({
  images,
  onThumbnailPress,
  selectedIndex = 0,
}) => {
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({});
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

  const renderThumbnail = (imageUrl: string, index: number) => {
    const isSelected = index === selectedIndex;
    const isLoading = imageLoading[index];
    const hasError = imageError[index];

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.thumbnailContainer,
          isSelected && styles.thumbnailSelected,
        ]}
        onPress={() => onThumbnailPress(index)}
        activeOpacity={0.7}
      >
        {!hasError ? (
          <>
            <Image
              source={{ uri: imageUrl }}
              style={styles.thumbnail}
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
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            )}
          </>
        ) : (
          <View style={styles.errorContainer} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {images.map((image, index) => renderThumbnail(image, index))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  thumbnailContainer: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.gray[300],
    marginRight: 8,
  },
  thumbnailSelected: {
    borderColor: Colors.primary,
    borderWidth: 3,
  },
  thumbnail: {
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
    backgroundColor: Colors.gray[100],
  },
});
