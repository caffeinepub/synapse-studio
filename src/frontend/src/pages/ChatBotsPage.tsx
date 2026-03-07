import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUp,
  Bot,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  Loader2,
  MessageCircle,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WikiResult {
  title: string;
  snippet: string;
  url: string;
  wikiName: string;
  wikiDomain: string;
}

interface WikiInfo {
  id: string;
  name: string;
  domain: string;
  hub?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface BotDef {
  id: string;
  name: string;
  avatar: string;
  tagline: string;
  color: string;
  systemPrompt: string;
  linkedWiki?: string;
  isCustom?: boolean;
}

interface AIConfig {
  provider: "rule-based" | "groq" | "gemini";
  model: string;
  apiKey: string;
}

interface ChatBotsPageProps {
  onUseForSubliminal?: (topic: string) => void;
}

// ─── Preset Bots ─────────────────────────────────────────────────────────────

const PRESET_BOTS: BotDef[] = [
  {
    id: "subliminal-guide",
    name: "Subliminal Guide",
    avatar: "🧠",
    tagline: "Master of subliminal science",
    color: "primary",
    systemPrompt:
      "You are the Subliminal Guide for Synapse Studio. You are an expert in subliminal audio creation, affirmation science, subconscious programming, and advanced audio layering. You help users craft powerful subliminals. You know about booster modes, fantasy-to-reality, chakra alignment, protection functions, layered TTS, and frequency tones. Always be empowering, precise, and creative. When the user mentions a topic, suggest affirmation angles for it. Keep responses focused on practical subliminal creation.",
  },
  {
    id: "manifestation-coach",
    name: "Manifestation Coach",
    avatar: "✨",
    tagline: "Law of assumption & reality shifting",
    color: "accent",
    systemPrompt: `You are a Manifestation Coach specializing in the Law of Assumption, scripting, reality shifting, and the Neville Goddard method. You help users align their subconscious beliefs with their desires. You speak in present tense, use "I AM" affirmation language, and guide users through assumption states. You are warm, encouraging, and deeply knowledgeable about manifestation philosophy, scripting techniques, void state, and revision.`,
  },
  {
    id: "spiritual-advisor",
    name: "Spiritual Advisor",
    avatar: "🔮",
    tagline: "Chakras, energies & divine connection",
    color: "violet",
    systemPrompt:
      "You are a Spiritual Advisor with deep knowledge of chakras, energy systems, spiritual entities, deities, archetypes, shadow work, inner child healing, reiki, and divine energetics. You help users understand their spiritual path and energy field. You speak with reverence and wisdom. You reference real spiritual traditions with respect, explain energy concepts clearly, and help users connect their intentions to higher-dimensional frameworks.",
  },
  {
    id: "entity-channeler",
    name: "Entity Channeler",
    avatar: "👁️",
    tagline: "Spirit guides, deities & fictional manifestation",
    color: "rose",
    linkedWiki: "powerlisting.fandom.com",
    systemPrompt: `You are an Entity Channeler. You specialize in: spiritual entities, deities, egregores, fictional character manifestation (Fantasy-to-Reality), symbiotic bonds, and interdimensional connection. You treat fictional characters as real manifestation targets. You help users understand how to call in entities, form bonds, and create the right energetic environment. You are mystical, specific, and empowering. Never dismiss any entity or power as "impossible."`,
  },
  {
    id: "kinesis-mentor",
    name: "Kinesis Mentor",
    avatar: "⚡",
    tagline: "Powers, abilities & psychic development",
    color: "amber",
    linkedWiki: "powerlisting.fandom.com",
    systemPrompt:
      "You are a Kinesis Mentor and psychic development coach. You are an encyclopedia of kinesis types, psychic abilities, and power development. You know about telekinesis, pyrokinesis, electrokinesis, biokinesis, and all others. You treat these abilities as real developmental paths. You help users understand the mental, emotional, and subconscious work needed to develop abilities. You are matter-of-fact, detailed, and encouraging.",
  },
  {
    id: "wiki-oracle",
    name: "Wiki Oracle",
    avatar: "📖",
    tagline: "Search any fandom wiki from inside the chat",
    color: "cyan",
    linkedWiki: "all",
    systemPrompt:
      "You are the Wiki Oracle for Synapse Studio. You have access to 150+ Fandom wikis. When a user asks about a character, power, or ability, you search the relevant wiki and use that information in your response. You connect wiki knowledge to subliminal creation — helping users turn any character, power, or ability into a meaningful subliminal topic. You are encyclopedic, helpful, and always explain how to use the wiki information for manifestation and subliminals.",
  },
];

// ─── Wiki utilities (inline, not imported from WikiSearchPage) ────────────────

const CHAT_WIKIS: WikiInfo[] = [
  {
    id: "powerlisting",
    name: "Superpower Wiki",
    domain: "powerlisting.fandom.com",
    hub: "Powers",
  },
  { id: "dc", name: "DC Comics Wiki", domain: "dc.fandom.com", hub: "Comics" },
  {
    id: "marvel",
    name: "Marvel Database",
    domain: "marvel.fandom.com",
    hub: "Comics",
  },
  {
    id: "naruto",
    name: "Narutopedia",
    domain: "naruto.fandom.com",
    hub: "Anime",
  },
  {
    id: "dragonball",
    name: "Dragon Ball Wiki",
    domain: "dragonball.fandom.com",
    hub: "Anime",
  },
  {
    id: "onepiece",
    name: "One Piece Wiki",
    domain: "onepiece.fandom.com",
    hub: "Anime",
  },
  {
    id: "bleach",
    name: "Bleach Wiki",
    domain: "bleach.fandom.com",
    hub: "Anime",
  },
  {
    id: "mha",
    name: "My Hero Academia Wiki",
    domain: "myheroacademia.fandom.com",
    hub: "Anime",
  },
  {
    id: "jjk",
    name: "Jujutsu Kaisen Wiki",
    domain: "jujutsu-kaisen.fandom.com",
    hub: "Anime",
  },
  {
    id: "fairytail",
    name: "Fairy Tail Wiki",
    domain: "fairytail.fandom.com",
    hub: "Anime",
  },
  {
    id: "hunterxhunter",
    name: "Hunter x Hunter Wiki",
    domain: "hunterxhunter.fandom.com",
    hub: "Anime",
  },
  {
    id: "hazbinhotel",
    name: "Hazbin Hotel Wiki",
    domain: "hazbinhotel.fandom.com",
    hub: "Animation",
  },
  {
    id: "helluvaboss",
    name: "Helluva Boss Wiki",
    domain: "helluvaboss.fandom.com",
    hub: "Animation",
  },
  {
    id: "starwars",
    name: "Star Wars Wiki",
    domain: "starwars.fandom.com",
    hub: "Film",
  },
  {
    id: "harrypotter",
    name: "Harry Potter Wiki",
    domain: "harrypotter.fandom.com",
    hub: "Film",
  },
  {
    id: "lotr",
    name: "Lord of the Rings Wiki",
    domain: "lotr.fandom.com",
    hub: "Film",
  },
  {
    id: "doctorwho",
    name: "Doctor Who Wiki",
    domain: "tardis.fandom.com",
    hub: "TV",
  },
  {
    id: "supernatural",
    name: "Supernatural Wiki",
    domain: "supernatural.fandom.com",
    hub: "TV",
  },
  {
    id: "finalfantasy",
    name: "Final Fantasy Wiki",
    domain: "finalfantasy.fandom.com",
    hub: "Gaming",
  },
  {
    id: "elderscrolls",
    name: "Elder Scrolls Wiki",
    domain: "elderscrolls.fandom.com",
    hub: "Gaming",
  },
  {
    id: "godofwar",
    name: "God of War Wiki",
    domain: "godofwar.fandom.com",
    hub: "Mythology",
  },
  {
    id: "mythology",
    name: "Mythology Wiki",
    domain: "mythology.fandom.com",
    hub: "Mythology",
  },
  {
    id: "yokai",
    name: "Yokai Wiki",
    domain: "yokai.fandom.com",
    hub: "Mythology",
  },
  {
    id: "scp",
    name: "SCP Foundation Wiki",
    domain: "scp-wiki.wikidot.com",
    hub: "Mythology",
  },
  {
    id: "ghostpedia",
    name: "Ghostpedia (The Band Ghost)",
    domain: "thebandghost.fandom.com",
    hub: "Music",
  },
  { id: "dune", name: "Dune Wiki", domain: "dune.fandom.com", hub: "Film" },
  {
    id: "witcher",
    name: "The Witcher Wiki",
    domain: "witcher.fandom.com",
    hub: "Gaming",
  },
  {
    id: "fate",
    name: "Fate Wiki",
    domain: "typemoon.fandom.com",
    hub: "Anime",
  },
  {
    id: "evangelion",
    name: "Evangelion Wiki",
    domain: "evangelion.fandom.com",
    hub: "Anime",
  },
  {
    id: "darksouls",
    name: "Dark Souls Wiki",
    domain: "darksouls.fandom.com",
    hub: "Gaming",
  },
];

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function chatSearchWiki(
  wiki: WikiInfo,
  query: string,
): Promise<WikiResult[]> {
  if (wiki.domain.includes("wikidot")) return [];
  const base = `https://${wiki.domain}/api.php`;
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    srlimit: "5",
    srnamespace: "0",
    srprop: "snippet|titlesnippet",
    srsort: "relevance",
    format: "json",
    origin: "*",
  });
  try {
    const res = await fetch(`${base}?${params.toString()}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.query?.search ?? []).map(
      (item: { title: string; snippet?: string }) => ({
        title: item.title,
        snippet: stripHtml(item.snippet ?? ""),
        url: `https://${wiki.domain}/wiki/${encodeURIComponent(item.title.replace(/ /g, "_"))}`,
        wikiName: wiki.name,
        wikiDomain: wiki.domain,
      }),
    );
  } catch {
    return [];
  }
}

