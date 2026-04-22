import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAreas } from "@/contexts/AreasContext";
import { colorIndexToHex } from "@/utils/colorIndexToHex";
import { createCrumb } from "@/db/crumbs";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface JournalInputProps {
  onSubmit?: () => void;
}

export function JournalInput({ onSubmit }: JournalInputProps) {
  const [text, setText] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const { areas } = useAreas();

  // Additional crumb icons beyond the area icons
  const additionalIcons = [
    "star.fill",
    "checkmark.circle.fill",
    "exclamationmark.circle.fill",
    "questionmark.circle.fill",
  ];
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
  const sendButtonColor = text.trim() ? "#5a4a3a" : "#8e8e93";
  const darkBrown = "#5a4a3a";

  const handleSend = () => {
    if (text.trim()) {
      // Determine areaId if the selected icon matches an area icon
      const selectedArea = areas.find((area) => area.icon === selectedIcon);
      const areaId = selectedArea ? selectedArea.id : null;

      // If icon is selected but not from an area, use it as a standalone icon
      const icon = selectedArea ? null : selectedIcon;

      // Create the crumb in the database
      createCrumb(areaId, icon, text.trim());

      // Reset form
      setText("");
      setSelectedIcon(null);
      Keyboard.dismiss();

      // Call optional callback
      onSubmit?.();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <View
        style={[
          styles.container,
          { backgroundColor, borderTopColor: borderColor },
        ]}
      >
        {/* Icon Selection Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.iconBar}
          contentContainerStyle={styles.iconBarContent}
        >
          {/* Area icons with their colors */}
          {areas.map((area) => (
            <TouchableOpacity
              key={area.id}
              style={[
                styles.iconButton,
                {
                  backgroundColor: colorIndexToHex(area.color),
                  opacity: selectedIcon === area.icon ? 1 : 0.6,
                  borderWidth: selectedIcon === area.icon ? 2 : 0,
                  borderColor: selectedIcon === area.icon ? darkBrown : "transparent",
                },
              ]}
              onPress={() => setSelectedIcon(selectedIcon === area.icon ? null : area.icon)}
            >
              <IconSymbol name={area.icon} size={20} color="#ffffff" />
            </TouchableOpacity>
          ))}

          {/* Additional crumb icons */}
          {additionalIcons.map((icon) => (
            <TouchableOpacity
              key={icon}
              style={[
                styles.iconButton,
                {
                  backgroundColor: "#8e8e93",
                  opacity: selectedIcon === icon ? 1 : 0.6,
                  borderWidth: selectedIcon === icon ? 2 : 0,
                  borderColor: selectedIcon === icon ? darkBrown : "transparent",
                },
              ]}
              onPress={() => setSelectedIcon(selectedIcon === icon ? null : icon)}
            >
              <IconSymbol name={icon} size={20} color="#ffffff" />
            </TouchableOpacity>
          ))}
        </ScrollView>

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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 2,
  },
  iconBar: {
    marginBottom: 8,
  },
  iconBarContent: {
    gap: 8,
    paddingVertical: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
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
