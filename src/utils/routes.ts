import {
  BriefcaseBusiness,
  CalendarDays,
  Compass,
  Gift,
  Heart,
  MessageCircle,
  UserRound
} from "lucide-react";

export const primaryRoutes = [
  { href: "/matches", label: "Matches", icon: Heart },
  { href: "/search", label: "Discover", icon: Compass },
  { href: "/messages", label: "Chat", icon: MessageCircle },
  { href: "/dates", label: "Dates", icon: CalendarDays },
  { href: "/executive", label: "Executive", icon: BriefcaseBusiness },
  { href: "/profile", label: "Profile", icon: UserRound }
];

export const quickRoutes = [
  { href: "/gifts", label: "Gifts", icon: Gift }
];