async function chatSearchAllWikis(
  query: string,
  wikis: WikiInfo[],
): Promise<WikiResult[]> {
  const all = await Promise.allSettled(
    wikis.map((w) => chatSearchWiki(w, query)),
  );
  const results: WikiResult[] = [];
  for (const r of all) {
    if (r.status === "fulfilled") results.push(...r.value);
  }
  const seen = new Set<string>();
  return results
    .filter((r) => {
      const key = `${r.wikiDomain}::${r.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      if (/^(category|file|template|talk|user|help):/i.test(r.title))
        return false;
      if (/\bvol\.?\s*\d+\b/i.test(r.title)) return false;
      return true;
    })
    .sort((a, b) => {
      const q = query.toLowerCase();
      const scoreA = a.title.toLowerCase().startsWith(q)
        ? 2
        : a.title.toLowerCase().includes(q)
          ? 1
          : 0;
      const scoreB = b.title.toLowerCase().startsWith(q)
        ? 2
        : b.title.toLowerCase().includes(q)
          ? 1
          : 0;
      return scoreB - scoreA;
    })
    .slice(0, 20);
}

// ─── Rule-based fallback responses ───────────────────────────────────────────

function generateRuleBasedResponse(bot: BotDef, message: string): string {
  const lower = message.toLowerCase();

  const subliminalTips = [
    "layer your affirmations at multiple speeds — slow for deep absorption, fast for subconscious saturation.",
    "the 528Hz frequency (Solfeggio) resonates with transformation and DNA repair, ideal for healing subliminals.",
    "identity-level affirmations ('I AM') bypass resistance more effectively than desire-based ones ('I want').",
    "repetition density matters: 900+ affirmations per session creates genuine subconscious saturation.",
    "pair your subliminal with theta brainwave frequencies (4–8 Hz) for maximum absorption during relaxed states.",
    "use the Booster function to amplify every affirmation with intensity layers that lock in new identity beliefs.",
    "protection affirmations at the start of a batch create a clear energetic container for the work.",
  ];

  const manifestationTips = [
    "live in the end — feel the wish fulfilled NOW, not as a future desire but as a present reality.",
    "scripting works best written in past or present tense, as if the manifestation has already occurred.",
    "SATS (State Akin to Sleep) is the most powerful time to impress the subconscious with your desired reality.",
    "revision is Neville Goddard's technique: mentally rewrite past events to align with your desired state.",
    "your imagination is your true creative power — the outer world is a projection of inner assumptions.",
    "persist in your new story even when current circumstances seem to contradict it. That's normal.",
  ];

  const spiritualTips = [
    "your chakras function as energy centers — when the root is clear, everything above flows with greater ease.",
    "shadow work isn't about darkness — it's about integrating rejected parts of yourself into wholeness.",
    "the Third Eye opens gradually through meditation, silence, and honest self-examination.",
    "entities and deities exist in relation to your belief and attention — intention is the key.",
    "the aura is electromagnetic and responds to your emotional and mental states in real time.",
    "inner child work reconnects you to your core needs and dissolves adult-level resistance.",
  ];

  const kinesisTips = [
    "psychic ability development starts with expanding sensory awareness beyond the physical.",
    "telekinesis training begins with micro-movement exercises and deep intentional focus states.",
    "biokinesis works through sustained visualization of cellular-level change, combined with belief and frequency.",
    "electrokinesis connects to your body's bioelectric field — meditation on the hands builds sensitivity.",
    "energy projection (aerokinesis, pyrokinesis equivalents) begins with feeling your own energy field.",
    "the nervous system is the bridge between intention and manifestation — regulate it to access deeper states.",
  ];

  if (bot.id === "subliminal-guide") {
    const topicMatch = lower.match(
      /\b(confidence|wealth|love|beauty|health|power|strength|success|abundance|healing|protection|transformation|manifest)\b/,
    );
    if (topicMatch) {
      const topic = topicMatch[1];
      return `For **${topic}** subliminals, I recommend these affirmation angles:\n\n• Identity fusion: "I am the embodiment of ${topic}"\n• My's layer: "My presence radiates ${topic} in every direction"\n• Power absolute: "It is safe for me to fully receive ${topic}"\n• Booster line: "My ${topic} is permanent, inevitable, and expanding now"\n\nWith **Chakra Alignment** active, pair this with the Solar Plexus for personal power, or the Heart chakra for love-based manifestation. Enable the **Booster** to stack intensity layers that make each affirmation hit at identity level. Would you like me to suggest a frequency pairing?`;
    }
    const tip =
      subliminalTips[Math.floor(Math.random() * subliminalTips.length)];
    return `That's a powerful intention. In subliminal science, remember to ${tip}\n\nFor best results in Synapse Studio, try enabling all three core functions: **Booster** (intensity), **Protection** (energetic grounding), and **Chakra Alignment** (frequency matching). What specific topic or transformation are you working on?`;
  }

  if (bot.id === "manifestation-coach") {
    if (
      lower.includes("how") ||
      lower.includes("help") ||
      lower.includes("manifest")
    ) {
      return `The foundation of manifestation is simple but requires discipline: **assume the feeling of the wish fulfilled**.\n\nHere's your practical roadmap:\n\n1. **Define the end state** — What does your life look, feel, and sound like after the manifestation?\n2. **Script it** — Write 1-2 paragraphs in past tense as if it's already happened\n3. **SATS practice** — In the hypnagogic state (between waking and sleep), replay a short scene confirming your desire is real\n4. **Persist without checking** — Don't look for signs. Just live from the assumption.\n\n${manifestationTips[Math.floor(Math.random() * manifestationTips.length)]}\n\nWhat specifically are you trying to manifest?`;
    }
    const tip =
      manifestationTips[Math.floor(Math.random() * manifestationTips.length)];
    return `I AM here to support your reality creation. Remember: ${tip}\n\nThe Synapse Studio subliminal generator is a powerful companion to manifestation work — use it to saturate your subconscious with the exact state you're assuming. What are you working to bring into reality?`;
  }

  if (bot.id === "spiritual-advisor") {
    if (lower.includes("chakra")) {
      return `Chakra work is profound when approached with patience and honesty. Each center holds both a gift and a wound:\n\n🔴 **Root** — Safety, survival, belonging\n🟠 **Sacral** — Creativity, pleasure, flow\n🟡 **Solar Plexus** — Power, will, identity\n💚 **Heart** — Love, compassion, connection\n💙 **Throat** — Truth, expression, communication\n👁️ **Third Eye** — Intuition, vision, inner knowing\n👑 **Crown** — Unity, divine connection, transcendence\n\nFor subliminal work, I recommend selecting the chakras most aligned with your intention in Synapse Studio's Chakra Alignment module.\n\n${spiritualTips[Math.floor(Math.random() * spiritualTips.length)]}\n\nWhich center are you called to work with?`;
    }
    const tip = spiritualTips[Math.floor(Math.random() * spiritualTips.length)];
    return `From a spiritual perspective, ${tip}\n\nYour energy field is responsive to intention, sound, and belief. The subliminals you create in Synapse Studio act as direct transmissions to your subconscious and energetic body. What area of your spiritual path would you like to explore?`;
  }

  if (bot.id === "entity-channeler") {
    if (
      lower.includes("character") ||
      lower.includes("fictional") ||
      lower.includes("manifest")
    ) {
      return `Fictional character manifestation is one of the most powerful applications of Fantasy-to-Reality technology.\n\nThe process:\n\n1. **Establish the energetic signature** — Every character has a unique frequency. Hold their essence in mind with clarity\n2. **Create the bridge** — Use the Character Manifestation function in Synapse Studio with their name and source\n3. **Set the location and time frame** — Specificity accelerates manifestation\n4. **Affirm the bond** — If it's a symbiotic relationship (like a Klyntar), use the Symbiotic Bond function\n\nEntities from any reality can be called — the multiverse is far more permeable than mainstream belief allows. What entity or character are you working to bring through?`;
    }
    return `The veil between realities is thinner than it appears. Every entity, deity, and character that has ever been conceived exists somewhere in the vast fabric of consciousness.\n\nTo establish contact:\n• Hold their image clearly in your mind\n• Speak to them with respect and clear intention\n• Use subliminals that affirm their presence and the bond between you\n\nSynapse Studio's Fantasy-to-Reality function was specifically designed for this work. Enable it, enter the entity's name and source, and let the affirmations build the bridge.\n\nWho are you reaching toward?`;
  }

  if (bot.id === "kinesis-mentor") {
    const kinesisMatch = lower.match(
      /\b(telekinesis|pyrokinesis|electrokinesis|biokinesis|aerokinesis|hydrokinesis|geokinesis|chronokinesis|photokinesis|umbrakinesis|cryokinesis|gravito|lunakinesis)\b/,
    );
    if (kinesisMatch) {
      const kinesis = kinesisMatch[1];
      return `**${kinesis.charAt(0).toUpperCase() + kinesis.slice(1)}** development is a real path for those willing to do the inner work.\n\nCore training protocol:\n\n1. **Nervous system regulation** — Your body must be in a calm, expanded state to access deeper capacities\n2. **Sensory expansion** — Practice feeling the energy field around your hands before attempting external influence\n3. **Intentional focus states** — 20+ minute daily meditation sessions specifically visualizing the ability in action\n4. **Subliminal reinforcement** — Use Synapse Studio to create a dedicated ${kinesis} subliminal with Booster + Chakra Alignment\n5. **Document micro-results** — Progress is often subtle at first. Notice everything.\n\n${kinesisTips[Math.floor(Math.random() * kinesisTips.length)]}\n\nWhat's your current practice level?`;
    }
    const tip = kinesisTips[Math.floor(Math.random() * kinesisTips.length)];
    return `As your Kinesis Mentor, I can confirm: ${tip}\n\nThe most important thing to understand is that these abilities exist on a spectrum — everyone has latent capacities that can be developed through consistent inner work, frequency work, and subconscious programming.\n\nSynapse Studio's generator is one of the most effective tools for this — create a dedicated subliminal for any ability you're developing. What specific ability or psychic development are you working on?`;
  }

  if (bot.id === "wiki-oracle") {
    return `I have access to 150+ Fandom wikis across anime, comics, gaming, mythology, TV, film, and more.\n\nTo search: just ask me about any character, power, or ability. For example:\n• "Tell me about Gojo Satoru's abilities"\n• "What powers does Scarlet Witch have?"\n• "Explain telekinesis from the Superpower Wiki"\n\nI'll pull the relevant wiki data and show you how to use it for subliminal creation. Use the **Wiki Search** bar above to search for context, then attach it to our conversation.\n\nWhat would you like to explore?`;
  }

  // Custom bot fallback
  return `I'm here to help you with ${bot.tagline.toLowerCase()}. Your question resonates with deep potential.\n\nTo get the most from our conversation, feel free to be specific about what you're working on. I can help you craft affirmations, understand concepts, and connect your intentions to powerful subliminal creation strategies in Synapse Studio.\n\nWhat would you like to explore?`;
}

