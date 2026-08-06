export async function registerBrowserPush(){
  if(typeof window==="undefined"||!("Notification" in window))throw new Error("Notification preview is not supported in this browser.");
  const permission=await Notification.requestPermission();
  if(permission!=="granted")throw new Error("Notification permission was not enabled.");
  localStorage.setItem("destinyone:notification-preview","enabled");
  return{provider:"browser-preview",permission,previewOnly:true};
}
