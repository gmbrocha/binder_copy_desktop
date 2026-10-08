import React from 'react';
import { Image } from 'react-native';
import { colors } from '../design/tokens';
const icons = { gear: require('../../assets/icons/gear.png'), lock: require('../../assets/icons/lock.png'), unlock: require('../../assets/icons/unlock.png'), plus: require('../../assets/icons/plus.png'), undo: require('../../assets/icons/undo.png'), eye: require('../../assets/icons/eye.png'), download: require('../../assets/icons/download.png'), cards: require('../../assets/icons/cards.png'), library: require('../../assets/icons/library.png'), grid: require('../../assets/icons/grid.png') };
export default function Icon({ name, color = colors.text, size = 20 }: { name: keyof typeof icons; color?: string; size?: number }) {
  return <Image source={icons[name]} accessible={false} style={{ width: size, height: size, tintColor: color, flexShrink: 0 }} resizeMode="contain" />;
}
