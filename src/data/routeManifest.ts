export const routeGroups=[
  {label:"Start & onboarding",routes:[["Home","/"],["Login","/login"],["Register","/register"],["Onboarding","/onboarding"],["Verification","/verification"]]},
  {label:"Matching",routes:[["Discover","/search"],["Discovery controls","/discovery"],["Matches","/matches"],["Match detail","/match/101"],["Mutual match","/mutual"],["Icebreaker","/icebreaker"]]},
  {label:"Communication & dates",routes:[["Chat","/messages"],["Date marketplace","/dates"],["Gift marketplace","/gifts"],["Recipient gift response","/gifts/respond"],["Coach","/coach"]]},
  {label:"Profile & relationship",routes:[["Profile","/profile"],["Profile settings","/profile/settings"],["Marriage Blueprint","/blueprint"],["Relationship Journey","/journey"],["Couple mode","/couple"],["Community","/community"],["Trusted Circle","/trusted-circle"]]},
  {label:"Membership & support",routes:[["Executive","/executive"],["Membership","/membership"],["Likes","/likes"],["Notifications","/notifications"],["Safety","/safety"],["Support","/support"],["Readiness","/readiness"],["Admin UI","/admin"],["About","/about"]]},
];
export const allRoutes=routeGroups.flatMap(group=>group.routes.map(([label,href])=>({label,href,group:group.label})));