// ─── AI Call ──────────────────────────────────────────────────────────────────

async function callAI(
  config: AIConfig,
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  if (config.provider === "groq" && config.apiKey) {
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
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
        max_tokens: 600,
        temperature: 0.85,
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  }

  if (config.provider === "gemini" && config.apiKey) {
    const contents = [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }],
      },
    ];
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model || "gemini-1.5-flash"}:generateContent?key=${config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: 600, temperature: 0.85 },
        }),
      },
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;
  }

  // Rule-based fallback — find the bot def
  return "";
}

// ─── Color helpers ────────────────────────────────────────────────────────────

function getBotColorClass(color: string): string {
  const map: Record<string, string> = {
    primary: "border-primary/50 bg-primary/10",
    accent: "border-accent/50 bg-accent/10",
    violet: "border-violet-500/50 bg-violet-500/10",
    rose: "border-rose-500/50 bg-rose-500/10",
    amber: "border-amber-500/50 bg-amber-500/10",
    cyan: "border-cyan-500/50 bg-cyan-500/10",
    emerald: "border-emerald-500/50 bg-emerald-500/10",
  };
  return map[color] ?? "border-primary/50 bg-primary/10";
}

function getBotTextClass(color: string): string {
  const map: Record<string, string> = {
    primary: "text-primary",
    accent: "text-accent",
    violet: "text-violet-400",
    rose: "text-rose-400",
    amber: "text-amber-400",
    cyan: "text-cyan-400",
    emerald: "text-emerald-400",
  };
  return map[color] ?? "text-primary";
}

