import React from "react";
import { View, Text, Image } from "react-native";
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
        width: "100%",
        aspectRatio: 1224 / 1856,
        padding: 8,
        backgroundColor: palette.bg,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {page.backdrop?.assetId && page.backdropMode !== "color" && (
        <BackgroundImage api={api} id={page.backdrop.assetId} />
      )}
      {page.backdropMode === undefined && !page.backdrop && (
        <CraftedBackground palette={page.palette} />
      )}
      <Text
        numberOfLines={1}
        style={{
          fontFamily: "Audiowide",
          fontSize: 9,
          color: palette.text,
          paddingBottom: 8,
        }}
      >
        {page.name}
      </Text>
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
      <Image
        source={require("../../../assets/brand/wordmark.png")}
        resizeMode="contain"
        style={{ width: "40%", height: 16, marginTop: 6 }}
      />
    </View>
  );
}
