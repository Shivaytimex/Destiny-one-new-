import type {GiftCommerceProduct,GiftCurrency} from '../domain/giftCommerce';
import {buildGiftConciergeV2Plan,type GiftConciergeV2Plan} from '../domain/giftExperience';

type ConciergeInput={
  prompt:string;
  products:GiftCommerceProduct[];
  currency:GiftCurrency;
  fallbackBudgetMinor:number;
  previousProductIds?:string[];
  relationshipStage?:'new_match'|'dating'|'committed';
};

export async function requestGiftConciergeV2(input:ConciergeInput):Promise<GiftConciergeV2Plan>{
  const fallback=buildGiftConciergeV2Plan(input);
  if(typeof window==='undefined'||!input.prompt.trim())return fallback;
  try{
    const response=await fetch('/api/gift-concierge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      prompt:input.prompt.trim().slice(0,500),currency:input.currency,fallbackBudgetMinor:input.fallbackBudgetMinor,
      previousProductIds:(input.previousProductIds??[]).slice(0,30),relationshipStage:input.relationshipStage,
      products:input.products.slice(0,50).map(product=>({id:product.id,name:product.name,category:product.category,description:product.description,
        priceMinor:product.localizedPriceMinor,availability:product.availability,deliveryWindows:product.deliveryWindows,moods:product.moods,rating:product.rating})),
    })});
    if(!response.ok)return fallback;
    const live=await response.json() as GiftConciergeV2Plan;
    const ids=new Set(input.products.map(product=>product.id));
    if(!Array.isArray(live.options)||!live.options.length||live.options.length>3||live.options.some(option=>!ids.has(option.productId)))return fallback;
    return{...fallback,...live,prompt:input.prompt.trim(),options:live.options,mode:'live_ai'};
  }catch{return fallback}
}
