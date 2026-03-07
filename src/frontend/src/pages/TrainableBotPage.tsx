import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  ArrowUp,
  BookOpen,
  BookmarkPlus,
  Brain,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FlaskConical,
  Globe,
  Loader2,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Wand2,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { Bot, Memory } from "../backend.d";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrainableBotPageProps {
  onUseForSubliminal?: (topic: string) => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface AIConfig {
  provider: "rule-based" | "groq" | "gemini";
  model: string;
  apiKey: string;
}

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
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AVATAR_OPTIONS = [
  "🤖",
  "🧠",
  "🌙",
  "⭐",
  "💫",
  "🔥",
  "💎",
  "👑",
  "🦋",
  "🌊",
  "🌸",
  "🐉",
  "🦅",
  "🌺",
  "🎭",
  "🔮",
  "🛡️",
  "⚔️",
  "🌠",
  "💀",
  "🕯️",
  "🌑",
  "🦊",
  "🐺",
  "⚡",
  "🌀",
  "🔱",
  "👁️",
  "✨",
  "🌿",
];

const COLOR_OPTIONS = [
  {
    value: "violet",
    label: "Violet",
    classes: "border-violet-500/50 bg-violet-500/10",
    text: "text-violet-400",
    glow: "oklch(0.62 0.22 295)",
  },
  {
    value: "cyan",
    label: "Cyan",
    classes: "border-cyan-500/50 bg-cyan-500/10",
    text: "text-cyan-400",
    glow: "oklch(0.7 0.18 210)",
  },
  {
    value: "rose",
    label: "Rose",
    classes: "border-rose-500/50 bg-rose-500/10",
    text: "text-rose-400",
    glow: "oklch(0.62 0.22 25)",
  },
  {
    value: "amber",
    label: "Amber",
    classes: "border-amber-500/50 bg-amber-500/10",
    text: "text-amber-400",
    glow: "oklch(0.65 0.2 48)",
  },
  {
    value: "emerald",
    label: "Emerald",
    classes: "border-emerald-500/50 bg-emerald-500/10",
    text: "text-emerald-400",
    glow: "oklch(0.62 0.2 145)",
  },
  {
    value: "pink",
    label: "Pink",
    classes: "border-pink-500/50 bg-pink-500/10",
    text: "text-pink-400",
    glow: "oklch(0.65 0.22 330)",
  },
];

const LINKED_WIKI_OPTIONS = [
  { value: "none", label: "None" },
  { value: "powerlisting.fandom.com", label: "Superpower Wiki" },
  { value: "naruto.fandom.com", label: "Narutopedia" },
  { value: "dragonball.fandom.com", label: "Dragon Ball Wiki" },
  { value: "marvel.fandom.com", label: "Marvel Database" },
  { value: "dc.fandom.com", label: "DC Comics Wiki" },
  { value: "onepiece.fandom.com", label: "One Piece Wiki" },
  { value: "bleach.fandom.com", label: "Bleach Wiki" },
  { value: "myheroacademia.fandom.com", label: "MHA Wiki" },
  { value: "jujutsu-kaisen.fandom.com", label: "JJK Wiki" },
  { value: "tardis.fandom.com", label: "Doctor Who Wiki" },
  { value: "harrypotter.fandom.com", label: "Harry Potter Wiki" },
  { value: "starwars.fandom.com", label: "Star Wars Wiki" },
  { value: "elderscrolls.fandom.com", label: "Elder Scrolls Wiki" },
  { value: "finalfantasy.fandom.com", label: "Final Fantasy Wiki" },
  { value: "kingdomhearts.fandom.com", label: "Kingdom Hearts Wiki" },
  { value: "zelda.fandom.com", label: "Zelda Wiki" },
];

const QUICK_TRAIN_PRESETS = [
  "Prefer 528Hz for healing subliminals",
  "My name is [your name here]",
  "Focus on abundance and wealth themes",
  "Use empowering 'I AM' language always",
  "I am interested in spiritual growth",
  "I practice chakra alignment daily",
  "My goal is to manifest physical abilities",
  "Always include protection affirmations",
];

const TRAINABLE_WIKIS: WikiInfo[] = [
  {
    id: "powerlisting",
    name: "Superpower Wiki",
    domain: "powerlisting.fandom.com",
  },
  { id: "naruto", name: "Narutopedia", domain: "naruto.fandom.com" },
  {
    id: "dragonball",
    name: "Dragon Ball Wiki",
    domain: "dragonball.fandom.com",
  },
  { id: "marvel", name: "Marvel Database", domain: "marvel.fandom.com" },
  { id: "dc", name: "DC Comics Wiki", domain: "dc.fandom.com" },
  { id: "onepiece", name: "One Piece Wiki", domain: "onepiece.fandom.com" },
  { id: "bleach", name: "Bleach Wiki", domain: "bleach.fandom.com" },
  { id: "mha", name: "MHA Wiki", domain: "myheroacademia.fandom.com" },
  { id: "jjk", name: "JJK Wiki", domain: "jujutsu-kaisen.fandom.com" },
  { id: "fairytail", name: "Fairy Tail Wiki", domain: "fairytail.fandom.com" },
  { id: "doctorwho", name: "Doctor Who Wiki", domain: "tardis.fandom.com" },
  {
    id: "harrypotter",
    name: "Harry Potter Wiki",
    domain: "harrypotter.fandom.com",
  },
  { id: "starwars", name: "Star Wars Wiki", domain: "starwars.fandom.com" },
  {
    id: "elderscrolls",
    name: "Elder Scrolls Wiki",
    domain: "elderscrolls.fandom.com",
  },
  {
    id: "finalfantasy",
    name: "Final Fantasy Wiki",
    domain: "finalfantasy.fandom.com",
  },
  {
    id: "hazbinhotel",
    name: "Hazbin Hotel Wiki",
    domain: "hazbinhotel.fandom.com",
  },
  { id: "mythology", name: "Mythology Wiki", domain: "mythology.fandom.com" },
  {
    id: "helluvaboss",
    name: "Helluva Boss Wiki",
    domain: "helluvaboss.fandom.com",
  },
  {
    id: "evangelion",
    name: "Evangelion Wiki",
    domain: "evangelion.fandom.com",
  },
  { id: "darksouls", name: "Dark Souls Wiki", domain: "darksouls.fandom.com" },
];

// ─── Wiki utilities ───────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function searchWiki(
  wiki: WikiInfo,
  query: string,
  limit = 5,
): Promise<WikiResult[]> {
  const base = `https://${wiki.domain}/api.php`;
  const params = new URLSearchParams({
    action: "query",
    list: "search",
    srsearch: query,
    srlimit: String(limit),
    srnamespace: "0",
    srprop: "snippet|titlesnippet",
    srsort: "relevance",
    format: "json",
    origin: "*",
  });
  try {
    const res = await fetch(`${base}?${params}`);
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

async function searchMultipleWikis(
  wikis: WikiInfo[],
  query: string,
): Promise<WikiResult[]> {
  const all = await Promise.allSettled(wikis.map((w) => searchWiki(w, query)));
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
    .slice(0, 15);
}

// ─── AI Config ────────────────────────────────────────────────────────────────

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

// ─── AI Call with memory context ──────────────────────────────────────────────

async function callTrainableAI(
  config: AIConfig,
  enrichedSystemPrompt: string,
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const last8 = history.slice(-8);

  if (config.provider === "groq" && config.apiKey) {
    const messages = [
      { role: "system", content: enrichedSystemPrompt },
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
        max_tokens: 700,
        temperature: 0.85,
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.choices[0].message.content;
  }

  if (config.provider === "gemini" && config.apiKey) {
    const contextText = `${enrichedSystemPrompt}\n\nUser: ${userMessage}`;
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${config.model || "gemini-1.5-flash"}:generateContent?key=${config.apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: contextText }] }],
          generationConfig: { maxOutputTokens: 700, temperature: 0.85 },
        }),
      },
    );
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;
  }

  return "";
}

