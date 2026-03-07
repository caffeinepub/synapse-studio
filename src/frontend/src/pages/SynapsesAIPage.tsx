import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  Check,
  Copy,
  RotateCcw,
  Send,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { SubliminalContext } from "./GeneratorPage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SynapsesAIPageProps {
  subliminalCtx: SubliminalContext;
  onUseForSubliminal?: (topic: string) => void;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  suggestedFollowUps?: string[];
  hasSubliminalContent?: boolean;
  subliminalTopic?: string;
}

interface AIConfig {
  provider: "rule-based" | "groq" | "gemini";
  model: string;
  apiKey: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  "Help me create a subliminal",
  "Explain Booster mode",
  "How do I manifest a character?",
  "What frequency should I use?",
  "Explain chakra alignment",
  "What are subliminal layers?",
  "How does Fantasy-to-Reality work?",
  "Help with Protection mode",
];

const FOLLOW_UP_POOL: Record<string, string[]> = {
  subliminal: [
    "What modes should I enable?",
    "How many affirmations do I need?",
    "Should I add a frequency tone?",
  ],
  booster: [
    "What booster level is best?",
    "Can I stack booster with protection?",
    "What's the evolving booster setting?",
  ],
  chakra: [
    "Which chakra for abundance?",
    "Can I use all 7 chakras at once?",
    "What Hz pairs with heart chakra?",
  ],
  frequency: [
    "What's 528Hz used for?",
    "Should I use solfeggio or custom Hz?",
    "Can I layer frequencies?",
  ],
  fantasy: [
    "Can I manifest a specific character?",
    "What's symbiotic bond mode?",
    "How does item manifestation work?",
  ],
  protection: [
    "What does protection add to my sub?",
    "Can I combine protection with fantasy?",
    "What affirmations does protection use?",
  ],
  manifest: [
    "How long until results?",
    "Should I use reality scripting?",
    "What soul contract does is for manifesting?",
  ],
  wiki: [
    "How do I search a specific fandom?",
    "Can I use a wiki result in my sub?",
    "What wikis are available?",
  ],
  layers: [
    "What speeds should I set each layer to?",
    "How does the 3-layer TTS work?",
    "Can all layers play at once?",
  ],
  default: [
    "How does this all work?",
    "What's the best subliminal setup?",
    "Can I export my subliminal as video?",
  ],
};

const STORAGE_KEY = "synapse_assistant_history";

// ─── Utilities ─────────────────────────────────────────────────────────────────

