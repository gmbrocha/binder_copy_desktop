import { useLoading } from '../../components/Loading';
import Modal from "../../components/DesktopDialog";
import React, { useRef, useState } from "react";
import {
  Keyboard,
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { ApiClient, Bootstrap } from "../../api/client";
import {
  emptyFilters,
  type Filters,
  type ParseResult,
} from "../../shared/contracts";
import SelectField from "../../components/SelectField";
import Action from "../../components/Action";
import Icon from "../../components/Icon";
import { colors as c, type as t } from "../../design/tokens";
export default function SearchControls({
  api,
  createId,
  bootstrap,
  query,
  onQuery,
  filters,
  onFilters,
  collection = false,
  showInterpretIcon = false,
}: {
  api: ApiClient;
  createId: () => string;
  bootstrap?: Bootstrap;
  query: string;
  onQuery: (query: string) => void;
  filters: Filters;
  onFilters: (filters: Filters) => void;
  collection?: boolean;
  showInterpretIcon?: boolean;
}) {
  const [quick, setQuick] = useState<"art" | "ownership" | null>(null);
  const [open, setOpen] = useState(false);
  const [tagQuery, setTagQuery] = useState("");
  const [interpretation, setInterpretation] = useState<ParseResult | null>(
    null,
  );
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [error, setError] = useState("");
  const currentQuery = useRef(query);
  const currentAccount = useRef(bootstrap?.user.id);
  currentAccount.current = bootstrap?.user.id;
  const attempt = useRef<{ query: string; account?: string; requestId: string } | null>(null);
  currentQuery.current = query;
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onFilters({ ...filters, [key]: value });
  const withLoading = useLoading();
  const run = async (action: () => Promise<void>) => {
    if (pending.current || busy) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      await withLoading("interpret", action);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Search could not be interpreted.",
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };
  const interpret = () =>
    run(async () => {
      const input = query;
      const account = bootstrap?.user.id;
      if (!attempt.current || attempt.current.query !== input || attempt.current.account !== account)
        attempt.current = { query: input, account, requestId: createId() };
      const parsed = await api.request<ParseResult>("/interpret", "POST", {
        query: input,
        requestId: attempt.current.requestId,
      });
      if (input !== currentQuery.current || account !== currentAccount.current)
        throw new Error("Search changed. Interpret the new phrase.");
      setSelected(parsed.tags);
      setInterpretation(parsed);
    });
  const checkbox = (
    id: string,
    label: string,
    checked: boolean,
    press: () => void,
  ) => (
    <Pressable
      key={id}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={press}
      style={s.option}
    >
      <View style={[s.check, checked && { backgroundColor: c.accent }]}>
        <Text style={{ color: c.onAccent }}>{checked ? "✓" : ""}</Text>
      </View>
      <Text style={[s.body, { flex: 1 }]}>{label}</Text>
    </Pressable>
  );
  const status = (
    <>
      {busy && <ActivityIndicator color={c.accent} />}
      {!!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
    </>
  );
  const tags = bootstrap?.tags ?? [];
  const chip = (
    label: string,
    action: () => void,
    icon: "star" | "filter" | "down" | "close",
    disabled = false,
  ) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={action}
      style={[s.chip, disabled && { opacity: 0.4 }]}
    >
      <Icon name={icon} size={16} color={c.secondary} />
      <Text style={s.caption}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={{ gap: 12 }}>
      <View style={[s.row, s.search]}>
        <Icon name="search" color={c.muted} />
        <TextInput
          accessibilityLabel="Search cards"
          placeholder="A Pokémon, an artist, a feeling…"
          placeholderTextColor={c.muted}
          value={query}
          returnKeyType="search"
          onSubmitEditing={() => {Keyboard.dismiss();onQuery(query);}}
          maxLength={300}
          onChangeText={onQuery}
          style={[s.input, { flex: 1, borderWidth: 0, paddingHorizontal: 0 }]}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Search"
          onPress={() => {Keyboard.dismiss();onQuery(query);}}
          style={{ padding: 10 }}
        >
          <Icon name="submit" color={c.accent} />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {chip("Read as theme", interpret, "star", busy || !query.trim())}
        {chip(
          "Art: " +
            {
              all: "All",
              full: "Full",
              standard: "Common",
              unknown: "Unknown",
            }[filters.art],
          () => setQuick("art"),
          "down",
        )}
        {!collection &&
          chip(
            "Owned: " +
              { all: "Any", owned: "Owned", needed: "Needed" }[
                filters.ownership
              ],
            () => setQuick("ownership"),
            "down",
          )}
        {chip("Filters", () => setOpen(true), "filter")}
        {(query ||
          JSON.stringify(filters) !== JSON.stringify(emptyFilters())) &&
          chip(
            "Clear",
            () => {
              onQuery("");
              onFilters(emptyFilters());
              setInterpretation(null);
            },
            "close",
          )}
      </ScrollView>
      {status}
      <Modal
        visible={!!quick}
        presentationStyle="pageSheet"
        animationType="slide"
        onRequestClose={() => setQuick(null)}
      >
        <View style={[s.modal, { gap: 12 }]}>
          <View style={s.row}>
            <Text style={[s.heading, { flex: 1 }]}>
              {quick === "art" ? "Artwork" : "Collection"}
            </Text>
            <Action label="Done" onPress={() => setQuick(null)} />
          </View>
          {(quick === "art"
            ? [
                ["all", "All cards"],
                ["full", "Full art"],
                ["standard", "Common art"],
                ["unknown", "Unknown"],
              ]
            : [
                ["all", "All cards"],
                ["owned", "Owned"],
                ["needed", "Needed"],
              ]
          ).map(([value, label]) => (
            <Pressable
              key={value}
              accessibilityRole="radio"
              accessibilityState={{
                checked:
                  quick === "art"
                    ? filters.art === value
                    : filters.ownership === value,
              }}
              style={s.option}
              onPress={() => {
                if (quick === "art") set("art", value as Filters["art"]);
                else set("ownership", value as Filters["ownership"]);
                setQuick(null);
              }}
            >
              <Text style={s.body}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </Modal>
      <Modal
        visible={open}
        presentationStyle="pageSheet"
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <ScrollView
          style={s.modal}
          contentContainerStyle={{ gap: 12, paddingBottom: 40 }}
        >
          <View style={s.row}>
            <Text style={[s.heading, { flex: 1 }]}>Filters</Text>
            <Action label="Reset" onPress={() => onFilters(emptyFilters())} />
            <Action label="Done" onPress={() => setOpen(false)} />
          </View>
          <SelectField
            label="Search"
            value={filters.mode}
            options={[
              { value: "auto", label: "Automatic" },
              { value: "visual", label: "Artwork" },
              { value: "catalog", label: "Catalog" },
            ]}
            onChange={(value) => set("mode", value as Filters["mode"])}
          />
          <SelectField
            label="Artwork"
            value={filters.art}
            options={[
              { value: "all", label: "All cards" },
              { value: "full", label: "Full art" },
              { value: "standard", label: "Common art" },
              { value: "unknown", label: "Unknown" },
            ]}
            onChange={(value) => set("art", value as Filters["art"])}
          />
          {!collection && (
            <SelectField
              label="Collection"
              value={filters.ownership}
              options={[
                { value: "all", label: "All cards" },
                { value: "owned", label: "Owned" },
                { value: "needed", label: "Needed" },
              ]}
              onChange={(value) =>
                set("ownership", value as Filters["ownership"])
              }
            />
          )}
          <SelectField
            label="Set"
            value={filters.set}
            options={[
              { value: "", label: "Any set" },
              ...(bootstrap?.sets ?? []).map((set) => ({
                value: set.id,
                label: set.name,
              })),
            ]}
            onChange={(value) => set("set", value)}
          />
          <SelectField
            label="Type"
            value={filters.type}
            options={[
              { value: "", label: "Any type" },
              ...(bootstrap?.types ?? []).map((type) => ({
                value: type.name,
                label: type.name,
              })),
            ]}
            onChange={(value) => set("type", value)}
          />
          <SelectField
            label="Category"
            value={filters.category}
            options={[
              { value: "", label: "Any category" },
              ...(bootstrap?.categories ?? []).map((category) => ({
                value: category.name,
                label: category.name,
              })),
            ]}
            onChange={(value) => set("category", value)}
          />
          <SelectField
            label="Year"
            value={filters.year}
            options={[
              { value: "", label: "Any year" },
              ...(bootstrap?.years ?? []).map((year) => ({
                value: year.year,
                label: year.year,
              })),
            ]}
            onChange={(value) => set("year", value)}
          />
          <TextInput
            accessibilityLabel="Card name filter"
            placeholder="Card name"
            placeholderTextColor={c.muted}
            value={filters.name}
            maxLength={100}
            onChangeText={(value) => set("name", value)}
            style={s.input}
          />
          <TextInput
            accessibilityLabel="Artist filter"
            placeholder="Artist"
            placeholderTextColor={c.muted}
            value={filters.artist}
            maxLength={120}
            onChangeText={(value) => set("artist", value)}
            style={s.input}
          />
          <Text style={s.heading}>Tags</Text>
          <TextInput
            accessibilityLabel="Find tags"
            placeholder="Find tags"
            placeholderTextColor={c.muted}
            value={tagQuery}
            onChangeText={setTagQuery}
            style={s.input}
          />
          <View style={s.grid}>
            {tags
              .filter((tag) =>
                [tag.label, ...tag.aliases].some((text) =>
                  text.toLowerCase().includes(tagQuery.toLowerCase()),
                ),
              )
              .map((tag) =>
                checkbox(tag.id, tag.label, filters.tags.includes(tag.id), () =>
                  set(
                    "tags",
                    filters.tags.includes(tag.id)
                      ? filters.tags.filter((id) => id !== tag.id)
                      : [...filters.tags, tag.id],
                  ),
                ),
              )}
          </View>
        </ScrollView>
      </Modal>
      <Modal
        visible={!!interpretation}
        presentationStyle="pageSheet"
        animationType="slide"
        onRequestClose={() => setInterpretation(null)}
      >
        <ScrollView style={s.modal} contentContainerStyle={{ gap: 16 }}>
          <Text style={s.heading}>Search meaning</Text>
          {status}
          <View style={s.grid}>
            {interpretation?.tags.map((id) =>
              checkbox(
                id,
                tags.find((tag) => tag.id === id)?.label ?? id,
                selected.includes(id),
                () =>
                  setSelected((previous) =>
                    previous.includes(id)
                      ? previous.filter((tag) => tag !== id)
                      : [...previous, id],
                  ),
              ),
            )}
          </View>
          {!!interpretation?.note && (
            <Text style={s.body}>{interpretation.note}</Text>
          )}
          {!!interpretation?.remaining && (
            <Text style={s.body}>Also search: {interpretation.remaining}</Text>
          )}
          <View style={s.row}>
            <Action
              label="Cancel"
              disabled={busy}
              onPress={() => setInterpretation(null)}
            />
            <Action
              label="Use search"
              primary
              disabled={busy}
              onPress={() => {
                onFilters({ ...filters, themeTags: selected });
                onQuery(interpretation?.remaining ?? "");
                setInterpretation(null);
              }}
            />
          </View>
          {bootstrap?.capabilities?.curateTags && interpretation?.proposal && (
            <Action
              label="Save meaning for everyone"
              disabled={
                busy ||
                !selected.some((tag) =>
                  interpretation.proposal!.tags.includes(tag),
                )
              }
              onPress={() =>
                run(async () => {
                  const proposal = interpretation.proposal!;
                  await api.request("/search-mappings/accept", "POST", {
                    proposalId: proposal.id,
                    tags: selected.filter((tag) => proposal.tags.includes(tag)),
                  });
                  setInterpretation({
                    ...interpretation,
                    proposal: undefined,
                    note: "Shared meaning saved.",
                  });
                })
              }
            />
          )}
        </ScrollView>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  caption: { ...t.caption, color: c.secondary },
  search: {
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    paddingLeft: 12,
    backgroundColor: c.sunken,
  },
  chip: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: c.lineStrong,
    borderRadius: 99,
  },
  row: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: {
    ...t.body,
    color: c.text,
    minHeight: 44,
    padding: 12,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
  },
  heading: { ...t.heading, color: c.text },
  body: { ...t.body, color: c.secondary },
  error: { ...t.body, color: c.danger },
  modal: { flex: 1, padding: 16, backgroundColor: c.background },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  option: {
    width: "50%",
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingRight: 10,
  },
  check: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
