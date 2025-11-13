import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants';
import { ShareData } from '../types/share';
import {
  generateShareLink,
  generateShareText,
  copyToClipboard,
  openWhatsApp,
  openFacebook,
  openTwitter,
} from '../utils/shareHelpers';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  property: ShareData;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  property,
}) => {
  const shareLink = generateShareLink(property.propertyId);
  const shareText = generateShareText(property);

  const handleWhatsAppPress = async () => {
    onClose();
    await openWhatsApp(shareText);
  };

  const handleFacebookPress = async () => {
    onClose();
    await openFacebook(shareLink);
  };

  const handleTwitterPress = async () => {
    onClose();
    await openTwitter(shareText);
  };

  const handleCopyPress = async () => {
    const success = await copyToClipboard(shareLink);
    onClose();

    if (success) {
      Alert.alert('Success', 'Link copied to clipboard', [{ text: 'OK' }]);
    } else {
      Alert.alert('Error', 'Failed to copy link', [{ text: 'OK' }]);
    }
  };

  const handleMorePress = async () => {
    try {
      await Share.share({
        message: shareText,
        title: property.title,
      });
      onClose();
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatPrice = (price: number): string => {
    return `Rp ${price.toLocaleString('id-ID')}/month`;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Content */}
        <View style={styles.content}>
          {/* Property Preview */}
          <View style={styles.preview}>
            <Text style={styles.previewTitle} numberOfLines={1}>
              {property.title}
            </Text>
            <Text style={styles.previewDetails}>
              {formatPrice(property.price)} • {property.location}
            </Text>
          </View>

          {/* Share Options */}
          <View style={styles.optionsContainer}>
            {/* WhatsApp */}
            <TouchableOpacity
              style={styles.option}
              onPress={handleWhatsAppPress}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              <Text style={styles.optionText}>Share to WhatsApp</Text>
            </TouchableOpacity>

            {/* Facebook */}
            <TouchableOpacity
              style={styles.option}
              onPress={handleFacebookPress}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              <Text style={styles.optionText}>Share to Facebook</Text>
            </TouchableOpacity>

            {/* Twitter */}
            <TouchableOpacity
              style={styles.option}
              onPress={handleTwitterPress}
              activeOpacity={0.7}
            >
              <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
              <Text style={styles.optionText}>Share to Twitter</Text>
            </TouchableOpacity>

            {/* Copy Link */}
            <TouchableOpacity
              style={styles.option}
              onPress={handleCopyPress}
              activeOpacity={0.7}
            >
              <Ionicons name="copy-outline" size={24} color={Colors.gray[700]} />
              <Text style={styles.optionText}>Copy Link</Text>
            </TouchableOpacity>

            {/* More Options */}
            <TouchableOpacity
              style={[styles.option, styles.lastOption]}
              onPress={handleMorePress}
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={24} color={Colors.gray[700]} />
              <Text style={styles.optionText}>More...</Text>
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  preview: {
    backgroundColor: Colors.gray[100],
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: Fonts.weight.bold,
    color: Colors.gray[900],
    marginBottom: 4,
  },
  previewDetails: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  optionsContainer: {
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: Colors.gray[900],
    marginLeft: 16,
    fontWeight: Fonts.weight.regular,
  },
  cancelButton: {
    height: 48,
    backgroundColor: Colors.gray[100],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: Fonts.weight.medium,
    color: Colors.gray[700],
  },
});