// ─── Rule-based fallback with memory weaving ──────────────────────────────────

function generateMemoryAwareResponse(
  _bot: Bot,
  message: string,
  memories: Memory[],
): string {
  const lower = message.toLowerCase();

  // Pick a relevant memory if available
  const relevantMem = memories.find((m) =>
    lower
      .split(" ")
      .some(
        (word) => word.length > 4 && m.content.toLowerCase().includes(word),
      ),
  );

  const memoryRef = relevantMem
    ? `I remember you mentioned: "${relevantMem.content.slice(0, 80)}${relevantMem.content.length > 80 ? "..." : ""}". `
    : "";

  const defaultResponses = [
    `${memoryRef}I'm learning and growing with each conversation. Tell me more about what you'd like to work on — I'll use that to shape my understanding and help you build powerful subliminals.`,
    `${memoryRef}Based on what I know about you, I think we can create something deeply aligned with your intentions. What aspect would you like to explore further?`,
    `${memoryRef}Every piece of information you share helps me serve you better. What specific transformation or manifestation are you working toward right now?`,
    `${memoryRef}My understanding of your path grows with each message. To give you the most personalized guidance, tell me what you're focused on right now — and I'll connect it to everything I know about you.`,
  ];

  if (lower.includes("subliminal") || lower.includes("affirmation")) {
    return `${memoryRef}For a powerful subliminal, I'd recommend starting with your core intention and layering it with identity-level affirmations. Enable **Booster** mode for intensity, **Chakra Alignment** for frequency matching, and **Protection** to ground the energetic container. What's the main theme you want to program into your subconscious?`;
  }

  if (lower.includes("manifest") || lower.includes("reality")) {
    return `${memoryRef}Reality responds to the dominant assumptions you hold — not wishes, but settled convictions. The subliminals we build together are designed to install exactly those convictions at the deepest level of your subconscious. What are you most focused on manifesting right now?`;
  }

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// ─── Color helpers ────────────────────────────────────────────────────────────

function getColorDef(colorValue: string) {
  return COLOR_OPTIONS.find((c) => c.value === colorValue) ?? COLOR_OPTIONS[0];
}

// ─── Memory type badge ────────────────────────────────────────────────────────

function MemoryTypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    conversation: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    training: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    wiki: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    feedback: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  };
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${map[type] ?? "bg-secondary/50 text-muted-foreground border-border/40"}`}
    >
      {type}
    </span>
  );
}

// ─── Sentiment dot ────────────────────────────────────────────────────────────

function SentimentDot({ sentiment }: { sentiment: bigint }) {
  if (sentiment === 1n)
    return (
      <span
        className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0"
        title="Positive"
      />
    );
  if (sentiment === -1n)
    return (
      <span
        className="w-2 h-2 rounded-full bg-rose-400 inline-block shrink-0"
        title="Negative"
      />
    );
  return (
    <span
      className="w-2 h-2 rounded-full bg-muted-foreground/40 inline-block shrink-0"
      title="Neutral"
    />
  );
}

// ─── Format message content ───────────────────────────────────────────────────

function formatMessageContent(content: string): React.ReactNode {
  const lines = content.split("\n");
  return (
    <>
      {lines.map((line, lineIdx) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        const rendered = parts.map((part, partIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey:
              <strong key={partIdx} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
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

// ─── Stats circular ring ──────────────────────────────────────────────────────

function CircularProgress({
  value,
  size = 80,
}: { value: number; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = circumference * (1 - value / 100);
  return (
    <svg
      width={size}
      height={size}
      className="transform -rotate-90"
      role="img"
      aria-label="Learning progress ring"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="oklch(0.22 0.025 270)"
        strokeWidth={8}
        fill="none"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#progressGrad)"
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: strokeDash }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="oklch(0.62 0.22 295)" />
          <stop offset="100%" stopColor="oklch(0.7 0.18 210)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Pulsing brain dot ────────────────────────────────────────────────────────

function LearningDot() {
  return (
    <span className="relative inline-flex w-2 h-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
      <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-400" />
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TrainableBotPage({
  onUseForSubliminal,
}: TrainableBotPageProps) {
  // ── Actor ───────────────────────────────────────────────────────────────────
  const { actor, isFetching: actorFetching } = useActor();

  // ── Bot list state ──────────────────────────────────────────────────────────
  const [bots, setBots] = useState<Bot[]>([]);
  const [botsLoading, setBotsLoading] = useState(true);
  const [memCountMap, setMemCountMap] = useState<Record<string, number>>({});

  // ── Selected bot state ──────────────────────────────────────────────────────
  const [selectedBotId, setSelectedBotId] = useState<bigint | null>(null);
  const selectedBot = useMemo(
    () => bots.find((b) => b.id === selectedBotId) ?? null,
    [bots, selectedBotId],
  );

  // ── Create panel state ──────────────────────────────────────────────────────
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState("🧠");
  const [newPersonality, setNewPersonality] = useState("");
  const [newWiki, setNewWiki] = useState("none");
  const [newColor, setNewColor] = useState("violet");
  const [creating, setCreating] = useState(false);

  // ── Delete confirm ──────────────────────────────────────────────────────────
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);

  // ── Chat state ──────────────────────────────────────────────────────────────
  const [chatHistories, setChatHistories] = useState<
    Record<string, ChatMessage[]>
  >({});
  const currentHistory = useMemo(
    () => (selectedBotId ? (chatHistories[String(selectedBotId)] ?? []) : []),
    [chatHistories, selectedBotId],
  );
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // ── Wiki context ────────────────────────────────────────────────────────────
  const [wikiBarOpen, setWikiBarOpen] = useState(false);
  const [wikiQuery, setWikiQuery] = useState("");
  const [wikiResults, setWikiResults] = useState<WikiResult[]>([]);
  const [wikiSearchLoading, setWikiSearchLoading] = useState(false);
  const [wikiContext, setWikiContext] = useState<WikiResult | null>(null);

  // ── Personality editor inline ───────────────────────────────────────────────
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editPersonality, setEditPersonality] = useState("");

  // ── Training panel state ────────────────────────────────────────────────────
  const [memories, setMemories] = useState<Memory[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState(false);
  const [trainTopic, setTrainTopic] = useState("");
  const [trainContent, setTrainContent] = useState("");
  const [trainSentiment, setTrainSentiment] = useState<bigint>(0n);
  const [trainAdding, setTrainAdding] = useState(false);
  const [memFilter, setMemFilter] = useState("all");
  const [memSearch, setMemSearch] = useState("");
  const [clearConfirm, setClearConfirm] = useState(false);
  const [expandedMemIds, setExpandedMemIds] = useState<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  // ── Load bots on mount ──────────────────────────────────────────────────────
  const loadBots = useCallback(async () => {
    if (!actor) return;
    setBotsLoading(true);
    try {
      const fetched = await actor.getAllBots();
      setBots(fetched);

      // Load memory counts in parallel
      const counts = await Promise.allSettled(
        fetched.map(async (b) => {
          const mems = await actor.getMemoriesForBot(b.id);
          return { id: String(b.id), count: mems.length };
        }),
      );
      const countMap: Record<string, number> = {};
      for (const r of counts) {
        if (r.status === "fulfilled") countMap[r.value.id] = r.value.count;
      }
      setMemCountMap(countMap);
    } catch (err) {
      console.error("Failed to load bots:", err);
      toast.error("Failed to load bots.");
    } finally {
      setBotsLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (actor && !actorFetching) loadBots();
  }, [actor, actorFetching, loadBots]);

  // ── Load memories when selected bot changes ─────────────────────────────────
  const loadMemories = useCallback(
    async (botId: bigint) => {
      if (!actor) return;
      setMemoriesLoading(true);
      try {
        const mems = await actor.getMemoriesForBot(botId);
        setMemories(mems);
        setMemCountMap((prev) => ({ ...prev, [String(botId)]: mems.length }));
      } catch {
        toast.error("Failed to load memories.");
      } finally {
        setMemoriesLoading(false);
      }
    },
    [actor],
  );

  useEffect(() => {
    if (selectedBotId !== null) {
      loadMemories(selectedBotId);
    }
  }, [selectedBotId, loadMemories]);

  // ── Scroll to bottom on new message ────────────────────────────────────────
  const historyLength = currentHistory.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [historyLength]);

  // ── Create bot ──────────────────────────────────────────────────────────────
  const handleCreateBot = async () => {
    if (!actor) {
      toast.error("Actor not ready.");
      return;
    }
    if (!newName.trim()) {
      toast.error("Bot name is required.");
      return;
    }
    if (!newPersonality.trim()) {
      toast.error("Personality is required.");
      return;
    }
    setCreating(true);
    try {
      const id = await actor.createBot(
        newName.trim(),
        `${newAvatar}|${newColor}`,
        newPersonality.trim(),
        newWiki !== "none" ? newWiki : null,
      );
      await loadBots();
      setSelectedBotId(id);
      setCreateOpen(false);
      setNewName("");
      setNewPersonality("");
      setNewWiki("none");
      setNewColor("violet");
      setNewAvatar("🧠");
      toast.success(`${newName} is alive and ready to learn!`);
    } catch {
      toast.error("Failed to create bot.");
    } finally {
      setCreating(false);
    }
  };

  // ── Delete bot ──────────────────────────────────────────────────────────────
  const handleDeleteBot = async (id: bigint) => {
    if (!actor) return;
    try {
      await actor.deleteBot(id);
      if (selectedBotId === id) setSelectedBotId(null);
      setDeleteConfirmId(null);
      await loadBots();
      toast.success("Bot deleted.");
    } catch {
      toast.error("Failed to delete bot.");
    }
  };

  // ── Send chat message ───────────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!chatInput.trim() || chatLoading || !selectedBot || !actor) return;
    const trimmed = chatInput.trim();
    const botIdKey = String(selectedBot.id);

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
      [botIdKey]: [...(prev[botIdKey] ?? []), userMsg],
    }));
    setChatInput("");
    setWikiContext(null);
    setChatLoading(true);

    try {
      const config = getAIConfig();
      let responseText = "";

      // Build enriched system prompt with memories
      const relevantMemories = await actor.getRelevantMemories(
        selectedBot.id,
        trimmed,
        10n,
      );
      const memoryContext = relevantMemories
        .map((m) => `[${m.memoryType.toUpperCase()}] ${m.content}`)
        .join("\n");

      const enrichedSystemPrompt = `${selectedBot.personality}

