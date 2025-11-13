import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageViewerModalProps {
  visible: boolean;
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  visible,
  images,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({});
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible && flatListRef.current) {
      // Scroll to initial index when modal opens
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 100);
      setCurrentIndex(initialIndex);
    }
  }, [visible, initialIndex]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleShare = () => {
    console.log('Share image:', images[currentIndex]);
  };

  const renderImage = ({ item, index }: { item: string; index: number }) => {
    const isLoading = imageLoading[index];
    const hasError = imageError[index];

    return (
      <View style={styles.imageContainer}>
        {!hasError ? (
          <>
            <Image
              source={{ uri: item }}
              style={styles.image}
              resizeMode="contain"
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
                <ActivityIndicator size="large" color="white" />
              </View>
            )}
          </>
        ) : (
          <View style={styles.errorContainer}>
            <Ionicons name="image-outline" size={60} color="white" />
            <Text style={styles.errorText}>Image unavailable</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.container}>
        <StatusBar hidden />

        {/* Header */}
        <SafeAreaView edges={['top']} style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.counterText}>
              {currentIndex + 1} of {images.length}
            </Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={handleShare}
                activeOpacity={0.7}
              >
                <Ionicons name="share-social-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>

        {/* Image Carousel */}
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderImage}
          keyExtractor={(item, index) => `fullscreen-image-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          snapToAlignment="center"
          decelerationRate="fast"
          onScrollToIndexFailed={(info) => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: false });
            });
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  counterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
});
