// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation icons
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'info.circle': 'info',
  'xmark': 'close',
  'arrow.up.circle.fill': 'send',

  // Common icons from iconList
  'heart.fill': 'favorite',
  'star.fill': 'star',
  'book.fill': 'book',
  'figure.walk': 'directions-walk',
  'fork.knife': 'restaurant',
  'moon.stars.fill': 'bedtime',
  'brain.head.profile': 'psychology',
  'checkmark.circle.fill': 'check-circle',
  'exclamationmark.circle.fill': 'error',
  'questionmark.circle.fill': 'help',
  'house.fill': 'home',
  'briefcase.fill': 'work',
  'music.note': 'music-note',
  'gamecontroller.fill': 'sports-esports',
  'cart.fill': 'shopping-cart',
  'airplane': 'flight',
  'car.fill': 'directions-car',
  'gift.fill': 'card-giftcard',
  'bell.fill': 'notifications',
  'calendar': 'calendar-today',
  'clock.fill': 'schedule',
  'envelope.fill': 'email',
  'phone.fill': 'phone',
  'camera.fill': 'photo-camera',
  'film.fill': 'movie',
  'paintbrush.fill': 'brush',
  'leaf.fill': 'eco',
  'drop.fill': 'water-drop',
  'sun.max.fill': 'wb-sunny',
  'sparkles': 'auto-awesome',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
