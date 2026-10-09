import { LoadingTask } from '../../components/Loading';
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ApiClient, Bootstrap } from "../../api/client";
import Action from "../../components/Action";
import { colors as c, type as t } from "../../design/tokens";
import UsagePanel from "../billing/UsagePanel";
export default function SettingsPanel({
  api,
  bootstrap,
  onBootstrap,
  onClose,
  onSignOut,
  onDeleteAccount,
  blocked,
}: {
  api: ApiClient;
  bootstrap?: Bootstrap;
  onBootstrap: (data: Bootstrap) => void;
  onClose: () => void;
  onSignOut?: () => Promise<void>;
  onDeleteAccount?: () => Promise<void>;
  blocked: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const pending = useRef(false);
  useEffect(() => {
    if (!bootstrap?.catalog?.running) return;
    let active = true;
    const timer = setTimeout(() => {
      void api
        .bootstrap()
        .then((result) => {
          if (active) onBootstrap(result);
        })
        .catch(() => {
          if (active) setError("Could not refresh catalog status.");
        });
    }, 5000);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [api, bootstrap?.catalog]);
  const run = async (fn: () => Promise<void>) => {
    if (pending.current || blocked) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not complete this action.",
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={s.content}>
      <View style={s.row}>
        <Text style={[s.title, { flex: 1 }]}>Settings</Text>
        <Action label="Done" disabled={busy || blocked} onPress={onClose} />
      </View>
      {(busy || blocked) && <LoadingTask />}
      {!!error && (
        <Text accessibilityRole="alert" style={s.error}>
          {error}
        </Text>
      )}
      <View style={s.panel}>
        <Text style={s.heading}>{bootstrap?.user.name}</Text>
        {onSignOut && (
          <Action
            label="Sign out"
            disabled={busy || blocked}
            onPress={() => run(onSignOut)}
          />
        )}
      </View>
      {bootstrap?.user.id && <UsagePanel key={bootstrap.user.id} api={api} accountId={bootstrap.user.id} blocked={busy || blocked} />}
      <View style={s.panel}>
        <Text style={s.heading}>Catalog</Text>
        <Text style={s.body}>
          {(bootstrap?.catalog?.count ?? 0).toLocaleString()} cards ·{" "}
          {(bootstrap?.catalog?.sets ?? 0).toLocaleString()} sets
        </Text>
        <Text style={s.body}>
          {(bootstrap?.visual?.indexed ?? 0).toLocaleString()} artwork images
          indexed
        </Text>
        {!!bootstrap?.catalog?.stage && (
          <Text style={s.caption}>{bootstrap.catalog.stage}</Text>
        )}
        {!!bootstrap?.catalog?.completedAt && (
          <Text style={s.caption}>
            Updated{" "}
            {new Date(bootstrap.catalog.completedAt).toLocaleDateString()}
          </Text>
        )}
        {bootstrap?.capabilities?.manageCatalog && (
          <Action
            label={
              bootstrap.catalog?.running ? "Refreshing…" : "Refresh catalog"
            }
            disabled={busy || blocked || bootstrap.catalog?.running}
            onPress={() =>
              run(async () => {
                await api.request("/admin/import", "POST", {});
                onBootstrap(await api.bootstrap());
              })
            }
          />
        )}
        {!!error && (
          <Action
            label="Refresh status"
            disabled={busy || blocked}
            onPress={() => run(async () => onBootstrap(await api.bootstrap()))}
          />
        )}
      </View>
      <View style={s.panel}>
        <Action label={legalOpen ? "Close legal information" : "Legal & attribution"} disabled={busy || blocked} onPress={() => setLegalOpen(!legalOpen)} />
        {legalOpen && <>
          <Text style={s.heading}>Independent collection tool</Text>
          <Text style={s.body}>BinderCopy is a free, independent tool for visualizing and organizing personal card collections. Card names and reference images identify the cards in your collection. Card artwork and trademarks belong to their respective owners.</Text>
          <Text style={s.body}>BinderCopy is not affiliated with, endorsed by or sponsored by The Pokémon Company, Nintendo, Creatures or GAME FREAK. Catalog data and reference images are provided through TCGdex.</Text>
          <Text style={s.body}>Background artwork is generated at your request. BinderCopy does not sell card artwork or generated backgrounds, and does not offer file exports or downloads. Pages and collections are managed inside the app.</Text>
        </>}
      </View>
      {onDeleteAccount && bootstrap?.capabilities?.deleteAccount && <View style={s.panel}>
        {confirmDelete ? <>
          <Text style={s.heading}>Delete account?</Text>
          <Text style={s.body}>Your pages, collection and generated backgrounds will be permanently removed. Shared tag corrections remain without your name.</Text>
          <Action label="Cancel" disabled={busy || blocked} onPress={() => setConfirmDelete(false)} />
          <Action label="Permanently delete account" disabled={busy || blocked} onPress={() => run(onDeleteAccount)} />
        </> : <Action label="Delete account" disabled={busy || blocked} onPress={() => setConfirmDelete(true)} />}
      </View>}
    </ScrollView>
  );
}
const s = StyleSheet.create({
  content: {
    padding: 20,
    gap: 20,
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { ...t.title, color: c.text },
  heading: { ...t.heading, color: c.text },
  body: { ...t.body, color: c.secondary },
  caption: { ...t.caption, color: c.muted },
  error: { ...t.body, color: c.danger },
  panel: {
    padding: 16,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 8,
    gap: 12,
  },
});
