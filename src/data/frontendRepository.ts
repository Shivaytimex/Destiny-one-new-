const KEY="destinyone:frontend-only-state:v1";
const defaults={user:{id:1,firstName:"Aarav",email:"preview@destinyone.app",previewOnly:true},settings:{privacy:{profileVisibility:"verified_members",readReceipts:true,onlineStatus:true},notifications:{matches:true,messages:true,dates:true,gifts:true,marketing:false},discovery:{distance:50,ageMin:25,ageMax:38}}};
function read(){if(typeof window==="undefined")return defaults;try{return{...defaults,...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return defaults}}
function write(update){const next={...read(),...update};if(typeof window!=="undefined")localStorage.setItem(KEY,JSON.stringify(next));return next}

export const frontendRepository={
  session:{
    currentUser:async()=>read().user,
    startPreview:async({firstName,email})=>{const user={id:1,firstName:firstName||"Aarav",email:email||"preview@destinyone.app",previewOnly:true};write({user});return user},
  },
  profile:{
    saveOnboarding:async(profile)=>{write({profile});return profile},
    loadSettings:async()=>read().settings,
    saveSettings:async(settings)=>{write({settings});return settings},
  },
  matches:{list:async()=>[],saveDecision:async(matchId,kind)=>{write({lastMatchDecision:{matchId,kind}});return{matchId,kind,previewOnly:true}}},
  membership:{listPlans:async()=>[],selectPlan:async(planId)=>{write({selectedPlanId:planId});return{message:"Plan selected in frontend preview. No payment was created."}}},
  dates:{saveProposal:async(proposal)=>{write({lastDateProposal:proposal});return{...proposal,previewOnly:true}}},
  safety:{saveReport:async(report)=>{write({lastSafetyReport:{...report,storedLocally:true}});return{previewOnly:true}}},
  chat:{
    inbox:async()=>read().conversationPreferences||{},messages:async(_conversationId?:number)=>[],pinned:async(_conversationId?:number)=>read().pinnedMessages||[],preferences:async(_conversationId?:number)=>read().conversationPreferences||{},
    send:async(message)=>({...message,id:message.clientId||`local-${Date.now()}`,senderId:1,createdAt:Date.now(),status:"sent",previewOnly:true}),
    savePreferences:async(value)=>{write({conversationPreferences:value});return value},edit:async(message)=>message,remove:async(_message?:unknown)=>null,pin:async(_message?:unknown)=>({previewOnly:true}),forward:async(_message?:unknown)=>({previewOnly:true}),
  },
};