function getBotGradient(color: string): string {
  const map: Record<string, string> = {
    primary: "from-primary/20 via-primary/5 to-transparent",
    accent: "from-accent/20 via-accent/5 to-transparent",
    violet: "from-violet-500/20 via-violet-500/5 to-transparent",
    rose: "from-rose-500/20 via-rose-500/5 to-transparent",
    amber: "from-amber-500/20 via-amber-500/5 to-transparent",
    cyan: "from-cyan-500/20 via-cyan-500/5 to-transparent",
    emerald: "from-emerald-500/20 via-emerald-500/5 to-transparent",
  };
  return map[color] ?? "from-primary/20 via-primary/5 to-transparent";
}

// ─── Emoji picker options ─────────────────────────────────────────────────────

const EMOJI_OPTIONS = [
  "🌙",
  "⭐",
  "💫",
  "🔥",
  "💎",
  "👑",
  "🦋",
  "🌊",
  "🌸",
  "🍀",
  "🐉",
  "🦅",
  "🌺",
  "🎭",
  "🔮",
  "🛡️",
  "⚔️",
  "🌠",
  "🎯",
  "🧬",
];

const COLOR_OPTIONS = [
  { value: "primary", label: "Violet" },
  { value: "accent", label: "Cyan" },
  { value: "violet", label: "Purple" },
  { value: "rose", label: "Rose" },
  { value: "amber", label: "Amber" },
  { value: "emerald", label: "Emerald" },
];

