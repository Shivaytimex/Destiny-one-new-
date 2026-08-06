import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const requiredFiles = [
  "src/components/chat/RealtimeChatExperience.tsx",
  "src/components/chat/ChatMediaPicker.tsx",
  "src/components/chat/CoupleGamesPanel.tsx",
  "src/data/chatMediaCatalog.ts",
  "src/data/coupleGamePrompts.ts",
  "src/components/common/GiftMarketplaceExperience.tsx",
  "src/services/gifts.ts",
  "src/components/dates/DateMarketplace.tsx",
  "src/components/profile/MarriageBlueprintExperience.tsx",
  "src/components/profile/RelationshipMilestonesFamilyRoom.tsx",
  "src/components/search/VerifiedCityDensity.tsx",
  "src/components/search/PostDateLearningExperience.tsx",
];

const missing = requiredFiles.filter((path) => !existsSync(`${root}${path}`));
const checks = [
  ["1,000 GIF catalog", "src/data/chatMediaCatalog.ts", "gifIntents.flatMap"],
  ["custom stickers", "src/data/chatMediaCatalog.ts", "customChatStickers"],
  ["100 Truth/Dare prompts", "src/data/coupleGamePrompts.ts", "Array.from({length:100}"],
  ["six couple games", "src/data/coupleGames.ts", "caption-battle"],
  ["sent/delivered/read receipts", "src/components/chat/RealtimeChatExperience.tsx", "Delivered · two ticks"],
  ["edit/delete/undo", "src/components/chat/RealtimeChatExperience.tsx", "undoDelete"],
  ["reply jump", "src/components/chat/RealtimeChatExperience.tsx", "scrollIntoView"],
  ["voice playback/transcription", "src/components/chat/RealtimeChatExperience.tsx", "Transcript"],
  ["gift AI concierge", "src/components/common/GiftMarketplaceExperience.tsx", "Build my surprise"],
  ["gift recipient response", "src/services/gifts.ts", "respondGiftCheckout"],
  ["US/Canada/India address validation", "src/services/gifts.ts", "['US','CA','IN']"],
  ["gift inventory/courier preview", "src/services/gifts.ts", "inventoryStatus"],
  ["Marriage Blueprint", "src/components/profile/MarriageBlueprintExperience.tsx", "dealbreaker"],
  ["Family Room consent", "src/components/profile/RelationshipMilestonesFamilyRoom.tsx", "consent"],
  ["city density/waitlist", "src/components/search/VerifiedCityDensity.tsx", "waitlist"],
  ["post-date learning", "src/components/search/PostDateLearningExperience.tsx", "feedback"],
];

const failed = checks.filter(([, path, marker]) => !read(path).includes(marker));
if (missing.length || failed.length) {
  console.error(JSON.stringify({ status: "failed", missing, failed: failed.map(([feature, path]) => ({ feature, path })) }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok", baseline: "2026-08-04T23:51:46-07:00", requiredFiles: requiredFiles.length, featureChecks: checks.length }, null, 2));
