import { pageSchema, type Page } from '../../shared/contracts';
export type DraftStorage = { getItem(key: string): Promise<string | null>; setItem(key: string, value: string): Promise<void>; removeItem(key: string): Promise<void> };
type Manifest = { slot: 0 | 1; count: number };
/** Two banks of small Keychain items. Publish the manifest only after all chunks are durable. */
export class DraftJournal {
  private tail: Promise<unknown> = Promise.resolve();
  private key: string;
  constructor(private storage: DraftStorage, account: string) {
    this.key = 'draft.' + Array.from(account).map(c => c.codePointAt(0)!.toString(16)).join('-');
  }
  private async manifest(): Promise<Manifest | null> {
    const raw = await this.storage.getItem(this.key);
    if (!raw) return null;
    const value = JSON.parse(raw);
    if (![0, 1].includes(value.slot) || !Number.isInteger(value.count) || value.count < 1 || value.count > 100) throw new Error('Local draft could not be read.');
    return value;
  }
  async read(): Promise<Page | null> {
    await this.tail;
    const manifest = await this.manifest();
    if (!manifest) return null;
    const parts = await Promise.all(Array.from({ length: manifest.count }, (_, i) => this.storage.getItem(`${this.key}.${manifest.slot}.${i}`)));
    if (parts.some(p => p === null)) throw new Error('Local draft is incomplete.');
    return pageSchema.parse(JSON.parse(parts.join('')));
  }
  write(page: Page): Promise<void> {
    // Capture now: a delayed storage operation must not serialize a later mutable object.
    const serialized = JSON.stringify(pageSchema.parse(page));
    return this.enqueue(async () => {
      const old = await this.manifest();
      const slot = old?.slot === 0 ? 1 : 0;
      const points = Array.from(serialized);
      const chunks = Array.from({ length: Math.ceil(points.length / 450) }, (_, i) => points.slice(i * 450, (i + 1) * 450).join(''));
      if (chunks.length > 100) throw new Error('Local draft exceeds storage capacity.');
      for (let i = 0; i < chunks.length; i++) await this.storage.setItem(`${this.key}.${slot}.${i}`, chunks[i]);
      await this.storage.setItem(this.key, JSON.stringify({ slot, count: chunks.length }));
      if (old) for (let i = 0; i < old.count; i++) await this.storage.removeItem(`${this.key}.${old.slot}.${i}`).catch(() => {});
    });
  }
  clear(): Promise<void> {
    return this.enqueue(async () => {
      await this.storage.removeItem(this.key);
      // Also remove abandoned chunks from an interrupted write.
      for (let bank = 0; bank < 2; bank++) for (let i = 0; i < 100; i++) await this.storage.removeItem(`${this.key}.${bank}.${i}`);
    });
  }
  private enqueue(action: () => Promise<void>): Promise<void> {
    const result = this.tail.catch(() => {}).then(action);
    this.tail = result;
    return result;
  }
}