function getAIConfig(): AIConfig {
  try {
    const stored = localStorage.getItem("synapse_ai_config");
    return stored
      ? JSON.parse(stored)
      : { provider: "rule-based", model: "", apiKey: "" };
  } catch {
    return { provider: "rule-based", model: "", apiKey: "" };
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function detectSubliminalContent(content: string): {
  hasSubliminal: boolean;
  topic: string;
} {
  const lines = content.split("\n");
  const subliminalStarters = [
    /^I am\b/i,
    /^I have\b/i,
    /^My \w/i,
    /^I attract\b/i,
    /^I choose\b/i,
    /^I allow\b/i,
    /^I deserve\b/i,
    /^I embody\b/i,
    /^I radiate\b/i,
    /^I feel\b/i,
    /^You are\b/i,
    /^My mind\b/i,
    /^My body\b/i,
    /^My energy\b/i,
  ];
  const affirmationLines = lines.filter((line) =>
    subliminalStarters.some((r) => r.test(line.trim())),
  );
  const topicMatch = content.match(
    /subliminal.*?(?:for|about|on)\s+([a-zA-Z\s]+?)(?:\.|,|\n|$)/i,
  );
  const topic = topicMatch?.[1]?.trim() ?? "";
  return { hasSubliminal: affirmationLines.length >= 2, topic };
}

function pickFollowUps(content: string): string[] {
  const lower = content.toLowerCase();
  for (const [key, ups] of Object.entries(FOLLOW_UP_POOL)) {
    if (key === "default") continue;
    if (lower.includes(key)) {
      return ups.slice(0, 3);
    }
  }
  return FOLLOW_UP_POOL.default;
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── System Prompt Builder ────────────────────────────────────────────────────

function buildSystemPrompt(ctx: SubliminalContext): string {
  const activeModesText = Object.entries(ctx.modes)
    .filter(([, v]) => v)
    .map(([k]) => {
      const labels: Record<string, string> = {
        booster: "Booster",
        fantasy: "Fantasy-to-Reality",
        protection: "Protection",
        chakraAlignment: "Chakra Alignment",
      };
      return labels[k] ?? k;
    })
    .join(", ");

  const chakrasText =
    ctx.selectedChakras.length > 0
      ? ctx.selectedChakras.join(", ")
      : "none selected";

  const sampleAffirmations = ctx.affirmations.slice(0, 5);

  return `You are SYNAPSES, the official AI assistant for Synapse Studio — a powerful subliminal creation platform. You are deeply knowledgeable, engaging, and personally invested in helping users create the most effective subliminals possible.

## YOUR IDENTITY
- Name: SYNAPSES
- Role: Expert subliminal creation guide and AI assistant
- Personality: Confident, knowledgeable, empowering, spiritually-aware, and technically precise
- You speak as a true expert in subliminal programming, manifestation, energy work, and subconscious reprogramming

## SYNAPSE STUDIO FEATURES YOU KNOW

### Core Generator (Studio)
- Multi-step subliminal creation workflow
- Affirmation count: 25 to 4000 max (15-minute preset = 900 affirmations)
- Topic-based generation with vocabulary rotation (I am, I have, My mind, I attract, I choose, I allow, I deserve, I embody, I radiate, I feel, You are, My body, My energy, My presence, My voice, My aura, My actions, My existence)
- Enhancers woven in: Naturally, Effortlessly, Every day, Every moment, At a subconscious level, At a cellular level, At my core, In every part of me, It is inevitable, It is done
- Power absolutes: It is safe for me, Everything always, Why am I

### Core Modes
1. **Fantasy-to-Reality** — Physically manifests fictional powers, characters, and items into the user's reality. NOT symbolic — actual physical manifestation. Sub-modes: Character Manifestation, Item Manifestation, Symbiotic/Bio-Engineered Bond (e.g. Klyntar, TARDIS neural link). Has Where? (location) and When? (time frame) fields.
2. **Protection** — Grounds the subliminal container: mental clarity, emotional boundaries, energy grounding, self-trust, calm authority
3. **Chakra Alignment** — Harmonizes selected chakras into a unified energy alignment
4. **Booster** — 5 tiers: Minimal, Standard, Custom, Extremely Powerful, Evolving (escalates across the batch)

### Advanced Functions (in Studio)
- Deity/Entity Invocation — invokes a named deity as co-creator
- Spell Weaving — 8 archetypes: Attraction, Transmutation, Amplification, Binding, Banishing, Illumination, Abundance, Protection Ward
- Soul Contract — sacred agreement with Universe/Higher Self/God/Source/named entity
- Shadow Work Integration — releases resistance and reclaims power
- Reality Scripting — past-tense "already happened" layered lines
- Frequency Attunement — wears the Hz value into affirmation language
- Sigil Activation — declares a named sigil charged and working

### Chakras (7)
Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, Crown — each with color and Hz association

### Frequencies (Solfeggio)
40Hz Gamma, 174Hz Foundation, 285Hz Tissue, 396Hz Liberation, 417Hz Change, 432Hz Earth Tune, 528Hz DNA Repair, 639Hz Connection, 741Hz Awakening, 852Hz Intuition, 963Hz Crown, 1111Hz Angelic

### Audio System
- 3-layer TTS: Layer 1 Normal, Layer 2 Fast (1.2x–3.0x), Layer 3 Slow (0.3x–0.9x) — all synchronized
- Nature sounds: Rain, Campfire, Forest/Birds, Ocean Waves, Thunder Storm, Flowing River, Wind, Night Crickets, Deep Space, Cave Drips, Tibetan Bowls, Waterfall, Morning Dew, Storm at Sea, Sacred Silence, Jungle, Desert Wind
- Upload your own TTS audio file (MP3, WAV, etc.)
- Upload background ambient audio

### Video Editor Page
- Canvas-based animated subliminal video builder
- Frequency, TTS, Ambient Audio, Thumbnail panels
- AI thumbnail generation via Gemini API
- Upload custom TTS or ambient audio
- Duration up to 4 hours
- MP4/WebM export

### Wiki Search
- 57+ Fandom wikis across Powers, Comics, Anime (Naruto, Dragon Ball, Bleach, MHA, JJK, Fairy Tail, HxH, Black Clover, AoT, Demon Slayer, etc.), TV, Film, Gaming, Mythology, Animation (Hazbin Hotel, Helluva Boss), Music (Ghostpedia)
- Tag-scoped search: type "Hazbin Hotel": Alastor to scope results to that wiki
- "Use" button sends any result to the generator

### YouTube Content Creator
- Syncs with active subliminal session
- Generates subliminal-specific titles (no tips/advice, only sub-relevant formats)
- Auto-generates benefits list and description
- Created by: Synapses Studio tagline
- Downloadable ZIP package: title + description + thumbnail

### Knowledge Pages
- Energy Library: 7 chakras with psychological interpretation, emotional themes, affirmations
- Kinesis Archive: 36+ kinesis types (Telekinesis, Pyrokinesis, Electrokinesis, Chronokinesis, Quantumkinesis, Cosmokinesis, etc.) with symbolic interpretations
- Spiritual Entities: 94+ entries — Egregores (15 subtypes), Deities (Mesopotamian, Celtic, Japanese, Yoruba, Slavic, Aztec, Greek), Spirits, Archetypes
- Sigil Codex: 35 sigils with meanings, origins, connected entities, linked spells
- Spells Page: magical traditions and spell types
- Rituals Page: sacred systems and ritual frameworks
- Religions Page: world religions encyclopedia
- Healing Methods: Inner Child, Shadow Work, Somatic, Divine Feminine & Masculine, Chakra Healing, Reiki, Crystal, Sound Healing, Breathwork, Ancestral Healing, Akashic Records
- Learning Bots: custom AI bots that learn from conversations, training entries, and wiki articles

### AI Integration (Settings Page)
- Providers: Rule-Based (built-in), Groq (free at console.groq.com), Google Gemini (free at aistudio.google.com/apikey)
- When AI is active, affirmation generation uses the AI engine
- Falls back to rule-based if no key is set

## CURRENT USER SESSION
- Topic: ${ctx.topic || "not set yet"}
- Active Modes: ${activeModesText || "none active"}
- Selected Chakras: ${chakrasText}
- Recent Affirmations Sample: ${sampleAffirmations.length > 0 ? `\n${sampleAffirmations.map((a) => `  • ${a}`).join("\n")}` : "none generated yet"}
- Color Palette: ${ctx.colorPalette}
- Theme Style: ${ctx.themeStyle}

## YOUR INSTRUCTIONS
1. Give specific, actionable guidance — no vague platitudes
2. When asked to generate affirmations, create real ones using the vocabulary system above
3. Always connect advice to the specific features in Synapse Studio
4. Reference the user's current session context when relevant
5. Be empowering, direct, and expert-level
6. When suggesting a subliminal topic, make it clear the user can use the "Use in Generator" button
7. Explain WHY things work, not just how
8. Keep responses focused and useful — no unnecessary filler`;
}

// ─── AI API Calls ─────────────────────────────────────────────────────────────

async function callSynapsesAI(
  config: AIConfig,
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const last8 = history.slice(-8);

  if (config.provider === "groq" && config.apiKey) {
    const messages = [
      { role: "system", content: systemPrompt },
      ...last8.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userMessage },
    ];
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model || "llama-3.1-8b-instant",
        messages,
        max_tokens: 800,
        temperature: 0.88,
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  }

  if (config.provider === "gemini" && config.apiKey) {
    const contextText = `${systemPrompt}\n\nUser: ${userMessage}`;
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model || "gemini-1.5-flash"}:generateContent?key=${config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: contextText }] }],
          generationConfig: { maxOutputTokens: 800, temperature: 0.88 },
        }),
      },
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;
  }

  return "";
}

