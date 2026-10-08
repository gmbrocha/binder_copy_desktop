import React from "react";
import { View } from "react-native";
import type { ApiClient } from "../../api/client";
import type { Page } from "../../shared/contracts";
import { palettes } from "../../shared/domain/palettes";
import CardImage from "../../components/CardImage";
import BackgroundImage from "../../components/BackgroundImage";
import CraftedBackground from "../../components/CraftedBackground";

export default function PageThumbnail({
  api,
  page,
}: {
  api: ApiClient;
  page: Page;
}) {
  const palette = palettes[page.palette ?? "forge"];
  return (
    <View
      accessible={false}
      pointerEvents="none"
      style={{
        width: 88,
        aspectRatio: 0.74,
        padding: 5,
        backgroundColor: palette.bg,
        borderRadius: 4,
        overflow: "hidden",
      }}
    >
      {page.backdrop?.assetId && page.backdropMode !== "color" && (
        <BackgroundImage api={api} id={page.backdrop.assetId} />
      )}
      {page.backdropMode === undefined && !page.backdrop && <CraftedBackground palette={page.palette} />}
      <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
        {page.slots.map((slot, index) => (
          <View
            key={index}
            style={{
              width: `${100 / page.size}%`,
              height: `${100 / page.size}%`,
              padding: 1,
            }}
          >
            {slot.cardId && (
              <CardImage
                api={api}
                id={slot.cardId}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
