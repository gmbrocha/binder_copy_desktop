import { LoadingTask } from './components/Loading';
import { useLoading } from './components/Loading';
import Modal from "./components/DesktopDialog";
import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { ApiClient, ApiError, type Bootstrap } from "./api/client";
import CardImage from "./components/CardImage";
import PageSheet from "./components/PageSheet";
import Icon, { type IconName } from "./components/Icon";
import ScreenInsets from "./components/ScreenInsets";
import {
  beginReplacement,
  keepReplacement,
  type Replacement,
} from "./features/build/replacement";
import { swapSlots } from "./features/build/dragGeometry";
import CardDetails from "./features/catalog/CardDetails";
import { emptyFilters, type Card, type Page } from "./shared/contracts/index";
import Appearance from "./features/build/Appearance";
import PagesLibrary from "./features/library/PagesLibrary";
import MissingCards from "./features/build/MissingCards";
import SearchControls from "./features/catalog/SearchControls";
import TagManager from "./features/catalog/TagManager";
import SettingsPanel from "./features/settings/SettingsPanel";
import { usePurchaseRecovery } from "./features/billing/usePurchaseRecovery";
import { DraftJournal } from "./features/build/draftJournal";
import { authStorage } from "./auth/storage";
import { newPage, PageSession } from "./features/build/pageSession";
import {
  propose,
  keepProposal,
  fingerprint,
  type Inspiration,
  type Proposal,
} from "./features/build/generation";
import { pickPhotoColors } from "./platform/media";
import { colors as c, type as typography } from "./design/tokens";