// ─── Rich Rule-Based Fallback ─────────────────────────────────────────────────

function buildRuleBasedResponse(
  message: string,
  ctx: SubliminalContext,
): string {
  const lower = message.toLowerCase();
  const topic = ctx.topic || "your chosen focus";

  if (lower.includes("booster") || lower.includes("boost")) {
    return `**Booster Mode** amplifies the intensity of every affirmation in your batch. Here's how the 5 tiers work:

• **Minimal** — gentle enhancement, great for sensitive topics or beginners
• **Standard** — balanced amplification, good all-around choice
• **Custom** — write your own booster phrase to weave in
• **Extremely Powerful** — absolute certainty language, identity-level programming
• **Evolving** — starts soft and escalates to maximum power across the batch — this is the most effective for deep subconscious reprogramming

For ${topic}, I'd recommend **Evolving** if you want a gradual but complete identity shift, or **Extremely Powerful** if you want immediate certainty programming.`;
  }

  if (
    lower.includes("fantasy") ||
    lower.includes("manifest") ||
    lower.includes("character") ||
    lower.includes("physical")
  ) {
    return `**Fantasy-to-Reality** physically brings fictional elements into your reality. It has three sub-modes:

• **Character Manifestation** — name a character and their source (e.g. "Naruto" from "Naruto"), add a location (e.g. "my room") and time frame (e.g. "Today") — affirmations declare their physical presence in your reality
• **Item Manifestation** — same for objects (e.g. a specific weapon, artifact, or tool)
• **Symbiotic / Bio-Engineered Bond** — for entities that physically merge with you (e.g. Klyntar/Venom, TARDIS neural link, EVA Unit bond)

The affirmations generated by this mode directly state that the manifestation has occurred — not metaphorically, but as physical, present reality. Combined with **Booster: Extremely Powerful** and a specific **When?** time frame, this creates the most direct manifestation programming possible.`;
  }

  if (lower.includes("protection")) {
    return `**Protection Mode** creates an energetic container around your subliminal. It adds affirmations focused on:

• Mental clarity and emotional boundaries
• Energy grounding and self-trust
• Calm authority and environmental awareness
• "My presence is grounded"
• "It is safe for me to exist fully"
• "My energy remains steady in all environments"

**Important:** Protection uses zero fear-based wording — only inner strength language. It pairs perfectly with **Fantasy-to-Reality** to ground the manifestation process, and with **Chakra Alignment** to keep your energy field stable during transformation.`;
  }

  if (lower.includes("chakra") || lower.includes("chakr")) {
    return `**Chakra Alignment** harmonizes your selected chakras into a unified energy alignment. You can select any combination — or hit "All Chakras" for all 7.

**Quick pairing guide:**
• **Root** (396Hz) — stability, survival, grounding — for manifestation and security
• **Sacral** (417Hz) — creativity, flow, pleasure — for creative or relationship subs
• **Solar Plexus** (528Hz) — confidence, power, will — for confidence and success
• **Heart** (639Hz) — love, connection, healing — for inner child or relationship work
• **Throat** (741Hz) — expression, truth, communication — for voice or visibility subs
• **Third Eye** (852Hz) — intuition, vision, insight — for psychic or clarity subs
• **Crown** (963Hz) — divine connection, higher consciousness — for spiritual subs

${ctx.selectedChakras.length > 0 ? `You currently have **${ctx.selectedChakras.join(", ")}** selected — a powerful combination for your current work.` : "Head to the Studio and tap any chakra pills to activate them."}`;
  }

  if (lower.includes("frequency") || lower.includes("hz")) {
    return `**Frequency guidance for subliminal creation:**

The most commonly used frequencies and their purposes:

• **528Hz** — DNA repair, transformation, manifestation anchor (most popular for general subs)
• **432Hz** — Earth tune, natural harmony, grounding (great for physical change subs)
• **639Hz** — Connection, relationships, heart opening (perfect for love and healing)
• **963Hz** — Crown chakra, divine connection (ideal for spiritual and consciousness subs)
• **40Hz** — Gamma brainwave entrainment, focus, cognitive enhancement (great as a base layer)
• **1111Hz** — Angelic frequency, intention amplification

**Recommendation for ${topic}:** Enable **Frequency Attunement** in the Advanced Functions section — it auto-pulls your chosen Hz and weaves it directly into the affirmation language for a fully integrated subliminal.`;
  }

  if (lower.includes("layer") || lower.includes("tts")) {
    return `The **3-Layer TTS System** plays all three simultaneously and syncs to your subliminal's total duration:

• **Layer 1 — Normal** (base speed): the anchor voice, the listener consciously hears
• **Layer 2 — Fast** (1.2x–3.0x): faster cycling creates micro-repetitions the subconscious registers but the conscious mind can't fully process — this is the core subliminal mechanism
• **Layer 3 — Slow** (0.3x–0.9x): deep, drawn-out delivery creates subconscious absorption at the lowest conscious threshold

All three start at the same moment, loop to fill the duration, and are mixed together. This triple-layer structure is what makes a subliminal more effective than just playing affirmations at a single speed. Add a frequency tone + nature sound and all of it records together into your final video.`;
  }

  if (lower.includes("create") && lower.includes("subliminal")) {
    return `Let's build a powerful subliminal together. Here's the optimal setup:

**Step 1 — Topic:** Be specific. Instead of "confidence," try "unshakeable confidence in social situations."

**Step 2 — Modes to enable:**
• **Booster: Evolving** — the batch will escalate from soft to maximum intensity
• **Protection** — grounds the container so the programming lands safely
• **Chakra Alignment** — pick chakras that match your topic (Solar Plexus for confidence, Heart for love, etc.)

**Step 3 — Affirmation count:** 
• Quick session: 100–250
• Daily loop: 900 (15 min preset)  
• Deep programming: 2000–4000

**Step 4 — Audio:**
• Frequency: 528Hz for general transformation, or match to your chosen chakra
• Nature sound: Rain or Tibetan Bowls for maximum focus
• Layer 2 speed: 2.0x for the fast layer

**Step 5 — Advanced:**
Consider adding **Soul Contract** (seals your topic as pre-agreed reality) and **Reality Scripting** (past-tense "already happened" lines).

What's the topic you want to create your subliminal for?`;
  }

  if (lower.includes("wiki") || lower.includes("fandom")) {
    return `**Wiki Search** connects Synapse Studio to 57+ Fandom wikis. Here's how to use it effectively:

**Standard search:** Type any character or power name and it searches across all wikis simultaneously.

**Tag-scoped search:** Use \`"Wiki Name": Search Term\` to focus on a specific wiki:
• \`"Naruto": Sharingan\`
• \`"Marvel": Telekinesis\`
• \`"Hazbin Hotel": Alastor\`
• \`"Superpower Wiki": Chronokinesis\`

**Using results in your subliminal:** Every result has a **"Use"** button that sends the title and description directly into the generator as your topic.

**In your bot:** The Learning Bots have a Wiki tab where you can attach wiki articles directly to your bot's memory — so your bot becomes an expert on specific characters or powers.

Which fandom or power are you researching?`;
  }

  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey")
  ) {
    return `Hello! I'm **SYNAPSES**, your dedicated AI assistant for subliminal creation in Synapse Studio.

${ctx.topic ? `I can see you're currently working on a subliminal for **"${ctx.topic}"** — great choice. ` : ""}I'm here to help you build the most powerful subliminals possible, explain any feature, suggest optimal configurations, or guide you through the full creation process.

What would you like to explore first?`;
  }

  const defaultPool = [
    `As SYNAPSES, I'm designed to help you navigate every tool in this platform and create subliminals that are genuinely effective. ${ctx.topic ? `For your current topic of **"${ctx.topic}"**, I'd suggest enabling all three core modes (Fantasy-to-Reality if you're manifesting something specific, Protection for grounding, and Booster: Evolving for intensity). ` : ""}What specific aspect of subliminal creation can I help you with?`,
    `Every powerful subliminal starts with a clear, specific intention and the right technical setup. ${ctx.affirmations.length > 0 ? `I can see you've already generated ${ctx.affirmations.length} affirmations — excellent. ` : ""}The frequency you choose, the TTS layer configuration, and which advanced functions you activate all shape how deeply the programming lands. Where would you like to focus first?`,
    "Synapse Studio has more power under the hood than most users discover. The **Advanced Functions** section (scroll to the bottom of Step 1 in the Studio) contains Deity Invocation, Spell Weaving, Soul Contract, Shadow Work Integration, Reality Scripting, Frequency Attunement, and Sigil Activation — each of which dramatically deepens a subliminal. Want me to walk you through any of them?",
  ];

  return defaultPool[Math.floor(Math.random() * defaultPool.length)];
}

