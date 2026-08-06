import { truthOrDarePrompts } from "./coupleGamePrompts";

export type CoupleGame = {
  id: string;
  title: string;
  tag: string;
  description: string;
  howToPlay: string;
  prompts: readonly string[];
};

export const coupleGames: CoupleGame[] = [
  {
    id: "truth-dare",
    title: "Truth or Dare",
    tag: "100 ROMANTIC + FUN ROUNDS",
    description: "A safe mix of funny, romantic, thoughtful and future-focused rounds.",
    howToPlay: "Take turns. Answer honestly or complete the dare, then choose another round.",
    prompts: truthOrDarePrompts,
  },
  {
    id: "connection-cards",
    title: "Curiosity Cards",
    tag: "GET CLOSER",
    description: "Reciprocal questions that move from light to meaningful.",
    howToPlay: "Both people answer the same card before moving to the next one.",
    prompts: [
      "Which small everyday gesture makes you feel genuinely considered?",
      "What does a peaceful Sunday in your future look like?",
      "What is something you are learning to communicate more clearly?",
      "Which family tradition would you love to keep—or thoughtfully reinvent?",
      "What kind of support helps you most on a difficult day?",
      "What is one dream that feels more exciting when shared?",
    ],
  },
  {
    id: "decode-us",
    title: "Decode Us",
    tag: "PUZZLES",
    description: "Emoji clues, mini riddles and playful guesses.",
    howToPlay: "One person answers privately; the other gets one guess and one hint.",
    prompts: [
      "EMOJI CLUE · ☕🌧️📚 — invent the perfect date hidden in these emojis.",
      "RIDDLE · I can fill a room but take up no space. What am I?",
      "GUESS ME · Give three clues about your comfort food without naming it.",
      "EMOJI STORY · 🧳🌄🎵🍜 — where did our imaginary weekend go?",
      "TWO CLUES · Describe your dream city using only weather + one sound.",
      "MYSTERY · Pick an object near you; give one true clue and one tricky clue.",
    ],
  },
  {
    id: "coffee-roadtrip",
    title: "Coffee or Road Trip",
    tag: "QUICK PICKS",
    description: "Fast choices that reveal the reason behind the answer.",
    howToPlay: "Choose first, explain why second. No ‘both’ answers for this round.",
    prompts: [
      "Cozy coffee ☕ or spontaneous road trip 🚗 — and what makes it your pick?",
      "Sunrise walk 🌅 or late-night dessert 🍰?",
      "Plan every detail 🗓️ or leave one surprise ✨?",
      "Cook together 🍝 or find a hidden local restaurant 🥢?",
      "Mountain cabin 🏔️ or city weekend 🌆?",
      "Voice note 🎙️ or handwritten letter 💌?",
    ],
  },
  {
    id: "future-draft",
    title: "Future Draft",
    tag: "DATE TO MARRY",
    description: "Build a shared future one thoughtful pick at a time.",
    howToPlay: "Each person ranks the choices, then compares the biggest difference with curiosity.",
    prompts: [
      "Rank for the next five years: family, career, home, travel.",
      "Draft a Sunday: rest, friends, family time, one adventure.",
      "Choose three home feelings: calm, lively, private, welcoming, creative.",
      "Rank money priorities: security, experiences, giving, comfort.",
      "Pick two couple rituals: weekly date, daily walk, family dinner, monthly trip.",
      "Choose the first thing to protect in a busy season: honesty, quality time, health, patience.",
    ],
  },
  {
    id: "caption-battle",
    title: "Caption Battle",
    tag: "LAUGH TOGETHER",
    description: "Turn imaginary moments into funny one-line captions.",
    howToPlay: "Both send one caption. The next person chooses the winner and starts another round.",
    prompts: [
      "Caption this: we arrived at the restaurant wearing the exact same color.",
      "Caption this: our quick coffee somehow became a four-hour conversation.",
      "Caption this: the GPS said two minutes; we are now beside a goat farm.",
      "Caption this: both families joined the video call five minutes early.",
      "Caption this: we tried cooking together and the smoke alarm became the referee.",
      "Caption this: our first couple photo has one perfect smile and one closed eye.",
    ],
  },
];