function Button({
  label,
  onPress,
  disabled = false,
  primary = false,
  icon,
  plain = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
  icon?: IconName;
  plain?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        primary && s.primary,
        plain && { borderWidth: 0 },
        disabled && s.disabled,
        pressed && s.pressed,
      ]}
    >
      {icon && (
        <Icon name={icon} size={18} color={primary ? c.onAccent : c.text} />
      )}
      <Text style={[s.buttonText, primary && { color: c.onAccent }]}>
        {label}
      </Text>
    </Pressable>
  );
}
export default function Workbench({
  api,
  createId,
  desktop = false,
  onSignOut,
  onAccountDeleted,
}: {
  api: ApiClient;
  createId: () => string;
  desktop?: boolean;
  onSignOut?: () => Promise<void>;
  onAccountDeleted?: () => Promise<void>;
}) {
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState<"Build" | "Cards" | "Library">("Build");
  const [bootstrap, setBootstrap] = useState<Bootstrap>();
  usePurchaseRecovery(api, bootstrap?.user.id, async () => {
    const refreshed = await api.bootstrap();
    setBootstrap(previous => previous?.user.id === refreshed.user.id ? refreshed : previous);
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [, render] = useState(0);
  const [session, setSession] = useState(
    () =>
      new PageSession(
        newPage(createId()),
        (p) => api.save(p),
        () => render((n) => n + 1),
      ),
  );
  const [selected, setSelected] = useState(-1);
  const [sourceOptions, setSourceOptions] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [moveFrom, setMoveFrom] = useState<number | null>(null);
  const [cards, setCards] = useState<Record<string, Card>>({});
  const [results, setResults] = useState<Card[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [searching, setSearching] = useState(false);
  const [searchEpoch, setSearchEpoch] = useState(0);
  const [gridWidth, setGridWidth] = useState(width - 32);
  const [draftReady, setDraftReady] = useState(false);
  const [recovery, setRecovery] = useState<Page | null>(null);
  const journal = useRef<DraftJournal | null>(null);
  const journalHasDraft = useRef(false);
  const [confirm, setConfirm] = useState<{
    title: string;
    label: string;
    action: () => Promise<void>;
  } | null>(null);
  const [library, setLibrary] = useState<"Pages" | "Collection">("Pages");
  const [picker, setPicker] = useState<"manual" | "favorite" | "colors" | null>(
    null,
  );
  const [replacement, setReplacement] = useState<Replacement | null>(null);
  const [similar, setSimilar] = useState<Card[]>([]);
  const [detail, setDetail] = useState<Card | null>(null);
  const [settings, setSettings] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [nameOpen, setNameOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [themeOpen, setThemeOpen] = useState(false);
  const [theme, setTheme] = useState("");
  const [preview, setPreview] = useState(false);
  const [missingOpen, setMissingOpen] = useState(false);
  const busyRef = useRef(false);
  const closingAccount = useRef(false);
  const [accountDeleted, setAccountDeleted] = useState(false);
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const searchVersion = useRef(0);
  const page = session.page;
  const remember = (items: Card[]) =>
    setCards((existing) => ({
      ...existing,
      ...Object.fromEntries(items.map((card) => [card.id, card])),
    }));
  const report = (e: unknown) => {
    const message = e instanceof Error ? e.message : "Something went wrong.";
    if (/KeyChain|SecureStore|entitlement/i.test(message)) {
      if (__DEV__)
        console.warn("Secure storage initialization failed:", message);
      setError("Secure storage is unavailable. Restart the app and try again.");
    } else setError(message);
  };
  const withLoading = useLoading();
  const run = async (fn: () => Promise<void>) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError("");
    try {
      await withLoading("action", fn);
    } catch (e) {
      report(e);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  };
  useEffect(() => {
    void api.bootstrap().then(setBootstrap).catch(report);
  }, [api]);
  useEffect(() => {
    if (!bootstrap) return;
    let active = true;
    const next = new DraftJournal(authStorage, bootstrap.user.id);
    journal.current = next;
    void next
      .read()
      .then((draft) => {
        if (active) {
          journalHasDraft.current = !!draft;
          setRecovery(draft);
          setDraftReady(true);
        }
      })
      .catch(report);
    return () => {
      active = false;
    };
  }, [bootstrap?.user.id]);
  useEffect(() => {
    if (!draftReady || recovery || !journal.current || !page.name.trim())
      return;
    const meaningful =
      page.revision ||
      page.name !== "Untitled page" ||
      page.slots.some((slot) => slot.cardId);
    const persistDraft = () => {
      if (closingAccount.current) return;
      if (session.dirty && meaningful) {
        journalHasDraft.current = true;
        void journal.current!.write(page).catch(report);
      } else if (!session.dirty && journalHasDraft.current) {
        journalHasDraft.current = false;
        void journal.current!.clear().catch(report);
      }
    };
    const timer = setTimeout(persistDraft, 150);
    const lifecycle = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        clearTimeout(timer);
        persistDraft();
      }
    });
    return () => {
      clearTimeout(timer);
      lifecycle.remove();
    };
  }, [session, JSON.stringify(page), session.dirty, draftReady, recovery]);
  const searchActive =
    tab === "Cards" ||
    (tab === "Library" && library === "Collection") ||
    !!picker;
  const collectionSearch = tab === "Library" && !picker;
  const activeFilters = {
    ...filters,
    q: query,
    ownership: collectionSearch ? ("owned" as const) : filters.ownership,
  };
  useEffect(() => {
    if (!searchActive) return;
    const version = ++searchVersion.current;
    setSearching(true);
    setResults([]);
    setTotal(0);
    const controller = new AbortController();
    const timer = setTimeout(() => {
      void api
        .search(activeFilters, 0, desktop ? 80 : 48, controller.signal)
        .then((result) => {
          if (version !== searchVersion.current) return;
          remember(result.cards);
          setResults(result.cards);
          setTotal(result.total);
        })
        .catch((e) => {
          if (!controller.signal.aborted) report(e);
        })
        .finally(() => {
          if (version === searchVersion.current) setSearching(false);
        });
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [api, JSON.stringify(activeFilters), searchActive, desktop, searchEpoch]);
  useEffect(() => {
    if (
      !draftReady ||
      recovery ||
      !page.name.trim() ||
      !session.dirty ||
      session.error ||
      !bootstrap ||
      (!page.revision &&
        page.name === "Untitled page" &&
        !page.slots.some((x) => x.cardId))
    )
      return;
    const timer = setTimeout(() => {
      if (closingAccount.current) return;
      void session.save().catch(report);
    }, 700);
    return () => clearTimeout(timer);
  }, [
    session,
    JSON.stringify(page),
    bootstrap,
    session.error,
    draftReady,
    recovery,
  ]);
  const replaceSession = (next: Page, recovered = false) => {
    setSession(
      new PageSession(
        next,
        (p) => api.save(p),
        () => render((n) => n + 1),
        recovered,
      ),
    );
    setMoveFrom(null);
    setSelected(-1);
    setZoom(false);
    setTab("Build");
    setError("");
  };
  const openPage = async (shown: Page) => {
    const next = await session.prepareOpen(shown);
    await journal.current?.clear();
    journalHasDraft.current = false;
    const loaded = await api.cards(
      next.slots.flatMap((slot) => (slot.cardId ? [slot.cardId] : [])),
    );
    remember(loaded.cards);
    replaceSession(next);
  };
  const resize = (size: Page["size"]) => {
    const apply = async () => {
      session.edit((p) => ({
        ...p,
        size,
        backdrop: undefined,
        backdropMode: "color",
        slots: Array.from(
          { length: size * size },
          (_, i) => p.slots[i] ?? { cardId: null, locked: false },
        ),
      }));
      setMoveFrom(null);
      setSelected(-1);
    };
    if (
      size < page.size &&
      page.slots.slice(size * size).some((slot) => slot.cardId)
    )
      setConfirm({
        title: "Remove cards outside the smaller page?",
        label: "Resize page",
        action: apply,
      });
    else void apply();
  };
  const recoverDraft = () =>
    run(async () => {
      if (!recovery) return;
      const draft = recovery;
      replaceSession(draft, true);
      setRecovery(null);
      void api
        .cards(
          draft.slots.flatMap((slot) => (slot.cardId ? [slot.cardId] : [])),
        )
        .then((result) => remember(result.cards))
        .catch(report);
    });
  const saveCopy = () =>
    run(async () => {
      const copied = await api.save({
        ...session.page,
        id: createId(),
        revision: 0,
        name: `${session.page.name.slice(0, 93)} (copy)`,
      });
      replaceSession(copied);
    });
  const reloadSaved = () =>
    setConfirm({
      title: "Replace local changes with the saved page?",
      label: "Reload saved",
      action: async () => {
        const result = await api.pages();
        const saved = result.pages.find((p) => p.id === session.page.id);
        if (!saved)
          throw new Error(
            "This page was deleted. Save a copy to keep your changes.",
          );
        const loaded = await api.cards(
          saved.slots.flatMap((slot) => (slot.cardId ? [slot.cardId] : [])),
        );
        remember(loaded.cards);
        replaceSession(saved);
      },
    });
  const generate = async (
    inspiration: Inspiration,
    input = session.page,
    source = fingerprint(session.page),
  ) => {
    const result = await propose(api, input, inspiration);
    if (sessionRef.current !== session || source !== fingerprint(session.page))
      throw new Error("Your page changed. Generate another preview.");
    remember(result.cards);
    setProposal({ ...result, source });
    setPicker(null);
    setThemeOpen(false);
  };
  const startReplacement = (card?: Card, target = selected) => {
    const next = beginReplacement(session.page, target, card);
    setReplacement(next);
    setSimilar([]);
    setQuery("");
    setPicker("manual");
    const seedCardId =
      session.page.seedCardId ?? session.page.slots[target]?.cardId;
    if (seedCardId)
      void api
        .request<{ cards: Card[] }>("/cards/similar", "POST", {
          seedCardId,
          filters: session.page.filters,
        })
        .then((result) => {
          remember(result.cards);
          setSimilar(result.cards);
        })
        .catch(() => {});
  };
  const reroll = () =>
    run(async () => {
      const source = fingerprint(session.page),
        target = selected;
      if (session.page.slots[target]?.locked)
        throw new Error("Unlock this slot first.");
      const result = await api.request<{
        slots: Page["slots"];
        cards: Card[];
        note?: string;
      }>("/generate", "POST", {
        slots: session.page.slots,
        filters: session.page.filters,
        seedCardId: session.page.seedCardId,
        target,
      });
      if (
        source !== fingerprint(session.page) ||
        sessionRef.current !== session
      )
        throw new Error("Your page changed. Reroll again.");
      remember(result.cards);
      const candidate = result.cards.find(
        (card) => card.id === result.slots[target]?.cardId,
      );
      if (!candidate || candidate.id === session.page.slots[target]?.cardId)
        throw new Error(
          result.note || "No different card matches these filters.",
        );
      startReplacement(candidate);
    });
  const choose = async (card: Card) => {
    remember([card]);
    if (picker === "favorite" || picker === "colors")
      await generate(
        { kind: picker === "favorite" ? "favorite" : "card-colors", card },
        { ...session.page, filters: activeFilters },
      );
    else if (replacement) {
      setReplacement({ ...replacement, card });
    } else {
      if (session.page.slots[selected]?.locked)
        throw new Error("Unlock this slot first.");
      session.edit((p) => ({
        ...p,
        slots: p.slots.map((slot, i) =>
          i === selected ? { ...slot, cardId: card.id } : slot,
        ),
      }));
      const next = session.page.slots.findIndex(
        (slot, i) => i > selected && !slot.cardId,
      );
      setSelected(next >= 0 ? next : selected);
      setPicker(null);
    }
  };
  const fromPhoto = () =>
    run(async () => {
      const source = fingerprint(session.page);
      const colors = await pickPhotoColors();
      if (!colors) return;
      if (
        sessionRef.current !== session ||
        source !== fingerprint(session.page)
      )
        throw new Error("Your page changed. Choose the photo again.");
      await generate({ kind: "photo", colors });
    });
  const more = () =>
    run(async () => {
      const version = searchVersion.current;
      const result = await api.search(
        activeFilters,
        results.length,
        desktop ? 80 : 48,
      );
      if (version !== searchVersion.current) return;
      remember(result.cards);
      setResults((current) => [...current, ...result.cards]);
      setTotal(result.total);
    });
  const columns = desktop
    ? Math.max(3, Math.floor((gridWidth + 12) / 132))
    : picker
      ? 3
      : width >= 600
        ? 3
        : 2;
  const cardGap = picker && !desktop ? 8 : 12;
  const cardWidth = Math.max(1, (gridWidth - (columns - 1) * cardGap) / columns);
  const cardGrid = (select: (card: Card) => void) => (
    <View
      style={{ flex: 1, gap: 12 }}
      onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
    >
      <SearchControls
        api={api}
        createId={createId}
        bootstrap={bootstrap}
        query={query}
        onQuery={setQuery}
        filters={filters}
        onFilters={setFilters}
        collection={collectionSearch}
        showInterpretIcon={!!picker}
      />
      {searching ? (
        <LoadingTask />
      ) : !picker ? (
        <Text style={s.caption}>{total.toLocaleString()} cards</Text>
      ) : null}
      <FlatList
        key={columns}
        numColumns={columns}
        data={results}
        keyExtractor={(card) => card.id}
        contentContainerStyle={{ gap: picker ? 16 : 12, paddingVertical: picker ? 8 : 16 }}
        columnWrapperStyle={{ gap: cardGap }}
        renderItem={({ item }) => (
          <View style={{ width: cardWidth }}><Pressable
            accessibilityRole="button"
            accessibilityLabel={item.name + ", " + item.setName}
            style={{ width: cardWidth }}
            onPress={() => select(item)}
          >
            <CardImage
              api={api}
              id={item.id}
              style={s.cardArt}
              resizeMode="contain"
            />
            <Text numberOfLines={1} style={[picker ? s.caption : s.buttonText, { marginTop: 8, paddingRight: picker ? 28 : 0, color: c.text }]}>
              {item.name}
            </Text>
            <Text numberOfLines={1} style={[s.caption, {paddingRight: picker ? 28 : 0}]}>
              {item.setName} · {item.number}
            </Text>
          </Pressable>
          {picker && <Pressable accessibilityRole="button" accessibilityLabel={`Details for ${item.name}`} onPress={() => setDetail(item)} style={{position: "absolute", right: 0, bottom: 0, width: 32, height: 40, alignItems: "center", justifyContent: "center"}}><Icon name="info" size={18} color={c.muted}/></Pressable>}
          </View>
        )}
        ListEmptyComponent={
          searching ? null : <Text style={s.muted}>No cards found.</Text>
        }
        ListFooterComponent={
          results.length < total ? (
            <Button
              label="More cards"
              onPress={more}
              disabled={busy || searching}
            />
          ) : null
        }
      />
    </View>
  );
  const sheet = (shown: Page, interactive: boolean, showLocks = !interactive) => (
    <PageSheet
      api={api}
      page={shown}
      cards={cards}
      titleFont="Audiowide"
      showLocks={showLocks}
      maximumWidth={interactive && zoom ? 1400 : 820}
      selected={interactive ? selected : -1}
      onDragging={interactive ? setDragging : undefined}
      onSelect={
        interactive && !busy
          ? (i) => {
              if (moveFrom !== null) {
                if (session.page.slots[i].locked) {
                  setError("Unlock this slot first.");
                  return;
                }
                session.edit((p) => swapSlots(p, moveFrom, i));
                setMoveFrom(null);
              }
              setSelected(i);
              if (
                moveFrom === null &&
                !session.page.slots[i].cardId &&
                !session.page.slots[i].locked &&
                !busy
              ) {
                setQuery("");
                setReplacement(null);
                setPicker("manual");
              }
            }
          : undefined
      }
      onLock={
        interactive && !busy
          ? (i) =>
              session.edit((p) => ({
                ...p,
                slots: p.slots.map((slot, index) =>
                  index === i ? { ...slot, locked: !slot.locked } : slot,
                ),
              }))
          : undefined
      }
      onSwap={
        interactive && !busy
          ? (from, to) => session.edit((p) => swapSlots(p, from, to))
          : undefined
      }
    />
  );
  const modalStatus = (
    <>
      {busy && <LoadingTask />}
      {!!error && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss error"
          onPress={() => setError("")}
          style={s.error}
        >
          <Text style={{ color: c.danger }}>{error}</Text>
        </Pressable>
      )}
    </>
  );
  const navigation = (
    <View
      accessibilityRole="tablist"
      style={[s.tabs, desktop && { borderTopWidth: 0 }]}
    >
      {(["Build", "Cards", "Library"] as const).map((name) => (
        <Pressable
          key={name}
          testID={`nav-${name.toLowerCase()}`}
          accessibilityRole="tab"
          accessibilityLabel={name}
          accessibilityState={{ selected: tab === name, disabled: busy }}
          disabled={busy}
          onPress={() => setTab(name)}
          style={[
            s.tab,
            desktop && tab === name && s.activeTab,
            desktop && { flexDirection: "row", gap: 8 },
          ]}
        >
          <View
            style={
              !desktop && [
                s.navPill,
                tab === name && { backgroundColor: c.accentSoft },
              ]
            }
          >
            <Icon
              color={tab === name ? c.accent : c.muted}
              name={
                { Build: "grid", Cards: "cards", Library: "library" }[name] as
                  "grid" | "cards" | "library"
              }
              size={20}
            />
          </View>
          <Text
            style={[
              s.buttonText,
              !desktop && { fontSize: 12, lineHeight: 16, color: c.muted },
              tab === name && { color: c.accent },
            ]}
          >
            {name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
  const filled = page.slots.filter((slot) => slot.cardId).length;
  const sourceLabel = page.seedCardId
    ? `Around ${cards[page.seedCardId]?.name ?? "a favorite card"}`
    : page.colorInspiration
      ? page.colorInspiration.source === "photo"
        ? "Colors from a photo"
        : "Colors from a card"
      : page.themeSource
        ? page.themeSource
        : "";
  const sourceTiles = (
    <View style={{ gap: 8 }}>
      <Text style={s.heading}>{desktop ? "Build a page" : "Start from"}</Text>
      {!desktop && (
        <Text style={s.caption}>
          Each one opens a proposal you can shuffle before keeping.
        </Text>
      )}
      <View style={[s.row, { flexWrap: "wrap" }]}>
        {[
          {
            label: "A favorite card",
            icon: "favorite" as IconName,
            action: () => {
              setSourceOptions(false);
              setQuery("");
              setPicker("favorite");
            },
          },
          {
            label: "A card’s colors",
            icon: "droplet" as IconName,
            action: () => {
              setSourceOptions(false);
              setQuery("");
              setPicker("colors");
            },
          },
          {
            label: "A photo",
            icon: "camera" as IconName,
            action: () => {
              setSourceOptions(false);
              void fromPhoto();
            },
          },
          {
            label: "A theme",
            icon: "star" as IconName,
            action: () => {
              setSourceOptions(false);
              setTheme(page.themeSource ?? "");
              setThemeOpen(true);
            },
          },
        ].map((option) => (
          <Pressable
            key={option.label}
            accessibilityRole="button"
            accessibilityLabel={option.label}
            disabled={busy}
            onPress={option.action}
            style={[
              s.sourceTile,
              { width: desktop ? "100%" : "47%", minHeight: desktop ? 48 : 60 },
              busy && s.disabled,
            ]}
          >
            <View style={s.sourceIcon}>
              <Icon name={option.icon} size={16} color={c.accent} />
            </View>
            <Text style={[s.buttonText, { flex: 1, fontWeight: "600" }]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
  const sourceControls = sourceLabel ? (
    <View style={[s.sourceStrip, desktop && { flexWrap: "wrap" }]}>
      <View style={s.sourceIcon}>
        <Icon
          name={
            page.seedCardId
              ? "favorite"
              : page.colorInspiration
                ? "droplet"
                : "star"
          }
          color={c.accent}
          size={20}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Generation source options"
        disabled={busy}
        onPress={() => setSourceOptions(true)}
        style={{ flex: 1, gap: 4 }}
      >
        <Text numberOfLines={1} style={[s.buttonText, { fontWeight: "600" }]}>
          {sourceLabel} ▾
        </Text>
        <Text numberOfLines={1} style={s.caption}>
          Replaces the {page.slots.filter((slot) => !slot.locked).length}{" "}
          unlocked slots
        </Text>
      </Pressable>
      <View style={desktop ? { width: "100%" } : undefined}>
        <Button
          label="Regenerate"
          icon="shuffle"
          disabled={busy || page.slots.every((slot) => slot.locked)}
          onPress={() => run(() => generate({ kind: "repeat" }))}
        />
      </View>
    </View>
  ) : !filled ? (
    sourceTiles
  ) : null;
  const appearance = (
    <Appearance
      key={page.id}
      api={api}
      session={session}
      cards={cards}
      createId={createId}
      blocked={busy}
      onBusy={(active) => {
        busyRef.current = active;
        setBusy(active);
      }}
      canGenerate={
        !!bootstrap?.backdropConfigured &&
        bootstrap?.capabilities?.paidApi !== false
      }
      canSurround={!!bootstrap?.surroundConfigured && bootstrap?.capabilities?.paidApi !== false}
      selectedCardId={page.slots[selected]?.cardId ?? undefined}
    />
  );
  const selectedSlot = page.slots[selected];
  const selectedCard = selectedSlot?.cardId
    ? cards[selectedSlot.cardId]
    : undefined;
  const slotAction = (
    label: string,
    icon: IconName,
    action: () => void,
    disabled = false,
    visibleLabel = label,
  ) => (
    <Pressable
      key={label}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={busy || disabled}
      onPress={action}
      style={[
        s.slotAction,
        desktop && {
          width: "47%",
          flexGrow: 1,
          borderWidth: 1,
          borderColor: c.border,
          borderRadius: 6,
        },
        (busy || disabled) && s.disabled,
      ]}
    >
      <Icon name={icon} size={20} />
      <Text style={s.caption}>{visibleLabel}</Text>
    </Pressable>
  );
  const slotControls = selected >= 0 && selectedSlot && (
    <View style={{ gap: 8 }}>
      <View style={s.row}>
        <View style={s.slotNumber}>
          <Text style={{ color: c.background, fontWeight: "600" }}>
            {selected + 1}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Details"
          onPress={() => selectedCard && setDetail(selectedCard)}
          style={{ flex: 1 }}
        >
          <Text numberOfLines={1} style={s.buttonText}>
            {selectedCard?.name ?? "Empty slot"}
          </Text>
          {selectedCard && (
            <Text numberOfLines={1} style={s.caption}>
              {selectedCard.setName} · {selectedCard.number}
            </Text>
          )}
        </Pressable>
        {selectedCard && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={selectedCard.owned ? "Owned" : "Mark owned"}
            disabled={busy}
            onPress={() =>
              run(async () => {
                const result = await api.ownership(
                  selectedCard.id,
                  !selectedCard.owned,
                );
                remember([{ ...selectedCard, owned: result.owned }]);
                setSearchEpoch((n) => n + 1);
              })
            }
            style={{
              borderWidth: 1,
              borderColor: c.lineStrong,
              borderRadius: 99,
              padding: 8,
            }}
          >
            <Text style={s.caption}>
              {selectedCard.owned ? "Owned" : "Mark owned"}
            </Text>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Deselect slot"
          onPress={() => {
            setSelected(-1);
            setMoveFrom(null);
          }}
          style={s.iconButton}
        >
          <Icon name="close" />
        </Pressable>
      </View>
      <View style={[s.row, desktop && { flexWrap: "wrap" }]}>
        {slotAction(
          selectedSlot.locked ? "Unlock slot" : "Lock slot",
          selectedSlot.locked ? "lock" : "unlock",
          () =>
            session.edit((p) => ({
              ...p,
              slots: p.slots.map((slot, i) =>
                i === selected ? { ...slot, locked: !slot.locked } : slot,
              ),
            })),
          false,
          selectedSlot.locked ? "Unlock" : "Lock",
        )}
        {slotAction(
          selectedSlot.cardId ? "Replace" : "Fill slot",
          "replace",
          () => {
            if (selectedSlot.cardId) startReplacement();
            else {
              setReplacement(null);
              setQuery("");
              setPicker("manual");
            }
          },
          selectedSlot.locked,
        )}
        {slotAction(
          "Reroll",
          "shuffle",
          reroll,
          selectedSlot.locked || !selectedSlot.cardId,
        )}
        {slotAction(
          moveFrom === null ? "Move" : "Cancel move",
          "move",
          () =>
            setMoveFrom((previous) => (previous === null ? selected : null)),
          selectedSlot.locked || !selectedSlot.cardId,
        )}
        {slotAction(
          "Remove card",
          "trash",
          () =>
            session.edit((p) => ({
              ...p,
              slots: p.slots.map((slot, i) =>
                i === selected ? { cardId: null, locked: false } : slot,
              ),
            })),
          selectedSlot.locked || !selectedSlot.cardId,
          "Remove",
        )}
      </View>
      {moveFrom !== null && (
        <Text style={s.caption}>Tap a destination slot</Text>
      )}
    </View>
  );
  const builderActions = (
    <View style={s.row}>
      <Button
        label="Undo"
        disabled={!session.history.length || busy}
        onPress={() => session.undo()}
      />
      <Button
        label="Save"
        disabled={session.saving || busy}
        onPress={() => run(() => session.save())}
      />
      <Button
        label="Preview"
        disabled={!filled || busy}
        onPress={() => setPreview(true)}
      />
    </View>
  );
  const activeDialog = nameOpen
    ? "name"
    : confirm
      ? "confirm"
      : tagsOpen
        ? "tags"
        : detail
          ? "detail"
          : proposal
            ? "proposal"
            : picker
              ? "picker"
              : themeOpen
                ? "theme"
                : sourceOptions
                  ? "sources"
                  : missingOpen
                    ? "missing"
                    : preview
                        ? "preview"
                        : settings
                          ? "settings"
                          : null;
  const closeDialog = () => {
    if (busy) return;
    if (activeDialog === "name") setNameOpen(false);
    else if (activeDialog === "confirm") setConfirm(null);
    else if (activeDialog === "tags") setTagsOpen(false);
    else if (activeDialog === "detail") setDetail(null);
    else if (activeDialog === "proposal") setProposal(null);
    else if (activeDialog === "picker") {
      setPicker(null);
      setReplacement(null);
    } else if (activeDialog === "theme") setThemeOpen(false);
    else if (activeDialog === "sources") setSourceOptions(false);
    else if (activeDialog === "missing") setMissingOpen(false);
    else if (activeDialog === "preview") setPreview(false);
    else setSettings(false);
  };
  if (accountDeleted)
    return (
      <View
        style={[s.root, { padding: 24, justifyContent: "center", gap: 20 }]}
      >
        <Text style={s.heading}>Account deletion requested</Text>
        <Text style={s.body}>
          Your private content has been removed. Sign-in removal is being
          completed.
        </Text>
        {modalStatus}
        <Button
          label="Return to sign in"
          disabled={busy}
          onPress={() =>
            run(async () => {
              await journal.current?.clear();
              await onAccountDeleted?.();
            })
          }
        />
      </View>
    );
  if (!draftReady || recovery)
    return (
      <View
        style={[s.root, { padding: 24, justifyContent: "center", gap: 16 }]}
      >
        {modalStatus}
        {recovery ? (
          <>
            <Text style={s.title}>Unsaved page</Text>
            <Text style={s.heading}>{recovery.name}</Text>
            <Button
              label="Restore page"
              primary
              disabled={busy}
              onPress={recoverDraft}
            />
            <Button
              label="Discard draft"
              disabled={busy}
              onPress={() =>
                run(async () => {
                  await journal.current?.clear();
                  journalHasDraft.current = false;
                  setRecovery(null);
                })
              }
            />
          </>
        ) : (
          <>
            {!error && <LoadingTask />}
            {!!error && (
              <>
                <Button
                  label="Retry"
                  onPress={() =>
                    run(async () => {
                      if (!bootstrap) setBootstrap(await api.bootstrap());
                      else {
                        const draft = await journal.current!.read();
                        setRecovery(draft);
                        setDraftReady(true);
                      }
                    })
                  }
                />
                {bootstrap && (
                  <Button
                    label="Discard unreadable draft"
                    onPress={() =>
                      run(async () => {
                        await journal.current?.clear();
                        setDraftReady(true);
                      })
                    }
                  />
                )}
              </>
            )}
          </>
        )}
      </View>
    );
  return (
    <View style={s.root}>
      <View
        style={[s.header, desktop && { height: 64, paddingHorizontal: 24 }]}
      >
        <Image
          accessibilityLabel="BinderCopy"
          source={require("../assets/brand/wordmark.png")}
          style={{ width: desktop ? 176 : 150, height: 38 }}
          resizeMode="contain"
        />
        {desktop && (
          <View style={{ flex: 1, maxWidth: 480, marginHorizontal: 24 }}>
            {navigation}
          </View>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Settings"
          onPress={() => setSettings(true)}
          style={{
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="gear" size={22} />
        </Pressable>
      </View>
      {!!error && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss error"
          onPress={() => setError("")}
          style={s.error}
        >
          <Text style={{ color: c.danger }}>{error}</Text>
        </Pressable>
      )}
      {busy && <LoadingTask />}
      <View style={[s.body, desktop && { paddingHorizontal: 24 }]}>
        {tab === "Build" && (
          <ScrollView
            scrollEnabled={!dragging}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 24, alignItems: "center" }}
          >
            <View
              style={{ width: "100%", maxWidth: desktop ? 1252 : 580, gap: 24 }}
            >
              <View style={s.row}>
                <View style={{ flex: 1 }}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Page name"
                    onPress={() => {
                      setNameDraft(
                        page.name === "Untitled page" ? "" : page.name,
                      );
                      setNameOpen(true);
                    }}
                    style={[s.row, { minHeight: 28 }]}
                  >
                    <Text style={[s.title, { flexShrink: 1 }]}>
                      {page.name}
                    </Text>
                    <Icon name="pencil" size={16} color={c.muted} />
                  </Pressable>
                  <Text
                    style={[
                      s.caption,
                      { marginTop: 4 },
                      !session.dirty && { color: c.accent },
                    ]}
                  >
                    {session.error
                      ? "Not saved"
                      : session.saving
                        ? "Saving…"
                        : session.dirty
                          ? "Unsaved"
                          : "Saved"}
                  </Text>
                </View>
                <Button
                  label="New"
                  icon="plus"
                  disabled={busy}
                  onPress={() => run(() => openPage(newPage(createId())))}
                />
                {desktop && builderActions}
              </View>
              {!!session.error && (
                <View style={[s.row, { flexWrap: "wrap" }]}>
                  <Button
                    label="Retry save"
                    disabled={busy}
                    onPress={() => run(() => session.save())}
                  />
                  <Button
                    label="Save a copy"
                    disabled={busy}
                    onPress={saveCopy}
                  />
                  {session.error instanceof ApiError &&
                    session.error.status === 409 && (
                      <Button
                        label="Reload saved"
                        disabled={busy}
                        onPress={reloadSaved}
                      />
                    )}
                </View>
              )}
              {!desktop && sourceControls}
              <View
                style={
                  desktop && {
                    flexDirection: "row",
                    gap: 24,
                    alignItems: "flex-start",
                  }
                }
              >
                <View style={{ flex: 1, gap: desktop ? 16 : 24 }}>
                  <View style={s.row}>
                    {!desktop && !filled && (
                      <Text
                        style={[s.buttonText, { flex: 1, fontWeight: "600" }]}
                      >
                        Or fill it by hand
                      </Text>
                    )}
                    <View
                      style={[
                        s.row,
                        {
                          backgroundColor: c.sunken,
                          borderRadius: 8,
                          padding: 2,
                          gap: 2,
                        },
                      ]}
                    >
                      {(
                        [2, 3, 4, ...(desktop ? [5] : [])] as Page["size"][]
                      ).map((size) => (
                        <Pressable
                          key={size}
                          accessibilityRole="radio"
                          accessibilityLabel={`${size} × ${size}`}
                          accessibilityState={{ checked: page.size === size }}
                          disabled={busy}
                          onPress={() => resize(size)}
                          style={{
                            paddingHorizontal: 10,
                            minHeight: 40,
                            justifyContent: "center",
                            borderRadius: 6,
                            backgroundColor:
                              page.size === size ? c.raised : "transparent",
                          }}
                        >
                          <Text
                            style={[
                              s.caption,
                              page.size === size && { color: c.text },
                            ]}
                          >
                            {size}×{size}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                    {!!filled && !desktop && (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Undo"
                        disabled={!session.history.length || busy}
                        onPress={() => session.undo()}
                        style={{
                          padding: 10,
                          marginLeft: "auto",
                          opacity: session.history.length ? 1 : 0.4,
                        }}
                      >
                        <Icon name="undo" size={20} />
                      </Pressable>
                    )}
                    {desktop && <View style={{ flex: 1 }} />}
                    {(desktop || !!filled) && (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={
                          zoom ? "Show whole page" : "Zoom in"
                        }
                        disabled={busy}
                        onPress={() => setZoom((v) => !v)}
                        style={s.iconButton}
                      >
                        <Icon name="zoom" />
                      </Pressable>
                    )}
                  </View>
                  <View>
                    {zoom ? (
                      <ScrollView horizontal scrollEnabled={!dragging}>
                        <View style={{ width: desktop ? 1100 : width * 1.6 }}>
                          {sheet(page, true)}
                        </View>
                      </ScrollView>
                    ) : (
                      sheet(page, true)
                    )}
                  </View>
                  {!!filled && (
                    <View style={[s.row, { justifyContent: "space-between" }]}>
                      <Text style={s.caption}>
                        {
                          page.slots.filter(
                            (slot) => slot.cardId && cards[slot.cardId]?.owned,
                          ).length
                        }{" "}
                        of {filled} owned
                      </Text>
                      <Button
                        label={`${new Set(page.slots.flatMap((slot) => (slot.cardId && !cards[slot.cardId]?.owned ? [slot.cardId] : []))).size} to collect`}
                        onPress={() => setMissingOpen(true)}
                      />
                    </View>
                  )}
                </View>
                {desktop && (
                  <View
                    style={[
                      s.panel,
                      { width: 300, gap: 20, backgroundColor: c.surface },
                    ]}
                  >
                    {slotControls}
                    {sourceControls}
                    {appearance}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        )}
        {tab === "Cards" && (
          <View style={{ flex: 1 }}>
            <View style={[s.row, { marginBottom: 24 }]}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={s.title}>Cards</Text>
                <Text style={s.caption}>
                  {bootstrap?.catalog?.count?.toLocaleString()} in the shared
                  catalog
                </Text>
              </View>
              {bootstrap?.capabilities?.curateTags && (
                <Button
                  label="Tags"
                  icon="tag"
                  onPress={() => setTagsOpen(true)}
                />
              )}
            </View>
            {cardGrid(setDetail)}
          </View>
        )}
        {tab === "Library" && (
          <View style={{ flex: 1, gap: 12 }}>
            <View style={s.row}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={s.title}>Library</Text>
                <Text style={s.caption}>
                  {bootstrap?.user.name} · only you see this
                </Text>
              </View>
              <Button
                label="New"
                icon="plus"
                disabled={busy}
                onPress={() => run(() => openPage(newPage(createId())))}
              />
            </View>
            <View style={s.segmented}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="My pages"
                onPress={() => setLibrary("Pages")}
                style={[
                  s.segment,
                  library === "Pages" && { backgroundColor: c.raised },
                ]}
              >
                <Text style={s.buttonText}>Pages</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="My collection"
                onPress={() => setLibrary("Collection")}
                style={[
                  s.segment,
                  library === "Collection" && { backgroundColor: c.raised },
                ]}
              >
                <Text style={s.buttonText}>Collection</Text>
              </Pressable>
            </View>
            {library === "Collection" ? (
              cardGrid(setDetail)
            ) : (
              <PagesLibrary
                api={api}
                session={session}
                createId={createId}
                onOpen={openPage}
                onNew={() => openPage(newPage(createId()))}
                onDeleted={(id) => {
                  if (id === session.page.id)
                    replaceSession(newPage(createId()));
                }}
              />
            )}
          </View>
        )}
      </View>
      {!desktop && tab === "Build" && (
        <View
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            gap: 12,
            backgroundColor: selected >= 0 ? c.surface : c.background,
            borderTopWidth: 1,
            borderTopColor: c.line,
          }}
        >
          {slotControls}
          {selected < 0 && (
            <Button
              icon="eye"
              label="Preview"
              primary
              disabled={!filled || busy}
              onPress={() => setPreview(true)}
            />
          )}
        </View>
      )}
      {!desktop && navigation}
      <Modal
        compact={activeDialog === "name"}
        visible={!!activeDialog}
        animationType="slide"
        presentationStyle={
          activeDialog === "preview" ? "fullScreen" : "pageSheet"
        }
        onRequestClose={closeDialog}
      >
        {activeDialog === "name" && (
          <View style={[s.modal, { flex: 0 }]}>
            <View
              style={[
                s.row,
                { padding: 16, borderTopWidth: 1, borderTopColor: c.line },
              ]}
            >
              <Text style={[s.heading, { flex: 1 }]}>Name your page</Text>
              <Button label="Cancel" plain onPress={() => setNameOpen(false)} />
            </View>
            <TextInput
              accessibilityLabel="Page name"
              autoFocus
              value={nameDraft}
              maxLength={100}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              onChangeText={setNameDraft}
              placeholder="Page name"
              placeholderTextColor={c.muted}
              style={s.input}
            />
            <Button
              label="Save page"
              primary
              disabled={busy || !nameDraft.trim()}
              onPress={() =>
                run(async () => {
                  session.edit((p) => ({ ...p, name: nameDraft.trim() }));
                  await session.save();
                  setNameOpen(false);
                })
              }
            />
          </View>
        )}
        {activeDialog === "sources" && (
          <View style={s.modal}>
            <Button label="Done" onPress={() => setSourceOptions(false)} />
            {sourceTiles}
            <Button
              label="Clear inspiration"
              disabled={busy}
              onPress={() => {
                session.edit((p) => ({
                  ...p,
                  seedCardId: undefined,
                  colorInspiration: undefined,
                  themeSource: undefined,
                }));
                setSourceOptions(false);
              }}
            />
          </View>
        )}
        {activeDialog === "tags" && (
          <TagManager
            api={api}
            tags={bootstrap?.tags ?? []}
            onTags={(tags) =>
              setBootstrap((previous) =>
                previous ? { ...previous, tags } : previous,
              )
            }
            onClose={() => setTagsOpen(false)}
          />
        )}
        {activeDialog === "confirm" && (
          <View style={s.modal}>
            {modalStatus}
            <Text style={s.title}>{confirm?.title}</Text>
            <View style={[s.row, { marginTop: 20 }]}>
              <Button
                label="Cancel"
                disabled={busy}
                onPress={() => setConfirm(null)}
              />
              <Button
                label={confirm?.label ?? "Continue"}
                disabled={busy}
                onPress={() =>
                  run(async () => {
                    await confirm?.action();
                    setConfirm(null);
                  })
                }
              />
            </View>
          </View>
        )}
        {activeDialog === "picker" && (
          <View style={s.modal}>
            {modalStatus}
            <View style={s.row}>
              <Text style={[s.heading, { flex: 1 }]}>
                {picker === "favorite"
                  ? "Pick a favorite card"
                  : picker === "colors"
                    ? "Choose a card’s colors"
                    : replacement
                      ? `Replace slot ${replacement.target + 1}`
                      : `Fill slot ${selected + 1}`}
              </Text>
              <Button
                label="Close"
                plain
                disabled={busy}
                onPress={() => {
                  setPicker(null);
                  setReplacement(null);
                }}
              />
            </View>
            {picker === "favorite" && <Text style={s.caption}>We’ll build the page around it.</Text>}
            {replacement && (
              <View style={[s.row, { gap: 12 }]}>
                <View style={{ width: 100 }}>
                  {sheet(
                    {
                      ...page,
                      slots: page.slots.map((slot, i) =>
                        i === replacement.target && replacement.card
                          ? { ...slot, cardId: replacement.card.id }
                          : slot,
                      ),
                    },
                    false,
                  )}
                </View>
                <Text style={[s.caption, { flex: 1 }]}>
                  {replacement.card
                    ? replacement.card.name
                    : "Choose a replacement"}
                </Text>
              </View>
            )}
            {replacement && similar.length > 0 && (
              <ScrollView
                horizontal
                style={{ maxHeight: 82 }}
                contentContainerStyle={{ gap: 8 }}
              >
                {similar.slice(0, 8).map((card) => (
                  <Pressable
                    key={card.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Preview ${card.name}`}
                    onPress={() => setReplacement({ ...replacement, card })}
                  >
                    <CardImage
                      api={api}
                      id={card.id}
                      style={{ width: 50, height: 70 }}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            )}
            {cardGrid((card) => run(() => choose(card)))}
            {replacement && (
              <Button
                label="Keep this card"
                primary
                disabled={busy || !replacement.card}
                onPress={() =>
                  run(async () => {
                    session.edit((p) => keepReplacement(p, replacement));
                    setReplacement(null);
                    setPicker(null);
                  })
                }
              />
            )}
          </View>
        )}
        {activeDialog === "proposal" && (
          <View style={s.modal}>
            {modalStatus}
            <View style={s.row}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={s.heading}>Your page, together</Text>
                <Text style={s.caption}>
                  Nothing changes until you keep it.
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                disabled={busy}
                onPress={() => setProposal(null)}
                style={s.iconButton}
              >
                <Icon name="close" />
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 16 }}>
              {proposal && (
                <View style={[s.sourceStrip, { borderWidth: 0 }]}>
                  <Icon
                    name={
                      proposal.page.seedCardId
                        ? "favorite"
                        : proposal.page.colorInspiration
                          ? "droplet"
                          : "star"
                    }
                  />
                  <Text style={[s.buttonText, { flex: 1 }]}>
                    {proposal.page.seedCardId
                      ? `Around ${cards[proposal.page.seedCardId]?.name ?? "a favorite card"}`
                      : proposal.page.colorInspiration
                        ? "Colors from your inspiration"
                        : proposal.page.themeSource}
                  </Text>
                  <Button label="Change" plain disabled={busy} onPress={() => {
                    setProposal(null);
                    setSourceOptions(true);
                  }} />
                </View>
              )}
              {proposal && sheet(proposal.page, false)}
              <Text style={s.caption}>
                Shuffle keeps locked cards. You can lock, swap and reorder after
                you keep it.
              </Text>
              {!!proposal?.note && (
                <Text style={s.caption}>{proposal.note}</Text>
              )}
            </ScrollView>
            <View
              style={[
                s.row,
                { paddingTop: 12, borderTopWidth: 1, borderTopColor: c.line },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Button
                  label="Shuffle"
                  icon="shuffle"
                  disabled={busy}
                  onPress={() => {
                    if (proposal)
                      void run(() =>
                        generate(
                          { kind: "repeat" },
                          proposal.input,
                          proposal.source,
                        ),
                      );
                  }}
                />
              </View>
              <View style={{ flex: 1.4 }}>
                <Button
                  label="Keep this page"
                  primary
                  disabled={busy}
                  onPress={() =>
                    run(async () => {
                      if (proposal)
                        session.edit((p) => keepProposal(p, proposal));
                      setProposal(null);
                    })
                  }
                />
              </View>
            </View>
          </View>
        )}
        {activeDialog === "theme" && (
          <View style={s.modal}>
            {modalStatus}
            <View style={s.row}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={s.heading}>Start from a theme</Text>
                <Text style={s.caption}>
                  Describe the cards you have in mind.
                </Text>
              </View>
              <Button
                label="Cancel"
                plain
                disabled={busy}
                onPress={() => setThemeOpen(false)}
              />
            </View>
            <SearchControls
              api={api}
              createId={createId}
              bootstrap={bootstrap}
              query={theme}
              onQuery={setTheme}
              filters={filters}
              onFilters={setFilters}
              showInterpretIcon
            />
            <View style={{ flex: 1 }} />
            <Button
              label="Generate from this"
              primary
              disabled={busy || !theme.trim()}
              onPress={() =>
                run(() =>
                  generate(
                    { kind: "theme", query: theme },
                    { ...session.page, filters },
                  ),
                )
              }
            />
          </View>
        )}
        {activeDialog === "preview" && (
          <ScreenInsets style={{ flex: 1, backgroundColor: c.background }}>
            {modalStatus}
            <View style={[s.header, { justifyContent: "flex-start" }]}>
              <Button
                label="Builder"
                plain
                icon="back"
                disabled={busy}
                onPress={() => setPreview(false)}
              />
              <Text style={[s.heading, { position: "absolute", left: "40%" }]}>
                Preview
              </Text>
            </View>
            <ScrollView contentContainerStyle={{ gap: 24, padding: 16 }}>
              {sheet(page, false, false)}
              {appearance}
            </ScrollView>
            <View
              style={[
                s.row,
                { padding: 16, borderTopWidth: 1, borderTopColor: c.line },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Button
                  label="Missing list"
                  disabled={busy}
                  onPress={() => setMissingOpen(true)}
                />
              </View>
            </View>
          </ScreenInsets>
        )}
        {activeDialog === "missing" && (
          <View style={{ flex: 1, backgroundColor: c.background }}>
            {modalStatus}
            <MissingCards
              api={api}
              page={page}
              onCard={(card) => {
                if (!busy) setDetail(card);
              }}
              onClose={() => {
                if (!busy) setMissingOpen(false);
              }}
            />
          </View>
        )}
        {activeDialog === "detail" && (
          <View style={{ flex: 1, backgroundColor: c.background }}>
            {detail && (
              <CardDetails
                key={detail.id}
                api={api}
                initial={detail}
                tags={bootstrap?.tags ?? []}
                canCurate={bootstrap?.capabilities?.curateTags ?? false}
                onBuild={(kind, card) => {
                  setDetail(null);
                  setTab("Build");
                  void run(() => generate({ kind, card }));
                }}
                onPlace={(card) => {
                  if (picker) {setDetail(null);void run(() => choose(card));return;}
                  const slots = session.page.slots;
                  let target = selected >= 0 && !slots[selected]?.locked ? selected : slots.findIndex(slot => !slot.cardId && !slot.locked);
                  if (target < 0) target = slots.findIndex(slot => !slot.locked);
                  if (target < 0) {setError("Unlock a slot first.");return;}
                  setDetail(null);setTab("Build");setSelected(target);
                  if (slots[target].cardId) startReplacement(card, target);
                  else session.edit(p => ({...p, slots: p.slots.map((slot,i) => i === target ? {...slot,cardId: card.id} : slot)}));
                }}
                onClose={() => setDetail(null)}
                onUpdate={(next) => {
                  remember([next]);
                  setDetail(next);
                  setSearchEpoch((value) => value + 1);
                  setResults((previous) =>
                    previous.map((card) => (card.id === next.id ? next : card)),
                  );
                }}
              />
            )}
          </View>
        )}
        {activeDialog === "settings" && (
          <View style={{ flex: 1, backgroundColor: c.background }}>
            <SettingsPanel
              api={api}
              bootstrap={bootstrap}
              onBootstrap={setBootstrap}
              blocked={busy}
              onDeleteAccount={
                onAccountDeleted
                  ? async () => {
                      closingAccount.current = true;
                      try {
                        await api.request("/account", "DELETE", {
                          confirmation: "DELETE",
                        });
                      } catch (e) {
                        closingAccount.current = false;
                        throw e;
                      }
                      setAccountDeleted(true);
                      await journal.current?.clear();
                      await onAccountDeleted();
                    }
                  : undefined
              }
              onClose={() => setSettings(false)}
              onSignOut={
                onSignOut
                  ? async () => {
                      if (
                        session.dirty &&
                        (page.revision ||
                          page.name !== "Untitled page" ||
                          page.slots.some((slot) => slot.cardId))
                      )
                        await session.save();
                      await journal.current?.clear();
                      await onSignOut();
                    }
                  : undefined
              }
            />
          </View>
        )}
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: c.background },
  header: {
    paddingHorizontal: 16,
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: c.line,
    borderBottomWidth: 1,
  },
  body: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  button: {
    minHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    gap: 8,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },
  buttonText: { ...typography.label, color: c.text },
  primary: { backgroundColor: c.accent, borderColor: c.accent, minHeight: 44 },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.7 },
  input: {
    minHeight: 44,
    color: c.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: { ...typography.title, color: c.text },
  heading: { ...typography.heading, color: c.text },
  caption: { ...typography.caption, color: c.secondary },
  muted: { ...typography.body, color: c.secondary },
  tabs: { flexDirection: "row", borderTopWidth: 1, borderTopColor: c.line },
  tab: {
    flex: 1,
    height: 64,
    gap: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  activeTab: { backgroundColor: c.accentSoft },
  cardArt: {
    width: "100%",
    aspectRatio: 0.716,
    borderRadius: 6,
    backgroundColor: c.sunken,
  },
  panel: {
    padding: 16,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 8,
    gap: 4,
  },
  sheet: {
    padding: 12,
    borderRadius: 10,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  slot: {
    width: "100%",
    aspectRatio: 0.716,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: c.line,
    backgroundColor: c.sunken,
    alignItems: "center",
    justifyContent: "center",
  },
  lock: {
    position: "absolute",
    right: 5,
    bottom: 5,
    padding: 4,
    borderRadius: 4,
    backgroundColor: c.surface,
  },
  modal: { flex: 1, padding: 16, gap: 16, backgroundColor: c.background },
  error: { padding: 12, backgroundColor: c.surface },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  navPill: {
    width: 52,
    height: 28,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sourceTile: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: c.lineStrong,
    borderRadius: 8,
    backgroundColor: c.surface,
  },
  sourceIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: c.raised,
    alignItems: "center",
    justifyContent: "center",
  },
  sourceStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: c.lineStrong,
    borderRadius: 8,
    backgroundColor: c.surface,
  },
  slotAction: {
    flex: 1,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  slotNumber: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: c.text,
    alignItems: "center",
    justifyContent: "center",
  },
  segmented: {
    flexDirection: "row",
    padding: 3,
    gap: 2,
    borderWidth: 1,
    borderColor: c.lineStrong,
    borderRadius: 8,
    backgroundColor: c.sunken,
  },
  segment: {
    flex: 1,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
});
