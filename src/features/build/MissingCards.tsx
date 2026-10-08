import { LoadingTask } from '../../components/Loading';
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import type { ApiClient } from "../../api/client";
import type { Card, Page } from "../../shared/contracts";
import CardImage from "../../components/CardImage";
import { colors as c, type as t } from "../../design/tokens";

export default function MissingCards({
  api,
  page,
  onCard,
  onClose,
  onExport,
}: {
  api: ApiClient;
  page: Page;
  onCard: (card: Card) => void;
  onClose: () => void;
  onExport: () => void;
}) {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const ids = [
    ...new Set(
      page.slots.flatMap((slot) => (slot.cardId ? [slot.cardId] : [])),
    ),
  ].join(",");
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    void api
      .cards(ids ? ids.split(",") : [])
      .then((result) => {
        if (active) setCards(result.cards.filter((card) => !card.owned));
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api, ids, retry]);
  const button = (label: string, onPress: () => void) => (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{
        minHeight: 44,
        padding: 12,
        borderWidth: 1,
        borderColor: c.border,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ ...t.label, color: c.text }}>{label}</Text>
    </Pressable>
  );
  return (
    <View
      style={{ flex: 1, padding: 20, gap: 16, backgroundColor: c.background }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Text style={{ ...t.title, color: c.text, flex: 1 }}>To collect</Text>
        {button("Done", onClose)}
      </View>
      {loading ? (
        <LoadingTask />
      ) : error ? (
        <>
          <Text
            accessibilityRole="alert"
            style={{ ...t.body, color: c.danger }}
          >
            {error}
          </Text>
          {button("Retry", () => setRetry((value) => value + 1))}
        </>
      ) : (
        <>
          <FlatList
            data={cards}
            keyExtractor={(card) => card.id}
            contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
            ListEmptyComponent={
              <Text style={{ ...t.body, color: c.secondary }}>
                You own every card on this page.
              </Text>
            }
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`View ${item.name}`}
                onPress={() => onCard(item)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                  paddingVertical: 8,
                }}
              >
                <CardImage
                  api={api}
                  id={item.id}
                  style={{ width: 70, height: 98 }}
                />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ ...t.heading, color: c.text }}>
                    {item.name}
                  </Text>
                  <Text style={{ ...t.body, color: c.secondary }}>
                    {item.setName}
                  </Text>
                </View>
              </Pressable>
            )}
          />
          {button("Export CSV", onExport)}
        </>
      )}
    </View>
  );
}
