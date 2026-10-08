import { z } from "zod";
export const artSchema = z.enum(["all", "full", "standard", "unknown"]);
export const filtersSchema = z.object({
  mode: z.enum(["auto", "visual", "catalog"]).default("auto"),
  themeTags: z.array(z.string().max(60)).max(30).default([]),
  q: z.string().max(300).default(""),
  art: artSchema.default("all"),
  ownership: z.enum(["all", "owned", "needed"]).default("all"),
  set: z.string().max(80).default(""),
  category: z.string().max(40).default(""),
  type: z.string().max(40).default(""),
  artist: z.string().max(120).default(""),
  name: z.string().max(100).default(""),
  year: z.string().max(4).default(""),
  tags: z.array(z.string().max(60)).max(30).default([]),
});
export type Filters = z.infer<typeof filtersSchema>;
export const emptyFilters = (): Filters => filtersSchema.parse({});
export const slotSchema = z.object({
  cardId: z.string().max(80).nullable(),
  locked: z.boolean(),
});
export const paletteSchema = z.enum([
  "forge",
  "ocean",
  "ember",
  "forest",
  "plum",
]);
export type PaletteId = z.infer<typeof paletteSchema>;
export const colorsSchema = z
  .array(z.string().regex(/^#[0-9a-fA-F]{6}$/))
  .min(1)
  .max(5);
export const pageSizeSchema = z.union([
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
export const pageSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().trim().min(1).max(100),
    size: pageSizeSchema,
    slots: z.array(slotSchema).max(25),
    filters: filtersSchema,
    revision: z.number().int().min(0),
    palette: paletteSchema.optional(),
    seedCardId: z.string().max(80).optional(),
    themeSource: z.string().max(300).optional(),
    backdropMode: z.enum(["color", "art"]).optional(),
    colorInspiration: z
      .object({
        source: z.enum(["photo", "card"]),
        colors: colorsSchema,
        cardId: z.string().max(80).optional(),
      })
      .optional(),
    backdrop: z
      .object({
        kind: z.literal("generated"),
        assetId: z.string().uuid(),
        sourceHash: z.string().regex(/^[a-f0-9]{64}$/),
        layoutVersion: z.literal(1),
      })
      .optional(),
  })
  .refine(
    (p) => p.slots.length === p.size * p.size,
    "Slot count must match grid size",
  );
export type Page = z.infer<typeof pageSchema>;
export type Slot = z.infer<typeof slotSchema>;
export type Card = {
  id: string;
  name: string;
  setId: string;
  setName: string;
  number: string;
  image: string;
  releaseDate: string;
  category: string;
  rarity: string;
  artist: string;
  types: string[];
  dexIds: number[];
  art: string;
  tags: string[];
  owned: boolean;
  curated: boolean;
  curationRevision?: number;
  annotation?: { description: string; state: string; model: string };
};
export type Tag = {
  id: string;
  label: string;
  category: string;
  aliases: string[];
};
export type CardPrices = {
  cardId: string;
  source: "TCGplayer via TCGdex";
  currency: "USD";
  updatedAt: string | null;
  variants: {
    name: string;
    market: number | null;
    low: number | null;
    url: string | null;
  }[];
};
export const tagSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]{1,60}$/),
  label: z.string().trim().min(1).max(60),
  category: z.enum([
    "color",
    "environment",
    "vibe",
    "style",
    "direction",
    "subject",
  ]),
  aliases: z.array(z.string().trim().min(1).max(80)).max(40),
});
export type ParseResult = {
  tags: string[];
  remaining: string;
  recognized: string[];
  note: string;
  source: "rules" | "ai";
  proposal?: { id: string; phrase: string; tags: string[] };
};

/** 1.1.0 additive billing contract. Role and paid entitlement are independent. */
export type BillingState = {
  tier: 'free' | 'paid' | 'complimentary';
  environment: 'Production' | 'Sandbox' | null;
  expiresAt: number | null;
  needsRefresh: boolean;
  period: string;
  allowanceMicroUsd: number;
  committedMicroUsd: number;
  remainingMicroUsd: number;
  halted: boolean;
  paidApi: boolean;
  credits?: { includedImages: number; includedThemes: number; purchasedImages: number; purchasedDebt: number };
};
export type BillingOffer = {
  state: BillingState;
  productIds: string[];
  purchasingAvailable: boolean;
  privacyUrl?: string;
  termsUrl?: string;
  recentUsage?: { id: string; kind: 'image' | 'theme'; createdAt: number; status: 'pending' | 'consumed' | 'released'; environment: 'Production' | 'Sandbox' }[];
};
