import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { PaletteId } from '../shared/contracts';
const images = {
  forge: require('../../assets/backgrounds/forge.png'),
  ocean: require('../../assets/backgrounds/ocean.png'),
  ember: require('../../assets/backgrounds/ember.png'),
  forest: require('../../assets/backgrounds/forest.png'),
  plum: require('../../assets/backgrounds/plum.png'),
};
export default function CraftedBackground({ palette = 'forge', visible = true, onLoad, onError }: { palette?: PaletteId; visible?: boolean; onLoad?: () => void; onError?: () => void }) {
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}><Image accessible={false} source={images[palette]} style={[StyleSheet.absoluteFill, { opacity: visible ? 1 : 0 }]} resizeMode="stretch" onLoad={onLoad} onError={onError} /></View>;
}
