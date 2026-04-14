import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { IconSymbol } from '@/components/ui/icon-symbol';

export function JournalInput() {
  const [text, setText] = useState('');
  const backgroundColor = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');
  const inputBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#2c2c2e' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  const placeholderColor = useThemeColor({ light: '#8e8e93', dark: '#8e8e93' }, 'text');
  const sendButtonColor = text.trim() ? '#007AFF' : '#8e8e93';

  const handleSend = () => {
    if (text.trim()) {
      // TODO: Handle sending the journal entry
      console.log('Sending:', text);
      setText('');
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.container, { backgroundColor }]}>
        <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
          <TextInput
            style={[styles.input, { color: textColor }]}
            value={text}
            onChangeText={setText}
            placeholder="What's on your mind?"
            placeholderTextColor={placeholderColor}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={!text.trim()}
          >
            <IconSymbol
              name="arrow.up.circle.fill"
              size={32}
              color={sendButtonColor}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#c6c6c8',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 40,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    marginBottom: 2,
  },
});
