import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface JournalInputProps {
  onSubmit: (text: string) => void;
}

export function JournalInput({ onSubmit }: JournalInputProps) {
  const [text, setText] = useState("");
  const backgroundColor = useThemeColor(
    { light: "#d4a574", dark: "#5a4a3a" },
    "background",
  );
  const inputBackgroundColor = useThemeColor(
    { light: "#ffffff", dark: "#2c2c2e" },
    "background",
  );
  const textColor = useThemeColor(
    { light: "#000000", dark: "#ffffff" },
    "text",
  );
  const placeholderColor = useThemeColor(
    { light: "#8e8e93", dark: "#8e8e93" },
    "text",
  );
  const borderColor = useThemeColor(
    { light: "#d4a574", dark: "#5a4a3a" },
    "background",
  );
  const sendButtonColor = text.trim() ? "#007AFF" : "#8e8e93";

  const handleSend = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText("");
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.container, { backgroundColor, borderTopColor: borderColor }]}>
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: inputBackgroundColor, borderColor },
          ]}
        >
          <TextInput
            style={[styles.input, { color: textColor }]}
            value={text}
            onChangeText={setText}
            placeholder="what's on your mind?"
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
    borderTopWidth: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderRadius: 20,
    borderWidth: 2,
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
