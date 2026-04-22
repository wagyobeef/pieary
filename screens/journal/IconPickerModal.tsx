import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAreas } from "@/contexts/AreasContext";
import { colorIndexToHex } from "@/utils/colorIndexToHex";
import { iconList } from "@/utils/iconList";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface IconPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectIcon: (icon: string) => void;
  selectedIcon: string | null;
  selectionType: "area" | "icon" | null;
  onSelectArea?: (areaId: number) => void;
}

export function IconPickerModal({
  visible,
  onClose,
  onSelectIcon,
  selectedIcon,
  selectionType,
  onSelectArea,
}: IconPickerModalProps) {
  const { areas } = useAreas();
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

  const handleSelectArea = (areaId: number, icon: string) => {
    if (onSelectArea) {
      onSelectArea(areaId);
    }
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
            {/* Area Icons */}
            <View style={[styles.iconGrid, styles.areaIconGrid]}>
              {areas.map((area) => {
                const isSelected = selectedIcon === area.icon && selectionType === "area";
                return (
                  <TouchableOpacity
                    key={`area-${area.id}`}
                    style={[
                      styles.iconButton,
                      {
                        backgroundColor: colorIndexToHex(area.color),
                        opacity: isSelected ? 1 : 0.6,
                        borderWidth: isSelected ? 2 : 0,
                        borderColor: isSelected ? darkBrown : "transparent",
                      },
                    ]}
                    onPress={() => handleSelectArea(area.id, area.icon)}
                  >
                    <IconSymbol name={area.icon} size={20} color="#ffffff" />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Divider */}
            <View style={[styles.divider, { backgroundColor: darkBrown }]} />

            {/* Generic Icons */}
            <View style={styles.iconGrid}>
              {iconList.map((icon) => {
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
                    onPress={() => handleSelectIcon(icon)}
                  >
                    <IconSymbol name={icon} size={20} color="#ffffff" />
                  </TouchableOpacity>
                );
              })}
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
  areaIconGrid: {
    marginBottom: 12,
  },
  divider: {
    height: 1,
    alignSelf: "center",
    width: "90%",
    marginBottom: 12,
    opacity: 0.3,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
