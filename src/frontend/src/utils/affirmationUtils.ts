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

export type BoosterLevel =
  | "minimal"
  | "standard"
  | "custom"
  | "extremely_powerful"
  | "evolving";

/**
 * Build a unique affirmation from the template vocabulary.
 * Uses slot index to vary starter + enhancer combination.
 * strength: 0=minimal, 1=standard, 2=extremely_powerful
 */
function buildAffirmation(
  T: string,
  slot: number,
  strength: 0 | 1 | 2,
  customPhrase?: string,
): string {
  const section = slot % 4;

  if (section === 0) {
    // I's starters
    const starter = pick(I_STARTERS, slot + 3);
    const enhancer = pick(ENHANCERS, slot + 5);
    if (strength === 2) {
      return `${starter} UNSTOPPABLY ${T} — ${enhancer}.`;
    }
    if (strength === 0) {
      return `${starter} gently opening to ${T} — ${enhancer}.`;
    }
    if (customPhrase) {
      return `${customPhrase}, ${starter.toLowerCase()} ${T} — ${enhancer}.`;
    }
    return `${starter} ${T} — ${enhancer}.`;
  }

  if (section === 1) {
    // My's starters
    const starter = pick(MY_STARTERS, slot + 2);
    const enhancer = pick(ENHANCERS, slot + 7);
    if (strength === 2) {
      return `${starter} IS ${T} — without question — ${enhancer}.`;
    }
    if (strength === 0) {
      return `${starter} is beginning to reflect ${T} — ${enhancer}.`;
    }
    if (customPhrase) {
      return `${customPhrase} — ${starter.toLowerCase()} fully embodies ${T} — ${enhancer}.`;
    }
    return `${starter} reflects ${T} — ${enhancer}.`;
  }

  if (section === 2) {
    // Power absolutes
    const abs = pick(POWER_ABSOLUTES, slot);
    const enhancer = pick(ENHANCERS, slot + 9);
    if (strength === 2) {
      if (abs.startsWith("Why am I")) {
        return `Reality bends to my ${T} — ${enhancer}.`;
      }
      return `My entire being IS ${T} — ${enhancer}.`;
    }
    if (strength === 0) {
      if (abs.startsWith("Why am I")) {
        return `${abs} beginning to experience ${T} — ${enhancer}?`;
      }
      return `It is safe for me to allow ${T} — ${enhancer}.`;
    }
    if (abs.startsWith("Why am I")) {
      return `${abs} filled with ${T} — ${enhancer}?`;
    }
    return `${abs} fully experience ${T} — ${enhancer}.`;
  }

  // section === 3: Compound form
  const starter = pick(I_STARTERS, slot + 11);
  const myStarter = pick(MY_STARTERS, slot + 6);
  const enhancer = pick(ENHANCERS, slot + 13);
  if (strength === 2) {
    return `${starter} UNSTOPPABLY ${T} and ${myStarter} confirms this — it is absolute and done.`;
  }
  if (strength === 0) {
    return `I am opening to ${T} and ${myStarter} is ready — ${enhancer}.`;
  }
  if (customPhrase) {
    return `${customPhrase} — ${starter.toLowerCase()} ${T} and ${myStarter} knows it — ${enhancer}.`;
  }
  return `${starter} ${T} and ${myStarter} knows it — ${enhancer}.`;
}

export interface AdvancedFunctions {
  // Deity / Entity Invocation
  deityEnabled?: boolean;
  deityName?: string;
  deityPantheon?: string;

  // Spell Weaving
  spellEnabled?: boolean;
  spellArchetype?: string; // e.g. "Attraction", "Transmutation", "Amplification", "Binding", "Banishing", "Illumination", "Abundance", "Protection Ward"
  spellCustom?: string;

  // Soul Contract
  soulContractEnabled?: boolean;
  soulContractEntity?: string; // "Universe", "Higher Self", or a named entity

  // Shadow Work Integration
  shadowWorkEnabled?: boolean;
  shadowWorkBlock?: string; // optional: specific block/resistance to address

  // Reality Scripting
  realityScriptEnabled?: boolean;
  realityScriptTimeAgo?: string; // e.g. "months ago", "years ago"

  // Frequency Attunement
  frequencyAttunementEnabled?: boolean;
  frequencyAttunementHz?: string; // e.g. "528"

