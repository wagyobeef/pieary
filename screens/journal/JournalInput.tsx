import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAreas } from "@/contexts/AreasContext";
import { colorIndexToHex } from "@/utils/colorIndexToHex";
import { createCrumb } from "@/db/crumbs";
import { IconPickerModal } from "./IconPickerModal";
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
  selectedDate: Date;
  onSubmit?: () => void;
}

type SelectionType = "area" | "icon" | null;

export function JournalInput({ selectedDate, onSubmit }: JournalInputProps) {
  const [text, setText] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [selectionType, setSelectionType] = useState<SelectionType>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const { areas } = useAreas();

  // Hot bar icons - default quick access icons
  const defaultHotBarIcons = [
    "star.fill",
    "checkmark.circle.fill",
    "exclamationmark.circle.fill",
    "questionmark.circle.fill",
  ];

  // If an icon is selected from the modal that's not in the hot bar, temporarily append it
  const hotBarIcons =
    selectedIcon &&
    selectionType === "icon" &&
    !defaultHotBarIcons.includes(selectedIcon)
      ? [...defaultHotBarIcons, selectedIcon]
      : defaultHotBarIcons;
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
      let areaId: number | null = null;
      let icon: string | null = null;

      // If selection is an area, set areaId
      if (selectionType === "area") {
        const selectedArea = areas.find((area) => area.icon === selectedIcon);
        areaId = selectedArea ? selectedArea.id : null;
      }
      // If selection is a generic icon, set icon
      else if (selectionType === "icon") {
        icon = selectedIcon;
      }

      // Create the crumb in the database with the selected date
      const timestamp = selectedDate.toISOString();
      createCrumb(areaId, icon, text.trim(), timestamp);

      // Reset form
      setText("");
      setSelectedIcon(null);
      setSelectionType(null);
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
          {areas.map((area) => {
            const isSelected = selectedIcon === area.icon && selectionType === "area";
            return (
              <TouchableOpacity
                key={area.id}
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: colorIndexToHex(area.color),
                    opacity: isSelected ? 1 : 0.6,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: isSelected ? darkBrown : "transparent",
                  },
                ]}
                onPress={() => {
                  if (isSelected) {
                    setSelectedIcon(null);
                    setSelectionType(null);
                  } else {
                    setSelectedIcon(area.icon);
                    setSelectionType("area");
                  }
                }}
              >
                <IconSymbol name={area.icon} size={20} color="#ffffff" />
              </TouchableOpacity>
            );
          })}

          {/* Hot bar icons */}
          {hotBarIcons.map((icon) => {
            const isSelected = selectedIcon === icon && selectionType === "icon";
            return (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: "#8e8e93",
                    opacity: isSelected ? 1 : 0.6,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: isSelected ? darkBrown : "transparent",
                  },
                ]}
                onPress={() => {
                  if (isSelected) {
                    setSelectedIcon(null);
                    setSelectionType(null);
                  } else {
                    setSelectedIcon(icon);
                    setSelectionType("icon");
                  }
                }}
              >
                <IconSymbol name={icon} size={20} color="#ffffff" />
              </TouchableOpacity>
            );
          })}

          {/* More icons chevron button */}
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                backgroundColor: darkBrown,
                opacity: 0.8,
              },
            ]}
            onPress={() => setShowIconPicker(true)}
          >
            <IconSymbol name="chevron.right" size={20} color="#ffffff" />
          </TouchableOpacity>
        </ScrollView>

        <IconPickerModal
          visible={showIconPicker}
          onClose={() => setShowIconPicker(false)}
          onSelectIcon={(icon) => {
            setSelectedIcon(icon);
            setSelectionType("icon");
          }}
          selectedIcon={selectionType === "icon" ? selectedIcon : null}
        />

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