## What you remember about this user:
${memoryContext || "No memories yet. This is a new conversation."}

## Instructions:
- Reference your memories naturally when relevant
- Build on previous conversations
- Personalize responses based on training entries
- When you reference a memory, say things like "I remember you mentioned..." or "Based on what I know about you..."
- Always be helpful, stay in character, and connect everything to subliminal creation in Synapse Studio
- You are ${selectedBot.name} — a learning AI that grows with each conversation`;

      if (config.provider !== "rule-based" && config.apiKey) {
        try {
          responseText = await callTrainableAI(
            config,
            enrichedSystemPrompt,
            currentHistory,
            fullUserMessage,
          );
        } catch (err) {
          console.warn("AI call failed, falling back to rule-based:", err);
          responseText = generateMemoryAwareResponse(
            selectedBot,
            trimmed,
            relevantMemories,
          );
        }
      } else {
        await new Promise((r) => setTimeout(r, 500 + Math.random() * 400));
        responseText = generateMemoryAwareResponse(
          selectedBot,
          trimmed,
          relevantMemories,
        );
      }

      const botMsg: ChatMessage = {
        role: "assistant",
        content: responseText,
        timestamp: Date.now(),
      };
      setChatHistories((prev) => ({
        ...prev,
        [botIdKey]: [...(prev[botIdKey] ?? []), userMsg, botMsg],
      }));

      // Save conversation memory
      const topicGuess = trimmed.split(" ").slice(0, 4).join(" ");
      await actor.addMemory(
        selectedBot.id,
        "conversation",
        `${trimmed} → ${responseText.slice(0, 200)}`,
        topicGuess,
        0n,
      );

      // Inject wiki context memory (captured before clearing)
      if (wikiContext) {
        await actor.addMemory(
          selectedBot.id,
          "wiki",
          `${wikiContext.title}: ${wikiContext.snippet}`,
          wikiContext.title,
          0n,
        );
      }

      setMemCountMap((prev) => ({
        ...prev,
        [botIdKey]: (prev[botIdKey] ?? 0) + 1,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, chatLoading, selectedBot, currentHistory, wikiContext, actor]);

  const handleChatKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Save bot message as memory ──────────────────────────────────────────────
  const handleSaveAsMemory = async (content: string) => {
    if (!selectedBot || !actor) return;
    try {
      await actor.addMemory(
        selectedBot.id,
        "training",
        content.slice(0, 500),
        "chat_save",
        1n,
      );
      await loadMemories(selectedBot.id);
      toast.success("Saved to bot memory!");
    } catch {
      toast.error("Failed to save memory.");
    }
  };

  // ── Wiki search ─────────────────────────────────────────────────────────────
  const handleWikiSearch = useCallback(async () => {
    if (!wikiQuery.trim()) return;
    setWikiSearchLoading(true);
    setWikiResults([]);
    try {
      const wikisToSearch = selectedBot?.linkedWiki
        ? TRAINABLE_WIKIS.filter((w) => w.domain === selectedBot.linkedWiki)
        : TRAINABLE_WIKIS.slice(0, 10);
      const results = await searchMultipleWikis(
        wikisToSearch.length > 0 ? wikisToSearch : TRAINABLE_WIKIS,
        wikiQuery,
      );
      setWikiResults(results);
    } catch {
      toast.error("Wiki search failed.");
    } finally {
      setWikiSearchLoading(false);
    }
  }, [wikiQuery, selectedBot?.linkedWiki]);

  // ── Add training memory ─────────────────────────────────────────────────────
  const handleAddTraining = async () => {
    if (!actor || !selectedBot || !trainContent.trim()) {
      toast.error("Training content is required.");
      return;
    }
    setTrainAdding(true);
    try {
      await actor.addMemory(
        selectedBot.id,
        "training",
        trainContent.trim(),
        trainTopic.trim() || "general",
        trainSentiment,
      );
      await loadMemories(selectedBot.id);
      setTrainContent("");
      setTrainTopic("");
      toast.success("Training added to memory!");
    } catch {
      toast.error("Failed to add training.");
    } finally {
      setTrainAdding(false);
    }
  };

  // ── Delete memory ───────────────────────────────────────────────────────────
  const handleDeleteMemory = async (id: bigint) => {
    if (!actor) return;
    try {
      await actor.deleteMemory(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
      if (selectedBotId)
        setMemCountMap((prev) => ({
          ...prev,
          [String(selectedBotId)]: (prev[String(selectedBotId)] ?? 1) - 1,
        }));
    } catch {
      toast.error("Failed to delete memory.");
    }
  };

  // ── Clear all memories ──────────────────────────────────────────────────────
  const handleClearAllMemories = async () => {
    if (!selectedBot || !actor) return;
    try {
      await actor.clearMemoriesForBot(selectedBot.id);
      setMemories([]);
      setMemCountMap((prev) => ({ ...prev, [String(selectedBot.id)]: 0 }));
      setClearConfirm(false);
      toast.success("All memories cleared.");
    } catch {
      toast.error("Failed to clear memories.");
    }
  };

  // ── Save personality edits ──────────────────────────────────────────────────
  const handleSavePersonality = async () => {
    if (!selectedBot || !editPersonality.trim() || !actor) return;
    // We store it as a training memory so it shapes future responses
    try {
      await actor.addMemory(
        selectedBot.id,
        "training",
        `PERSONALITY UPDATE: ${editPersonality}`,
        "personality",
        1n,
      );
      await loadMemories(selectedBot.id);
      setSettingsOpen(false);
      toast.success("Personality update saved to memory.");
    } catch {
      toast.error("Failed to save personality update.");
    }
  };

  // ── Filtered memories ───────────────────────────────────────────────────────
  const filteredMemories = useMemo(() => {
    return memories
      .filter((m) => memFilter === "all" || m.memoryType === memFilter)
      .filter(
        (m) =>
          !memSearch.trim() ||
          m.content.toLowerCase().includes(memSearch.toLowerCase()) ||
          m.topic.toLowerCase().includes(memSearch.toLowerCase()),
      )
      .sort((a, b) => Number(b.timestamp - a.timestamp));
  }, [memories, memFilter, memSearch]);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = memories.length;
    const byType = {
      conversation: memories.filter((m) => m.memoryType === "conversation")
        .length,
      training: memories.filter((m) => m.memoryType === "training").length,
      wiki: memories.filter((m) => m.memoryType === "wiki").length,
      feedback: memories.filter((m) => m.memoryType === "feedback").length,
    };
    const oldest = memories.reduce(
      (min, m) => (m.timestamp < min ? m.timestamp : min),
      memories[0]?.timestamp ?? 0n,
    );
    const newest = memories.reduce(
      (max, m) => (m.timestamp > max ? m.timestamp : max),
      0n,
    );
    const progressPct = Math.min(100, (total / 100) * 100);
    let status = "Just getting started...";
    if (total >= 100) status = "Fully awakened";
    else if (total >= 51) status = "Deeply learning...";
    else if (total >= 21) status = "Developing personality...";
    else if (total >= 6) status = "Building awareness...";
    return { total, byType, oldest, newest, progressPct, status };
  }, [memories]);

  // ── Avatar/color parsing ────────────────────────────────────────────────────
  function parseBotAvatar(bot: Bot): { emoji: string; color: string } {
    const parts = (bot.avatar ?? "🤖|violet").split("|");
    return { emoji: parts[0] ?? "🤖", color: parts[1] ?? "violet" };
  }

  const memCount = selectedBotId
    ? (memCountMap[String(selectedBotId)] ?? 0)
    : 0;
  const colorDef = selectedBot
    ? getColorDef(parseBotAvatar(selectedBot).color)
    : COLOR_OPTIONS[0];

  return (
    <div className="container max-w-[1400px] mx-auto px-3 sm:px-4 py-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center"
            style={{ boxShadow: "0 0 20px oklch(0.62 0.2 145 / 0.3)" }}
          >
            <Brain className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl">
              <span className="gradient-text">Learning Bots</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              AI bots that remember, learn, and grow with every conversation
            </p>
          </div>
        </div>
      </motion.div>

      {/* Three-column layout */}
      <div className="flex flex-col xl:flex-row gap-4 min-h-[calc(100vh-220px)]">
        {/* ── Left Sidebar: Bot Roster ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="xl:w-72 shrink-0 flex flex-col gap-3"
        >
          <div className="glass-card rounded-2xl border border-border/40 flex flex-col overflow-hidden flex-1">
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
              <h2 className="font-heading font-semibold text-sm text-foreground/80 tracking-wide uppercase">
                My Learning Bots
              </h2>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-emerald-400"
                onClick={() => setCreateOpen((v) => !v)}
                data-ocid="trainable.create.open_modal_button"
              >
                <Plus className="w-3.5 h-3.5" />
                New
              </Button>
            </div>

            <ScrollArea className="flex-1 min-h-0">
              <div className="p-2 space-y-1">
                {botsLoading ? (
                  <div
                    className="flex items-center justify-center py-8"
                    data-ocid="trainable.bots.loading_state"
                  >
                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                  </div>
                ) : bots.length === 0 ? (
                  <div
                    className="text-center py-10 px-4"
                    data-ocid="trainable.bots.empty_state"
                  >
                    <div className="text-3xl mb-2">🧠</div>
                    <p className="text-xs text-muted-foreground">
                      No bots yet. Create your first learning bot.
                    </p>
                  </div>
                ) : (
                  bots.map((bot, idx) => {
                    const { emoji, color } = parseBotAvatar(bot);
                    const cd = getColorDef(color);
                    const isActive = bot.id === selectedBotId;
                    const memCnt = memCountMap[String(bot.id)] ?? 0;
                    return (
                      <motion.div
                        key={String(bot.id)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="relative group"
                        data-ocid={`trainable.bot.item.${idx + 1}`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedBotId(bot.id)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 ${isActive ? `${cd.classes} border` : "hover:bg-secondary/40 border border-transparent"}`}
                          style={
                            isActive
                              ? { boxShadow: `0 0 18px ${cd.glow}30` }
                              : undefined
                          }
                        >
                          {/* Bot avatar with pulse */}
                          <div className="relative shrink-0">
                            <div
                              className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl border transition-all ${isActive ? "border-current/30 shadow-lg" : "border-border/30 bg-secondary/30"}`}
                            >
                              {emoji}
                            </div>
                            {/* Brain pulse */}
                            <div
                              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center ${isActive ? "bg-emerald-500/30 border border-emerald-500/60" : "bg-secondary/60 border border-border/40"}`}
                            >
                              <motion.div
                                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                animate={{
                                  scale: [1, 1.4, 1],
                                  opacity: [0.6, 1, 0.6],
                                }}
                                transition={{
                                  repeat: Number.POSITIVE_INFINITY,
                                  duration: 1.8,
                                  delay: idx * 0.3,
                                }}
                              />
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`font-heading font-semibold text-sm truncate ${isActive ? cd.text : "text-foreground"}`}
                              >
                                {bot.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {/* Memory count badge */}
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                                style={{
                                  background:
                                    "linear-gradient(135deg, oklch(0.3 0.1 145 / 0.4), oklch(0.3 0.1 210 / 0.4))",
                                  color: "oklch(0.8 0.1 160)",
                                }}
                              >
                                <Sparkles className="w-2.5 h-2.5" />
                                {memCnt} mem
                              </span>
                              {bot.linkedWiki && (
                                <span className="text-[10px] text-muted-foreground/60 truncate flex items-center gap-1">
                                  <Globe className="w-2.5 h-2.5" />
                                  {bot.linkedWiki.split(".")[0]}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>

                        {/* Delete button */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          {deleteConfirmId === bot.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleDeleteBot(bot.id)}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/40"
                                data-ocid={`trainable.bot.confirm_button.${idx + 1}`}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/60 text-muted-foreground border border-border/40"
                                data-ocid={`trainable.bot.cancel_button.${idx + 1}`}
                              >
                                No
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(bot.id)}
                              className="w-6 h-6 rounded-md bg-destructive/10 hover:bg-destructive/30 flex items-center justify-center transition-all"
                              data-ocid={`trainable.bot.delete_button.${idx + 1}`}
                            >
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        </motion.div>

        {/* ── Center: Create Panel or Chat Window ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 min-w-0 flex flex-col"
        >
          <AnimatePresence mode="wait">
            {/* Create Bot Panel */}
            {(createOpen || (!selectedBot && !createOpen)) && createOpen ? (
              <motion.div
                key="create-panel"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="glass-card rounded-2xl border border-emerald-500/20 p-6 flex-1 overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading font-bold text-xl gradient-text">
                    Create Learning Bot
                  </h2>
                  <button
                    type="button"
                    onClick={() => setCreateOpen(false)}
                    className="w-8 h-8 rounded-lg hover:bg-secondary/50 flex items-center justify-center"
                    data-ocid="trainable.create.close_button"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-5 max-w-lg">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground font-medium">
                      Bot Name *
                    </Label>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="My Learning Bot"
                      className="bg-secondary/30 border-border/40"
                      data-ocid="trainable.create.input"
                    />
                  </div>

                  {/* Avatar */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground font-medium">
                      Avatar
                    </Label>
                    <div className="grid grid-cols-10 gap-1.5">
                      {AVATAR_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setNewAvatar(emoji)}
                          className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center transition-all ${newAvatar === emoji ? "bg-primary/20 border border-primary/50 scale-110" : "bg-secondary/30 hover:bg-secondary/50 border border-transparent"}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Personality */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground font-medium">
                      Personality & Expertise *
                    </Label>
                    <Textarea
                      value={newPersonality}
                      onChange={(e) => setNewPersonality(e.target.value)}
                      placeholder="Describe your bot's personality, areas of expertise, communication style, and what it should focus on. The more detail you give, the better it learns..."
                      className="bg-secondary/30 border-border/40 min-h-[120px] resize-none"
                      data-ocid="trainable.create.textarea"
                    />
                  </div>

                  {/* Linked Wiki */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground font-medium">
                      Linked Wiki (optional)
                    </Label>
                    <Select value={newWiki} onValueChange={setNewWiki}>
                      <SelectTrigger
                        className="bg-secondary/30 border-border/40"
                        data-ocid="trainable.create.select"
                      >
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        {LINKED_WIKI_OPTIONS.map((w) => (
                          <SelectItem key={w.value} value={w.value}>
                            {w.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Color */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground font-medium">
                      Color Theme
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setNewColor(c.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${newColor === c.value ? `${c.classes} ${c.text} border-current/60` : "bg-secondary/30 text-muted-foreground border-border/40 hover:bg-secondary/50"}`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleCreateBot}
                      disabled={creating}
                      className="flex-1 gap-2"
                      data-ocid="trainable.create.submit_button"
                    >
                      {creating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Brain className="w-4 h-4" />
                      )}
                      {creating ? "Creating..." : "Bring Bot to Life"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCreateOpen(false)}
                      className="border-border/40"
                      data-ocid="trainable.create.cancel_button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : !selectedBot ? (
              /* Empty state — no bot selected */
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-2xl border border-border/40 flex-1 flex flex-col items-center justify-center py-20 text-center px-6"
                data-ocid="trainable.chat.empty_state"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                  className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-4xl mb-5"
                >
                  🧠
                </motion.div>
                <h3 className="font-heading font-bold text-xl gradient-text mb-2">
                  Select or Create a Learning Bot
                </h3>
                <p className="text-muted-foreground text-sm max-w-xs mb-5">
                  Learning bots remember every conversation, training entry, and
                  wiki context — growing smarter with each session.
                </p>
                <Button
                  onClick={() => setCreateOpen(true)}
                  className="gap-2"
                  data-ocid="trainable.empty.primary_button"
                >
                  <Plus className="w-4 h-4" />
                  Create First Bot
                </Button>
              </motion.div>
            ) : (
              /* Chat Window */
              <motion.div
                key={`chat-${String(selectedBot.id)}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="glass-card rounded-2xl border border-border/40 flex flex-col overflow-hidden flex-1 min-h-[500px]"
              >
                {/* Chat header */}
                {(() => {
                  const { emoji } = parseBotAvatar(selectedBot);
                  return (
                    <div
                      className={`px-4 py-3 border-b border-border/40 bg-gradient-to-r from-${colorDef.value}-500/10 via-transparent to-transparent`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl border ${colorDef.classes}`}
                          >
                            {emoji}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h2
                                className={`font-heading font-bold text-base ${colorDef.text}`}
                              >
                                {selectedBot.name}
                              </h2>
                              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                                <LearningDot />
                                <span className="text-[10px] text-emerald-400 font-medium">
                                  Learning
                                </span>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-[10px] h-5 px-1.5 border-border/50 text-muted-foreground"
                              >
                                {memCount} memories
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                              {selectedBot.personality.slice(0, 60)}
                              {selectedBot.personality.length > 60 ? "..." : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setEditPersonality(selectedBot.personality);
                              setSettingsOpen((v) => !v);
                            }}
                            data-ocid="trainable.chat.edit_button"
                          >
                            <Settings className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-7 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                              setChatHistories((prev) => ({
                                ...prev,
                                [String(selectedBot.id)]: [],
                              }));
                              toast.success("Chat cleared.");
                            }}
                            data-ocid="trainable.chat.delete_button"
                          >
                            Clear
                          </Button>
                        </div>
                      </div>

                      {/* AI config hint */}
                      {getAIConfig().provider === "rule-based" && (
                        <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground/70">
                          <Sparkles className="w-3 h-3" />
                          <span>
                            Rule-based mode — add an API key in Settings to
                            unlock full AI responses
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Personality editor (inline) */}
                <AnimatePresence>
                  {settingsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-border/30 bg-secondary/20 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">
                            Update Personality (saved as memory)
                          </span>
                          <button
                            type="button"
                            onClick={() => setSettingsOpen(false)}
                            className="w-5 h-5 flex items-center justify-center hover:text-foreground text-muted-foreground"
                            data-ocid="trainable.settings.close_button"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <Textarea
                          value={editPersonality}
                          onChange={(e) => setEditPersonality(e.target.value)}
                          className="text-xs bg-secondary/30 border-border/40 min-h-[60px] resize-none"
                          data-ocid="trainable.settings.textarea"
                        />
                        <Button
                          size="sm"
                          className="h-7 text-xs gap-1"
                          onClick={handleSavePersonality}
                          data-ocid="trainable.settings.save_button"
                        >
                          <BookmarkPlus className="w-3 h-3" />
                          Save to Memory
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Wiki context bar */}
                <div className="px-4 py-2.5 border-b border-border/30 bg-secondary/10">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setWikiBarOpen((v) => !v)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      data-ocid="trainable.wiki.toggle"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      {wikiBarOpen
                        ? "Hide wiki search"
                        : "Search wiki for context..."}
                      {wikiBarOpen ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                    {wikiContext && (
                      <div className="flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs text-primary">
                        <BookOpen className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">
                          {wikiContext.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => setWikiContext(null)}
                          className="hover:text-primary/60"
                          data-ocid="trainable.wiki.close_button"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <AnimatePresence>
                    {wikiBarOpen && (
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
                            data-ocid="trainable.wiki.search_input"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs border-border/40 shrink-0"
                            onClick={handleWikiSearch}
                            disabled={wikiSearchLoading}
                            data-ocid="trainable.wiki.button"
                          >
                            {wikiSearchLoading ? (
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
                                      setWikiBarOpen(false);
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
                                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
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

                {/* Messages */}
                <ScrollArea className="flex-1 px-4 py-4">
                  {currentHistory.length === 0 && !chatLoading ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center h-full py-16 text-center"
                      data-ocid="trainable.messages.empty_state"
                    >
                      {(() => {
                        const { emoji } = parseBotAvatar(selectedBot);
                        return (
                          <>
                            <div
                              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-4 border ${colorDef.classes}`}
                            >
                              {emoji}
                            </div>
                            <h3
                              className={`font-heading font-bold text-lg mb-1 ${colorDef.text}`}
                            >
                              {selectedBot.name}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs">
                              {selectedBot.personality.slice(0, 100)}
                              {selectedBot.personality.length > 100
                                ? "..."
                                : ""}
                            </p>
                            <p className="text-xs text-muted-foreground/60 mt-3 max-w-[220px]">
                              I'm ready to learn and grow with you. What shall
                              we work on?
                            </p>
                          </>
                        );
                      })()}
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence initial={false}>
                        {currentHistory.map((msg) => {
                          const { emoji } = parseBotAvatar(selectedBot);
                          return (
                            <motion.div
                              key={`${String(selectedBot.id)}-${msg.timestamp}-${msg.role}`}
                              initial={{ opacity: 0, y: 12, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.25 }}
                              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                              <div
                                className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-lg border mt-0.5 ${msg.role === "user" ? "bg-primary/20 border-primary/30" : colorDef.classes}`}
                              >
                                {msg.role === "user" ? "👤" : emoji}
                              </div>
                              <div
                                className={`flex flex-col gap-1 max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}
                              >
                                <span className="text-[10px] text-muted-foreground/60 px-1">
                                  {msg.role === "user"
                                    ? "You"
                                    : selectedBot.name}
                                </span>
                                <div
                                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "glass-card border border-border/40 text-foreground rounded-tl-sm"}`}
                                >
                                  {formatMessageContent(msg.content)}
                                </div>
                                {msg.role === "assistant" && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    {onUseForSubliminal && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          onUseForSubliminal(
                                            msg.content
                                              .replace(/\*\*/g, "")
                                              .slice(0, 200),
                                          );
                                          toast.success("Sent to generator!");
                                        }}
                                        data-ocid="trainable.message.button"
                                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                                      >
                                        <Wand2 className="w-2.5 h-2.5" />
                                        Use in Generator
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleSaveAsMemory(msg.content)
                                      }
                                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                                      data-ocid="trainable.message.save_button"
                                    >
                                      <BookmarkPlus className="w-2.5 h-2.5" />
                                      Save as Memory
                                    </button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>

                      {/* Loading indicator */}
                      {chatLoading && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-3"
                          data-ocid="trainable.chat.loading_state"
                        >
                          {(() => {
                            const { emoji } = parseBotAvatar(selectedBot);
                            return (
                              <>
                                <div
                                  className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-lg border ${colorDef.classes}`}
                                >
                                  {emoji}
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
                              </>
                            );
                          })()}
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
                        Wiki: <strong>{wikiContext.title}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => setWikiContext(null)}
                        data-ocid="trainable.context.close_button"
                      >
                        <X className="w-3 h-3 hover:text-primary/60" />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2 items-end">
                    <Textarea
                      ref={chatInputRef}
                      value={chatInput}
                      onChange={(e) => {
                        setChatInput(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                      }}
                      onKeyDown={handleChatKeyDown}
                      placeholder="Talk to your bot... (Enter to send, Shift+Enter for new line)"
                      className="flex-1 resize-none min-h-[44px] max-h-[120px] bg-secondary/30 border-border/40 text-sm py-3 rounded-xl"
                      rows={1}
                      disabled={chatLoading}
                      data-ocid="trainable.chat.textarea"
                    />
                    <Button
                      size="icon"
                      className="h-11 w-11 rounded-xl shrink-0"
                      onClick={handleSend}
                      disabled={!chatInput.trim() || chatLoading}
                      data-ocid="trainable.chat.submit_button"
                    >
                      {chatLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Right Panel: Training & Memory ──────────────────────────────── */}
        {selectedBot && (
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="xl:w-80 shrink-0"
          >
            <div
              className="glass-card rounded-2xl border border-border/40 overflow-hidden h-full"
              style={{ background: "oklch(0.095 0.018 275 / 0.85)" }}
            >
              <Tabs defaultValue="train">
                <TabsList className="w-full rounded-none border-b border-border/40 bg-transparent h-auto p-0">
                  {(["train", "memories", "stats"] as const).map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="flex-1 rounded-none py-3 text-xs font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary border-b-2 border-transparent transition-all"
                      data-ocid="trainable.panel.tab"
                    >
                      {tab === "train" && (
                        <>
                          <FlaskConical className="w-3 h-3 mr-1" />
                          Train
                        </>
                      )}
                      {tab === "memories" && (
                        <>
                          <BookOpen className="w-3 h-3 mr-1" />
                          Memories
                        </>
                      )}
                      {tab === "stats" && (
                        <>
                          <Zap className="w-3 h-3 mr-1" />
                          Stats
                        </>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* ── Train Tab ── */}
                <TabsContent value="train" className="p-4 space-y-4 mt-0">
                  <p className="text-xs text-muted-foreground">
                    Teach your bot specific facts, preferences, and rules.
                  </p>

                  {/* Quick presets */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Quick Presets
                    </Label>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_TRAIN_PRESETS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setTrainContent(p)}
                          className="text-[10px] px-2 py-1 rounded-full bg-secondary/50 border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                        >
                          {p.length > 30 ? `${p.slice(0, 30)}...` : p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Topic */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Topic (optional)
                    </Label>
                    <Input
                      value={trainTopic}
                      onChange={(e) => setTrainTopic(e.target.value)}
                      placeholder="e.g. preferences, abilities..."
                      className="h-8 text-xs bg-secondary/30 border-border/40"
                      data-ocid="trainable.train.input"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Training Content *
                    </Label>
                    <Textarea
                      value={trainContent}
                      onChange={(e) => setTrainContent(e.target.value)}
                      placeholder="What should this bot learn or remember?"
                      className="text-xs bg-secondary/30 border-border/40 min-h-[80px] resize-none"
                      data-ocid="trainable.train.textarea"
                    />
                  </div>

                  {/* Sentiment */}
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Sentiment
                    </Label>
                    <div className="flex gap-2">
                      {(
                        [
                          {
                            label: "Positive",
                            val: 1n,
                            cls: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
                          },
                          {
                            label: "Neutral",
                            val: 0n,
                            cls: "text-muted-foreground border-border/40 bg-secondary/30",
                          },
                          {
                            label: "Negative",
                            val: -1n as bigint,
                            cls: "text-rose-400 border-rose-500/40 bg-rose-500/10",
                          },
                        ] as const
                      ).map((s) => (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => setTrainSentiment(s.val)}
                          className={`flex-1 py-1.5 text-[11px] rounded-lg border transition-all font-medium ${trainSentiment === s.val ? s.cls : "bg-secondary/20 text-muted-foreground/60 border-border/30 hover:bg-secondary/40"}`}
                          data-ocid="trainable.train.toggle"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddTraining}
                    disabled={trainAdding || !trainContent.trim()}
                    className="w-full gap-2 text-sm"
                    data-ocid="trainable.train.submit_button"
                  >
                    {trainAdding ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Brain className="w-4 h-4" />
                    )}
                    {trainAdding ? "Adding..." : "Add Training"}
                  </Button>
                </TabsContent>

                {/* ── Memories Tab ── */}
                <TabsContent
                  value="memories"
                  className="mt-0 flex flex-col h-[calc(100%-48px)]"
                >
                  <div className="p-4 border-b border-border/30 space-y-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/60" />
                      <Input
                        value={memSearch}
                        onChange={(e) => setMemSearch(e.target.value)}
                        placeholder="Search memories..."
                        className="h-8 text-xs bg-secondary/30 border-border/40 pl-7"
                        data-ocid="trainable.memories.search_input"
                      />
                    </div>

                    {/* Filter */}
                    <div className="flex gap-1 flex-wrap">
                      {[
                        "all",
                        "conversation",
                        "training",
                        "wiki",
                        "feedback",
                      ].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setMemFilter(f)}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${memFilter === f ? "bg-primary/20 text-primary border-primary/40" : "bg-secondary/30 text-muted-foreground border-border/40 hover:bg-secondary/50"}`}
                          data-ocid="trainable.memories.tab"
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    {/* Clear all */}
                    {memories.length > 0 && (
                      <div>
                        {clearConfirm ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Clear all?
                            </span>
                            <button
                              type="button"
                              onClick={handleClearAllMemories}
                              className="text-[11px] text-destructive hover:text-destructive/80"
                              data-ocid="trainable.memories.confirm_button"
                            >
                              Yes
                            </button>
                            <button
                              type="button"
                              onClick={() => setClearConfirm(false)}
                              className="text-[11px] text-muted-foreground hover:text-foreground"
                              data-ocid="trainable.memories.cancel_button"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setClearConfirm(true)}
                            className="text-[11px] text-destructive/70 hover:text-destructive transition-colors"
                            data-ocid="trainable.memories.delete_button"
                          >
                            Clear All Memories
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <ScrollArea className="flex-1 p-3">
                    {memoriesLoading ? (
                      <div
                        className="flex items-center justify-center py-8"
                        data-ocid="trainable.memories.loading_state"
                      >
                        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : filteredMemories.length === 0 ? (
                      <div
                        className="text-center py-8 text-xs text-muted-foreground"
                        data-ocid="trainable.memories.empty_state"
                      >
                        {memFilter !== "all"
                          ? `No ${memFilter} memories yet.`
                          : "No memories yet. Start chatting or add training!"}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredMemories.map((mem, idx) => {
                          const memKey = String(mem.id);
                          const isExpanded = expandedMemIds.has(memKey);
                          const ts = Number(mem.timestamp);
                          const date =
                            ts > 0
                              ? new Date(
                                  ts < 1e12 ? ts * 1000 : ts,
                                ).toLocaleDateString()
                              : "—";
                          return (
                            <motion.div
                              key={memKey}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.02 }}
                              className="p-2.5 rounded-xl bg-secondary/20 border border-border/30 group"
                              data-ocid={`trainable.memories.item.${idx + 1}`}
                            >
                              <div className="flex items-start gap-2">
                                <SentimentDot sentiment={mem.sentiment} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                    <MemoryTypeBadge type={mem.memoryType} />
                                    {mem.topic && (
                                      <span className="text-[10px] text-muted-foreground/70">
                                        {mem.topic}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-muted-foreground/50 ml-auto">
                                      {date}
                                    </span>
                                  </div>
                                  <p
                                    className={`text-xs text-foreground/80 leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`}
                                  >
                                    {mem.content}
                                  </p>
                                  {mem.content.length > 80 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedMemIds((prev) => {
                                          const next = new Set(prev);
                                          if (isExpanded) next.delete(memKey);
                                          else next.add(memKey);
                                          return next;
                                        })
                                      }
                                      className="text-[10px] text-primary/60 hover:text-primary mt-0.5"
                                    >
                                      {isExpanded ? "Show less" : "Show more"}
                                    </button>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMemory(mem.id)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded flex items-center justify-center hover:bg-destructive/20 shrink-0"
                                  data-ocid={`trainable.memories.delete_button.${idx + 1}`}
                                >
                                  <Trash2 className="w-3 h-3 text-destructive/70" />
                                </button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>

                {/* ── Stats Tab ── */}
                <TabsContent value="stats" className="p-4 space-y-5 mt-0">
                  {/* Learning progress ring */}
                  <div className="flex flex-col items-center py-2">
                    <div className="relative">
                      <CircularProgress value={stats.progressPct} size={90} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold font-heading gradient-text">
                          {stats.total}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          mem
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                      {stats.status}
                    </p>
                  </div>

                  {/* Memory breakdown */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Memory Breakdown
                    </h4>
                    {(
                      [
                        {
                          label: "Conversation",
                          key: "conversation",
                          color: "bg-blue-500",
                          count: stats.byType.conversation,
                        },
                        {
                          label: "Training",
                          key: "training",
                          color: "bg-emerald-500",
                          count: stats.byType.training,
                        },
                        {
                          label: "Wiki",
                          key: "wiki",
                          color: "bg-amber-500",
                          count: stats.byType.wiki,
                        },
                        {
                          label: "Feedback",
                          key: "feedback",
                          color: "bg-rose-500",
                          count: stats.byType.feedback,
                        },
                      ] as const
                    ).map(({ label, color, count }) => (
                      <div key={label}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${color}`} />
                            <span className="text-muted-foreground">
                              {label}
                            </span>
                          </div>
                          <span className="text-foreground/70 font-medium">
                            {count}
                          </span>
                        </div>
                        <Progress
                          value={
                            stats.total > 0 ? (count / stats.total) * 100 : 0
                          }
                          className="h-1.5"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Bot metadata */}
                  <div className="space-y-2 border-t border-border/30 pt-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Last Active</span>
                      <span className="text-foreground/70">
                        {stats.newest > 0n
                          ? new Date(
                              Number(stats.newest) < 1e12
                                ? Number(stats.newest) * 1000
                                : Number(stats.newest),
                            ).toLocaleDateString()
                          : "Never"}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        Total Memories
                      </span>
                      <span className="text-foreground/70 font-medium">
                        {stats.total}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Linked Wiki</span>
                      <span className="text-foreground/70 truncate max-w-[120px]">
                        {selectedBot.linkedWiki
                          ? selectedBot.linkedWiki.split(".")[0]
                          : "None"}
                      </span>
                    </div>
                  </div>

                  {/* Motivational message */}
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
                    <p className="text-xs text-primary/80 italic">
                      {stats.total === 0 &&
                        "Every conversation is a seed planted in this bot's mind."}
                      {stats.total > 0 &&
                        stats.total <= 5 &&
                        "The foundation is forming. Keep teaching."}
                      {stats.total > 5 &&
                        stats.total <= 20 &&
                        "Awareness is building. This bot is starting to understand you."}
                      {stats.total > 20 &&
                        stats.total <= 50 &&
                        "A unique personality is emerging from these memories."}
                      {stats.total > 50 &&
                        stats.total <= 100 &&
                        "Deep learning in progress. This bot knows you well."}
                      {stats.total > 100 &&
                        "This bot has fully awakened — a mind shaped by your intentions."}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
