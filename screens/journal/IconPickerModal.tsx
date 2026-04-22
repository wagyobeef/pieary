import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { iconList } from "@/utils/iconList";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface IconPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectIcon: (icon: string) => void;
  selectedIcon: string | null;
}

export function IconPickerModal({
  visible,
  onClose,
  onSelectIcon,
  selectedIcon,
}: IconPickerModalProps) {
  const textColor = useThemeColor(
    { light: "#5a4a3a", dark: "#ffffff" },
    "text",
  );
  const overlayColor = "rgba(0, 0, 0, 0.5)";
  const modalBackground = useThemeColor(
    { light: "#faf6f0", dark: "#2c2c2e" },
    "background",
  );
  const darkBrown = "#5a4a3a";

  const handleSelectIcon = (icon: string) => {
    onSelectIcon(icon);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <View
          style={[styles.modalContainer, { backgroundColor: modalBackground }]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>
              choose a tag
            </Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol name="xmark" size={18} color={textColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.iconGrid}>
              {iconList.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconButton,
                    {
                      backgroundColor: "#8e8e93",
                      opacity: selectedIcon === icon ? 1 : 0.6,
                      borderWidth: selectedIcon === icon ? 2 : 0,
                      borderColor:
                        selectedIcon === icon ? darkBrown : "transparent",
                    },
                  ]}
                  onPress={() => handleSelectIcon(icon)}
                >
                  <IconSymbol name={icon} size={24} color="#ffffff" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    maxHeight: "70%",
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {},
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
