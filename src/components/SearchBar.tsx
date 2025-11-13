import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search by location or title...',
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChangeText(inputValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  const handleClear = () => {
    setInputValue('');
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="search-outline"
        size={20}
        color={Colors.text.secondary}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={setInputValue}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.disabled}
      />
      {inputValue.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons
            name="close-circle"
            size={20}
            color={Colors.text.secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: Fonts.size.md,
    color: Colors.text.primary,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
});
