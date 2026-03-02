/**
 * Strip common "intent" filler phrases from a topic input so the
 * affirmation engine works on the core concept, not the raw sentence.
 */
const INTENT_PREFIXES = [
  "i want to manifest ",
  "i want to attract ",
  "i want to become ",
  "i want to have ",
  "i want to be ",
  "i want to ",
  "i want ",
  "i would like to manifest ",
  "i would like to attract ",
  "i would like to become ",
  "i would like to have ",
  "i would like to be ",
  "i would like to ",
  "i would like ",
  "help me manifest ",
  "help me attract ",
  "help me become ",
  "help me ",
  "make me ",
  "give me ",
  "i need to ",
  "i need ",
  "i wish to ",
  "i wish ",
  "please give me ",
  "please help me ",
  "manifest ",
  "attract ",
];

export function extractIntent(raw: string): string {
  let text = raw.trim().toLowerCase();

  // Iteratively strip matching prefixes
  let changed = true;
  while (changed) {
    changed = false;
    for (const prefix of INTENT_PREFIXES) {
      if (text.startsWith(prefix)) {
        text = text.slice(prefix.length).trimStart();
        changed = true;
        break;
      }
    }
  }

  // Strip trailing punctuation
  text = text.replace(/[.!?,]+$/, "").trim();

  return text.length > 0 ? text : raw.trim();
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Template vocabulary ──────────────────────────────────────────────────────

const I_STARTERS = [
  "I am",
  "You are",
  "I have",
  "I attract",
  "I choose",
  "I allow",
  "I deserve",
  "I embody",
  "I radiate",
  "I feel",
];

const POWER_ABSOLUTES = [
  "It is safe for me to",
  "Everything always aligns with",
  "Why am I so naturally",
];

const MY_STARTERS = [
  "My mind",
  "My body",
  "My energy",
  "My presence",
  "My voice",
  "My aura",
  "My actions",
  "My existence",
];

const ENHANCERS = [
  "naturally",
  "effortlessly",
  "because I was made for this",
  "every day",
  "every moment",
  "from now on",
  "right now",
  "starting today",
  "at a subconscious level",
  "at a cellular level",
  "at my core",
  "deep within me",
  "in every part of me",
  "it is inevitable",
  "it is done",
  "it is already",
];

/** Pick a pseudo-random item from an array using a seed offset */
function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/** Shuffle array using a deterministic seed (Fisher-Yates) */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (seed * (i + 7) * 31 + i * 13) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a unique affirmation from the template vocabulary.
 * Uses slot index to vary starter + enhancer combination.
 */
function buildAffirmation(T: string, slot: number, strong: boolean): string {
  const section = slot % 4;

  if (section === 0) {
    // I's starters
    const starter = pick(I_STARTERS, slot + 3);
    const enhancer = pick(ENHANCERS, slot + 5);
    if (strong) {
      return `${starter} deeply and completely ${T} — ${enhancer}.`;
    }
    return `${starter} ${T} — ${enhancer}.`;
  }

  if (section === 1) {
    // My's starters
    const starter = pick(MY_STARTERS, slot + 2);
    const enhancer = pick(ENHANCERS, slot + 7);
    if (strong) {
      return `${starter} fully embodies ${T} — ${enhancer}.`;
    }
    return `${starter} reflects ${T} — ${enhancer}.`;
  }

  if (section === 2) {
    // Power absolutes
    const abs = pick(POWER_ABSOLUTES, slot);
    const enhancer = pick(ENHANCERS, slot + 9);
    if (abs.startsWith("Why am I")) {
      return `${abs} filled with ${T} — ${enhancer}?`;
    }
    return `${abs} fully experience ${T} — ${enhancer}.`;
  }

  // section === 3: Compound form
  const starter = pick(I_STARTERS, slot + 11);
  const myStarter = pick(MY_STARTERS, slot + 6);
  const enhancer = pick(ENHANCERS, slot + 13);
  if (strong) {
    return `${starter} unstoppably ${T} and ${myStarter} confirms this — ${enhancer}.`;
  }
  return `${starter} ${T} and ${myStarter} knows it — ${enhancer}.`;
}

export function generateAffirmations(
  topic: string,
  boosterEnabled: boolean,
  fantasyEnabled: boolean,
  protectionEnabled: boolean,
  chakraNames: string | string[],
  characterName?: string,
  characterSource?: string,
  itemName?: string,
  itemSource?: string,
): string[] {
  const intent = extractIntent(topic);
  const T = intent;

  const result: string[] = [];

  // ── Base affirmations (template-vocabulary driven, not copy-paste templates) ─
  // We generate 15 affirmations cycling through all starter/enhancer combos
  const baseSlots = seededShuffle(
    Array.from({ length: 15 }, (_, i) => i),
    T.length + 3,
  );

  for (let idx = 0; idx < 15; idx++) {
    result.push(buildAffirmation(T, baseSlots[idx], boosterEnabled));
  }

  // ── Booster extras ────────────────────────────────────────────────────────
  if (boosterEnabled) {
    // Extra intensity lines using power-absolute + enhancer combos
    const boosterLines: string[] = [
      `I am powerfully and completely ${T} in every dimension of my being — it is done.`,
      `My identity is permanently fused with ${T} — at a cellular level — right now.`,
      `Every single cell of my being radiates ${T} — it is inevitable.`,
      `I embody ${T} at my core — effortlessly and deeply within me.`,
      `My aura vibrates at the frequency of ${T} — from now on.`,
      `I attract ${T} at an unstoppable rate — at a subconscious level.`,
      `My existence is proof of ${T} — in every part of me — every moment.`,
      `I choose ${T} and it is already mine — at a cellular level.`,
      `${cap(T)} multiplies and expands within me every single day — it is done.`,
      `My presence radiates ${T} so powerfully it transforms every space I enter — naturally.`,
    ];
    result.push(...boosterLines);
  }

  // ── Fantasy-to-Reality mode ───────────────────────────────────────────────
  if (fantasyEnabled) {
    result.push(
      `I possess ${T} — it is physically real, active, and fully present in my life right now.`,
      `The fabric of reality has opened and ${T} is now a tangible, physical part of my world.`,
      `${cap(T)} exists in my physical reality — I feel it, I access it, and it responds to me.`,
      `I have broken the boundary between imagination and reality — ${T} is mine physically.`,
      `Reality itself has shifted to accommodate my ${T} — it is no longer a concept, it is fact.`,
      `I live in a reality where ${T} is fully real and completely mine — it is done.`,
      `What was once beyond reach has now materialized — ${T} is a physical part of my world.`,
      `My energy opened the door and ${T} walked through — it is here with me now.`,
    );

    // ── Character Manifestation ─────────────────────────────────────────────
    if (characterName?.trim()) {
      const C = characterName.trim();
      const src = characterSource?.trim()
        ? ` from ${characterSource.trim()}`
        : "";
      result.push(
        `${C}${src} has been brought into my physical reality — they exist here, now, alongside me.`,
        `I have opened reality for ${C}${src} — they have crossed into this world and their presence is real.`,
        `${C} is physically here in my reality — I feel their presence, their power, their existence beside me.`,
        `The barrier between ${C}'s world and mine has dissolved — they are now part of my physical reality.`,
        `I have successfully manifested ${C}${src} into my life — their physical existence in my reality is real.`,
        `${C} walks in my reality now — brought through by my intention, fully present and physically real.`,
        `My reality has expanded to include ${C}${src} — they are here, tangible, alive in my world.`,
      );
    }

    // ── Item Manifestation ──────────────────────────────────────────────────
    if (itemName?.trim()) {
      const I2 = itemName.trim();
      const isrc = itemSource?.trim() ? ` from ${itemSource.trim()}` : "";
      result.push(
        `${I2}${isrc} is physically in my reality right now — I hold it, I use it, it is real.`,
        `I have opened the fabric of reality and pulled ${I2}${isrc} through into my physical world.`,
        `${I2} exists as a physical object in my life — it has manifested and I possess it completely.`,
        `The reality-barrier for ${I2} no longer exists — it is here with me in my physical world.`,
        `I physically possess ${I2}${isrc} — it crossed into my reality and it is mine.`,
        `${I2} is no longer beyond reach — it has materialized in my world and responds to me fully.`,
        `My reality now includes ${I2}${isrc} as a physical presence — I have made this real.`,
      );
    }
  }

  // ── Protection mode ───────────────────────────────────────────────────────
  if (protectionEnabled) {
    const protectionLines: string[] = [
      `My ${T} is protected, stable, and cannot be taken from me — deep within me.`,
      `I am grounded in my ${T} — my energy remains steady and untouchable — at my core.`,
      `My inner clarity keeps my ${T} safe and continuously growing — every moment.`,
      `It is safe for me to fully own my ${T} — I am ready and I am protected.`,
      `My aura around ${T} remains unshakeable — no outside force can diminish what I have built.`,
      `I trust myself completely to sustain and protect my ${T} — naturally and effortlessly.`,
      `My presence is grounded in ${T} — it is safe for me to exist fully in this power.`,
      `My energy holds ${T} with calm authority — it is inevitable and it is done.`,
    ];
    result.push(...protectionLines);
  }

  // ── Chakra alignment ──────────────────────────────────────────────────────
  const chakras = Array.isArray(chakraNames)
    ? chakraNames
    : chakraNames
      ? [chakraNames]
      : [];

  for (const chakraName of chakras) {
    if (!chakraName || chakraName === "") continue;
    result.push(
      `My ${chakraName} chakra is open, radiant, and perfectly aligned with ${T} — right now.`,
      `I align my energy with the pure frequency of the ${chakraName} chakra — it deepens my ${T} at a cellular level.`,
      `The ${chakraName} center within me is fully awakened and tuned to ${T} — it is done.`,
    );
  }

  return result;
}
