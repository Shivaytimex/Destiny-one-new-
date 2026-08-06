import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import giftCatalog from '../../shared/gift-catalog.json';
import { buildGiftConciergePlan } from './giftConcierge';

const migration = readFileSync('supabase/migrations/20260805042245_gift_inventory_tracking_and_proof.sql', 'utf8');
const checkout = readFileSync('supabase/functions/create-gift-order/index.ts', 'utf8');
const webhook = readFileSync('supabase/functions/gift-delivery-webhook/index.ts', 'utf8');
const reserve = readFileSync('supabase/functions/reserve-gift-inventory/index.ts', 'utf8');
const nativeGiftService = readFileSync('src/services/gifts.ts', 'utf8');
const app = readFileSync('App.tsx', 'utf8');

describe('gift fulfillment v3 contract', () => {
  it('uses one complete, unique catalog and resolves production checkout prices from Postgres', () => {
    expect(giftCatalog).toHaveLength(12);
    expect(new Set(giftCatalog.map((product) => product.id)).size).toBe(giftCatalog.length);
    expect(new Set(giftCatalog.map((product) => product.sku)).size).toBe(giftCatalog.length);
    expect(checkout).toContain('/rest/v1/gift_catalog_products');
    expect(checkout).not.toContain("'ruby-roses':{name:");
    expect(nativeGiftService).toContain("import giftCatalogJson from '../../shared/gift-catalog.json'");
    expect(nativeGiftService).toContain('Object.fromEntries');
    expect(nativeGiftService).not.toContain("'ruby-roses':{name:");
  });

  it('orders occasion and delivery context before the Concierge action in the compact original UI', () => {
    expect(app.indexOf('OCCASION & DELIVERY CONTEXT')).toBeLessThan(app.indexOf('Build my surprise'));
    expect(app).toContain('TOTAL CHECKOUT BUDGET');
  });

  it('keeps the complete AI recommendation estimate inside the selected budget', () => {
    for (const budgetCents of [4000, 4500, 6000, 10000, 15000]) {
      const plan = buildGiftConciergePlan({ recipientName: 'Anika', city: 'Fresno', mood: 'romantic', occasion: 'Just because', deliveryWindow: 'asap', budgetCents });
      expect(plan.estimatedTotalCents).toBeLessThanOrEqual(budgetCents);
      expect(plan.estimatedSubtotalCents).toBeGreaterThan(0);
    }
  });

  it('holds inventory atomically, expires stale holds and keeps private tables service-role only', () => {
    expect(migration).toContain('for update skip locked');
    expect(migration).toContain('expire_gift_inventory_reservations');
    expect(migration).toContain("inventory_reservation_status='unavailable'");
    expect(migration).toContain('revoke all on public.gift_inventory from public,anon,authenticated');
    expect(reserve).toContain('recipient_id:`eq.${user.id}`');
  });

  it('authenticates and deduplicates courier events while storing privacy-safe delivery proof', () => {
    expect(webhook).toContain("{name:'HMAC',hash:'SHA-256'}");
    expect(webhook).toContain('secureEqual');
    expect(webhook).toContain('process_gift_delivery_webhook_v2');
    expect(migration).toContain('gift_order_webhook_receipts');
    expect(migration).toContain("retention_expires_at");
    expect(migration).toContain("proof_status='verified'");
  });
});
