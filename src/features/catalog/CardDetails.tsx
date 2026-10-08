import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { ApiClient, ApiError } from "../../api/client";
import type { Card, CardPrices, Tag } from "../../shared/contracts";
import CardImage from "../../components/CardImage";
import Action from "../../components/Action";
import Icon, { type IconName } from "../../components/Icon";
import { colors as c, type as t } from "../../design/tokens";

type History = {
  entries: {
    revision: number;
    actor: string;
    createdAt: string;
    kind: string;
  }[];
};
export default function CardDetails({
  api,
  initial,
  tags,
  canCurate,
  onUpdate,
  onClose,
  onBuild,
  onPlace,
}: {
  api: ApiClient;
  initial: Card;
  tags: Tag[];
  canCurate: boolean;
  onUpdate: (card: Card) => void;
  onClose: () => void;
  onPlace?: (card: Card) => void;
  onBuild?: (kind: "favorite" | "card-colors", card: Card) => void;
}) {
  const wide = useWindowDimensions().width >= 768;
  const [card, setCard] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(initial.tags);
  const [art, setArt] = useState(initial.art);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);
  const [prices, setPrices] = useState<CardPrices>();
  const [history, setHistory] = useState<History>();
  const [ready, setReady] = useState(false);
  const path = "/cards/" + encodeURIComponent(card.id);
  const update = (next: Card) => {
    setCard(next);
    onUpdate(next);
  };
  useEffect(() => {
    let active = true;
    void api
      .request<Card>(path)
      .then((next) => {
        if (active) {
          update(next);
          setDraft(next.tags);
          setArt(next.art);
          setReady(true);
        }
      })
      .catch(() => {
        if (active) setError("Could not refresh this card.");
      });
    return () => {
      active = false;
    };
  }, [api, path]);
  const run = async (action: () => Promise<void>) => {
    if (pending.current || busy) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not complete this action.",
      );
      if (e instanceof ApiError && e.status === 409) setConflict(true);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };
  const reload = () =>
    run(async () => {
      const next = await api.request<Card>(path);
      update(next);
      setDraft(next.tags);
      setArt(next.art);
      setConflict(false);
      setHistory(undefined);
      setReady(true);
    });
  const save = () =>
    run(async () => {
      const next = await api.request<Card>(
        "/admin/cards/" + encodeURIComponent(card.id),
        "PUT",
        { tags: draft, art, revision: card.curationRevision ?? 0 },
      );
      update(next);
      setEditing(false);
      setConflict(false);
      setHistory(undefined);
    });
  const tagById = new Map(tags.map((tag) => [tag.id, tag]));
  const rowAction = (label: string, icon: IconName, onPress: () => void) => (
    <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={busy || !ready} onPress={onPress} style={[s.actionRow, (busy || !ready) && {opacity: 0.4}]}>
      <Icon name={icon} size={18}/><Text style={[s.body, {flex: 1, color: c.text}]}>{label}</Text><Icon name="arrow" size={18}/>
    </Pressable>
  );
  return (
    <ScrollView
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.row}>
        <View style={{flex: 1, gap: 4}}>
          <Text accessibilityLabel={editing ? "Edit tags" : "Card details"} style={s.heading}>{editing ? "Edit tags" : card.name}</Text>
          <Text style={s.caption}>{card.setName} · {card.number}</Text>
        </View>
        <Action label="Done" disabled={busy} onPress={onClose} />
      </View>
      {busy && <ActivityIndicator color={c.accent} />}
      {!!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      {!!error && !ready && (
        <Action label="Reload card" disabled={busy} onPress={reload} />
      )}
      <View style={{flexDirection: wide && !editing ? "row" : "column", gap: 20}}>
      <CardImage
        api={api}
        id={card.id}
        accessibilityLabel={card.name}
        style={{ height: 252, width: 180, alignSelf: wide && !editing ? "flex-start" : "center" }}
      />
      <View style={{flex: wide && !editing ? 1 : undefined, gap: 16}}>
      <Text style={s.caption}>
        {[card.rarity, card.artist].filter(Boolean).join(" · ")}
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel={card.owned ? "Remove from collection" : "Add to collection"} style={s.ownership}
        accessibilityState={{selected: card.owned}}
        disabled={busy || !ready}
        onPress={() =>
          run(async () => {
            const result = await api.ownership(card.id, !card.owned);
            update({ ...card, owned: result.owned });
          })
        }
      ><Text style={s.body}>{card.owned ? "✓ Owned" : "Mark owned"}</Text></Pressable>
      {!editing && (
        <>
          <Text style={s.body}>{card.tags.map(tag => tagById.get(tag)?.label ?? tag).join(" · ") || "No theme tags yet."}</Text>
          {rowAction(prices ? "Refresh prices" : "Check prices", "tag", () => run(async () => setPrices(await api.request<CardPrices>(path + "/prices"))))}
          {onBuild && <>
            {rowAction("Build around this card", "favorite", () => onBuild("favorite", card))}
            {rowAction("Use this card’s colors", "droplet", () => onBuild("card-colors", card))}
          </>}
          {canCurate && rowAction("Edit tags", "tag", () => {setDraft(card.tags);setArt(card.art);setEditing(true);})}
          {prices && (
            <View style={{ gap: 8 }}>
              <Text style={s.caption}>
                {prices.source} · USD
                {prices.updatedAt
                  ? ` · ${new Date(prices.updatedAt).toLocaleDateString()}`
                  : ""}
              </Text>
              {prices.variants.length ? (
                prices.variants.map((variant) => (
                  <View key={variant.name} style={s.row}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.body}>{variant.name}</Text>
                      <Text style={s.caption}>
                        Market{" "}
                        {variant.market == null
                          ? "—"
                          : "$" + variant.market.toFixed(2)}{" "}
                        · Low{" "}
                        {variant.low == null
                          ? "—"
                          : "$" + variant.low.toFixed(2)}
                      </Text>
                    </View>
                    {variant.url &&
                      /^https:\/\/(?:www\.)?tcgplayer\.com\//.test(
                        variant.url,
                      ) && (
                        <Action
                          label="View"
                          onPress={() =>
                            run(async () => {
                              await Linking.openURL(variant.url!);
                            })
                          }
                        />
                      )}
                  </View>
                ))
              ) : (
                <Text style={s.body}>No prices available for this card.</Text>
              )}
            </View>
          )}
        </>
      )}
      </View></View>
      {!editing && onPlace && <Action label="Place in page" primary disabled={busy || !ready} onPress={() => onPlace(card)} />}
      {editing && (
        <>
          <Text style={s.caption}>Shared catalog</Text>
          <View style={s.row}>
            {(["full", "standard", "unknown"] as const).map((value) => (
              <Action
                key={value}
                label={
                  {
                    full: "Full art",
                    standard: "Common art",
                    unknown: "Unknown",
                  }[value]
                }
                primary={art === value}
                disabled={busy}
                onPress={() => setArt(value)}
              />
            ))}
          </View>
          <TextInput
            accessibilityLabel="Filter tags"
            placeholder="Filter tags"
            placeholderTextColor={c.muted}
            value={query}
            onChangeText={setQuery}
            style={s.input}
          />
          <View style={s.tagGrid}>
            {tags
              .filter((tag) =>
                [tag.label, ...tag.aliases].some((value) =>
                  value.toLowerCase().includes(query.toLowerCase()),
                ),
              )
              .map((tag) => (
                <Pressable
                  key={tag.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: draft.includes(tag.id) }}
                  disabled={busy}
                  onPress={() =>
                    setDraft((previous) =>
                      previous.includes(tag.id)
                        ? previous.filter((id) => id !== tag.id)
                        : [...previous, tag.id],
                    )
                  }
                  style={s.tagOption}
                >
                  <View
                    style={[
                      s.check,
                      draft.includes(tag.id) && { backgroundColor: c.accent },
                    ]}
                  >
                    <Text style={{ color: c.onAccent }}>
                      {draft.includes(tag.id) ? "✓" : ""}
                    </Text>
                  </View>
                  <Text style={[s.body, { flex: 1 }]}>{tag.label}</Text>
                </Pressable>
              ))}
          </View>
          {conflict ? (
            <Action
              label="Reload current tags"
              disabled={busy}
              onPress={reload}
            />
          ) : (
            <View style={s.row}>
              <Action
                label="Cancel"
                disabled={busy}
                onPress={() => setEditing(false)}
              />
              <Action
                label="Save tags"
                primary
                disabled={busy}
                onPress={save}
              />
            </View>
          )}
          <Action
            label="History"
            disabled={busy}
            onPress={() =>
              run(async () =>
                setHistory(await api.request<History>(path + "/history")),
              )
            }
          />
          {history && (
            <View style={{ gap: 8 }}>
              {history.entries.map((entry) => (
                <Text style={s.caption} key={entry.revision}>
                  {entry.kind} · {entry.actor} ·{" "}
                  {new Date(entry.createdAt).toLocaleString()}
                </Text>
              ))}
              {history.entries[0]?.kind === "edit" && (
                <Action
                  label="Undo last edit"
                  disabled={busy || conflict}
                  onPress={() =>
                    run(async () => {
                      const next = await api.request<Card>(
                        "/admin/cards/" + encodeURIComponent(card.id) + "/undo",
                        "POST",
                        { revision: card.curationRevision ?? 0 },
                      );
                      update(next);
                      setDraft(next.tags);
                      setArt(next.art);
                      setHistory(undefined);
                    })
                  }
                />
              )}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  actionRow: {flexDirection: "row", alignItems: "center", gap: 12, borderTopWidth: 1, borderTopColor: c.line, paddingVertical: 12, minHeight: 44},
  ownership: {alignSelf: "flex-start", borderWidth: 1, borderColor: c.lineStrong, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 8},
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { ...t.title, color: c.text },
  heading: { ...t.heading, color: c.text },
  body: { ...t.body, color: c.secondary },
  caption: { ...t.caption, color: c.muted },
  error: { ...t.body, color: c.danger },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    ...t.caption,
    color: c.text,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: c.raised,
  },
  input: {
    ...t.body,
    minHeight: 44,
    color: c.text,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  tagGrid: { flexDirection: "row", flexWrap: "wrap" },
  tagOption: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    gap: 10,
    paddingRight: 8,
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderColor: c.border,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
