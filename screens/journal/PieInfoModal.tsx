import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAreas } from '@/contexts/AreasContext';
import { colorIndexToHex } from '@/utils/colorIndexToHex';

interface PieInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PieInfoModal({ visible, onClose }: PieInfoModalProps) {
  const backgroundColor = useThemeColor({ light: '#f4ead5', dark: '#2a2520' }, 'background');
  const textColor = useThemeColor({ light: '#5a4a3a', dark: '#ffffff' }, 'text');
  const overlayColor = 'rgba(0, 0, 0, 0.5)';
  const modalBackground = useThemeColor({ light: '#faf6f0', dark: '#2c2c2e' }, 'background');

  const { areas, isLoading } = useAreas();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <View style={[styles.modalContainer, { backgroundColor: modalBackground }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <IconSymbol name="xmark" size={18} color={textColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {isLoading ? (
              <Text style={[styles.areaTitle, { color: textColor }]}>Loading...</Text>
            ) : areas.length === 0 ? (
              <Text style={[styles.areaTitle, { color: textColor }]}>No areas found</Text>
            ) : (
              areas.map((area, index) => (
                <View key={area.id} style={styles.areaItem}>
                  <View
                    style={[
                      styles.colorCircle,
                      { backgroundColor: colorIndexToHex(area.color) }
                    ]}
                  >
                    <IconSymbol name={area.icon} size={20} color="#ffffff" />
                  </View>
                  <Text style={[styles.areaTitle, { color: textColor }]}>{area.title}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '70%',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
  },
  content: {
  },
  areaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  areaTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
});