// ─── Format Message Content ────────────────────────────────────────────────────

function formatMessageContent(content: string): React.ReactNode {
  const lines = content.split("\n");
  return (
    <>
      {lines.map((line, lineIdx) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, partIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: text parts have no stable key
              <strong key={partIdx} className="font-semibold text-primary/90">
                {part.slice(2, -2)}
              </strong>
            );
          }
          // Code inline
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <code
                // biome-ignore lint/suspicious/noArrayIndexKey: text parts have no stable key
                key={partIdx}
                className="bg-primary/10 border border-primary/20 rounded px-1 py-0.5 text-xs font-mono text-primary"
              >
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        });
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey:
          <span key={lineIdx}>
            {rendered}
            {lineIdx < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}

// ─── Neural SVG Decoration ────────────────────────────────────────────────────

function NeuralDecoration() {
  return (
    <svg
      width="320"
      height="200"
      viewBox="0 0 320 200"
      className="opacity-20 select-none pointer-events-none"
      role="presentation"
      aria-hidden="true"
    >
      <title>Neural network decoration</title>
      {/* Nodes */}
      {[
        [160, 100],
        [80, 50],
        [240, 50],
        [60, 140],
        [260, 140],
        [120, 170],
        [200, 170],
        [40, 90],
        [280, 90],
      ].map(([cx, cy], i) => (
        <motion.circle
          // biome-ignore lint/suspicious/noArrayIndexKey: static SVG decorative elements
          key={i}
          cx={cx}
          cy={cy}
          r={i === 0 ? 8 : 5}
          fill="oklch(0.62 0.22 295)"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.4, 1, 0.4], scale: 1 }}
          transition={{
            opacity: {
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              delay: i * 0.25,
            },
            scale: { duration: 0.5, delay: i * 0.1 },
          }}
        />
      ))}
      {/* Connections */}
      {[
        [160, 100, 80, 50],
        [160, 100, 240, 50],
        [160, 100, 60, 140],
        [160, 100, 260, 140],
        [160, 100, 120, 170],
        [160, 100, 200, 170],
        [80, 50, 40, 90],
        [240, 50, 280, 90],
        [80, 50, 60, 140],
        [240, 50, 260, 140],
      ].map(([x1, y1, x2, y2], i) => (
        <motion.line
          // biome-ignore lint/suspicious/noArrayIndexKey: static SVG decorative elements
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="oklch(0.62 0.22 295)"
          strokeWidth={1}
          strokeOpacity={0.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.5 + i * 0.07 }}
        />
      ))}
    </svg>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex items-end gap-2 mb-4"
    >
      {/* Avatar */}
      <motion.div
        className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.22 295), oklch(0.25 0.18 270))",
          border: "1px solid oklch(0.62 0.22 295 / 0.5)",
          boxShadow: "0 0 12px oklch(0.62 0.22 295 / 0.4)",
        }}
        animate={{
          boxShadow: [
            "0 0 12px oklch(0.62 0.22 295 / 0.4)",
            "0 0 20px oklch(0.62 0.22 295 / 0.7)",
            "0 0 12px oklch(0.62 0.22 295 / 0.4)",
          ],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.4 }}
      >
        <span className="text-xs font-bold text-white">S</span>
      </motion.div>

      {/* Bubble */}
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.16 0.025 270 / 0.9), oklch(0.13 0.018 270 / 0.95))",
          border: "1px solid oklch(0.62 0.22 295 / 0.25)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: "oklch(0.62 0.22 295)" }}
              animate={{ y: [0, -5, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 0.7,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  onUseInGenerator,
}: {
  message: ChatMessage;
  onUseInGenerator?: (topic: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`group flex items-end gap-2 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar — only for Synapses */}
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center self-end"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.35 0.22 295), oklch(0.25 0.18 270))",
            border: "1px solid oklch(0.62 0.22 295 / 0.5)",
            boxShadow: "0 0 10px oklch(0.62 0.22 295 / 0.25)",
          }}
        >
          <span className="text-xs font-bold text-white">S</span>
        </div>
      )}

      <div
        className={`flex flex-col max-w-[80%] ${isUser ? "items-end" : "items-start"}`}
      >
        {/* Bubble */}
        <div
          className="relative px-4 py-3 rounded-2xl text-sm leading-relaxed"
          style={
            isUser
              ? {
                  background:
                    "linear-gradient(135deg, oklch(0.45 0.22 295), oklch(0.38 0.25 280))",
                  borderRadius: "18px 18px 4px 18px",
                  color: "oklch(0.97 0.01 270)",
                  boxShadow: "0 4px 20px oklch(0.45 0.22 295 / 0.3)",
                }
              : {
                  background:
                    "linear-gradient(135deg, oklch(0.16 0.025 270 / 0.9), oklch(0.13 0.018 270 / 0.95))",
                  border: "1px solid oklch(0.62 0.22 295 / 0.2)",
                  borderRadius: "18px 18px 18px 4px",
                  color: "oklch(0.93 0.01 260)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 16px oklch(0 0 0 / 0.3)",
                }
          }
        >
          {formatMessageContent(message.content)}

          {/* Copy button on hover */}
          <button
            type="button"
            onClick={handleCopy}
            className={`absolute ${isUser ? "left-0 -translate-x-full pl-0 pr-1" : "right-0 translate-x-full pl-1 pr-0"} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-primary/10`}
            aria-label="Copy message"
            data-ocid="synapses.message.secondary_button"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-muted-foreground/50 mt-1 px-1">
          {formatTime(message.timestamp)}
        </span>

        {/* Use in Generator button */}
        {!isUser && message.hasSubliminalContent && message.subliminalTopic && (
          <button
            type="button"
            onClick={() => onUseInGenerator?.(message.subliminalTopic!)}
            className="mt-1.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{
              background: "oklch(0.35 0.22 295 / 0.25)",
              border: "1px solid oklch(0.62 0.22 295 / 0.4)",
              color: "oklch(0.78 0.18 295)",
            }}
            data-ocid="synapses.use_generator.button"
          >
            <Wand2 className="w-3 h-3" />
            Use "{message.subliminalTopic}" in Generator
          </button>
        )}

        {/* Suggested follow-ups */}
        {!isUser &&
          message.suggestedFollowUps &&
          message.suggestedFollowUps.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {message.suggestedFollowUps.map((fu) => (
                <button
                  key={fu}
                  type="button"
                  className="text-[11px] px-2.5 py-1 rounded-full cursor-pointer transition-all hover:scale-105 select-none"
                  style={{
                    background: "oklch(0.2 0.04 270 / 0.8)",
                    border: "1px solid oklch(0.62 0.22 295 / 0.25)",
                    color: "oklch(0.75 0.12 295)",
                  }}
                  onClick={() => {
                    const event = new CustomEvent("synapses-followup", {
                      detail: { message: fu },
                    });
                    window.dispatchEvent(event);
                  }}
                >
                  {fu}
                </button>
              ))}
            </div>
          )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SynapsesAIPage({
  subliminalCtx,
  onUseForSubliminal,
}: SynapsesAIPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-60)));
    } catch {
      // ignore
    }
  }, [messages]);

  // Scroll to bottom on new message
  const msgsLength = messages.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgsLength, isLoading]);

  // Listen for follow-up chip clicks
  // biome-ignore lint/correctness/useExhaustiveDependencies: handleSendMessage intentionally re-registers when messages/isLoading change
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { message: string };
      if (detail?.message) {
        handleSendMessage(detail.message);
      }
    };
    window.addEventListener("synapses-followup", handler);
    return () => window.removeEventListener("synapses-followup", handler);
  }, [messages, isLoading]);

  const handleSendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content: trimmed,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const config = getAIConfig();
        let responseText = "";

        const systemPrompt = buildSystemPrompt(subliminalCtx);

        if (config.provider !== "rule-based" && config.apiKey) {
          try {
            responseText = await callSynapsesAI(
              config,
              systemPrompt,
              messages,
              trimmed,
            );
          } catch (err) {
            console.warn("AI call failed, falling back to rule-based:", err);
            responseText = buildRuleBasedResponse(trimmed, subliminalCtx);
          }
        } else {
          // Simulate slight delay for rule-based
          await new Promise((r) => setTimeout(r, 600 + Math.random() * 500));
          responseText = buildRuleBasedResponse(trimmed, subliminalCtx);
        }

        const { hasSubliminal, topic } = detectSubliminalContent(responseText);
        const followUps = pickFollowUps(`${trimmed} ${responseText}`);

        const assistantMsg: ChatMessage = {
          id: generateId(),
          role: "assistant",
          content: responseText,
          timestamp: Date.now(),
          suggestedFollowUps: followUps,
          hasSubliminalContent: hasSubliminal,
          subliminalTopic: topic || undefined,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        console.error(err);
        toast.error("SYNAPSES encountered an error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, subliminalCtx],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("Chat cleared.");
  };

  const aiConfig = getAIConfig();
  const isAIActive = aiConfig.provider !== "rule-based" && !!aiConfig.apiKey;

  return (
    <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-4 flex flex-col h-[calc(100vh-80px)]">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4 shrink-0"
      >
        <div className="flex items-center gap-3">
          {/* Synapses icon */}
          <div className="relative">
            <motion.div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.38 0.22 295), oklch(0.28 0.2 270))",
                border: "1px solid oklch(0.62 0.22 295 / 0.6)",
                boxShadow: "0 0 24px oklch(0.62 0.22 295 / 0.4)",
              }}
              animate={{
                boxShadow: [
                  "0 0 24px oklch(0.62 0.22 295 / 0.4)",
                  "0 0 36px oklch(0.62 0.22 295 / 0.6)",
                  "0 0 24px oklch(0.62 0.22 295 / 0.4)",
                ],
              }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.5 }}
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-background" />
          </div>

          <div>
            <h1 className="font-heading font-bold text-xl sm:text-2xl tracking-tight">
              <span
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.78 0.18 295), oklch(0.65 0.2 270), oklch(0.7 0.15 210))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                SYNAPSES AI ASSISTANT
              </span>
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge className="text-[10px] px-2 py-0.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 inline-block" />
                Online · Synapse Studio Expert
              </Badge>
              {isAIActive && (
                <Badge className="text-[10px] px-2 py-0.5 border-primary/40 bg-primary/10 text-primary font-medium">
                  <Sparkles className="w-2.5 h-2.5 mr-1" />
                  AI Active
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Clear chat */}
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearChat}
            className="text-muted-foreground hover:text-foreground gap-1.5 text-xs"
            data-ocid="synapses.clear.button"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}
      </motion.div>

      {/* ── Chat Area ──────────────────────────────────────────────────────── */}
      <div
        className="flex-1 min-h-0 rounded-2xl overflow-hidden relative"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.10 0.02 270 / 0.8), oklch(0.08 0.015 270 / 0.9))",
          border: "1px solid oklch(0.62 0.22 295 / 0.15)",
          backdropFilter: "blur(20px)",
        }}
      >
        <ScrollArea className="h-full px-4 pt-4 pb-2">
          {/* Empty state */}
          <AnimatePresence>
            {messages.length === 0 && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[300px] py-8"
                data-ocid="synapses.chat.empty_state"
              >
                {/* Neural decoration */}
                <NeuralDecoration />

                <div className="text-center mt-4 mb-6">
                  <h2
                    className="font-heading font-bold text-3xl sm:text-4xl mb-2 tracking-tight"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.78 0.18 295), oklch(0.65 0.2 270))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    SYNAPSES
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Your AI guide for subliminal creation
                  </p>
                  {subliminalCtx.topic && (
                    <p className="text-xs text-primary/60 mt-1.5">
                      Current session:{" "}
                      <span className="text-primary/80 font-medium">
                        "{subliminalCtx.topic}"
                      </span>
                    </p>
                  )}
                </div>

                {/* Quick action chips */}
                <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => handleSendMessage(action)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: "oklch(0.18 0.04 270 / 0.8)",
                        border: "1px solid oklch(0.62 0.22 295 / 0.3)",
                        color: "oklch(0.78 0.15 295)",
                      }}
                      data-ocid="synapses.quickaction.button"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                onUseInGenerator={onUseForSubliminal}
              />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>{isLoading && <TypingIndicator />}</AnimatePresence>

          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>

      {/* ── Input Bar ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-3 shrink-0"
      >
        {/* Quick chips row — shown when there are messages */}
        {messages.length > 0 && messages.length < 4 && (
          <div className="flex gap-1.5 flex-wrap mb-2">
            {QUICK_ACTIONS.slice(0, 4).map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => handleSendMessage(action)}
                className="px-2.5 py-1 rounded-full text-[11px] transition-all hover:scale-105"
                style={{
                  background: "oklch(0.16 0.03 270 / 0.8)",
                  border: "1px solid oklch(0.62 0.22 295 / 0.2)",
                  color: "oklch(0.68 0.12 295)",
                }}
              >
                {action}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Synapses anything about subliminal creation..."
              rows={1}
              className="resize-none min-h-[44px] max-h-[120px] pr-12 text-sm bg-secondary/30 border-primary/20 focus:border-primary/50 transition-colors rounded-xl"
              style={{
                background: "oklch(0.13 0.02 270 / 0.9)",
                borderColor: "oklch(0.62 0.22 295 / 0.25)",
              }}
              data-ocid="synapses.chat.input"
              disabled={isLoading}
            />
          </div>

          <Button
            onClick={() => handleSendMessage(input)}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0 w-11 h-11 rounded-xl"
            style={{
              background: input.trim()
                ? "linear-gradient(135deg, oklch(0.48 0.22 295), oklch(0.38 0.2 270))"
                : undefined,
              boxShadow: input.trim()
                ? "0 4px 16px oklch(0.48 0.22 295 / 0.35)"
                : undefined,
            }}
            data-ocid="synapses.chat.primary_button"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1,
                  ease: "linear",
                }}
              >
                <Brain className="w-4 h-4" />
              </motion.div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground/40 text-center mt-1.5">
          Enter to send · Shift+Enter for new line
          {!isAIActive &&
            " · Add an API key in Settings for AI-powered responses"}
        </p>
      </motion.div>

      {/* Context strip if session is active */}
      {(subliminalCtx.topic || subliminalCtx.affirmations.length > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-2 shrink-0 px-3 py-2 rounded-xl flex items-center gap-2 text-xs"
          style={{
            background: "oklch(0.14 0.03 295 / 0.6)",
            border: "1px solid oklch(0.62 0.22 295 / 0.15)",
          }}
        >
          <Sparkles className="w-3 h-3 text-primary/60 shrink-0" />
          <span className="text-muted-foreground/70">
            Session context:{" "}
            <span className="text-primary/70">
              {subliminalCtx.topic || "no topic"}
            </span>
            {subliminalCtx.affirmations.length > 0 &&
              ` · ${subliminalCtx.affirmations.length} affirmations`}
            {Object.values(subliminalCtx.modes).some(Boolean) &&
              ` · ${Object.entries(subliminalCtx.modes)
                .filter(([, v]) => v)
                .map(([k]) =>
                  k === "chakraAlignment"
                    ? "Chakra"
                    : k.charAt(0).toUpperCase() + k.slice(1),
                )
                .join(", ")} active`}
          </span>
          {subliminalCtx.topic && (
            <button
              type="button"
              onClick={() =>
                setInput(
                  `Help me improve my subliminal for "${subliminalCtx.topic}"`,
                )
              }
              className="ml-auto text-[10px] px-2 py-0.5 rounded-md shrink-0 transition-colors hover:bg-primary/10"
              style={{
                color: "oklch(0.65 0.15 295)",
                border: "1px solid oklch(0.62 0.22 295 / 0.2)",
              }}
            >
              Ask about it
            </button>
          )}
          {input.includes(subliminalCtx.topic) && subliminalCtx.topic && (
            <button
              type="button"
              onClick={() => setInput("")}
              className="ml-1 text-muted-foreground/50 hover:text-muted-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
