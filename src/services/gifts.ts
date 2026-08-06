import giftCatalog from "../data/giftCatalog";

export const GIFT_CHECKOUT_CONTRACT = "gift-checkout-v2";
export const giftCheckoutBackendConfigured = false;

export function createGiftCheckoutKey() {
  const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `gift:${id}`;
}

export function buildGiftCheckoutRequest(input) {
  return {
    contractVersion: GIFT_CHECKOUT_CONTRACT,
    idempotencyKey: input.idempotencyKey,
    recipientId: input.recipientId,
    lineItems: input.lineItems.map(({ productId, quantity }) => ({ productId, quantity })),
    note: input.note,
    occasion: input.occasion,
    senderDisplayMode: "first_name",
    recipientAddressMode: input.recipientAddressMode,
    deliveryAddress: input.recipientAddressMode === "sender_supplied_known_address" ? input.deliveryAddress : undefined,
    deliveryWindow: input.deliveryWindow,
    requestedDeliveryAt: input.requestedDeliveryAt,
    deliveryCity: input.deliveryCity,
    deliveryDistanceMilesEstimate: input.deliveryDistanceMilesEstimate,
    paymentMethod: input.paymentMethod,
    paymentTokenMode: "provider_token_required",
    paymentToken: input.paymentToken,
    confirmationEmail: input.confirmationEmail || undefined,
  };
}

export function giftCartStorageKey(recipientId) {
  if (!recipientId) throw new Error("A recipient is required for a gift cart.");
  return `destinyone:gift-cart-v2:${recipientId}`;
}

export function validateScheduledGiftDelivery(deliveryWindow, requestedDeliveryAt, now = new Date()) {
  if (deliveryWindow !== "scheduled") return "";
  const scheduled = new Date(requestedDeliveryAt || "");
  if (Number.isNaN(scheduled.getTime())) return "Choose a delivery date and time.";
  if (scheduled.getTime() < now.getTime() + 60 * 60 * 1000) return "Choose a time at least one hour from now.";
  if (scheduled.getTime() > now.getTime() + 90 * 24 * 60 * 60 * 1000) return "Choose a date within 90 days.";
  return "";
}

export async function createGiftCheckout(input) {
  const request = buildGiftCheckoutRequest(input);
  const scheduleError = validateScheduledGiftDelivery(request.deliveryWindow, request.requestedDeliveryAt);
  if (scheduleError) throw new Error(scheduleError);
  return { contractVersion:GIFT_CHECKOUT_CONTRACT,orderId:`preview-gift-${Date.now()}`,demo:true,status:"recipient_pending",deliveryStatus:"recipient_pending",provider:"frontend_preview",lineItems:request.lineItems };
}

export async function checkGiftAvailability(input) {
  const request = buildGiftCheckoutRequest(input);
  return { contractVersion:GIFT_CHECKOUT_CONTRACT,available:true,inventoryStatus:"preview_available",merchant:{status:"frontend_preview",reservationTtlMinutes:15},courier:{status:"preview_coverage",serviceLevels:[input.deliveryWindow === "scheduled" ? "scheduled" : "same_day"]} };
}

export async function cancelGiftOrder({ orderId, reason }) {
  if (!orderId) throw new Error("Gift order is unavailable.");
  return { orderId,status:"cancelled",deliveryStatus:"cancelled",cancellation:{reason,cancelledAt:new Date().toISOString(),feeCents:0},refund:{status:"preview",amountCents:null,method:"original_payment",estimatedBusinessDays:"3–5"} };
}

export async function requestGiftRefund({ orderId, reason }) {
  if (!orderId) throw new Error("Gift order is unavailable.");
  return { orderId,status:"cancelled",refund:{status:"preview_requested",amountCents:null,method:"original_payment",estimatedBusinessDays:"3–5",reason} };
}

export async function createGiftSupportCase({ orderId, issue, details }) {
  if (!orderId) throw new Error("Gift order is unavailable.");
  if (String(details || "").trim().length < 10) throw new Error("Tell support a little more about the issue.");
  return { contractVersion:GIFT_CHECKOUT_CONTRACT,caseId:`PREVIEW-${Date.now().toString(36).toUpperCase()}`,orderId,issue,details,status:"preview",priority:["Courier cannot find address","Gift damaged"].includes(issue)?"urgent":"standard",responseTarget:"Frontend demonstration only" };
}

