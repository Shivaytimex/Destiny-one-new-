import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const client = readFileSync('src/services/gifts.ts', 'utf8');
const app = readFileSync('App.tsx', 'utf8');
const edge = readFileSync('supabase/functions/create-gift-order/index.ts', 'utf8');
const migration = readFileSync('supabase/migrations/20260805002659_gift_checkout_contract_v2.sql', 'utf8');
const nextClient = readFileSync('frontend/src/services/gifts.js', 'utf8');
const nextGiftPage = readFileSync('frontend/src/components/common/GiftMarketplaceExperience.jsx', 'utf8');
const expressGiftRoute = readFileSync('backend/src/routes/gifts.js', 'utf8');

describe('Gift Checkout v2 frontend/backend contract', () => {
  it('uses one explicit version and idempotency key from UI through persistence', () => {
    for (const source of [client, app, edge, migration, nextClient]) expect(source).toContain('gift-checkout-v2');
    expect(app).toContain('createGiftIdempotencyKey');
    expect(edge).toContain('record_gift_order_request_v2');
    expect(migration).toContain('gift_orders_sender_idempotency_key');
  });

  it('keeps the Next.js developer handoff on the same safe request shape', () => {
    expect(nextGiftPage).toContain('createGiftCheckout');
    expect(nextGiftPage).toContain('cart.map((line) => ({ productId: line.product.id, quantity: line.quantity }))');
    expect(nextClient).toContain('api.post("/gifts/orders", request)');
    expect(nextClient).not.toContain('card.number');
    expect(nextClient).not.toContain('unitPriceCents');
    expect(expressGiftRoute).toContain('gift-checkout-v2');
    expect(expressGiftRoute).toContain('router.post("/orders"');
    expect(expressGiftRoute).toContain('unitPriceCents: product[1]');
    expect(expressGiftRoute).toContain('Raw payment details are not accepted.');
  });

  it('sends only product IDs and quantities while the server owns catalog prices', () => {
    expect(client).toContain("map(({productId,quantity})=>({productId,quantity}))");
    expect(client).not.toContain('body:JSON.stringify(input)');
    expect(edge).toContain('/rest/v1/gift_catalog_products');
    expect(edge).toContain('unitPriceCents:rule.amount');
    expect(edge).not.toContain('const catalog:Record<string,CatalogItem>');
    expect(app).toContain('cart.map(line=>({productId:line.gift.id,quantity:line.quantity}))');
  });

  it('gates checkout to a mutual unblocked match and persists atomically', () => {
    expect(edge).toContain('findMutualMatch');
    expect(edge).toContain('pairIsBlocked');
    expect(edge).toContain("status:'eq.mutual'");
    expect(migration).toContain('insert into public.gift_order_items');
    expect(migration).toContain('insert into public.gift_order_checkout_private');
    expect(migration).toContain('exception when unique_violation');
  });

  it('keeps raw card data out of the request and private checkout data out of member access', () => {
    expect(client).not.toMatch(/card\.number[^\n]+JSON\.stringify/);
    expect(edge).toContain('Only a payment-provider token is accepted');
    expect(migration).toContain('revoke all on public.gift_order_checkout_private from public,anon,authenticated');
    expect(migration).toContain('grant all on public.gift_order_checkout_private to service_role');
  });

  it('supports recipient-private and already-known address consent without exposing addresses in chat', () => {
    expect(edge).toContain("'recipient_supplied_private'");
    expect(edge).toContain("'sender_supplied_known_address'");
    expect(migration).toContain("if p_recipient_address_mode='sender_supplied_known_address'");
    expect(migration).toContain('Address confirmed privately.');
  });
});
