import { LoadingTask } from '../../components/Loading';
import { useLoading } from '../../components/Loading';
import Modal from "../../components/DesktopDialog";
import React, { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ApiClient } from "../../api/client";
import type { Card, Page } from "../../shared/contracts";
import { paletteSchema } from "../../shared/contracts";
import { palettes } from "../../shared/domain/palettes";
import { colors as c, type as typography } from "../../design/tokens";
import CustomColor from "./CustomColor";
import PageSheet from "../../components/PageSheet";
import Icon from "../../components/Icon";
import type { PageSession } from "./pageSession";
import {
  backgroundSource,
  beginBackground,
  keepBackground,
  requestBackground,
  type BackgroundAttempt,
  type BackgroundProposal,
} from "./background";

export default function Appearance({
  api,
  session,
  cards,
  createId,
  canGenerate,
  onBusy,
  blocked,
}: {
  api: ApiClient;
  session: PageSession;
  cards: Record<string, Card>;
  createId: () => string;
  canGenerate: boolean;
  onBusy: (busy: boolean) => void;
  blocked: boolean;
}) {
  const [proposal, setProposal] = useState<BackgroundProposal | null>(null);
  const [attempt, setAttempt] = useState<BackgroundAttempt | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const page = session.page;
  const hasCards = page.slots.some((slot) => slot.cardId);
  const mode = page.backdropMode ?? (page.backdrop ? "art" : "color");
  const withLoading = useLoading();
  const run = async (fn: () => Promise<void>) => {
    if (pending.current || blocked) return;
    pending.current = true;
    setBusy(true);
    onBusy(true);
    setError("");
    try {
      await withLoading("action", fn);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      pending.current = false;
      setBusy(false);
      onBusy(false);
    }
  };
  const button = (
    label: string,
    action: () => void,
    disabled = false,
    primary = false,
  ) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: busy || blocked || disabled }}
      disabled={busy || blocked || disabled}
      onPress={action}
      style={[
        s.button,
        primary && { backgroundColor: c.accent, borderColor: c.accent },
        (busy || blocked || disabled) && { opacity: 0.4 },
      ]}
    >
      <Text style={[s.label, primary && { color: c.onAccent }]}>{label}</Text>
    </Pressable>
  );
  const generate = () =>
    run(async () => {
      if (!canGenerate)
        throw new Error("Art backdrops are unavailable for this account.");
      const next = attempt ?? beginBackground(session.page, createId());
      setAttempt(next);
      const result = await requestBackground(api, next);
      setAttempt(null);
      keepBackground(session.page, result);
      setProposal(result);
    });
  const suggest = () =>
    run(async () => {
      const source = backgroundSource(session.page);
      const result = await api.request<{ palette: unknown }>(
        "/palette",
        "POST",
        {
          ids: session.page.slots.flatMap((slot) =>
            slot.cardId ? [slot.cardId] : [],
          ),
        },
      );
      if (source !== backgroundSource(session.page))
        throw new Error("Your page changed. Suggest colors again.");
      const palette = paletteSchema.parse(result.palette);
      session.edit((p) => ({ ...p, palette, customColor: undefined }));
    });
  const preview =
    proposal && proposal.source === backgroundSource(page)
      ? { ...page, backdrop: proposal.backdrop, backdropMode: "art" as const }
      : null;
  return (
    <View style={{ gap: 16 }}>
      <View style={s.row}>
        <Text style={[s.heading, { flex: 1 }]}>Backdrop</Text>
        {(canGenerate || page.backdrop) && (
          <View style={s.segmented}>
            {(["color", "art"] as const).map((value) => (
              <Pressable
                key={value}
                accessibilityRole="radio"
                accessibilityLabel={value === "color" ? "Color" : "Art"}
                accessibilityState={{ checked: mode === value }}
                disabled={busy || blocked}
                onPress={() =>
                  session.edit((p) => ({ ...p, backdropMode: value }))
                }
                style={[
                  s.segment,
                  mode === value && { backgroundColor: c.raised },
                ]}
              >
                {value === "art" && (
                  <Icon
                    name="star"
                    size={18}
                    color={mode === value ? c.text : c.muted}
                  />
                )}
                <Text
                  style={[
                    s.label,
                    { color: mode === value ? c.text : c.muted },
                  ]}
                >
                  {value === "color" ? "Color" : "Art"}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      <View style={s.row}>
        <Text style={[s.caption, { flex: 1 }]}>
          {mode === "art"
            ? "Palette the art is painted in"
            : "Solid page color"}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Match my cards"
          disabled={busy || blocked || !hasCards}
          onPress={suggest}
          style={{ minHeight: 40, justifyContent: "center" }}
        >
          <Text style={[s.caption, { color: c.accent }]}>Match my cards</Text>
        </Pressable>
      </View>
      <View
        accessibilityLabel="Page color"
        style={{ flexDirection: "row", gap: 2 }}
      >
        {Object.entries(palettes).map(([id, palette]) => (
          <Pressable
            key={id}
            accessibilityRole="radio"
            accessibilityLabel={palette.label}
            accessibilityState={{ checked: !page.customColor && (page.palette ?? "forge") === id }}
            disabled={busy || blocked}
            onPress={() =>
              session.edit((p) => ({ ...p, palette: id as Page["palette"], customColor: undefined, backdropMode: "color" }))
            }
            style={{
              flex: 1,
              alignItems: "center",
              gap: 6,
              paddingVertical: 6,
            }}
          >
            <View
              style={[
                s.swatchRing,
                !page.customColor && (page.palette ?? "forge") === id && { borderColor: c.accent },
              ]}
            >
              <View style={[s.swatch, { backgroundColor: palette.bg }]} />
            </View>
            <Text
              style={[
                s.caption,
                {
                  textAlign: "center",
                  fontSize: 12,
                  color: !page.customColor && (page.palette ?? "forge") === id ? c.text : c.muted,
                },
              ]}
            >
              {palette.label}
            </Text>
          </Pressable>
        ))}
      </View>
      {mode === "color" && <CustomColor key={page.id} value={page.customColor} disabled={busy || blocked}
        onApply={customColor => session.edit(p => ({ ...p, customColor, backdropMode: "color" }))} />}
      {page.backdrop && (
        <View style={s.artPanel}>
          <View style={s.row}>
            <Icon name="star" color={c.accent} />
            <View style={{ flex: 1 }}>
              <Text style={s.label}>Art backdrop</Text>
              <Text style={[s.caption, { color: c.accent }]}>{mode === "art" ? "Applied" : "Saved"}</Text>
            </View>
            {mode !== "art" && button("Reapply", () => { void run(async () => {
              session.edit(p => ({ ...p, backdropMode: "art" }));
            }); })}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remove art backdrop"
              disabled={busy || blocked}
              onPress={() =>
                session.edit((p) => ({
                  ...p,
                  backdrop: undefined,
                  backdropMode: "color",
                }))
              }
              style={{ padding: 10 }}
            >
              <Icon name="trash" />
            </Pressable>
          </View>
          {mode === "art" && canGenerate &&
            button(
              attempt ? "Check background" : "New version",
              generate,
              !hasCards && !attempt,
            )}
        </View>
      )}
      {mode === "art" && !page.backdrop && canGenerate && (
        <View style={s.artPanel}>
          <View style={s.row}>
            <Icon name="star" color={c.accent} />
            <Text style={[s.label, { flex: 1 }]}>
              Paint a backdrop for this set
            </Text>
          </View>
          {button(
            attempt ? "Check background" : "Create art backdrop",
            generate,
            !hasCards && !attempt,
          )}
        </View>
      )}
      {busy && <LoadingTask />}
      {!!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      <Modal
        visible={!!proposal}
        presentationStyle="pageSheet"
        animationType="slide"
        onRequestClose={() => {
          if (!busy) setProposal(null);
        }}
      >
        <View style={s.modal}>
          <View style={s.row}>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={s.heading}>Your finishing touch</Text>
              <Text style={s.caption}>Nothing changes until you keep it.</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Discard and close"
              disabled={busy}
              onPress={() => setProposal(null)}
              style={{ padding: 10 }}
            >
              <Icon name="close" />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
            {preview ? (
              <PageSheet
                api={api}
                page={preview}
                cards={cards}
                titleFont="Audiowide"
              />
            ) : (
              <Text style={s.error}>
                Your page changed. This preview is out of date.
              </Text>
            )}
            {!!error && <Text style={s.error}>{error}</Text>}
          </ScrollView>
          <View style={s.row}>
            <View style={{ flex: 1 }}>
              {button("Try another", generate, !canGenerate)}
            </View>
            <View style={{ flex: 1.4 }}>
              {button(
                "Keep backdrop",
                () => {
                  try {
                    if (proposal)
                      session.edit((p) => keepBackground(p, proposal));
                    setProposal(null);
                  } catch (e) {
                    setError((e as Error).message);
                  }
                },
                !preview,
                true,
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  heading: { ...typography.heading, color: c.text },
  label: { ...typography.label, color: c.text },
  caption: { ...typography.caption, color: c.secondary },
  button: {
    minHeight: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  modal: { flex: 1, padding: 16, backgroundColor: c.background },
  error: { ...typography.body, color: c.danger },
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ffffff26",
  },
  swatchRing: {
    padding: 3,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 24,
  },
  artPanel: {
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: c.lineStrong,
    borderRadius: 8,
    backgroundColor: c.surface,
  },
});
