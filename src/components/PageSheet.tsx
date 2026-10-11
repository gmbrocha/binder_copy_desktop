import { overlayInk } from '../shared/domain/overlays';
import usePageOverlays from './usePageOverlays';
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ApiClient } from "../api/client";
import type { Card, Page } from "../shared/contracts";
import { pagePalette } from "../shared/domain/palettes";
import { getPageLayout } from "../shared/domain/backdrops";
import { surroundLayout } from '../shared/domain/surround';
import { swapTarget, type Rect } from "../features/build/dragGeometry";
import { colors } from "../design/tokens";
import CardImage from "./CardImage";
import Icon from "./Icon";
import BackgroundImage from "./BackgroundImage";
import CraftedBackground from "./CraftedBackground";

type Drag = {
  from: number;
  startX: number;
  startY: number;
  captured: boolean;
  dx: number;
  dy: number;
};
export default function PageSheet({
  api,
  page,
  cards,
  selected = -1,
  onSelect,
  onLock,
  onSwap,
  onDragging,
  titleFont,
  maximumWidth = 820,
  showLocks = false,
}: {
  api: ApiClient;
  page: Page;
  cards: Record<string, Card>;
  selected?: number;
  onSelect?: (index: number) => void;
  onLock?: (index: number) => void;
  onSwap?: (from: number, to: number) => void;
  onDragging?: (active: boolean) => void;
  titleFont?: string;
  maximumWidth?: number;
  showLocks?: boolean;
}) {
  const [width, setWidth] = useState(0);
  const [floating, setFloating] = useState<number | null>(null);
  const [target, setTarget] = useState<number | null>(null);
  const drag = useRef<Drag | null>(null);
  const suppressUntil = useRef(0);
  const offset = useRef(new Animated.ValueXY()).current;
  const layout = page.surround ? surroundLayout : getPageLayout(page.size);
  const scale = width / layout.width;
  const rects = page.slots.map((_slot, i): Rect => ({
    left:
      (layout.pad + (i % page.size) * (layout.cardWidth + layout.gap)) * scale,
    top:
      (layout.top +
        Math.floor(i / page.size) * (layout.cardHeight + layout.gap)) *
      scale,
    width: layout.cardWidth * scale,
    height: layout.cardHeight * scale,
  }));
  const current = useRef({ page, rects, onSwap, onDragging });
  current.current = { page, rects, onSwap, onDragging };
  const finish = (commit: boolean) => {
    const active = drag.current;
    drag.current = null;
    setTarget(null);
    current.current.onDragging?.(false);
    if (!active) return;
    suppressUntil.current = Date.now() + 500;
    const hit = commit
      ? swapTarget(
          active.from,
          active.dx,
          active.dy,
          current.current.rects,
          current.current.page.slots,
        )
      : null;
    if (hit !== null) {
      setFloating(null);
      offset.setValue({ x: 0, y: 0 });
      current.current.onSwap?.(active.from, hit);
    } else
      Animated.timing(offset, {
        toValue: { x: 0, y: 0 },
        duration: 160,
        useNativeDriver: true,
      }).start(() => setFloating(null));
  };
  const responder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: () => {
          if (!drag.current) return false;
          drag.current.captured = true;
          return true;
        },
        onPanResponderMove: (event, gesture) => {
          const active = drag.current;
          if (!active) return;
          if (gesture.numberActiveTouches > 1) {
            finish(false);
            return;
          }
          active.dx = event.nativeEvent.pageX - active.startX;
          active.dy = event.nativeEvent.pageY - active.startY;
          offset.setValue({ x: active.dx, y: active.dy });
          setTarget(
            swapTarget(
              active.from,
              active.dx,
              active.dy,
              current.current.rects,
              current.current.page.slots,
            ),
          );
        },
        onPanResponderRelease: () => finish(true),
        onPanResponderTerminate: () => finish(false),
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => !!drag.current,
      }),
    [],
  );
  const signature = JSON.stringify([page.id, page.size, page.slots, width]);
  useEffect(() => {
    if (drag.current) finish(false);
  }, [signature]);
  useEffect(
    () => () => {
      drag.current = null;
      offset.stopAnimation();
      current.current.onDragging?.(false);
    },
    [],
  );
  const palette = pagePalette(page);
  const contrast = usePageOverlays(api, page);
  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[
        s.board,
        {
          maxWidth: maximumWidth,
          backgroundColor: palette.bg,
          aspectRatio: layout.width / layout.height,
        },
      ]}
      {...responder.panHandlers}
    >
      {contrast.ready && page.backdropMode !== "color" && page.backdrop && (
        <BackgroundImage key={contrast.key} api={api} id={page.backdrop.assetId} visible={contrast.visible} onLoad={contrast.onLoad} onError={contrast.onError} />
      )}
      {contrast.ready && page.backdropMode === undefined && !page.backdrop && !page.customColor && (
        <CraftedBackground key={contrast.key} palette={page.palette} visible={contrast.visible} onLoad={contrast.onLoad} onError={contrast.onError} />
      )}
      {contrast.failed && <Text style={{ position: "absolute", bottom: 4, right: 8, color: "#fff", backgroundColor: "#000b", fontSize: 11 }}>Background unavailable</Text>}
      {!page.surround && <Text
        testID={`page-title-${contrast.overlays.title}`}
        numberOfLines={1}
        style={{
          position: "absolute",
          left: (layout.pad + 20) * scale,
          right: layout.pad * scale,
          top: 52 * scale,
          lineHeight: 56 * scale,
          fontSize:
            Math.min(
              46,
              (layout.width - layout.pad * 2 - 40) /
                Math.max(1, Array.from(page.name).length),
            ) * scale,
          color: overlayInk[contrast.overlays.title],
          fontFamily: titleFont,
        }}
      >
        {page.name}
      </Text>}
      {!page.surround && <Image
        testID={`page-logo-${contrast.overlays.logo}`}
        source={contrast.overlays.logo === "dark" ? require("../../assets/brand/wordmark-dark.png") : require("../../assets/brand/wordmark.png")}
        resizeMode="contain"
        style={{
          position: "absolute",
          left: layout.pad * scale,
          top: (layout.height - 72) * scale,
          width: 220 * scale,
          height: 45 * scale,
        }}
      />}
      {page.slots.map((slot, i) => page.surround && i!==4 ? null : (
        <View
          key={i}
          style={[s.position, rects[i], { opacity: floating === i ? 0.24 : 1 }]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Slot ${i + 1}: ${slot.cardId ? (cards[slot.cardId]?.name ?? "Card") : "empty"}${slot.locked ? ", locked" : ""}`}
            accessibilityState={{ selected: selected === i }}
            onPress={() => {
              if (!drag.current && Date.now() > suppressUntil.current)
                onSelect?.(i);
            }}
            delayLongPress={350}
            onLongPress={(event) => {
              if (!onSwap || !slot.cardId || slot.locked || drag.current)
                return;
              offset.stopAnimation();
              offset.setValue({ x: 0, y: 0 });
              drag.current = {
                from: i,
                startX: event.nativeEvent.pageX,
                startY: event.nativeEvent.pageY,
                captured: false,
                dx: 0,
                dy: 0,
              };
              setFloating(i);
              setTarget(null);
              onDragging?.(true);
            }}
            onPressOut={() => {
              if (drag.current && !drag.current.captured) finish(false);
            }}
            style={[
              s.slot,
              page.surround && {borderRadius:34*scale,backgroundColor:'transparent'},
              selected >= 0 && selected !== i && { opacity: 0.82 },
              {
                borderColor:
                  target === i || selected === i ? overlayInk.cream : "transparent",
                borderWidth:
                  !page.surround && (target === i || selected === i) ? 2 : 0,
              },
            ]}
          >
            {slot.cardId ? (
              <CardImage
                api={api}
                id={slot.cardId}
                resizeMode={page.surround ? 'stretch' : 'contain'}
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <>
                <View pointerEvents="none" style={[s.corner, s.topLeft]} />
                <View pointerEvents="none" style={[s.corner, s.topRight]} />
                <View pointerEvents="none" style={[s.corner, s.bottomLeft]} />
                <View pointerEvents="none" style={[s.corner, s.bottomRight]} />
                <View style={{ alignItems: "center", gap: 2 }}>
                  <Icon name="plus" size={18} color={overlayInk.cream} />
                  <Text style={{ color: overlayInk.cream, fontSize: 12 }}>
                    {i + 1}
                  </Text>
                </View>
              </>
            )}
          </Pressable>
          {selected === i && onSelect && (
            <View pointerEvents="none" style={s.badge}>
              <Text style={s.badgeText}>{i + 1}</Text>
            </View>
          )}
          {slot.cardId && slot.locked && (onLock || showLocks) && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Unlock slot ${i + 1}`}
              disabled={!onLock}
              onPress={() => onLock?.(i)}
              hitSlop={8}
              style={s.lockButton}
            >
              <Icon name="lock" size={14} />
            </Pressable>
          )}
        </View>
      ))}
      {floating !== null && page.slots[floating]?.cardId && (
        <Animated.View
          pointerEvents="none"
          style={[
            s.position,
            rects[floating],
            {
              zIndex: 10,
              transform: offset.getTranslateTransform(),
              opacity: 0.94,
            },
          ]}
        >
          <CardImage
            api={api}
            id={page.slots[floating].cardId!}
            style={{ width: "100%", height: "100%" }}
          />
        </Animated.View>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  board: {
    width: "100%",
    maxWidth: 820,
    borderRadius: 8,
    alignSelf: "center",
    overflow: "hidden",
  },
  position: { position: "absolute" },
  corner: { position: "absolute", width: 12, height: 12, borderColor: overlayInk.cream },
  topLeft: { top: 0, left: 0, borderTopWidth: 1.5, borderLeftWidth: 1.5 },
  topRight: { top: 0, right: 0, borderTopWidth: 1.5, borderRightWidth: 1.5 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 1.5, borderLeftWidth: 1.5 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 1.5, borderRightWidth: 1.5 },
  slot: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
    borderWidth: 0,
    backgroundColor: "#ffffff03",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  lockButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#151816e8",
    borderRadius: 5,
  },
  shackle: {
    position: "absolute",
    left: 5,
    top: 3,
    width: 11,
    height: 10,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderColor: colors.text,
  },
  lockBody: {
    position: "absolute",
    left: 2,
    top: 12,
    width: 17,
    height: 11,
    borderWidth: 2,
    borderRadius: 3,
    borderColor: colors.text,
  },
  badge: {
    position: "absolute",
    top: 0,
    left: 0,
    minWidth: 20,
    padding: 3,
    backgroundColor: colors.accent,
    borderBottomRightRadius: 6,
  },
  badgeText: { color: colors.onAccent, fontSize: 11, textAlign: "center" },
});
