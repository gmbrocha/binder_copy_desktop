import Modal from '../../components/DesktopDialog';
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import type { ApiClient } from "../../api/client";
import type { Page } from "../../shared/contracts";
import PageThumbnail from "./PageThumbnail";
import type { PageSession } from "../build/pageSession";
import { colors as c, type as t } from "../../design/tokens";

export default function PagesLibrary({
  api,
  session,
  createId,
  onOpen,
  onNew,
  onDeleted,
}: {
  api: ApiClient;
  session: PageSession;
  createId: () => string;
  onOpen: (page: Page) => Promise<void>;
  onNew: () => Promise<void>;
  onDeleted: (id: string) => void;
}) {
  const [pages, setPages] = useState<Page[]>([]);
  const [selected, setSelected] = useState<Page | null>(null);
  const [name, setName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const load = async () => {
    const result = await api.pages();
    setPages(result.pages);
  };
  useEffect(() => {
    let active = true;
    setBusy(true);
    void api
      .pages()
      .then((result) => {
        if (active) setPages(result.pages);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setBusy(false);
      });
    return () => {
      active = false;
    };
  }, [api]);
  const run = async (fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update pages.");
    } finally {
      setBusy(false);
    }
  };
  const button = (label: string, fn: () => void, disabled = false) => (
    <Pressable
      accessibilityRole="button"
      disabled={busy || disabled}
      onPress={fn}
      style={[s.button, (busy || disabled) && { opacity: 0.4 }]}
    >
      <Text style={s.label}>{label}</Text>
    </Pressable>
  );
  const current = async (shown: Page) => {
    if (session.page.id === shown.id) {
      if (session.dirty) await session.save();
      return session.page;
    }
    return shown;
  };
  const rename = () =>
    run(async () => {
      if (!selected) return;
      const validName = name.trim();
      if (!validName) throw new Error("Enter a page name.");
      if (session.page.id === selected.id) {
        session.edit((p) => ({ ...p, name: validName }));
        await session.save();
      } else await api.save({ ...selected, name: validName });
      setSelected(null);
      await load();
    });
  const duplicate = () =>
    run(async () => {
      if (!selected) return;
      const source = await current(selected);
      await api.save({
        ...source,
        id: createId(),
        revision: 0,
        name: `${source.name.slice(0, 93)} (copy)`,
      });
      setSelected(null);
      await load();
    });
  const remove = () =>
    run(async () => {
      if (!selected) return;
      const source = await current(selected);
      await api.request("/pages/" + source.id, "DELETE", {
        revision: source.revision,
      });
      onDeleted(source.id);
      setSelected(null);
      setConfirmDelete(false);
      await load();
    });
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
  return (
    <View style={{ flex: 1, gap: 12 }}>
      <View style={s.row}>
        <Text style={[s.title, { flex: 1 }]}>My pages</Text>
        {button("+ New", () => run(onNew))}
      </View>
      {status}
      <ScrollView contentContainerStyle={{ gap: 12, paddingBottom: 24 }}>
        {!busy && !pages.length && (
          <Text style={s.body}>No saved pages yet.</Text>
        )}
        {pages.map((page) => (
          <View key={page.id} style={s.panel}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Open ${page.name}`}
              disabled={busy}
              onPress={() => run(() => onOpen(page))}
              style={{
                flex: 1,
                gap: 12,
                paddingVertical: 8,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <PageThumbnail api={api} page={page} />
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={s.heading}>{page.name}</Text>
                <Text style={s.body}>
                  {page.size} × {page.size} ·{" "}
                  {page.slots.filter((slot) => slot.cardId).length} cards
                </Text>
              </View>
            </Pressable>
            {button("Edit", () => {
              setSelected(page);
              setName(page.name);
              setConfirmDelete(false);
              setError("");
            })}
          </View>
        ))}
      </ScrollView>
      <Modal
        visible={!!selected}
        presentationStyle="pageSheet"
        animationType="slide"
        onRequestClose={() => {
          if (!busy) setSelected(null);
        }}
      >
        <View style={s.modal}>
          {status}
          <Text style={s.title}>
            {confirmDelete ? "Delete page?" : "Edit page"}
          </Text>
          {confirmDelete ? (
            <>
              <Text style={s.body}>“{selected?.name}” will be deleted.</Text>
              <View style={s.row}>
                {button("Cancel", () => setConfirmDelete(false))}
                {button("Delete page", remove)}
              </View>
            </>
          ) : (
            <>
              <TextInput
                accessibilityLabel="Page name"
                maxLength={100}
                value={name}
                onChangeText={setName}
                style={s.input}
              />
              <View style={s.row}>
                {button("Save name", rename, !name.trim())}
                {button("Duplicate", duplicate)}
                {button("Delete", () => setConfirmDelete(true))}
              </View>
              {button("Done", () => setSelected(null))}
              {!!error &&
                button("Reload pages", () =>
                  run(async () => {
                    await load();
                    setSelected(null);
                  }),
                )}
            </>
          )}
        </View>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, alignItems: "center" },
  title: { ...t.title, color: c.text },
  heading: { ...t.heading, color: c.text },
  body: { ...t.body, color: c.secondary },
  label: { ...t.label, color: c.text },
  error: { ...t.body, color: c.danger },
  button: {
    minHeight: 44,
    padding: 12,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 1,
  },
  panel: {
    padding: 12,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 8,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  modal: { flex: 1, padding: 20, gap: 20, backgroundColor: c.background },
  input: {
    ...t.body,
    color: c.text,
    minHeight: 44,
    padding: 12,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 6,
  },
});
