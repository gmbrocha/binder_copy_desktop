import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, AppState, Easing, StyleSheet, View } from 'react-native';
import { overlayInk } from '../shared/domain/overlays';

// Approved mock: 48pt cream silhouette, one clockwise turn every 1.4 seconds.
export default function LoadingSpinner() {
  const rotation = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(true);
  const [foreground, setForeground] = useState(AppState.currentState === 'active');

  useEffect(() => {
    let mounted = true;
    let preferenceChanged = false;
    const preference = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      preferenceChanged = true;
      setReduceMotion(value);
    });
    void AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (mounted && !preferenceChanged) setReduceMotion(value);
    }).catch(() => { /* Keep a static indicator if the preference cannot be read. */ });
    const activity = AppState.addEventListener('change', value => setForeground(value === 'active'));
    return () => {
      mounted = false;
      preference.remove();
      activity.remove();
    };
  }, []);

  useEffect(() => {
    rotation.setValue(0);
    if (reduceMotion || !foreground) return;
    const loop = Animated.loop(Animated.timing(rotation, {
      toValue: 1,
      duration: 1400,
      easing: Easing.linear,
      useNativeDriver: true,
      isInteraction: false,
    }));
    loop.start();
    return () => loop.stop();
  }, [foreground, reduceMotion, rotation]);

  return (
    <Animated.View
      testID="loading-spinner"
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      accessibilityState={{ busy: true }}
      style={[s.ball, { transform: [{ rotate: rotation.interpolate({
        inputRange: [0, 1], outputRange: ['-20deg', '340deg'],
      }) }] }]}
    >
      <View accessible={false} style={s.band} />
      <View accessible={false} style={s.ring}>
        <View accessible={false} style={s.center} />
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  ball: { width: 48, height: 48, borderRadius: 24, backgroundColor: overlayInk.cream, overflow: 'hidden' },
  band: { position: 'absolute', left: 0, right: 0, top: 21, height: 6, backgroundColor: '#000' },
  ring: { position: 'absolute', left: 15.36, top: 15.36, width: 17.28, height: 17.28, borderRadius: 8.64, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  center: { width: 8, height: 8, borderRadius: 4, backgroundColor: overlayInk.cream },
});
