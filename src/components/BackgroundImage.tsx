import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, type ImageURISource } from 'react-native';
import type { ApiClient } from '../api/client';
export default function BackgroundImage({ api, id, visible = true, onLoad, onError }: { api: ApiClient; id: string; visible?: boolean; onLoad?: () => void; onError?: () => void }) {
  const [source, setSource] = useState<ImageURISource>();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true; setSource(undefined); setFailed(false);
    void api.backgroundSource(id).then(next => { if (active) setSource(next); }).catch(() => { if (active) { setFailed(true); onError?.(); } });
    return () => { active = false; };
  }, [api, id]);
  return <View pointerEvents="none" style={StyleSheet.absoluteFill}>{source && !failed && <Image source={source} style={[StyleSheet.absoluteFill, { opacity: visible ? 1 : 0 }]} resizeMode="stretch" onLoad={onLoad} onError={() => { setFailed(true); onError?.(); }} />}{failed && <Text style={{ position: 'absolute', bottom: 4, right: 8, color: '#fff', backgroundColor: '#000b', fontSize: 11 }}>Background unavailable</Text>}</View>;
}
