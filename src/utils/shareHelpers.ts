import { Linking, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ShareData } from '../types/share';

/**
 * Generate a shareable link for a property
 */
export const generateShareLink = (propertyId: string): string => {
  return `https://rentapp.com/property/${propertyId}`;
};

/**
 * Generate share text for a property
 */
export const generateShareText = (property: ShareData): string => {
  const link = generateShareLink(property.propertyId);
  const formattedPrice = `Rp ${property.price.toLocaleString('id-ID')}`;
  return `${property.title} - ${formattedPrice}/month in ${property.location}. View details: ${link}`;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await Clipboard.setStringAsync(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * Open WhatsApp with pre-filled text
 */
export const openWhatsApp = async (text: string): Promise<void> => {
  const url = `whatsapp://send?text=${encodeURIComponent(text)}`;

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'WhatsApp Not Installed',
        'Please install WhatsApp to share via this app',
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    Alert.alert(
      'Error',
      'Failed to open WhatsApp. Please try another sharing method.',
      [{ text: 'OK' }]
    );
  }
};

/**
 * Open Facebook share dialog
 */
export const openFacebook = async (url: string): Promise<void> => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  try {
    const canOpen = await Linking.canOpenURL(facebookUrl);
    if (canOpen) {
      await Linking.openURL(facebookUrl);
    } else {
      Alert.alert(
        'Cannot Open Facebook',
        'Please install Facebook app or try another sharing method',
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('Error opening Facebook:', error);
    Alert.alert(
      'Error',
      'Failed to open Facebook. Please try another sharing method.',
      [{ text: 'OK' }]
    );
  }
};

/**
 * Open Twitter with pre-filled text (max 280 chars)
 */
export const openTwitter = async (text: string): Promise<void> => {
  // Truncate to 280 characters if needed
  let tweetText = text;
  if (text.length > 280) {
    tweetText = text.substring(0, 277) + '...';
  }

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  try {
    const canOpen = await Linking.canOpenURL(twitterUrl);
    if (canOpen) {
      await Linking.openURL(twitterUrl);
    } else {
      Alert.alert(
        'Cannot Open Twitter',
        'Please install Twitter app or try another sharing method',
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('Error opening Twitter:', error);
    Alert.alert(
      'Error',
      'Failed to open Twitter. Please try another sharing method.',
      [{ text: 'OK' }]
    );
  }
};

/**
 * Check if a URL can be opened
 */
export const canOpenURL = async (url: string): Promise<boolean> => {
  try {
    return await Linking.canOpenURL(url);
  } catch (error) {
    console.error('Error checking URL:', error);
    return false;
  }
};
