import { NativeEventEmitter, NativeModules } from 'react-native';
import type { PurchaseStore } from '../features/billing/purchases';

const native = NativeModules.BinderPurchases;
export const purchaseStore: PurchaseStore | null = native ? {
  products: ids => native.products(ids), purchase: (id, token) => native.purchase(id, token),
  pending: token => native.pending(token), restore: token => native.restore(token),
  finish: (id, token) => native.finish(id, token),
  listen: changed => new NativeEventEmitter(native).addListener('purchasesChanged', changed),
} : null;
