export const LOADING_DELAY_MS = 750;
export class LoadingClock {
  private pending = new Set<symbol>();
  private timer?: ReturnType<typeof setTimeout>;
  private started = 0;
  private label = '';
  visible = false;
  readonly measurements: { operation: string; durationMs: number }[] = [];
  constructor(private changed: () => void, private now = () => Date.now(), private measured?: (sample: { operation: string; durationMs: number }) => void) {}
  get active() { return this.pending.size > 0; }
  begin(operation: string, onlyIfActive = false) {
    if (onlyIfActive && !this.active) return () => {};
    if (!this.active) {
      this.started = this.now(); this.label = operation;
      this.timer = setTimeout(() => { if (this.active) { this.visible = true; this.changed(); } }, LOADING_DELAY_MS);
    }
    const id = Symbol(); this.pending.add(id);
    return () => {
      if (!this.pending.delete(id) || this.active) return;
      if (this.timer !== undefined) clearTimeout(this.timer); this.visible = false;
      this.measurements.push({ operation: this.label, durationMs: Math.round(this.now() - this.started) });
      this.measured?.(this.measurements[this.measurements.length - 1]);
      if (this.measurements.length > 20) this.measurements.shift();
      this.changed();
    };
  }
  dispose() { if (this.timer !== undefined) clearTimeout(this.timer); this.pending.clear(); this.visible = false; }
}
