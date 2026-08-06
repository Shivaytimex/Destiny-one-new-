import { existsSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const project = fileURLToPath(new URL("../", import.meta.url));
const source = join(project, "src");

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = join(directory, entry.name);
    return entry.isDirectory() ? files(target) : [target];
  });
}

const required = [
  "package.json",
  "next.config.js",
  "tsconfig.json",
  "tailwind.config.ts",
  "postcss.config.js",
  "src/pages/index.tsx",
  "src/pages/login.tsx",
  "src/pages/register.tsx",
  "src/pages/search.tsx",
  "src/pages/profile.tsx",
  "src/pages/matches.tsx",
  "src/pages/messages.tsx",
  "src/pages/membership.tsx",
  "src/pages/about.tsx",
  "src/components/home/HeroSection.tsx",
  "src/components/home/SearchForm.tsx",
  "src/components/home/StatsSection.tsx",
  "src/components/home/SuccessStories.tsx",
  "src/components/home/PremiumPlans.tsx",
  "src/components/home/Testimonials.tsx",
  "src/components/chat/ChatMediaPicker.tsx",
  "src/components/chat/CoupleGamesPanel.tsx",
  "src/data/chatMediaCatalog.ts",
  "src/data/coupleGamePrompts.ts",
  "src/data/coupleGames.ts",
  "src/data/frontendRepository.ts",
  "src/data/routeManifest.ts",
  "contracts/REST-API-HANDOFF.md",
];

const missing = required.filter((path) => !existsSync(join(project, path)));
const forbidden = [
  "backend",
  "src/services/api.ts",
  "src/pages/index.actual.tsx",
  "public/actual-app",
  "public/push-sw.js",
  ".openai/hosting.json",
  "supabase",
].filter((path) => existsSync(join(project, path)));
const invalidSource = files(source)
  .filter((path) => [".js", ".jsx"].includes(extname(path)))
  .map((path) => relative(project, path));

if (missing.length || forbidden.length || invalidSource.length) {
  console.error(JSON.stringify({ status: "failed", missing, forbidden, invalidSource }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "ok",
  stack: "Next.js + TypeScript + Tailwind CSS",
  sourceFiles: files(source).length,
  requiredFilesChecked: required.length,
  legacyOrBackendEntries: 0,
}, null, 2));
