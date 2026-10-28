// Server-side catalog. Prices live HERE, never trusted from the browser.
// Keep in sync with src/data/products.ts (ids and prices).
export type CatalogItem = { id: string; name: string; cents: number; files: string[] };

export const FILES = {
  playbook: 'The_Quarterback_Playbook.pdf',
  filmroom: 'QB_Film_Room_Guide.pdf',
  journal: 'Offseason_QB_Training_Journal.pdf',
};

export const CATALOG: Record<string, CatalogItem> = {
  sku_playbook_001: { id: 'sku_playbook_001', name: 'The Quarterback Playbook', cents: 2400, files: [FILES.playbook] },
  sku_filmroom_002: { id: 'sku_filmroom_002', name: 'QB Film Room Guide', cents: 1900, files: [FILES.filmroom] },
  sku_journal_003: { id: 'sku_journal_003', name: 'Offseason QB Training Journal', cents: 1200, files: [FILES.journal] },
  sku_bundle_004: { id: 'sku_bundle_004', name: 'Complete QB Development Bundle', cents: 4500, files: [FILES.playbook, FILES.filmroom, FILES.journal] },
};
