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

export function generateAffirmations(
  topic: string,
  boosterEnabled: boolean,
  fantasyEnabled: boolean,
  protectionEnabled: boolean,
  chakraName: string,
  characterName?: string,
  characterSource?: string,
  itemName?: string,
  itemSource?: string,
): string[] {
  const intent = extractIntent(topic);
  const T = intent; // short alias

  // ── Base affirmations (always generated, topic-specific) ─────────────
  const base: string[] = boosterEnabled
    ? [
        // Boosted identity-level versions
        `I am powerfully and completely ${T} in every dimension of my being.`,
        `${cap(T)} is my natural, permanent state — I embody it without effort.`,
        `Every single cell of my being radiates ${T} at maximum intensity.`,
        `I am the living, breathing definition of ${T} — it flows from me effortlessly.`,
        `My ${T} grows stronger, deeper, and more unshakeable with every breath.`,
        `I am an unstoppable, magnetic force of ${T} — nothing can diminish it.`,
        `The universe recognizes me as a master of ${T} and aligns everything in my favor.`,
        `My identity is permanently fused with ${T} — it is who I am at my core.`,
        `I attract infinite ${T} because I am a perfect vibrational match for it.`,
        `My subconscious mind is completely saturated with ${T} — it runs through everything I do.`,
        `${cap(T)} multiplies and compounds within me every moment of every day.`,
        `I radiate ${T} so powerfully that it transforms every environment I enter.`,
        `My capacity for ${T} is limitless and constantly expanding beyond what I thought possible.`,
        `I am already living the reality of ${T} — my mind, body, and spirit confirm this now.`,
        `The intensity of my ${T} is legendary — it defines my entire existence.`,
      ]
    : [
        // Standard depth
        `I am ${T}.`,
        `I have ${T} in abundance.`,
        `My ${T} grows stronger every single day.`,
        `I radiate ${T} naturally and effortlessly.`,
        `I deserve ${T} and I receive it fully.`,
        `The universe aligns to bring me ${T} in perfect timing.`,
        `I am grateful for the ${T} that is already mine.`,
        `Every day I step deeper into my ${T}.`,
        `I am worthy of ${T} beyond what I can imagine.`,
        `My subconscious mind is fully programmed with ${T}.`,
        `${cap(T)} is a natural part of who I am.`,
        `I attract ${T} because I embody it completely.`,
        `My relationship with ${T} deepens with every passing moment.`,
        `I choose ${T} and ${T} chooses me.`,
        `Everything I do reflects my ${T}.`,
      ];

  const result: string[] = [...base];

  // ── Fantasy-to-Reality mode ──────────────────────────────────────────
  // Generates affirmations about physically bringing fictional elements into reality
  if (fantasyEnabled) {
    result.push(
      `I possess ${T} — it is physically real, active, and fully present in my life right now.`,
      `The fabric of reality has opened and ${T} is now a tangible, physical part of my world.`,
      `${cap(T)} exists in my physical reality — I can see it, feel it, and access it at will.`,
      `I have broken the boundary between fiction and reality — ${T} is mine in the physical world.`,
      `Reality itself has shifted to accommodate my ${T} — it is no longer a concept, it is fact.`,
      `I live in a reality where ${T} is physically possible and completely real for me.`,
      `The laws of my reality have expanded — ${T} is now a natural part of my physical existence.`,
      `What was once fictional has become physical — ${T} has crossed into my reality completely.`,
    );

    // ── Character Manifestation ────────────────────────────────────────
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

    // ── Item Manifestation ────────────────────────────────────────────
    if (itemName?.trim()) {
      const I2 = itemName.trim();
      const isrc = itemSource?.trim() ? ` from ${itemSource.trim()}` : "";
      result.push(
        `${I2}${isrc} is physically in my reality right now — I hold it, I use it, it is real.`,
        `I have opened the fabric of reality and pulled ${I2}${isrc} through into my physical world.`,
        `${I2} exists as a physical object in my life — it has manifested and I possess it completely.`,
        `The reality-barrier for ${I2} no longer exists — it is here with me in my physical world.`,
        `I physically possess ${I2}${isrc} — it crossed from fiction into my reality and it is mine.`,
        `${I2} is no longer beyond reach — it has materialized in my world and responds to me fully.`,
        `My reality now includes ${I2}${isrc} as a physical presence — I have made this real.`,
      );
    }
  }

  // ── Protection mode ──────────────────────────────────────────────────
  // Grounding affirmations themed to the user's specific topic
  if (protectionEnabled) {
    result.push(
      `My ${T} is protected, stable, and cannot be taken from me.`,
      `I am grounded in my ${T} — no outside force can shake what I have built.`,
      `My inner clarity keeps my ${T} safe and continuously growing.`,
      `It is safe for me to fully own my ${T} — I am ready and I am protected.`,
      `My energy around ${T} remains steady and unaffected by doubt or external noise.`,
      `I trust myself completely to sustain and protect my ${T} at all times.`,
    );
  }

  // ── Chakra alignment ────────────────────────────────────────────────
  if (chakraName && chakraName !== "") {
    result.push(
      `My ${chakraName} chakra is balanced, open, and radiating — it amplifies my ${T}.`,
      `I align my energy with the pure frequency of the ${chakraName} chakra, deepening my ${T}.`,
      `The ${chakraName} center within me is fully awakened and perfectly tuned to my ${T}.`,
    );
  }

  return result;
}
