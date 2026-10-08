import React from "react";
import { Image } from "react-native";
import { colors } from "../design/tokens";
// Rasterized at 3x from the frozen PWA's exact SVG paths.
const icons = {
  gear: require("../../assets/icons/gear.png"),
  plus: require("../../assets/icons/plus.png"),
  close: require("../../assets/icons/close.png"),
  search: require("../../assets/icons/search.png"),
  lock: require("../../assets/icons/lock.png"),
  unlock: require("../../assets/icons/unlock.png"),
  shuffle: require("../../assets/icons/shuffle.png"),
  undo: require("../../assets/icons/undo.png"),
  filter: require("../../assets/icons/filter.png"),
  check: require("../../assets/icons/check.png"),
  download: require("../../assets/icons/download.png"),
  arrow: require("../../assets/icons/arrow.png"),
  back: require("../../assets/icons/back.png"),
  down: require("../../assets/icons/down.png"),
  submit: require("../../assets/icons/submit.png"),
  star: require("../../assets/icons/star.png"),
  favorite: require("../../assets/icons/favorite.png"),
  droplet: require("../../assets/icons/droplet.png"),
  camera: require("../../assets/icons/camera.png"),
  pencil: require("../../assets/icons/pencil.png"),
  replace: require("../../assets/icons/replace.png"),
  move: require("../../assets/icons/move.png"),
  trash: require("../../assets/icons/trash.png"),
  zoom: require("../../assets/icons/zoom.png"),
  eye: require("../../assets/icons/eye.png"),
  tag: require("../../assets/icons/tag.png"),
  more: require("../../assets/icons/more.png"),
  info: require("../../assets/icons/info.png"),
  refresh: require("../../assets/icons/refresh.png"),
  grid: require("../../assets/icons/grid.png"),
  cards: require("../../assets/icons/cards.png"),
  library: require("../../assets/icons/library.png"),
};
export type IconName = keyof typeof icons;
export default function Icon({
  name,
  color = colors.text,
  size = 20,
}: {
  name: IconName;
  color?: string;
  size?: number;
}) {
  return (
    <Image
      source={icons[name]}
      accessible={false}
      style={{ width: size, height: size, tintColor: color, flexShrink: 0 }}
      resizeMode="contain"
    />
  );
}
