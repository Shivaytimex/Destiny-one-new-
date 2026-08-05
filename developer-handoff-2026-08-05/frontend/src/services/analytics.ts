const KEY="destinyone:frontend-only-analytics-preview";
let enabled=false;
export function configureWebAnalytics(consent){enabled=Boolean(consent)}
export function trackWebAnalytics(eventName,properties={}){
  if(!enabled||typeof window==="undefined")return false;
  try{const events=JSON.parse(localStorage.getItem(KEY)||"[]");events.push({eventName,properties,occurredAt:new Date().toISOString(),previewOnly:true});localStorage.setItem(KEY,JSON.stringify(events.slice(-100)));return true}catch{return false}
}
export async function withdrawWebAnalytics(){enabled=false;if(typeof window!=="undefined")localStorage.removeItem(KEY)}