  // Sigil Activation
  sigilActivationEnabled?: boolean;
  sigilName?: string;
}

const FREQUENCY_MEANINGS: Record<string, string> = {
  "40": "deep focus and gamma synchronization",
  "174": "foundation healing and pain relief",
  "285": "cellular tissue healing and regeneration",
  "396": "liberation from guilt and fear",
  "417": "transformation and breaking free from old patterns",
  "432": "natural earth resonance and heart harmony",
  "528": "DNA repair and miraculous transformation",
  "639": "connection, love, and harmonious relationships",
  "741": "spiritual awakening and expanded consciousness",
  "852": "deep intuition and third eye activation",
  "963": "crown chakra activation and divine connection",
  "1111": "angelic alignment and manifestation gateway",
};

export interface PersonalTarget {
  id: string;
  name: string;
  relationship: string;
}

/** Build affirmations FOR a specific person using third-person or "for [Name]" framing */
function buildAffirmationForPerson(
  T: string,
  name: string,
  relationship: string,
  slot: number,
): string {
  const rel = relationship.trim() || "this person";
  const relLabel = relationship.trim() ? `my ${relationship.trim()} ` : "";
  const enhancer = pick(ENHANCERS, slot + 4);

  const patterns = [
    `${name} is ${T} — ${enhancer}.`,
    `${name} has everything they need to embody ${T} — ${enhancer}.`,
    `${name} attracts ${T} — every moment, without effort.`,
    `${relLabel}${name} radiates ${T} — deep within them, it is done.`,
    `My ${rel} ${name} embodies ${T} — at a cellular level — right now.`,
    `${name} is becoming more ${T} every single day — it is inevitable.`,
    `${name}'s reality is filled with ${T} — starting today.`,
    `I send ${name} the energy of ${T} — they receive it fully — it is done.`,
    `${relLabel}${name} is blessed with ${T} — effortlessly and completely.`,
    `${name} deserves ${T} and it is manifesting for them now — at every level.`,
    `The subliminal I create for ${name} activates ${T} in their life — it is real and working.`,
    `${name}'s subconscious is now programmed with ${T} — at a cellular level.`,
  ];

  return patterns[slot % patterns.length];
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
  symbioticName?: string,
  symbioticSource?: string,
  symbioticBondType?: string,
  boosterLevel: BoosterLevel = "standard",
  boosterCustomPhrase?: string,
  characterLocation?: string,
  characterTimeFrame?: string,
  itemLocation?: string,
  itemTimeFrame?: string,
  symbioticLocation?: string,
  symbioticTimeFrame?: string,
  advanced: AdvancedFunctions = {},
  personalTargets?: PersonalTarget[],
  stackedTopics?: string[],
): string[] {
  const intent = extractIntent(topic);
  const T = intent;

  const result: string[] = [];

  // ── Determine base strength from booster level ──────────────────────────
  // For non-booster or minimal: no strong phrasing in base lines
  const getStrength = (slot: number): 0 | 1 | 2 => {
    if (!boosterEnabled) return 1; // standard when booster is off
    switch (boosterLevel) {
      case "minimal":
        return 0;
      case "standard":
        return 1;
      case "custom":
        return 1; // custom phrase is prepended, not strength change
      case "extremely_powerful":
        return 2;
      case "evolving": {
        // first 1/3 = minimal, middle 1/3 = standard, last 1/3 = max
        const third = Math.floor(15 / 3);
        if (slot < third) return 0;
        if (slot < third * 2) return 1;
        return 2;
      }
    }
  };

  // ── Base affirmations (template-vocabulary driven, not copy-paste templates) ─
  const baseSlots = seededShuffle(
    Array.from({ length: 15 }, (_, i) => i),
    T.length + 3,
  );

  for (let idx = 0; idx < 15; idx++) {
    const strength = getStrength(idx);
    const customPhrase =
      boosterEnabled && boosterLevel === "custom" && boosterCustomPhrase?.trim()
        ? boosterCustomPhrase.trim()
        : undefined;
    result.push(buildAffirmation(T, baseSlots[idx], strength, customPhrase));
  }

  // ── Booster extras ────────────────────────────────────────────────────────
  if (boosterEnabled) {
    if (boosterLevel === "minimal") {
      // Gentle lines only — skip heavy extras
    } else if (boosterLevel === "extremely_powerful") {
      // Double set with maximum intensity
      const boosterLines: string[] = [
        `I am UNSTOPPABLY and completely ${T} in every dimension of my being — it is absolute and done.`,
        `My identity IS ${T} — permanently, at a cellular level, without question.`,
        `Every single cell of my being RADIATES ${T} — Reality bends to this.`,
        `My entire being IS ${T} at my core — effortlessly and completely.`,
        `My aura vibrates at the MAXIMUM frequency of ${T} — from now on — it is inevitable.`,
        `I attract ${T} at an UNSTOPPABLE rate — at a subconscious level — right now.`,
        `My existence IS ${T} — in every part of me — without question.`,
        `I choose ${T} and Reality itself has already confirmed it — it is done.`,
        `${cap(T)} MULTIPLIES and EXPANDS within me every moment — at a cellular level — it is absolute.`,
        `My presence RADIATES ${T} so powerfully that Reality itself reshapes around me — it is done.`,
        `Without question I am ${T} — this is unbreakable law — starting today.`,
        `Reality bends to my ${T} — it is inevitable and it is already.`,
        `My entire being IS the embodiment of ${T} — deep within me — at my core.`,
        `${cap(T)} is permanent, absolute, and fully mine — it is already.`,
        `I am an unstoppable force of ${T} — every moment — it is done.`,
        `Without question — ${T} IS my reality — at every level — it is absolute.`,
        `My ${T} multiplies exponentially — every day — it is inevitable.`,
        `It is absolute and done — I am ${T} — in every dimension.`,
        `${cap(T)} is my permanent identity — at a subconscious level — right now.`,
        `Reality has confirmed my ${T} — without question — it is done.`,
      ];
      result.push(...boosterLines);
    } else if (boosterLevel === "standard") {
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
    } else if (boosterLevel === "custom" && boosterCustomPhrase?.trim()) {
      const phrase = boosterCustomPhrase.trim();
      const boosterLines: string[] = [
        `${phrase} — I am ${T} in every dimension of my being — it is done.`,
        `${phrase} — my identity is permanently fused with ${T} — right now.`,
        `${phrase} — every cell of my being radiates ${T} — it is inevitable.`,
        `${phrase} — I embody ${T} at my core — effortlessly.`,
        `${phrase} — my aura vibrates at the frequency of ${T} — from now on.`,
        `${phrase} — I attract ${T} — at a subconscious level.`,
        `${phrase} — my existence is proof of ${T} — every moment.`,
        `${phrase} — ${T} multiplies and expands within me daily — it is done.`,
      ];
      result.push(...boosterLines);
    } else if (boosterLevel === "evolving") {
      // Escalating set: soft → standard → powerful
      result.push(
        `I am beginning to open to ${T} — every day, this grows stronger.`,
        `Something inside me is shifting toward ${T} — effortlessly.`,
        `I am powerfully and completely ${T} in every dimension — it is done.`,
        `My identity is fused with ${T} — at a cellular level — right now.`,
        `I am UNSTOPPABLY ${T} — Reality bends to this — it is absolute.`,
        `My entire being IS ${T} — without question — it is done.`,
        `${cap(T)} is PERMANENT, ABSOLUTE, and fully mine — it is already.`,
      );
    }
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
      const loc = characterLocation?.trim();
      const tf = characterTimeFrame?.trim();

      const locPhrase = loc ? ` in ${loc}` : "";
      const tfPhrase = tf ? ` ${tf.toLowerCase()}` : "";
      const locTfInline =
        loc && tf ? ` in ${loc}${tfPhrase}` : loc ? locPhrase : tfPhrase;

      result.push(
        `${C}${src} has been brought into my physical reality${locTfInline} — they exist here, now, alongside me.`,
        `I have opened reality for ${C}${src} — they have crossed into this world${loc ? ` and are present ${loc}` : ""} and their presence is real.`,
        `${C} is physically here${locTfInline} — I feel their presence, their power, their existence beside me.`,
        `The barrier between ${C}'s world and mine has dissolved${tf ? ` — ${tf}, ${C} stands in my reality` : ""}.`,
        `I have successfully manifested ${C}${src} into my life${loc ? ` at ${loc}` : ""}${tf ? ` — by ${tf.toLowerCase()}` : ""} — their physical existence in my reality is real.`,
        `${C} walks in my reality now${locTfInline} — brought through by my intention, fully present and physically real.`,
        `My reality has expanded to include ${C}${src}${loc ? ` — they are here at ${loc}` : ""} — tangible, alive in my world.`,
      );

      if (loc || tf) {
        if (loc && tf) {
          result.push(
            `By ${tf.toLowerCase()}, ${C} is physically present ${loc} — this is done and real.`,
            `${tf} — ${C} steps into ${loc} and their arrival is unmistakably physical and real.`,
          );
        } else if (loc) {
          result.push(
            `${C} is now located at ${loc} in my physical reality — real, present, and undeniable.`,
          );
        } else if (tf) {
          result.push(
            `${tf} — ${C} has arrived in my physical reality — this manifestation is complete.`,
          );
        }
      }
    }

    // ── Item Manifestation ──────────────────────────────────────────────────
    if (itemName?.trim()) {
      const I2 = itemName.trim();
      const isrc = itemSource?.trim() ? ` from ${itemSource.trim()}` : "";
      const loc = itemLocation?.trim();
      const tf = itemTimeFrame?.trim();

      const locPhrase = loc ? ` at ${loc}` : "";
      const tfPhrase = tf ? ` by ${tf.toLowerCase()}` : "";
      const locTfInline =
        loc && tf
          ? ` at ${loc} — by ${tf.toLowerCase()}`
          : loc
            ? locPhrase
            : tfPhrase;

      result.push(
        `${I2}${isrc} is physically in my reality${locTfInline ? ` ${locTfInline}` : " right now"} — I hold it, I use it, it is real.`,
        `I have opened the fabric of reality and pulled ${I2}${isrc} through into my physical world${loc ? ` — it sits at ${loc}` : ""}.`,
        `${I2} exists as a physical object in my life${loc ? ` at ${loc}` : ""}${tf ? ` — by ${tf.toLowerCase()}` : ""} — it has manifested and I possess it completely.`,
        `The reality-barrier for ${I2} no longer exists${tf ? ` — by ${tf.toLowerCase()} it is fully here` : ""} — it is here with me in my physical world.`,
        `I physically possess ${I2}${isrc}${locTfInline ? ` — ${locTfInline}` : ""} — it crossed into my reality and it is mine.`,
        `${I2} is no longer beyond reach — it has materialized${loc ? ` at ${loc}` : ""}${tf ? ` — by ${tf.toLowerCase()}` : ""} in my world and responds to me fully.`,
        `My reality now includes ${I2}${isrc} as a physical presence${loc ? ` at ${loc}` : ""} — I have made this real.`,
      );

      if (loc || tf) {
        if (loc && tf) {
          result.push(
            `By ${tf.toLowerCase()}, ${I2} is physically present at ${loc} — real and in my possession.`,
          );
        } else if (loc) {
          result.push(
            `${I2} has materialized at ${loc} in my physical reality — real and undeniable.`,
          );
        } else if (tf) {
          result.push(
            `${tf} — ${I2} has crossed into my physical world — this manifestation is complete.`,
          );
        }
      }
    }

    // ── Symbiotic / Bio-Engineered Manifestation ────────────────────────────
    if (symbioticName?.trim()) {
      const S = symbioticName.trim();
      const ssrc = symbioticSource?.trim()
        ? ` from ${symbioticSource.trim()}`
        : "";
      const bond = symbioticBondType?.trim() || "symbiotic bond";
      const loc = symbioticLocation?.trim();
      const tf = symbioticTimeFrame?.trim();

      const locPhrase = loc ? ` in ${loc}` : "";
      const tfPhrase = tf ? ` by ${tf.toLowerCase()}` : "";
      const locTfInline =
        loc && tf
          ? ` in ${loc} — by ${tf.toLowerCase()}`
          : loc
            ? locPhrase
            : tfPhrase;

      result.push(
        `${S}${ssrc} has crossed into my physical reality${locTfInline} and chosen me — our ${bond} is real, alive, and unbreakable.`,
        `I feel ${S} merging with my reality${loc ? ` at ${loc}` : ""} right now — they are both a living being and a physical extension of who I am.`,
        `The ${bond} between me and ${S} is fully formed${tf ? ` — by ${tf.toLowerCase()}` : ""} — we are one entity, complete and inseparable.`,
        `${S} is not a concept or a fiction — they exist${locTfInline ? ` ${locTfInline}` : " in my world physically"}, bonded to me, alive within my reality.`,
        `My energy called ${S}${ssrc} into existence${loc ? ` at ${loc}` : ""} — they arrived${tf ? ` by ${tf.toLowerCase()}` : ""} and our ${bond} sealed the moment they did.`,
        `${S} and I share the same reality now — their consciousness, their nature, and their power are woven into mine.`,
        `The boundary that kept ${S} apart from my world has dissolved${tf ? ` — ${tf.toLowerCase()}, this bond is complete` : ""} — they are here, physical, bonded, and real.`,
        `I am the host and the partner — ${S} chose this ${bond} and my reality expanded to make it possible.`,
        `${S}'s dual nature as both living being and physical extension of myself is fully real — we function as one.`,
        `My existence now includes ${S}${ssrc}${loc ? ` at ${loc}` : ""} — the ${bond} is complete, physical, and permanent in my reality.`,
        `${S} responds to my thoughts, my energy, my presence — our ${bond} makes us a unified force in this reality.`,
        `Everything that ${S} is — living, powerful, real — is now part of my physical world and my identity.`,
      );

      if (loc || tf) {
        if (loc && tf) {
          result.push(
            `By ${tf.toLowerCase()}, ${S} and I are bonded at ${loc} — the ${bond} is sealed, physical, and real.`,
          );
        } else if (loc) {
          result.push(
            `${S} is present at ${loc} in my reality — the ${bond} is physical and undeniable.`,
          );
        } else if (tf) {
          result.push(
            `${tf} — ${S} has completed their arrival in my reality and our ${bond} is sealed.`,
          );
        }
      }
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

  // ── Advanced Functions ────────────────────────────────────────────────────

  // 1. Deity / Entity Invocation
  if (advanced.deityEnabled && advanced.deityName?.trim()) {
    const D = advanced.deityName.trim();
    const pan = advanced.deityPantheon?.trim()
      ? ` of ${advanced.deityPantheon.trim()}`
      : "";
    result.push(
      `I invoke ${D}${pan} — their power flows through my ${T} now, amplifying it at every level.`,
      `${D} stands beside me as I embody ${T} — their divine presence seals this into reality.`,
      `I am blessed and empowered by ${D}${pan} in my pursuit of ${T} — this is real and it is done.`,
      `The energy of ${D} merges with mine — together we anchor ${T} into my physical reality permanently.`,
      `${D}'s blessing is woven into every affirmation — my ${T} is divinely charged and unstoppable.`,
      `I am aligned with ${D} and they co-create my reality of ${T} alongside me — it is inevitable.`,
      `${D} has heard my call — their power activates my ${T} at a subconscious and cellular level.`,
      `I draw on the ancient power of ${D}${pan} — it accelerates my ${T} beyond all limitation.`,
    );
  }

  // 2. Spell Weaving
  if (advanced.spellEnabled) {
    const archetype = (
      advanced.spellCustom?.trim() ||
      advanced.spellArchetype?.trim() ||
      "Attraction"
    ).toLowerCase();
    const spellMap: Record<string, string[]> = {
      attraction: [
        `I cast a living attraction spell on my ${T} — it draws toward me with magnetic force, right now.`,
        `Every cell of my being radiates an attraction field for ${T} — it has no choice but to arrive.`,
        `The spell is cast — ${T} is magnetized to me at every level, in every moment.`,
        `I am the magnet and ${T} is the iron — the attraction is law, it is done.`,
        `My attraction spell for ${T} grows stronger every single day — effortlessly.`,
      ],
      transmutation: [
        `I transmute every obstacle into fuel for my ${T} — the alchemy is done and it is real.`,
        `My ${T} is transmuted at a cellular level — the old pattern is dissolved and the new is sealed.`,
        `The transmutation spell is active — everything that was not ${T} has been transformed into it.`,
        `I am the alchemist of my reality — I have transmuted my being into pure ${T}.`,
        `Every shadow around ${T} is now fuel — transmuted, refined, and returned to me as power.`,
      ],
      amplification: [
        `I amplify my ${T} with every breath — it multiplies exponentially in every direction.`,
        `The amplification spell is cast — my ${T} is magnified beyond all previous limits, right now.`,
        `My ${T} is amplified at a subconscious level and the effect compounds every moment.`,
        `Every thought I have about ${T} amplifies it further — the spell grows with my attention.`,
        `I am running an active amplification spell on ${T} — the results are inevitable and accelerating.`,
      ],
      binding: [
        `I bind ${T} permanently into my reality — it is sealed, anchored, and cannot leave.`,
        `The binding is complete — ${T} is woven into the fabric of my existence at a cellular level.`,
        `${cap(T)} is bound to me eternally — this agreement is sealed and cannot be undone.`,
        `I have cast a binding on my ${T} and my higher self has confirmed — it is done.`,
        `The binding spell is active — ${T} and I are permanently linked, inseparable, and real.`,
      ],
      banishing: [
        `I banish every block, doubt, and resistance to my ${T} — they are gone, now, permanently.`,
        `The banishing is complete — everything opposing my ${T} has been cleared at a root level.`,
        `I cast a banishing on all limitations around ${T} — they dissolve and do not return.`,
        `Every obstacle to my ${T} is banished — the path is clear, the way is open, it is done.`,
        `My banishing spell has removed every energetic barrier to ${T} — the field is clear.`,
      ],
      illumination: [
        `The illumination spell brings full clarity to my ${T} — I see the path and I walk it now.`,
        `I illuminate every hidden truth about my ${T} — understanding flows through me at a cellular level.`,
        `My ${T} is bathed in pure illumination — all confusion is dissolved and clarity is permanent.`,
        `I cast illumination on ${T} and the truth is revealed — I know exactly who I am becoming.`,
        `Light pours into my ${T} — every shadow is revealed and transformed into wisdom, right now.`,
      ],
      abundance: [
        `I cast an abundance spell on my ${T} — it multiplies and overflows in every direction.`,
        `The abundance spell is active — my ${T} is unlimited, expanding, and arriving continuously.`,
        `I live in an abundance of ${T} — it flows to me naturally, effortlessly, every single day.`,
        `The abundance spell seeds my reality — ${T} grows without effort and compounds without limit.`,
        `My ${T} is abundant beyond measure — the spell is cast and the harvest is already here.`,
      ],
      "protection ward": [
        `I place a protection ward around my ${T} — nothing can diminish or take it from me.`,
        `The protection ward is active — my ${T} is shielded, sealed, and immune to all interference.`,
        `I have warded my ${T} with the strongest protection — it is safe, stable, and permanent.`,
        `No force can unravel my ${T} — the ward is set, the energy is locked, it is done.`,
        `My protection ward guards my ${T} at every level — spiritually, energetically, and physically.`,
      ],
    };
    const spellLines = spellMap[archetype] ?? spellMap.attraction;
    // Also add lines for any custom spell type not in the map
    if (!spellMap[archetype]) {
      result.push(
        `I cast a ${archetype} spell on my ${T} — it is active, charged, and working now.`,
        `The ${archetype} spell is woven through my ${T} — every affirmation carries this intent.`,
        `I direct ${archetype} energy toward my ${T} and it responds — the spell is done.`,
        `My ${archetype} magic amplifies my ${T} — the energy is real and the result is inevitable.`,
      );
    } else {
      result.push(...spellLines);
    }
  }

  // 3. Soul Contract
  if (advanced.soulContractEnabled) {
    const entity = advanced.soulContractEntity?.trim() || "the Universe";
    result.push(
      `I have a soul contract with ${entity} for my ${T} — this agreement is ancient, sealed, and unbreakable.`,
      `My soul agreed to ${T} before this lifetime — the contract is in effect and reality honors it now.`,
      `${entity} and I have sealed a sacred agreement — my ${T} is written into the fabric of my soul.`,
      `This soul contract is active — ${T} is mine by divine agreement and nothing can override it.`,
      `I invoke my soul contract with ${entity} — ${T} is delivered to me in full, on time, as agreed.`,
      `The sacred agreement between me and ${entity} for ${T} is already fulfilled — I claim it now.`,
      `My higher self signed this contract — ${T} is guaranteed and the universe is delivering.`,
      `The soul contract is done — ${T} is part of my eternal blueprint and it is already real.`,
    );
  }

  // 4. Shadow Work Integration
  if (advanced.shadowWorkEnabled) {
    const block = advanced.shadowWorkBlock?.trim() || `blocks around ${T}`;
    result.push(
      `I lovingly release the shadow that has been keeping me from ${T} — it is dissolved now.`,
      `Every fear, every doubt, every wound around ${T} is seen, held, and released — I am free.`,
      `I integrate my ${block} — I welcome the shadow, transform it, and reclaim my power.`,
      `The part of me that feared ${T} is now my greatest ally — I have done the work, it is done.`,
      `I release the old story that said I couldn't have ${T} — that narrative is over, at a root level.`,
      `I have met my shadow around ${T} and I have chosen myself — from now on, I choose ${T}.`,
      `Every ${block} is dissolved at a cellular level — I step forward into ${T} whole and unafraid.`,
      `The shadow integration is complete — what blocked ${T} now fuels it — it is inevitable.`,
      `I choose ${T} not in spite of my shadows, but because I have faced them — I am ready.`,
    );
  }

  // 5. Reality Scripting
  if (advanced.realityScriptEnabled) {
    const ago = advanced.realityScriptTimeAgo?.trim() || "months ago";
    result.push(
      `My life already changed ${ago} — ${T} has been my reality for a long time now.`,
      `I remember when ${T} wasn't yet mine — that feels so distant now, because ${T} is simply my life.`,
      `I look back on who I was before ${T} with gratitude — the transformation happened and it is permanent.`,
      `${ago}, something shifted — ${T} arrived and has never left. It is the baseline of my existence.`,
      `My life is written in the new script — ${T} is the chapter I'm living now, fully and completely.`,
      `The version of me living with ${T} is the only real version — everything else was temporary.`,
      `I already live in the reality where ${T} is mine — I wake up in it every single day.`,
      `The script is already written — I am living the story where ${T} has always been mine.`,
    );
  }

  // 6. Frequency Attunement
  if (
    advanced.frequencyAttunementEnabled &&
    advanced.frequencyAttunementHz?.trim()
  ) {
    const hz = advanced.frequencyAttunementHz.trim();
    const meaning =
      FREQUENCY_MEANINGS[hz] ?? "elevated resonance and alignment";
    result.push(
      `I am attuned to ${hz}Hz — the frequency of ${meaning} — it programs my ${T} at a cellular level.`,
      `${hz}Hz runs through every cell of my being — my ${T} is permanently encoded at this frequency.`,
      `I resonate at ${hz}Hz — the exact frequency that activates my ${T} at a subconscious level.`,
      `My ${T} is vibrating at ${hz}Hz — aligned with ${meaning} — right now and from now on.`,
      `The ${hz}Hz frequency is active in my body and mind — it accelerates and deepens my ${T}.`,
      `Every affirmation I receive is delivered on the ${hz}Hz carrier wave — it is absorbed completely.`,
    );
  }

  // 7. Sigil Activation
  if (advanced.sigilActivationEnabled && advanced.sigilName?.trim()) {
    const SIG = advanced.sigilName.trim();
    result.push(
      `The sigil of ${SIG} is active and charged — it is working on my ${T} right now at every level.`,
      `I have activated the ${SIG} sigil and directed its energy toward my ${T} — the intention is sealed.`,
      `The ${SIG} sigil is alive in my field — it anchors my ${T} into reality, effortlessly and completely.`,
      `Every time I see or think of the ${SIG} sigil, my ${T} is reinforced — it is done.`,
      `The ${SIG} sigil has been charged with my full intention for ${T} — it works continuously on my behalf.`,
      `I activate the ${SIG} sigil — it bridges the energetic and physical, bringing my ${T} into form.`,
      `The ${SIG} sigil is a permanent anchor for my ${T} — sealed, active, and delivering results now.`,
    );
  }

  // ── Personal Subliminal ───────────────────────────────────────────────────
  const validTargets = personalTargets?.filter((p) => p.name.trim()) ?? [];
  if (validTargets.length > 0) {
    for (const target of validTargets) {
      const name = target.name.trim();
      const rel = target.relationship.trim();
      // 5-6 affirmations per person
      for (let i = 0; i < 6; i++) {
        result.push(buildAffirmationForPerson(T, name, rel, i));
      }
      // Also weave active modes for the person
      if (boosterEnabled && boosterLevel === "extremely_powerful") {
        result.push(
          `${name} UNSTOPPABLY embodies ${T} — their entire being IS this — it is absolute and done.`,
          `Reality bends to ${name}'s ${T} — without question — deep within them — it is inevitable.`,
        );
      }
      if (fantasyEnabled) {
        result.push(
          `${name} possesses ${T} — it is physically real and active in their life right now.`,
          `The fabric of reality has opened for ${name} — ${T} is now a tangible part of their world.`,
        );
      }
      if (protectionEnabled) {
        result.push(
          `${name}'s ${T} is protected, stable, and growing stronger — every moment — it is done.`,
          `My ${rel || "person"} ${name} is grounded and shielded in their ${T} — naturally and effortlessly.`,
        );
      }
    }
  }

  // ── Multi-Subliminal Stack ────────────────────────────────────────────────
  if (stackedTopics && stackedTopics.length > 0) {
    const perTopic = Math.max(5, Math.floor(15 / (stackedTopics.length + 1)));
    for (const stackTopic of stackedTopics) {
      const ST = extractIntent(stackTopic);
      const stackSlots = seededShuffle(
        Array.from({ length: perTopic }, (_, i) => i),
        ST.length + 7,
      );
      for (let idx = 0; idx < perTopic; idx++) {
        const strength = boosterEnabled
          ? boosterLevel === "extremely_powerful"
            ? 2
            : boosterLevel === "minimal"
              ? 0
              : 1
          : 1;
        result.push(buildAffirmation(ST, stackSlots[idx], strength));
      }
    }
  }

  return result;
}

// ─── Mature theme vocabulary ──────────────────────────────────────────────────

const MATURE_STARTERS = [
  "I command",
  "I own",
  "I exude",
  "I project",
  "I dominate",
  "I radiate",
  "I embody",
  "I claim",
  "I unleash",
  "I seduce reality with",
];

const MATURE_ENHANCERS = [
  "with undeniable power",
  "in every room I enter",
  "without apology",
  "and the world responds",
  "in a way that cannot be ignored",
  "at the deepest cellular level",
  "completely and without limit",
  "and nothing can diminish this",
  "from a place of total mastery",
  "because I was born for this",
];

const MATURE_KEYWORDS = [
  "charisma",
  "magnetic",
  "dating",
  "irresistible",
  "allure",
  "sensual",
  "seductive",
  "sexuality",
  "dominance",
  "alpha",
  "feminine energy",
  "masculine energy",
  "divine feminine",
  "divine masculine",
  "body confidence",
  "physical attraction",
  "shadow alchemy",
  "dark archetype",
  "void work",
  "taboo",
  "underworld",
  "trickster",
  "liminal",
  "death and rebirth",
  "empire",
  "financial dominance",
  "millionaire",
  "executive",
  "ambition",
  "power and influence",
  "generational wealth",
  "magnetic allure",
  "sacred sexuality",
  "inner beauty",
  "physical magnetism",
];

export function detectMatureTheme(topic: string): boolean {
  const lower = topic.toLowerCase();
  return MATURE_KEYWORDS.some((k) => lower.includes(k));
}

/**
 * Generate mature-theme boosted affirmations for a topic that matches mature keywords.
 * These are appended to the main affirmation set when a mature theme is detected.
 */
export function generateMatureAffirmations(
  topic: string,
  boosterEnabled: boolean,
  boosterLevel: BoosterLevel = "standard",
): string[] {
  if (!detectMatureTheme(topic)) return [];

  const T = extractIntent(topic);
  const result: string[] = [];

  const getStrength = (slot: number): 0 | 1 | 2 => {
    if (!boosterEnabled) return 1;
    switch (boosterLevel) {
      case "minimal":
        return 0;
      case "extremely_powerful":
        return 2;
      case "evolving": {
        const third = Math.floor(8 / 3);
        if (slot < third) return 0;
        if (slot < third * 2) return 1;
        return 2;
      }
      default:
        return 1;
    }
  };

  for (let i = 0; i < 8; i++) {
    const starter = pick(MATURE_STARTERS, i + T.length);
    const enhancer = pick(MATURE_ENHANCERS, i + T.length + 5);
    const strength = getStrength(i);
    if (strength === 2) {
      result.push(
        `${starter} ${T} ABSOLUTELY and COMPLETELY \u2014 ${enhancer}.`,
      );
    } else if (strength === 0) {
      result.push(`${starter} ${T} gently \u2014 ${enhancer}.`);
    } else {
      result.push(`${starter} ${T} \u2014 ${enhancer}.`);
    }
  }

  return result;
}