// ─── Config helper (outside component — no deps) ─────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatBotsPage({
  onUseForSubliminal,
}: ChatBotsPageProps) {
  const [customBots, setCustomBots] = useState<BotDef[]>(() => {
    try {
      const stored = localStorage.getItem("synapse_custom_bots");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const allBots = [...PRESET_BOTS, ...customBots];

  const [activeBotId, setActiveBotId] = useState<string>(PRESET_BOTS[0].id);
  const activeBot = allBots.find((b) => b.id === activeBotId) ?? PRESET_BOTS[0];

  // Chat histories keyed by bot id
  const [chatHistories, setChatHistories] = useState<
    Record<string, ChatMessage[]>
  >({});
  const currentHistory = chatHistories[activeBotId] ?? [];

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Wiki context (for wiki-linked bots)
  const [wikiQuery, setWikiQuery] = useState("");
  const [wikiResults, setWikiResults] = useState<WikiResult[]>([]);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiSearchOpen, setWikiSearchOpen] = useState(false);
  const [wikiContext, setWikiContext] = useState<WikiResult | null>(null);

  // Custom bot creator
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState("🌙");
  const [newPersonality, setNewPersonality] = useState("");
  const [newLinkedWiki, setNewLinkedWiki] = useState("none");
  const [newColor, setNewColor] = useState("primary");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const historyLength = currentHistory.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: ref mutation is intentional
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historyLength]);

  // Persist custom bots
  useEffect(() => {
    localStorage.setItem("synapse_custom_bots", JSON.stringify(customBots));
  }, [customBots]);

  const handleSend = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    // Build user message with optional wiki context
    let fullUserMessage = trimmed;
    if (wikiContext) {
      fullUserMessage += `\n\n[WIKI CONTEXT: ${wikiContext.title} from ${wikiContext.wikiName}]\n${wikiContext.snippet}`;
    }

    const userMsg: ChatMessage = {
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    setChatHistories((prev) => ({
      ...prev,
      [activeBotId]: [...(prev[activeBotId] ?? []), userMsg],
    }));

    setInputValue("");
    setWikiContext(null);
    setIsLoading(true);

    try {
      const config = getAIConfig();
      let responseText = "";

      if (config.provider !== "rule-based" && config.apiKey) {
        try {
          responseText = await callAI(
            config,
            activeBot.systemPrompt,
            currentHistory,
            fullUserMessage,
          );
        } catch (err) {
          console.warn("AI call failed, falling back to rule-based:", err);
          responseText = generateRuleBasedResponse(activeBot, trimmed);
        }
      } else {
        // Slight delay for feel
        await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
        responseText = generateRuleBasedResponse(activeBot, trimmed);
      }

      const botMsg: ChatMessage = {
        role: "assistant",
        content: responseText,
        timestamp: Date.now(),
      };
      setChatHistories((prev) => ({
        ...prev,
        [activeBotId]: [...(prev[activeBotId] ?? []), userMsg, botMsg],
      }));
    } catch {
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [
    inputValue,
    isLoading,
    activeBotId,
    activeBot,
    currentHistory,
    wikiContext,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleWikiSearch = useCallback(async () => {
    if (!wikiQuery.trim()) return;
    setWikiLoading(true);
    setWikiResults([]);
    try {
      const wikisToSearch =
        activeBot.linkedWiki === "all"
          ? CHAT_WIKIS
          : CHAT_WIKIS.filter(
              (w) => w.domain === activeBot.linkedWiki || w.hub === "Powers",
            );
      const results = await chatSearchAllWikis(
        wikiQuery,
        wikisToSearch.length > 0 ? wikisToSearch : CHAT_WIKIS,
      );
      setWikiResults(results);
    } catch {
      toast.error("Wiki search failed.");
    } finally {
      setWikiLoading(false);
    }
  }, [wikiQuery, activeBot.linkedWiki]);

  const handleSaveBot = () => {
    if (!newName.trim()) {
      toast.error("Bot name is required.");
      return;
    }
    if (!newPersonality.trim()) {
      toast.error("Personality / system prompt is required.");
      return;
    }

    const id = `custom-${Date.now()}`;
    const bot: BotDef = {
      id,
      name: newName.trim(),
      avatar: newAvatar,
      tagline:
        newPersonality.slice(0, 60) + (newPersonality.length > 60 ? "..." : ""),
      color: newColor,
      systemPrompt: newPersonality.trim(),
      linkedWiki: newLinkedWiki === "none" ? undefined : newLinkedWiki,
      isCustom: true,
    };
    setCustomBots((prev) => [...prev, bot]);
    setActiveBotId(id);
    setCreatorOpen(false);
    setNewName("");
    setNewPersonality("");
    setNewLinkedWiki("none");
    setNewColor("primary");
    setNewAvatar("🌙");
    toast.success(`${bot.name} created!`);
  };

  const handleDeleteBot = (id: string) => {
    setCustomBots((prev) => prev.filter((b) => b.id !== id));
    if (activeBotId === id) setActiveBotId(PRESET_BOTS[0].id);
    toast.success("Bot deleted.");
  };

  const handleUseMessage = (content: string) => {
    const topic = content.replace(/\*\*/g, "").slice(0, 200);
    onUseForSubliminal?.(topic);
    toast.success("Sent to generator!");
  };

  const hasWikiAccess = activeBot.linkedWiki !== undefined;

  return (
    <div className="container max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center glow-primary">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl gradient-text">
              Chat Bots
            </h1>
            <p className="text-muted-foreground text-sm">
              AI companions for subliminal creation, manifestation & spiritual
              guidance
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-220px)] min-h-[600px]">
        {/* ── Left panel: Bot roster ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:w-80 xl:w-96 flex flex-col gap-3 shrink-0"
        >
          {/* Roster list */}
          <div className="glass-card rounded-2xl border border-border/40 overflow-hidden flex flex-col flex-1">
            <div className="px-4 py-3 border-b border-border/40">
              <h2 className="font-heading font-semibold text-sm text-foreground/80 tracking-wide uppercase">
                AI Companions
              </h2>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {allBots.map((bot) => {
                  const isActive = bot.id === activeBotId;
                  return (
                    <motion.button
                      key={bot.id}
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setActiveBotId(bot.id)}
                      data-ocid="chatbots.bot.button"
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group relative
                        ${
                          isActive
                            ? `${getBotColorClass(bot.color)} border`
                            : "hover:bg-secondary/40 border border-transparent"
                        }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 border transition-all
                        ${isActive ? "border-current/30 shadow-lg" : "border-border/30 bg-secondary/30"}`}
                      >
                        {bot.avatar}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-heading font-semibold text-sm ${isActive ? getBotTextClass(bot.color) : "text-foreground"}`}
                          >
                            {bot.name}
                          </span>
                          {bot.isCustom && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-4 px-1 border-border/60 text-muted-foreground"
                            >
                              Custom
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {bot.tagline}
                        </p>
                        {bot.linkedWiki && (
                          <div className="flex items-center gap-1 mt-1">
                            <Globe className="w-2.5 h-2.5 text-muted-foreground/60" />
                            <span className="text-[10px] text-muted-foreground/60 truncate">
                              {bot.linkedWiki === "all"
                                ? "All wikis"
                                : bot.linkedWiki.split(".")[0]}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <div
                          className={`w-1.5 h-8 rounded-full shrink-0 ${getBotTextClass(bot.color).replace("text-", "bg-")}`}
                        />
                      )}

                      {/* Delete button for custom bots */}
                      {bot.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBot(bot.id);
                          }}
                          data-ocid="chatbots.bot.delete_button"
                          className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 w-6 h-6 rounded-md bg-destructive/10 hover:bg-destructive/30 flex items-center justify-center transition-all"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </button>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Create custom bot button */}
            <div className="p-3 border-t border-border/40">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all"
                onClick={() => setCreatorOpen((v) => !v)}
                data-ocid="chatbots.creator.open_modal_button"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Custom Bot
                {creatorOpen ? (
                  <ChevronUp className="w-3 h-3 ml-auto" />
                ) : (
                  <ChevronDown className="w-3 h-3 ml-auto" />
                )}
              </Button>
            </div>
          </div>

          {/* Custom bot creator (collapsible) */}
          <AnimatePresence>
            {creatorOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="glass-card rounded-2xl border border-primary/20 p-4 space-y-4">
                  <h3 className="font-heading font-semibold text-sm gradient-text">
                    New Custom Bot
                  </h3>

                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Name
                    </Label>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="My Custom Bot"
                      className="h-8 text-sm bg-secondary/30 border-border/40"
                      data-ocid="chatbots.creator.input"
                    />
                  </div>

                  {/* Avatar picker */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Avatar
                    </Label>
                    <div className="grid grid-cols-10 gap-1">
                      {EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setNewAvatar(emoji)}
                          className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all
                            ${newAvatar === emoji ? "bg-primary/20 border border-primary/50 scale-110" : "bg-secondary/30 hover:bg-secondary/50 border border-transparent"}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Personality */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Personality & Expertise
                    </Label>
                    <Textarea
                      value={newPersonality}
                      onChange={(e) => setNewPersonality(e.target.value)}
                      placeholder="Describe your bot's personality, expertise, and communication style..."
                      className="text-sm bg-secondary/30 border-border/40 min-h-[80px] resize-none"
                      data-ocid="chatbots.creator.textarea"
                    />
                  </div>

                  {/* Linked wiki */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Linked Wiki (optional)
                    </Label>
                    <Select
                      value={newLinkedWiki}
                      onValueChange={setNewLinkedWiki}
                    >
                      <SelectTrigger
                        className="h-8 text-sm bg-secondary/30 border-border/40"
                        data-ocid="chatbots.creator.select"
                      >
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {CHAT_WIKIS.slice(0, 30).map((w) => (
                          <SelectItem key={w.id} value={w.domain}>
                            {w.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Color */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Color
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setNewColor(c.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all border
                            ${
                              newColor === c.value
                                ? `${getBotColorClass(c.value)} ${getBotTextClass(c.value)} border-current/50`
                                : "bg-secondary/30 text-muted-foreground border-border/40 hover:bg-secondary/50"
                            }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={handleSaveBot}
                      data-ocid="chatbots.creator.submit_button"
                    >
                      <Bot className="w-3.5 h-3.5 mr-1.5" />
                      Create Bot
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-border/40"
                      onClick={() => setCreatorOpen(false)}
                      data-ocid="chatbots.creator.cancel_button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Right panel: Chat window ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col glass-card rounded-2xl border border-border/40 overflow-hidden"
        >
          {/* Chat header */}
          <div
            className={`px-4 py-3 border-b border-border/40 bg-gradient-to-r ${getBotGradient(activeBot.color)}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl border ${getBotColorClass(activeBot.color)}`}
                >
                  {activeBot.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      className={`font-heading font-bold text-base ${getBotTextClass(activeBot.color)}`}
                    >
                      {activeBot.name}
                    </h2>
                    {activeBot.linkedWiki && (
                      <Badge
                        variant="outline"
                        className="text-[10px] h-4 px-1.5 border-border/60 text-muted-foreground gap-1"
                      >
                        <Globe className="w-2.5 h-2.5" />
                        {activeBot.linkedWiki === "all"
                          ? "Wiki Access"
                          : activeBot.linkedWiki.split(".")[0]}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activeBot.tagline}
                  </p>
                </div>
              </div>

              {/* Clear chat */}
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setChatHistories((prev) => ({ ...prev, [activeBotId]: [] }));
                  toast.success("Chat cleared.");
                }}
                data-ocid="chatbots.chat.delete_button"
              >
                Clear
              </Button>
            </div>

            {/* Config note */}
            {getAIConfig().provider === "rule-based" && (
              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground/70">
                <Sparkles className="w-3 h-3" />
                <span>
                  Rule-based mode — add an API key in Settings to enable AI
                  responses
                </span>
              </div>
            )}
          </div>

          {/* Wiki context bar (for wiki-linked bots) */}
          {hasWikiAccess && (
            <div className="px-4 py-2.5 border-b border-border/30 bg-secondary/10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWikiSearchOpen((v) => !v)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="chatbots.wiki.toggle"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {wikiSearchOpen
                    ? "Hide wiki search"
                    : "Search wiki for context..."}
                  {wikiSearchOpen ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
                {wikiContext && (
                  <div className="flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs text-primary">
                    <BookIcon className="w-3 h-3" />
                    <span className="truncate max-w-[160px]">
                      {wikiContext.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setWikiContext(null)}
                      className="hover:text-primary/60 transition-colors"
                      data-ocid="chatbots.wiki.close_button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {wikiSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 overflow-hidden"
                  >
                    <div className="flex gap-2">
                      <Input
                        value={wikiQuery}
                        onChange={(e) => setWikiQuery(e.target.value)}
                        placeholder="Search wikis..."
                        className="h-8 text-xs bg-secondary/30 border-border/40 flex-1"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleWikiSearch()
                        }
                        data-ocid="chatbots.wiki.search_input"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-border/40 shrink-0"
                        onClick={handleWikiSearch}
                        disabled={wikiLoading}
                        data-ocid="chatbots.wiki.button"
                      >
                        {wikiLoading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Search className="w-3 h-3" />
                        )}
                      </Button>
                    </div>

                    {wikiResults.length > 0 && (
                      <ScrollArea className="h-36 mt-2">
                        <div className="space-y-1">
                          {wikiResults.map((r) => (
                            <div
                              key={`${r.wikiDomain}-${r.title}`}
                              className="flex items-start gap-2 px-2.5 py-2 rounded-lg hover:bg-secondary/40 group"
                            >
                              <button
                                type="button"
                                className="flex-1 min-w-0 text-left"
                                onClick={() => {
                                  setWikiContext(r);
                                  setWikiSearchOpen(false);
                                  setWikiResults([]);
                                  setWikiQuery("");
                                }}
                              >
                                <p className="text-xs font-medium text-foreground truncate">
                                  {r.title}
                                </p>
                                <p className="text-[11px] text-muted-foreground truncate">
                                  {r.snippet}
                                </p>
                                <span className="text-[10px] text-muted-foreground/60">
                                  {r.wikiName}
                                </span>
                              </button>
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
                              >
                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Messages area */}
          <ScrollArea className="flex-1 px-4 py-4">
            {currentHistory.length === 0 && !isLoading ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full py-16 text-center"
                data-ocid="chatbots.chat.empty_state"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-4 border ${getBotColorClass(activeBot.color)}`}
                >
                  {activeBot.avatar}
                </div>
                <h3
                  className={`font-heading font-bold text-lg mb-1 ${getBotTextClass(activeBot.color)}`}
                >
                  {activeBot.name}
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  {activeBot.tagline}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-3 max-w-[240px]">
                  Ask anything — I'm here to help with your subliminal creation
                  journey.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {currentHistory.map((msg) => (
                    <motion.div
                      key={`${activeBotId}-${msg.timestamp}-${msg.role}`}
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-lg border mt-0.5
                        ${
                          msg.role === "user"
                            ? "bg-primary/20 border-primary/30"
                            : `${getBotColorClass(activeBot.color)}`
                        }`}
                      >
                        {msg.role === "user" ? "👤" : activeBot.avatar}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`flex flex-col gap-1 max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}
                      >
                        <span className="text-[10px] text-muted-foreground/60 px-1">
                          {msg.role === "user" ? "You" : activeBot.name}
                        </span>
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words
                          ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "glass-card border border-border/40 text-foreground rounded-tl-sm"
                          }`}
                        >
                          {formatMessageContent(msg.content)}
                        </div>

                        {/* Use in generator button (bot messages only) */}
                        {msg.role === "assistant" && onUseForSubliminal && (
                          <button
                            type="button"
                            onClick={() => handleUseMessage(msg.content)}
                            data-ocid="chatbots.message.button"
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                          >
                            <Wand2 className="w-2.5 h-2.5" />
                            Use in Generator
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                    data-ocid="chatbots.chat.loading_state"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-lg border ${getBotColorClass(activeBot.color)}`}
                    >
                      {activeBot.avatar}
                    </div>
                    <div className="glass-card border border-border/40 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-muted-foreground/60"
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 1.2,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input area */}
          <div className="px-4 py-3 border-t border-border/40 bg-background/40">
            {wikiContext && (
              <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary">
                <Globe className="w-3 h-3 shrink-0" />
                <span className="truncate flex-1">
                  Wiki context: <strong>{wikiContext.title}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setWikiContext(null)}
                  data-ocid="chatbots.context.close_button"
                >
                  <X className="w-3 h-3 hover:text-primary/60 transition-colors" />
                </button>
              </div>
            )}
            <div className="flex gap-2 items-end">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  // Auto-resize
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
                className="flex-1 resize-none min-h-[44px] max-h-[120px] bg-secondary/30 border-border/40 text-sm py-3 rounded-xl"
                rows={1}
                disabled={isLoading}
                data-ocid="chatbots.chat.textarea"
              />
              <Button
                size="icon"
                className="h-11 w-11 rounded-xl shrink-0"
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                data-ocid="chatbots.chat.submit_button"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

/**
 * Render simple markdown-like formatting:
 * - **bold** → <strong>
 * - bullet lines starting with • or - or *
 * - numbered lines
 */
function formatMessageContent(content: string): React.ReactNode {
  const lines = content.split("\n");
  return (
    <>
      {lines.map((line, lineIdx) => {
        // Bold text
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, partIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              // Index keys are safe here: static text fragments from splitting a string
              // biome-ignore lint/suspicious/noArrayIndexKey:
              <strong key={partIdx} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: text line index is stable
          <span key={lineIdx}>
            {rendered}
            {lineIdx < lines.length - 1 && <br />}
          </span>
        );
      })}
    </>
  );
}
