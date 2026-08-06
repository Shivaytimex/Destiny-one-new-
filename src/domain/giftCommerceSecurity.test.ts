import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
import {URL,fileURLToPath} from 'node:url';

const readContract=(relativePath:string)=>readFileSync(fileURLToPath(new URL(relativePath,import.meta.url)),'utf8');
const migration=readContract('../../supabase/migrations/20260805052601_gift_commerce_superapp.sql');
const syncFunction=readContract('../../supabase/functions/sync-gift-merchant-catalog/index.ts');
const worker=readContract('../../supabase/functions/gift-commerce-worker/index.ts');
const checkout=readContract('../../supabase/functions/create-gift-order/index.ts');

describe('gift commerce production contracts',()=>{
  it('keeps merchant, provider, notification and fraud data service-role private',()=>{
    for(const table of ['gift_merchants','gift_merchant_catalog_items','gift_notification_jobs','gift_provider_jobs','gift_fraud_assessments','gift_commerce_alerts']){
      expect(migration).toContain(`revoke all on public.${table} from public,anon,authenticated`);
      expect(migration).toContain(`grant all on public.${table} to service_role`);
    }
  });

  it('supports US, Canada and India market pricing and city coverage',()=>{
    for(const token of ["'US'","'CA'","'IN'","'USD'","'CAD'","'INR'",'Fresno','Toronto','New Delhi','Mumbai'])expect(migration).toContain(token);
    expect(checkout).toContain('gift_market_prices');
    expect(checkout).toContain('gift_city_coverage');
  });

  it('authenticates merchant sync and retries provider work without exposing secrets',()=>{
    expect(syncFunction).toContain("crypto.subtle.sign('HMAC'");
    expect(syncFunction).toContain('secureEqual');
    expect(worker).toContain('claim_gift_provider_jobs_v4');
    expect(worker).toContain('finish_gift_provider_job_v4');
    expect(worker).not.toMatch(/console\.(log|info)\([^\n]*(address|token|phone)/i);
  });

  it('creates durable confirmations and provider jobs after authoritative order persistence',()=>{
    expect(checkout).toContain('gift_notification_jobs');
    expect(checkout).toContain('gift_provider_jobs');
    expect(checkout).toContain("channel:'sms'");
    expect(checkout).toContain("channel:'push'");
    expect(checkout).not.toContain('cardNumber');
  });
});
