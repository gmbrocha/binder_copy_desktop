import { useLoadingMedia } from './Loading';
import React, { useEffect, useState } from 'react';
import { Image, Text, View, type ImageProps, type ImageURISource } from 'react-native';
import type { ApiClient } from '../api/client';
import { colors, type } from '../design/tokens';

export default function CardImage({ api, id, style, ...props }: Omit<ImageProps, 'source'> & { api: ApiClient; id: string }) {
  const rendered = useLoadingMedia(id);
  const [source, setSource] = useState<ImageURISource>();
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setSource(undefined); setFailed(false);
    void api.imageSource(id).then(next => { if (active) setSource(next); }).catch(() => { if (active) { setFailed(true); rendered(); } });
    return () => { active = false; };
  }, [api, id]);
  if (!source || failed) return <View style={[style, { backgroundColor: colors.sunken, alignItems: 'center', justifyContent: 'center' }]}>{failed && <Text style={{ ...type.caption, color: colors.muted }}>Artwork unavailable</Text>}</View>;
  return <Image {...props} source={source} style={style} resizeMode="contain" onLoadEnd={rendered} onError={() => { setFailed(true); rendered(); }} />;
}
