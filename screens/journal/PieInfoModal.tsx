import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAreas } from '@/contexts/AreasContext';

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

  React.useEffect(() => {
    if (visible) {
      console.log('Modal opened, areas:', areas);
      console.log('Is loading:', isLoading);
      console.log('Areas length:', areas.length);
    }
  }, [visible, areas, isLoading]);

  const sectorColors = [
    '#FF9B9B', // warm pink/red
    '#FFBD7A', // warm orange
    '#FFD97A', // warm yellow
    '#B8C9A3', // warm sage green
    '#B5ACD4', // warm periwinkle
    '#D4A5D4', // warm purple/lavender
  ];

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
                      { backgroundColor: sectorColors[area.color - 1] }
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
