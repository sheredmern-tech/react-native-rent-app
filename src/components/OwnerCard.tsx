import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Owner } from '../types';
import { Colors, Fonts } from '../constants';

interface OwnerCardProps {
  owner: Owner;
  onContactPress: () => void;
}

export const OwnerCard: React.FC<OwnerCardProps> = ({
  owner,
  onContactPress,
}) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      <View style={styles.ownerInfo}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {owner.avatar ? (
            <Text>Image</Text>
          ) : (
            <Text style={styles.avatarInitials}>
              {getInitials(owner.name)}
            </Text>
          )}
        </View>

        {/* Owner Details */}
        <View style={styles.textContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.ownerName} numberOfLines={1}>
              {owner.name}
            </Text>
            {owner.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="white" />
              </View>
            )}
          </View>
          <Text style={styles.responseTime} numberOfLines={1}>
            {owner.responseTime}
          </Text>
        </View>
      </View>

      {/* Contact Button */}
      <TouchableOpacity
        style={styles.contactButton}
        onPress={onContactPress}
        activeOpacity={0.7}
      >
        <Text style={styles.contactButtonText}>Contact</Text>
        <Ionicons name="chatbubble-outline" size={16} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    height: 80,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitials: {
    fontSize: 18,
    fontWeight: Fonts.weight.bold,
    color: Colors.white,
  },
  textContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: Fonts.weight.semiBold,
    color: Colors.text.primary,
    flex: 1,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  responseTime: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: Fonts.weight.semiBold,
    color: Colors.white,
  },
});
