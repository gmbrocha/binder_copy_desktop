import React from 'react';
import { View } from 'react-native';
import type { ApiClient } from '../../api/client';
import type { Page } from '../../shared/contracts';
import PageSheet from '../../components/PageSheet';

// Keep thumbnail title/logo positions and background treatment identical to exports.
export default function PageThumbnail({ api, page }: { api: ApiClient; page: Page }) {
  return <View accessible={false} pointerEvents="none"><PageSheet api={api} page={page} cards={{}} titleFont="Audiowide" /></View>;
}
