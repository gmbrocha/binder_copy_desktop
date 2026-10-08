import { emptyFilters, type Page } from '../../shared/contracts/index';
export function newPage(id: string, size: Page['size'] = 3): Page {
  return { id, name: 'Untitled page', size, slots: Array.from({ length: size * size }, () => ({ cardId: null, locked: false })), filters: emptyFilters(), revision: 0, palette: 'forge', backdropMode: 'color' };
}
const content = (page: Page) => JSON.stringify({ ...page, revision: 0 });
const clone = (page: Page): Page => JSON.parse(JSON.stringify(page));
/** Serialized writes acknowledge revisions without replacing newer local edits. */
export class PageSession {
  page: Page;
  history: Page[] = [];
  error: Error | null = null;
  saving = false;
  private acknowledged: string;
  private pending?: Promise<void>;
  constructor(page: Page, private persist: (page: Page) => Promise<Page>, private changed: () => void, recovered = false) {
    this.page = clone(page);
    this.acknowledged = page.revision && !recovered ? content(page) : '';
  }
  get dirty() { return content(this.page) !== this.acknowledged; }
  edit(update: (page: Page) => Page) {
    const next = update(clone(this.page));
    if (next.id !== this.page.id) throw new Error('Edit must preserve page identity.');
    if (content(next) === content(this.page)) return;
    this.history = [...this.history.slice(-49), clone(this.page)];
    this.page = { ...next, revision: this.page.revision };
    this.changed();
  }
  undo() {
    const previous = this.history.pop();
    if (previous) { this.page = { ...previous, revision: this.page.revision }; this.changed(); }
  }
  save(): Promise<void> {
    if (this.pending) return this.pending;
    this.error = null;
    this.saving = true;
    this.changed();
    this.pending = this.flush().finally(() => { this.pending = undefined; this.saving = false; this.changed(); });
    return this.pending;
  }
  private async flush() {
    try {
      while (this.dirty) {
        const submitted = clone(this.page);
        const saved = await this.persist(submitted);
        if (saved.id !== submitted.id) throw new Error('Save response changed page identity.');
        this.acknowledged = content(submitted);
        this.page = { ...this.page, revision: saved.revision };
        this.changed();
      }
    } catch (error) {
      this.error = error instanceof Error ? error : new Error('Save failed.');
      throw this.error;
    }
  }
}
