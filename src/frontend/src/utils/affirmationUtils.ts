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
  // Generates affirmations that directly tie the topic to real manifestations
  if (fantasyEnabled) {
    result.push(
      `I possess the ability to manifest ${T} — this is real, present, and undeniable.`,
      `My ${T} operates with the precision of someone who has mastered forces beyond ordinary perception.`,
      `I am connected to a source of ${T} that transcends limitation — it flows through me fully.`,
      `Reality reshapes itself around my ${T} — I have witnessed this and I trust it completely.`,
      `I carry within me the essence of those who embody ${T} at the highest level — it is now mine.`,
      `My ${T} is not a hope or a wish — it is an active force operating in my life right now.`,
      `I open the fabric of my reality to receive ${T} in ways that exceed my expectations.`,
      `The universe has engineered me specifically to embody and express ${T} — I accept this fully.`,
    );
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