export async function getGiftConciergePlan(input) {
  const budget=Math.max(1800,Math.min(25000,Number(input.budgetCents)||5000));
  const profiles=giftCatalog.filter(item=>item.active&&item.deliveryWindows.includes(input.deliveryWindow)).map(item=>({...item,score:(item.priceCents<=budget?4:-Math.ceil((item.priceCents-budget)/1000))+(item.moods.includes(input.mood)?5:0)+3})).sort((a,b)=>b.score-a.score||a.priceCents-b.priceCents);
  const combinations=[];for(let first=0;first<profiles.length;first+=1)for(let second=first;second<profiles.length;second+=1)for(let third=second;third<profiles.length;third+=1){const indexes=[first,second,third].filter((value,index,array)=>index===0||value!==array[index-1]);const products=indexes.map(index=>profiles[index]);if(products.length&&products.length<=3)combinations.push(products)}
  const estimate=(products)=>{const subtotal=products.reduce((sum,item)=>sum+item.priceCents,0);const delivery=Math.max(...products.map(item=>item.deliveryFeeCents));const rush=input.deliveryWindow==="asap"&&!products.some(item=>item.serviceLevel==="scheduled")?299:0;const small=subtotal<2500?199:0;const service=Math.max(199,Math.round(subtotal*.065));const discount=subtotal>=6000?Math.min(499,delivery):0;const taxable=subtotal+delivery+rush+small+service-discount;return{subtotal,total:taxable+Math.round(taxable*.0875)}};
  const candidates=combinations.map(products=>({products,quote:estimate(products),score:products.reduce((sum,item)=>sum+item.score,0)+products.length*2})).filter(item=>item.quote.total<=budget).sort((a,b)=>b.score-a.score||b.quote.total-a.quote.total);
  const fallback=profiles.map(product=>({products:[product],quote:estimate([product]),score:product.score})).sort((a,b)=>a.quote.total-b.quote.total)[0];
  if(!candidates[0])return {contractVersion:GIFT_CHECKOUT_CONTRACT,mode:"preview_rules",recommendedProductIds:[],headline:"A little more room will unlock a thoughtful surprise",reason:`No ${input.deliveryWindow.replace("_"," ")} cart fits the complete $${Math.round(budget/100)} checkout budget yet. The closest delivery-ready option is $${fallback?(fallback.quote.total/100).toFixed(2):"unavailable"} including estimated fees and tax.`,suggestedNote:`${input.recipientName}, I’m thinking of you and saving the right surprise for the right moment. ❤️`,budgetCents:budget,estimatedSubtotalCents:0,estimatedTotalCents:0,privacy:{usesPrivateChatText:false,usesConsentedPreferencesOnly:true},premiumDifferentiators:["Budget protected","Relationship-aware curation","Private surprise coordination","Premium fulfillment"]};
  const chosen=candidates[0];
  return {contractVersion:GIFT_CHECKOUT_CONTRACT,mode:"preview_rules",recommendedProductIds:chosen.products.map(item=>item.id),headline:`A ${input.mood} surprise for ${input.recipientName}`,reason:`Balanced for ${input.occasion.toLowerCase()}, ${input.deliveryWindow.replace("_"," ")} timing and your $${Math.round(budget/100)} total budget. Estimated checkout total $${(chosen.quote.total/100).toFixed(2)}.`,suggestedNote:`${input.recipientName}, I chose this because the little moments with you deserve to feel special. ❤️`,budgetCents:budget,estimatedSubtotalCents:chosen.quote.subtotal,estimatedTotalCents:chosen.quote.total,privacy:{usesPrivateChatText:false,usesConsentedPreferencesOnly:true},premiumDifferentiators:["Relationship-aware curation","Private surprise coordination","Concierge rescue","Premium fulfillment"]};
}

export function validateRecipientGiftAddress(address: Record<string, any> = {}) {
  if (![address.recipientName,address.line1,address.city,address.region,address.postalCode].every(value => String(value || '').trim())) return 'Complete the required delivery fields.';
  if (!['US','CA','IN'].includes(address.country)) return 'Choose United States, Canada, or India.';
  if (address.country==='US'&&!/^\d{5}(?:-\d{4})?$/.test(String(address.postalCode).trim())) return 'Enter a valid US ZIP code.';
  if (address.country==='CA'&&!/^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/i.test(String(address.postalCode).trim())) return 'Enter a valid Canadian postal code.';
  if (address.country==='IN'&&!/^\d{6}$/.test(String(address.postalCode).trim())) return 'Enter a valid 6-digit Indian PIN code.';
  return '';
}

export async function respondGiftCheckout({ orderId, accept, deliveryAddress }) {
  if (!orderId) throw new Error('Gift order is unavailable.');
  if (accept && deliveryAddress) { const error=validateRecipientGiftAddress(deliveryAddress); if (error) throw new Error(error); }
  return { contractVersion:GIFT_CHECKOUT_CONTRACT,orderId,status:accept?'recipient_accepted':'cancelled',deliveryStatus:accept?'recipient_accepted':'cancelled',addressStoredPrivately:Boolean(accept),previewOnly:true };
}

const previewAddresses=[
  {id:'preview-fresno-west',label:'3661 W Shaw Ave, Fresno, CA 93711, USA',line1:'3661 W Shaw Ave',city:'Fresno',region:'CA',postalCode:'93711',country:'US'},
  {id:'preview-toronto-king',label:'100 King St W, Toronto, ON M5X 1A9, Canada',line1:'100 King St W',city:'Toronto',region:'ON',postalCode:'M5X 1A9',country:'CA'},
  {id:'preview-delhi-connaught',label:'12 Connaught Place, New Delhi, Delhi 110001, India',line1:'12 Connaught Place',city:'New Delhi',region:'Delhi',postalCode:'110001',country:'IN'},
];
export async function searchRecipientGiftAddresses(query,country='US'){
  const value=String(query||'').trim();if(value.length<3)return [];
  const local=previewAddresses.filter(item=>item.country===country&&item.label.toLowerCase().includes(value.toLowerCase()));
  return local.length?local:previewAddresses.filter(item=>item.country===country);
}
