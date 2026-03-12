import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Atom,
  Check,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Coins,
  Copy,
  Download,
  Droplets,
  Eye,
  Film,
  Flame,
  FolderOpen,
  Layers,
  Leaf,
  Loader2,
  MapPin,
  Music,
  Package,
  Play,
  Plus,
  Save,
  Shield,
  Square,
  Star,
  Timer,
  Trash2,
  TrendingUp,
  User,
  Users,
  Video,
  Volume2,
  VolumeX,
  Wand2,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import SignsPanel, { type SignsContext } from "../components/SignsPanel";
import {
  useDeleteProject,
  useGenerateAffirmations,
  useGetProject,
  useListProjects,
  useSaveProject,
} from "../hooks/useQueries";
import type { BoosterLevel, PersonalTarget } from "../utils/affirmationUtils";
import { generateAffirmationsWithAI } from "../utils/aiGenerate";
import {
  connectFrequencyToneToCtx,
  connectNatureSoundToCtx,
  startFrequencyTone,
  startNatureSound,
} from "../utils/audioEngine";

const CHAKRAS = [
  "Root",
  "Sacral",
  "Solar Plexus",
  "Heart",
  "Throat",
  "Third Eye",
  "Crown",
  "High Heart",
  "Soul Star",
  "Earth Star",
];

const CHAKRA_COLORS: Record<string, string> = {
  Root: "oklch(0.58 0.22 25)",
  Sacral: "oklch(0.65 0.2 48)",
  "Solar Plexus": "oklch(0.78 0.18 90)",
  Heart: "oklch(0.62 0.2 145)",
  Throat: "oklch(0.58 0.2 220)",
  "Third Eye": "oklch(0.5 0.22 270)",
  Crown: "oklch(0.55 0.22 310)",
  "High Heart": "oklch(0.60 0.20 160)",
  "Soul Star": "oklch(0.82 0.15 55)",
  "Earth Star": "oklch(0.45 0.15 35)",
};

const CHAKRA_HZ: Record<string, string> = {
  Root: "396Hz",
  Sacral: "417Hz",
  "Solar Plexus": "528Hz",
  Heart: "639Hz",
  Throat: "741Hz",
  "Third Eye": "852Hz",
  Crown: "963Hz",
  "High Heart": "594Hz",
  "Soul Star": "1074Hz",
  "Earth Star": "285Hz",
};

const CHAKRA_EMOJI: Record<string, string> = {
  Root: "🔴",
  Sacral: "🟠",
  "Solar Plexus": "🟡",
  Heart: "💚",
  Throat: "🔵",
  "Third Eye": "🟣",
  Crown: "⚪",
  "High Heart": "💚",
  "Soul Star": "⭐",
  "Earth Star": "🌍",
};

const ADULT_THEME_PRESETS = [
  {
    category: "Confidence & Attractiveness",
    color: "oklch(0.62 0.22 0)",
    presets: [
      "Charisma",
      "Magnetic Presence",
      "Dating Success",
      "Irresistible Aura",
      "Social Dominance",
      "Alpha Energy",
      "Physical Attraction",
      "Seductive Confidence",
    ],
  },
  {
    category: "Wealth & Ambition",
    color: "oklch(0.72 0.2 48)",
    presets: [
      "Financial Dominance",
      "Millionaire Identity",
      "Power and Influence",
      "Empire Building",
      "Executive Presence",
      "Fearless Ambition",
      "Passive Income Mastery",
      "Generational Wealth",
    ],
  },
  {
    category: "Sensuality & Self-Image",
    color: "oklch(0.62 0.22 330)",
    presets: [
      "Body Confidence",
      "Divine Feminine Energy",
      "Divine Masculine Energy",
      "Magnetic Allure",
      "Inner Beauty Radiance",
      "Sensual Presence",
      "Physical Magnetism",
      "Sacred Sexuality",
      "Tantric Awakening",
      "Orgasmic Energy",
      "Kundalini Rise",
      "Erotic Magnetism",
      "Sacred Union",
      "Sexual Healing",
    ],
  },
  {
    category: "Mature Spiritual Themes",
    color: "oklch(0.45 0.2 280)",
    presets: [
      "Shadow Alchemy",
      "Dark Archetype Mastery",
      "Void Work",
      "Taboo Mythology",
      "Death and Rebirth",
      "The Underworld Path",
      "Trickster Energy",
      "Liminal Power",
    ],
  },
  {
    category: "Power & Domination",
    color: "oklch(0.55 0.22 15)",
    presets: [
      "Commanding Presence",
      "Natural Authority",
      "Submissive Surrender",
      "Power Exchange Mastery",
      "Dominant Energy",
      "Magnetic Control",
      "Irresistible Command",
      "Sacred Kink Integration",
    ],
  },
] as const;

type ModeKey = "booster" | "fantasy" | "protection" | "chakraAlignment";

interface ModeConfig {
  key: ModeKey;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const MODES: ModeConfig[] = [
  {
    key: "fantasy",
    label: "Fantasy-to-Reality",
    description:
      "Physically brings fictional powers, characters, and items into your reality",
    icon: Star,
    color: "oklch(0.62 0.22 295)",
  },
  {
    key: "protection",
    label: "Protection",
    description: "Add grounding and resilience affirmations",
    icon: Shield,
    color: "oklch(0.62 0.2 145)",
  },
  {
    key: "chakraAlignment",
    label: "Chakra Alignment",
    description: "Harmonize selected chakras into a unified energy alignment",
    icon: CircleDot,
    color: "oklch(0.62 0.22 295)",
  },
  {
    key: "booster",
    label: "Booster",
    description: "Amplify intensity and repetition density",
    icon: Zap,
    color: "oklch(0.78 0.18 90)",
  },
];

// ── Palette map → canvas gradient stops (literal hex for Canvas API) ──
const PALETTE_COLORS: Record<string, [string, string, string]> = {
  "Violet/Indigo": ["#0d0014", "#1a0035", "#2d0060"],
  "Gold/Amber": ["#0d0800", "#1a1000", "#2d1800"],
  "Teal/Cyan": ["#000d0d", "#001a1a", "#00282d"],
  "Rose/Crimson": ["#0d0005", "#1a0010", "#2d001a"],
  "Emerald/Green": ["#000d02", "#001a05", "#002d0a"],
  Monochrome: ["#080808", "#111111", "#1a1a1a"],
};

const PALETTE_ACCENT: Record<string, string> = {
  "Violet/Indigo": "#a855f7",
  "Gold/Amber": "#f59e0b",
  "Teal/Cyan": "#06b6d4",
  "Rose/Crimson": "#f43f5e",
  "Emerald/Green": "#10b981",
  Monochrome: "#e2e8f0",
};

// ── Nature sound options ──────────────────────────────────────────────────────
interface NatureSoundOption {
  label: string;
  icon: React.ElementType;
  color: string;
}

const NATURE_SOUNDS: NatureSoundOption[] = [
  { label: "None", icon: VolumeX, color: "oklch(0.45 0.02 270)" },
  { label: "Rain", icon: Droplets, color: "oklch(0.58 0.18 220)" },
  { label: "Campfire", icon: Flame, color: "oklch(0.65 0.2 40)" },
  { label: "Forest / Birds", icon: Leaf, color: "oklch(0.62 0.2 145)" },
  { label: "Ocean Waves", icon: Droplets, color: "oklch(0.58 0.2 200)" },
  { label: "Thunder Storm", icon: Zap, color: "oklch(0.65 0.18 260)" },
  { label: "Flowing River", icon: Droplets, color: "oklch(0.55 0.2 210)" },
  { label: "Wind", icon: Wind, color: "oklch(0.6 0.12 200)" },
];

// ── Frequency presets ─────────────────────────────────────────────────────────
const FREQUENCY_PRESETS = [
  { hz: 40, label: "40Hz", sublabel: "Gamma" },
  { hz: 174, label: "174Hz", sublabel: "Foundation" },
  { hz: 285, label: "285Hz", sublabel: "Tissue" },
  { hz: 396, label: "396Hz", sublabel: "Liberation" },
  { hz: 417, label: "417Hz", sublabel: "Change" },
  { hz: 432, label: "432Hz", sublabel: "Earth" },
  { hz: 528, label: "528Hz", sublabel: "DNA" },
  { hz: 639, label: "639Hz", sublabel: "Connection" },
  { hz: 741, label: "741Hz", sublabel: "Awakening" },
  { hz: 852, label: "852Hz", sublabel: "Intuition" },
  { hz: 963, label: "963Hz", sublabel: "Crown" },
  { hz: 1111, label: "1111Hz", sublabel: "Angelic" },
];

const WAVEFORMS: { type: OscillatorType; label: string }[] = [
  { type: "sine", label: "Sine" },
  { type: "triangle", label: "Triangle" },
  { type: "square", label: "Square" },
  { type: "sawtooth", label: "Sawtooth" },
];

export interface SubliminalContext {
  topic: string;
  affirmations: string[];
  modes: {
    booster: boolean;
    fantasy: boolean;
    protection: boolean;
    chakraAlignment: boolean;
  };
  selectedChakras: string[];
  colorPalette: string;
  themeStyle: string;
}

interface GeneratorPageProps {
  injectedTopic?: string;
  onInjectedTopicConsumed?: () => void;
  onSubliminalUpdate?: (ctx: SubliminalContext) => void;
  onNavigate?: (page: string) => void;
}

// ── Canvas subliminal video preview ──────────────────────────────────────────
interface VideoPreviewProps {
  affirmations: string[];
  topic: string;
  chakra: string;
  palette: string;
  theme: string;
  duration: number; // seconds (capped at 120 for browser preview)
  // Audio settings
  natureSound: string;
  natureSoundVolume: number;
  frequencyHz: string;
  frequencyWaveform: OscillatorType;
  frequencyToneVolume: number;
  audioLayers: { enabled: boolean; speed: number; volume: number }[];
  voiceType: string;
  voicePitch: number;
}

function VideoPreview({
  affirmations,
  topic,
  chakra,
  palette,
  theme,
  duration,
  natureSound,
  natureSoundVolume,
  frequencyHz,
  frequencyWaveform,
  frequencyToneVolume,
  audioLayers,
  voiceType,
  voicePitch,
}: VideoPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioStopFnsRef = useRef<(() => void)[]>([]);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ffmpegRef = useRef<any | null>(null);
  const ttsRecorderRef = useRef<MediaRecorder | null>(null);
  const ttsChunksRef = useRef<Blob[]>([]);
  const ttsAudioCtxRef = useRef<AudioContext | null>(null);
  const ttsAudioStopFnsRef = useRef<(() => void)[]>([]);

  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [mp4Url, setMp4Url] = useState<string | null>(null);
  const [webmFallbackUrl, setWebmFallbackUrl] = useState<string | null>(null);
  const [isTTSRecording, setIsTTSRecording] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);

  // No cap — support full duration including 1hr+
  const previewDuration = duration;
  const colors = PALETTE_COLORS[palette] ?? PALETTE_COLORS["Violet/Indigo"];

  /** Format seconds as "Xh Ym" or "Ym Zs" or "Zs" */
  const fmtDuration = (secs: number): string => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m > 0 ? `${m}m` : ""}`.trim();
    if (m > 0) return `${m}m ${s > 0 ? `${s}s` : ""}`.trim();
    return `${s}s`;
  };
  const accent = PALETTE_ACCENT[palette] ?? "#a855f7";

  // Particle state for theme effects
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; r: number; a: number }[]
  >([]);

  // Init particles once
  useEffect(() => {
    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * 1280,
      y: Math.random() * 720,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      a: Math.random(),
    }));
  }, []);

  // Affirmation cycling state
  const affIndexRef = useRef(0);
  const lastSwapRef = useRef(0);
  const textAlphaRef = useRef(0);
  const fadingInRef = useRef(true);

  const drawFrame = useCallback(
    (ctx: CanvasRenderingContext2D, elapsed: number) => {
      const W = 1280;
      const H = 720;

      // Background gradient
      const grad = ctx.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        W * 0.7,
      );
      grad.addColorStop(0, colors[1]);
      grad.addColorStop(0.6, colors[0]);
      grad.addColorStop(1, colors[0]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Theme-specific background effect
      if (theme === "Dark Cosmic" || theme === "Ethereal Light") {
        // Starfield / particles
        const pts = particlesRef.current;
        for (const p of pts) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${p.a * 0.7})`;
          ctx.fill();
        }
        if (theme === "Ethereal Light") {
          // Bloom
          const bloom = ctx.createRadialGradient(
            W / 2,
            H / 2,
            0,
            W / 2,
            H / 2,
            300,
          );
          bloom.addColorStop(0, `${accent}30`);
          bloom.addColorStop(1, "transparent");
          ctx.fillStyle = bloom;
          ctx.fillRect(0, 0, W, H);
        }
      } else if (theme === "Ocean Void") {
        // Slow wave
        ctx.save();
        ctx.globalAlpha = 0.12;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          const phase = elapsed * 0.0005 + (i * Math.PI) / 2;
          ctx.moveTo(0, H * 0.5);
          for (let x = 0; x <= W; x += 4) {
            ctx.lineTo(x, H * 0.5 + Math.sin(x * 0.008 + phase) * 40 * (i + 1));
          }
          ctx.strokeStyle = accent;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      } else if (theme === "Fire Core") {
        // Ember particles
        const pts = particlesRef.current;
        for (const p of pts) {
          p.y -= 0.6 + p.r * 0.5;
          p.x += Math.sin(elapsed * 0.001 + p.a * 10) * 0.5;
          if (p.y < 0) {
            p.y = H + 10;
            p.x = Math.random() * W;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          const heat = p.y / H;
          ctx.fillStyle = `rgba(255,${Math.round(heat * 80)},0,${p.a * 0.6})`;
          ctx.fill();
        }
      } else if (theme === "Crystal Grid") {
        // Geometric grid
        ctx.save();
        ctx.globalAlpha = 0.08;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1;
        const spacing = 60;
        for (let x = 0; x < W; x += spacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, H);
          ctx.stroke();
        }
        for (let y = 0; y < H; y += spacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }
        // Diagonal accents
        ctx.globalAlpha = 0.05;
        for (let i = -H; i < W + H; i += spacing * 2) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + H, H);
          ctx.stroke();
        }
        ctx.restore();
      } else if (theme === "Forest Depth") {
        // Green mist
        const mist = ctx.createLinearGradient(0, H * 0.4, 0, H);
        mist.addColorStop(0, "transparent");
        mist.addColorStop(1, `${accent}20`);
        ctx.fillStyle = mist;
        ctx.fillRect(0, 0, W, H);
      }

      // Subtle vignette
      const vig = ctx.createRadialGradient(
        W / 2,
        H / 2,
        H * 0.3,
        W / 2,
        H / 2,
        H * 0.8,
      );
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // ── Affirmation text cycling ──
      const DISPLAY_TIME = 1500; // ms per affirmation
      const FADE_TIME = 400;

      const timeSinceSwap = elapsed - lastSwapRef.current;

      if (fadingInRef.current) {
        textAlphaRef.current = Math.min(1, timeSinceSwap / FADE_TIME);
        if (
          textAlphaRef.current >= 1 &&
          timeSinceSwap > DISPLAY_TIME - FADE_TIME
        ) {
          fadingInRef.current = false;
        }
      } else {
        textAlphaRef.current = Math.max(
          0,
          1 - (timeSinceSwap - (DISPLAY_TIME - FADE_TIME)) / FADE_TIME,
        );
        if (textAlphaRef.current <= 0) {
          affIndexRef.current = (affIndexRef.current + 1) % affirmations.length;
          lastSwapRef.current = elapsed;
          fadingInRef.current = true;
          textAlphaRef.current = 0;
        }
      }

      const currentAff = affirmations[affIndexRef.current] ?? "";
      const alpha = textAlphaRef.current;

      // Glow behind text
      ctx.save();
      ctx.globalAlpha = alpha * 0.25;
      const glowGrad = ctx.createRadialGradient(
        W / 2,
        H / 2,
        0,
        W / 2,
        H / 2,
        300,
      );
      glowGrad.addColorStop(0, accent);
      glowGrad.addColorStop(1, "transparent");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // Main affirmation text
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Word-wrap the affirmation
      const maxWidth = W * 0.78;
      const fontSize =
        currentAff.length > 60 ? 28 : currentAff.length > 40 ? 34 : 40;
      ctx.font = `600 ${fontSize}px 'Segoe UI', system-ui, sans-serif`;

      const words = currentAff.split(" ");
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);

      const lineHeight = fontSize * 1.4;
      const totalHeight = lines.length * lineHeight;
      const startY = H / 2 - totalHeight / 2 + lineHeight / 2;

      // Shadow
      ctx.shadowColor = accent;
      ctx.shadowBlur = 24;

      for (let li = 0; li < lines.length; li++) {
        ctx.fillStyle = "#ffffff";
        ctx.fillText(lines[li], W / 2, startY + li * lineHeight);
      }
      ctx.restore();

      // Progress bar at bottom (if recording)
      if (isRecording && startTimeRef.current > 0) {
        const rec = (elapsed - startTimeRef.current) / (previewDuration * 1000);
        const barW = W * Math.min(rec, 1);
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = `${accent}40`;
        ctx.fillRect(0, H - 4, W, 4);
        ctx.fillStyle = accent;
        ctx.fillRect(0, H - 4, barW, 4);
        ctx.restore();
      }

      // Bottom info strip
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.font = "14px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      const label = chakra ? `${topic} · ${chakra} Chakra` : topic;
      ctx.fillText(label.toUpperCase(), W / 2, H - 14);
      ctx.restore();
    },
    [
      colors,
      accent,
      theme,
      affirmations,
      topic,
      chakra,
      isRecording,
      previewDuration,
    ],
  );

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startTime = performance.now();
    affIndexRef.current = 0;
    lastSwapRef.current = 0;
    fadingInRef.current = true;
    textAlphaRef.current = 0;

    const loop = (now: number) => {
      const elapsed = now - startTime;
      drawFrame(ctx, elapsed);
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [drawFrame]);

  const stopRecording = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    // Stop audio nodes
    for (const fn of audioStopFnsRef.current) {
      try {
        fn();
      } catch (_) {}
    }
    audioStopFnsRef.current = [];
    // Close audio context
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    window.speechSynthesis?.cancel();
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }, []);

  const handleRecord = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isRecording) {
      stopRecording();
      return;
    }

    chunksRef.current = [];
    setDownloadUrl(null);
    setMp4Url(null);
    setWebmFallbackUrl(null);
    setIsConverting(false);
    setProgress(0);

    // ── Build combined stream (canvas video + synthesized audio) ──
    const videoStream = canvas.captureStream(30);

    // Create a shared AudioContext and MediaStreamDestination for recording
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const audioCtx = new AudioCtxClass();
    audioCtxRef.current = audioCtx;
    const dest = audioCtx.createMediaStreamDestination();
    const stopFns: (() => void)[] = [];

    // Connect nature sound
    if (natureSound !== "None") {
      const stopNature = connectNatureSoundToCtx(
        natureSound,
        natureSoundVolume,
        audioCtx,
        dest,
      );
      stopFns.push(stopNature);
    }

    // Connect frequency tone
    const hz = Number.parseFloat(frequencyHz);
    if (!Number.isNaN(hz) && hz > 0) {
      const stopFreq = connectFrequencyToneToCtx(
        hz,
        frequencyWaveform,
        frequencyToneVolume,
        audioCtx,
        dest,
      );
      stopFns.push(stopFreq);
    }

    audioStopFnsRef.current = stopFns;

    // Start TTS cycling (Web Speech API — not capturable but plays during recording)
    const startTTSCycle = () => {
      if (!affirmations.length) return;
      const voices = window.speechSynthesis.getVoices();
      const femVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.includes("Samantha") ||
          v.name.includes("Victoria"),
      );
      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("male") ||
          v.name.includes("Daniel") ||
          v.name.includes("Alex"),
      );
      const selectedVoice = voiceType.includes("Female")
        ? femVoice
        : voiceType.includes("Male")
          ? maleVoice
          : undefined;
      const enabledLayers = audioLayers.filter((l) => l.enabled);
      for (const layer of enabledLayers) {
        const text = affirmations.slice(0, 10).join(". ");
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = layer.speed;
        utter.volume = layer.volume;
        utter.pitch = 1 + voicePitch * 0.1;
        if (selectedVoice) utter.voice = selectedVoice;
        window.speechSynthesis.speak(utter);
      }
    };
    startTTSCycle();

    // Combine video + audio tracks
    const combinedStream = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...dest.stream.getAudioTracks(),
    ]);

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
        ? "video/webm;codecs=vp8,opus"
        : "video/webm";
    const recorder = new MediaRecorder(combinedStream, { mimeType });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      setIsRecording(false);
      setProgress(100);
      // Stop audio after recorder stops
      for (const fn of audioStopFnsRef.current) {
        try {
          fn();
        } catch (_) {}
      }
      audioStopFnsRef.current = [];
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      window.speechSynthesis?.cancel();
      const blob = new Blob(chunksRef.current, { type: mimeType });

      // ── Convert WebM → MP4 via ffmpeg.wasm ──
      setIsConverting(true);
      setMp4Url(null);
      setWebmFallbackUrl(null);

      try {
        // Dynamically import ffmpeg via Function constructor to prevent rollup
        // from attempting to bundle these CDN-only packages at build time
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { FFmpeg } = (await new Function(
          'return import("@ffmpeg/ffmpeg")',
        )()) as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { fetchFile, toBlobURL } = (await new Function(
          'return import("@ffmpeg/util")',
        )()) as any;

        if (!ffmpegRef.current) {
          ffmpegRef.current = new FFmpeg();
        }
        const ffmpeg = ffmpegRef.current;

        if (!ffmpeg.loaded) {
          const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
          await ffmpeg.load({
            coreURL: await toBlobURL(
              `${baseURL}/ffmpeg-core.js`,
              "text/javascript",
            ),
            wasmURL: await toBlobURL(
              `${baseURL}/ffmpeg-core.wasm`,
              "application/wasm",
            ),
          });
        }

        await ffmpeg.writeFile("input.webm", await fetchFile(blob));
        await ffmpeg.exec([
          "-i",
          "input.webm",
          "-c:v",
          "copy",
          "-c:a",
          "aac",
          "output.mp4",
        ]);
        const data = await ffmpeg.readFile("output.mp4");
        // @ffmpeg/ffmpeg readFile returns Uint8Array | string; convert to safe BlobPart
        const rawData = data as Uint8Array | string;
        const mp4BlobParts: BlobPart[] =
          typeof rawData === "string"
            ? [rawData]
            : [new Uint8Array(rawData.buffer as ArrayBuffer)];
        const mp4Blob = new Blob(mp4BlobParts, { type: "video/mp4" });
        const mp4ObjectUrl = URL.createObjectURL(mp4Blob);
        setMp4Url(mp4ObjectUrl);
        setDownloadUrl(mp4ObjectUrl);
        toast.success("MP4 ready! Click Download to save your subliminal.");
      } catch (err) {
        console.error("FFmpeg conversion failed, falling back to WebM:", err);
        const webmUrl = URL.createObjectURL(blob);
        setWebmFallbackUrl(webmUrl);
        setDownloadUrl(webmUrl);
        toast.warning(
          "MP4 conversion unavailable — downloading as .webm instead.",
        );
      } finally {
        setIsConverting(false);
      }
    };

    recorder.start(100);
    setIsRecording(true);
    startTimeRef.current = performance.now();

    // Progress updater
    progressIntervalRef.current = setInterval(() => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      setProgress(Math.min((elapsed / previewDuration) * 100, 99));
    }, 300);

    // Auto-stop
    stopTimeoutRef.current = setTimeout(() => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      if (recorder.state !== "inactive") recorder.stop();
    }, previewDuration * 1000);
  }, [
    isRecording,
    previewDuration,
    natureSound,
    natureSoundVolume,
    frequencyHz,
    frequencyWaveform,
    frequencyToneVolume,
    affirmations,
    audioLayers,
    voiceType,
    voicePitch,
    stopRecording,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  useEffect(() => {
    return () => {
      if (mp4Url) URL.revokeObjectURL(mp4Url);
    };
  }, [mp4Url]);

  useEffect(() => {
    return () => {
      if (webmFallbackUrl) URL.revokeObjectURL(webmFallbackUrl);
    };
  }, [webmFallbackUrl]);

  useEffect(() => {
    return () => {
      if (ttsAudioUrl) URL.revokeObjectURL(ttsAudioUrl);
    };
  }, [ttsAudioUrl]);

  // ── TTS Export: AudioContext + MediaStreamDestination (no mic needed) ──
  const handleTTSExport = useCallback(() => {
    if (isTTSRecording) {
      // Stop current TTS recording
      window.speechSynthesis?.cancel();
      if (
        ttsRecorderRef.current &&
        ttsRecorderRef.current.state !== "inactive"
      ) {
        ttsRecorderRef.current.stop();
      }
      // Stop audio nodes
      for (const fn of ttsAudioStopFnsRef.current) {
        try {
          fn();
        } catch (_) {}
      }
      ttsAudioStopFnsRef.current = [];
      if (ttsAudioCtxRef.current) {
        ttsAudioCtxRef.current.close().catch(() => {});
        ttsAudioCtxRef.current = null;
      }
      setIsTTSRecording(false);
      return;
    }

    ttsChunksRef.current = [];
    setTtsAudioUrl(null);

    // Create AudioContext + MediaStreamDestination for recording synthesized audio
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const audioCtx = new AudioCtxClass();
    ttsAudioCtxRef.current = audioCtx;
    const dest = audioCtx.createMediaStreamDestination();
    const stopFns: (() => void)[] = [];

    // Connect nature sound to BOTH speakers and recording destination
    if (natureSound !== "None") {
      const stopNature = connectNatureSoundToCtx(
        natureSound,
        natureSoundVolume,
        audioCtx,
        dest,
      );
      // Also connect to speakers so user can hear it
      const stopNatureAudible = connectNatureSoundToCtx(
        natureSound,
        natureSoundVolume,
        audioCtx,
        audioCtx.destination,
      );
      stopFns.push(stopNature, stopNatureAudible);
    }

    // Connect frequency tone to BOTH speakers and recording destination
    const hz = Number.parseFloat(frequencyHz);
    if (!Number.isNaN(hz) && hz > 0) {
      const stopFreq = connectFrequencyToneToCtx(
        hz,
        frequencyWaveform,
        frequencyToneVolume,
        audioCtx,
        dest,
      );
      const stopFreqAudible = connectFrequencyToneToCtx(
        hz,
        frequencyWaveform,
        frequencyToneVolume,
        audioCtx,
        audioCtx.destination,
      );
      stopFns.push(stopFreq, stopFreqAudible);
    }

    ttsAudioStopFnsRef.current = stopFns;

    const mimeTypeAudio = MediaRecorder.isTypeSupported(
      "audio/webm;codecs=opus",
    )
      ? "audio/webm;codecs=opus"
      : "audio/webm";

    // Record from the MediaStreamDestination (captures nature + frequency audio)
    const ttsRecorder = new MediaRecorder(dest.stream, {
      mimeType: mimeTypeAudio,
    });
    ttsRecorderRef.current = ttsRecorder;

    ttsRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) ttsChunksRef.current.push(e.data);
    };

    ttsRecorder.onstop = () => {
      setIsTTSRecording(false);
      // Cleanup audio
      for (const fn of ttsAudioStopFnsRef.current) {
        try {
          fn();
        } catch (_) {}
      }
      ttsAudioStopFnsRef.current = [];
      if (ttsAudioCtxRef.current) {
        ttsAudioCtxRef.current.close().catch(() => {});
        ttsAudioCtxRef.current = null;
      }
      const audioBlob = new Blob(ttsChunksRef.current, { type: mimeTypeAudio });
      const url = URL.createObjectURL(audioBlob);
      setTtsAudioUrl(url);
      toast.success("TTS audio captured! Click Download TTS to save.");
    };

    ttsRecorder.start(100);
    setIsTTSRecording(true);

    // Speak all affirmations via Web Speech API (plays through speakers)
    const voices = window.speechSynthesis.getVoices();
    const femVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        v.name.includes("Samantha") ||
        v.name.includes("Victoria"),
    );
    const maleVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("male") ||
        v.name.includes("Daniel") ||
        v.name.includes("Alex"),
    );
    const selectedVoice = voiceType.includes("Female")
      ? femVoice
      : voiceType.includes("Male")
        ? maleVoice
        : undefined;

    const speakAll = () => {
      const text = affirmations.join(". ");
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.9;
      utter.volume = 1;
      utter.pitch = 1 + voicePitch * 0.1;
      if (selectedVoice) utter.voice = selectedVoice;
      utter.onend = () => {
        // Give a short buffer after speech ends, then stop recording
        setTimeout(() => {
          if (
            ttsRecorderRef.current &&
            ttsRecorderRef.current.state !== "inactive"
          ) {
            ttsRecorderRef.current.stop();
          }
        }, 500);
      };
      window.speechSynthesis.speak(utter);
    };

    // Wait for voices to load if needed
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = speakAll;
    } else {
      speakAll();
    }
  }, [
    isTTSRecording,
    affirmations,
    voiceType,
    voicePitch,
    natureSound,
    natureSoundVolume,
    frequencyHz,
    frequencyWaveform,
    frequencyToneVolume,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-4 mt-4"
    >
      <div className="rounded-xl overflow-hidden border border-border/40 bg-black relative">
        {/* 16:9 canvas wrapper */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {isRecording && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Recording preview…</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}

        {isConverting && (
          <div className="flex items-center gap-2 text-xs text-amber-400/90 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>
              Converting to MP4… this may take a moment on first run (loading
              codec)
            </span>
          </div>
        )}

        {isTTSRecording && (
          <div className="flex items-center gap-2 text-xs text-rose-400/90 bg-rose-400/10 border border-rose-400/20 rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
            <span>
              Recording TTS + audio mix… affirmations are playing through
              speakers
            </span>
          </div>
        )}

        {/* Row 1: record + download video */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleRecord}
            disabled={isConverting}
            variant={isRecording ? "destructive" : "outline"}
            className={`gap-2 font-heading font-semibold w-full sm:w-auto ${
              isRecording
                ? "border-red-500/60"
                : "border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/70"
            }`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                Record ({fmtDuration(previewDuration)})
              </>
            )}
          </Button>

          {mp4Url && !isConverting && (
            <Button
              asChild
              className="gap-2 bg-primary/90 hover:bg-primary font-heading font-semibold w-full sm:w-auto"
            >
              <a href={mp4Url} download="synapse-subliminal.mp4">
                <Download className="w-4 h-4" />
                Download Video (.mp4)
              </a>
            </Button>
          )}

          {webmFallbackUrl && !isConverting && !mp4Url && (
            <Button
              asChild
              className="gap-2 bg-primary/90 hover:bg-primary font-heading font-semibold w-full sm:w-auto"
            >
              <a href={webmFallbackUrl} download="synapse-subliminal.webm">
                <Download className="w-4 h-4" />
                Download Video (.webm)
              </a>
            </Button>
          )}
        </div>

        {/* Row 2: TTS export */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleTTSExport}
            disabled={isRecording || isConverting || affirmations.length === 0}
            variant="outline"
            className={`gap-2 font-heading font-semibold w-full sm:w-auto ${
              isTTSRecording
                ? "border-rose-500/60 text-rose-400 hover:bg-rose-500/10"
                : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {isTTSRecording ? (
              <>
                <Square className="w-4 h-4" />
                Stop TTS Recording
              </>
            ) : (
              <>
                <Music className="w-4 h-4" />
                Capture TTS Audio
              </>
            )}
          </Button>

          {ttsAudioUrl && !isTTSRecording && (
            <Button
              asChild
              variant="outline"
              className="gap-2 border-border/50 text-muted-foreground hover:text-foreground font-heading font-semibold w-full sm:w-auto"
            >
              <a href={ttsAudioUrl} download="synapse-tts.webm">
                <Download className="w-4 h-4" />
                Download TTS (.webm)
              </a>
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed space-y-1">
          <span className="block">
            Video records for {fmtDuration(previewDuration)} with frequency tone
            and nature sound baked in — downloads as <strong>.mp4</strong>.{" "}
            {previewDuration >= 3600 && (
              <span className="text-amber-400/80">
                Long recordings use more memory — keep the tab active until
                recording stops.
              </span>
            )}
          </span>
          <span className="block">
            <strong>Capture TTS Audio</strong> records nature sound + frequency
            tone into an audio file. TTS affirmations play through your speakers
            simultaneously — no microphone required.
          </span>
        </p>
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function GeneratorPage({
  injectedTopic,
  onInjectedTopicConsumed,
  onSubliminalUpdate,
  onNavigate,
}: GeneratorPageProps = {}) {
  // Step 1 state
  const [topic, setTopic] = useState("");
  const [modes, setModes] = useState<Record<ModeKey, boolean>>({
    booster: false,
    fantasy: false,
    protection: false,
    chakraAlignment: false,
  });
  const [selectedChakras, setSelectedChakras] = useState<string[]>([]);

  // Fantasy-to-Reality sub-functions
  const [characterEnabled, setCharacterEnabled] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [characterSource, setCharacterSource] = useState("");
  const [characterLocation, setCharacterLocation] = useState("");
  const [characterTimeFrame, setCharacterTimeFrame] = useState("");
  const [itemEnabled, setItemEnabled] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemSource, setItemSource] = useState("");
  const [itemLocation, setItemLocation] = useState("");
  const [itemTimeFrame, setItemTimeFrame] = useState("");
  const [symbioticEnabled, setSymbioticEnabled] = useState(false);
  const [symbioticName, setSymbioticName] = useState("");
  const [symbioticSource, setSymbioticSource] = useState("");
  const [symbioticBondType, setSymbioticBondType] = useState("");
  const [symbioticLocation, setSymbioticLocation] = useState("");
  const [symbioticTimeFrame, setSymbioticTimeFrame] = useState("");

  // Booster level
  const [boosterLevel, setBoosterLevel] = useState<BoosterLevel>("standard");
  const [boosterCustomPhrase, setBoosterCustomPhrase] = useState("");

  // Wealth presets panel
  const [wealthPresetsOpen, setWealthPresetsOpen] = useState(false);

  // ── Personal Subliminal ───────────────────────────────────────────────────
  const [personalEnabled, setPersonalEnabled] = useState(false);
  const [personalTargets, setPersonalTargets] = useState<PersonalTarget[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      relationship: "",
      intent: "Healing",
      customIntent: "",
      wish: "",
      energyColor: "",
    },
  ]);

  // ── Personal Subliminal Advanced Options ─────────────────────────────────
  const [personalAffStyle, setPersonalAffStyle] = useState<
    "about" | "to" | "hybrid"
  >("about");
  const [personalRelHealingMode, setPersonalRelHealingMode] = useState(false);
  const [personalCoreIssue, setPersonalCoreIssue] = useState("");
  const [personalGroupMode, setPersonalGroupMode] = useState(false);
  const [personalGroupDesc, setPersonalGroupDesc] = useState("");
  const [personalBlessingIntensity, setPersonalBlessingIntensity] = useState(3);
  const [personalProtectionSeal, setPersonalProtectionSeal] = useState(false);
  const [personalManifestSpeed, setPersonalManifestSpeed] = useState<
    "gradual" | "accelerated" | "instant"
  >("gradual");
  const [personalMirrorMode, setPersonalMirrorMode] = useState(false);
  const [personalLoveFreq, setPersonalLoveFreq] = useState(false);
  const [personalCordCutting, setPersonalCordCutting] = useState(false);
  const [personalCordDesc, setPersonalCordDesc] = useState("");
  const [personalAncestralHealing, setPersonalAncestralHealing] =
    useState(false);
  const [personalTimeline, setPersonalTimeline] = useState("Present");
  const [personalEmotionalLayers, setPersonalEmotionalLayers] = useState<
    string[]
  >([]);
  const [personalNote, setPersonalNote] = useState("");
  const [personalNoteOpen, setPersonalNoteOpen] = useState(false);

  // ── Personal Subliminal — Extra Advanced Options ──────────────────────────
  const [personalSoulDepth, setPersonalSoulDepth] = useState("Heart");
  const [personalDivineTiming, setPersonalDivineTiming] = useState(false);
  const [personalKarmaClearing, setPersonalKarmaClearing] = useState(false);
  const [personalTwinFlame, setPersonalTwinFlame] = useState(false);
  const [personalEthericCord, setPersonalEthericCord] = useState(false);
  const [personalVowClearing, setPersonalVowClearing] = useState(false);
  const [personalDNACode, setPersonalDNACode] = useState(false);
  const [personalAkashicUpdate, setPersonalAkashicUpdate] = useState(false);
  const [personalFreqMatch, setPersonalFreqMatch] = useState(false);
  const [personalFreqHz, setPersonalFreqHz] = useState("528Hz");
  const [personalSharedDream, setPersonalSharedDream] = useState(false);
  const [personalHeartWall, setPersonalHeartWall] = useState(false);
  const [personalUnconditionalLove, setPersonalUnconditionalLove] =
    useState(false);
  const [personalSoulRetrieval, setPersonalSoulRetrieval] = useState(false);
  const [personalDNAReprog, setPersonalDNAReprog] = useState(false);
  const [personalInnerChildProtect, setPersonalInnerChildProtect] =
    useState(false);

  // ── Protection Sub-Panel ──────────────────────────────────────────────────
  const [protectionTypes, setProtectionTypes] = useState<string[]>([]);
  const [protectionStrength, setProtectionStrength] = useState("Absolute");
  const [protectFrom, setProtectFrom] = useState<string[]>([]);
  const [protectionEntity, setProtectionEntity] = useState("");
  const [auricLayer, setAuricLayer] = useState("All Layers");
  const [protectionGeometry, setProtectionGeometry] = useState<string[]>([]);
  const [protectionDuration, setProtectionDuration] = useState("Permanent");
  const [protectionBoost, setProtectionBoost] = useState(false);

  // ── Advanced Functions — Extra ────────────────────────────────────────────
  const [astralEnabled, setAstralEnabled] = useState(false);
  const [astralIntent, setAstralIntent] = useState("");
  const [lucidDreamEnabled, setLucidDreamEnabled] = useState(false);
  const [lucidDreamScenario, setLucidDreamScenario] = useState("");
  const [parallelSelfEnabled, setParallelSelfEnabled] = useState(false);
  const [parallelSelfType, setParallelSelfType] = useState("Wealthiest Self");
  const [voidMeditationEnabled, setVoidMeditationEnabled] = useState(false);
  const [sacredFlameEnabled, setSacredFlameEnabled] = useState(false);
  const [sacredFlameColor, setSacredFlameColor] = useState("Violet");
  const [quantumObserverEnabled, setQuantumObserverEnabled] = useState(false);
  const [divineBlueprintEnabled, setDivineBlueprintEnabled] = useState(false);
  const [morphicFieldEnabled, setMorphicFieldEnabled] = useState(false);
  const [morphicFieldName, setMorphicFieldName] = useState("");

  // ── Booster Extras ────────────────────────────────────────────────────────
  const [boosterTargets, setBoosterTargets] = useState<string[]>(["Self"]);
  const [quantumAmp, setQuantumAmp] = useState(false);
  const [parallelUniversePull, setParallelUniversePull] = useState(false);
  const [godMode, setGodMode] = useState(false);

  // ── Fantasy Extra Sub-Types ───────────────────────────────────────────────
  const [mythicalCreatureEnabled, setMythicalCreatureEnabled] = useState(false);
  const [mythicalCreatureName, setMythicalCreatureName] = useState("");
  const [mythicalCreatureSpecies, setMythicalCreatureSpecies] = useState("");
  const [mythicalCreatureBondType, setMythicalCreatureBondType] = useState("");
  const [mythicalCreatureLocation, setMythicalCreatureLocation] = useState("");
  const [mythicalCreatureTimeFrame, setMythicalCreatureTimeFrame] =
    useState("");
  const [soulFragmentEnabled, setSoulFragmentEnabled] = useState(false);
  const [soulFragmentDesc, setSoulFragmentDesc] = useState("");
  const [soulFragmentRealm, setSoulFragmentRealm] = useState("");
  const [soulFragmentMethod, setSoulFragmentMethod] = useState("Dream");
  const [soulFragmentTimeFrame, setSoulFragmentTimeFrame] = useState("");
  const [powerInheritanceEnabled, setPowerInheritanceEnabled] = useState(false);
  const [powerInheritanceSource, setPowerInheritanceSource] = useState("");
  const [powerInheritancePower, setPowerInheritancePower] = useState("");
  const [powerInheritanceTrigger, setPowerInheritanceTrigger] = useState("");
  const [powerInheritanceLocation, setPowerInheritanceLocation] = useState("");
  const [powerInheritanceTimeFrame, setPowerInheritanceTimeFrame] =
    useState("");

  // ── Chakra Extras ─────────────────────────────────────────────────────────
  const [chakraToneViz, setChakraToneViz] = useState(false);

  // ── Multi-Subliminal Stack ────────────────────────────────────────────────
  const [stackEnabled, setStackEnabled] = useState(false);
  const [stackedTopics, setStackedTopics] = useState<string[]>([]);
  const [stackInputValue, setStackInputValue] = useState("");

  // ── Advanced Functions panel ──────────────────────────────────────────────
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // ── Adult Themes panel ────────────────────────────────────────────────────
  const [adultThemesOpen, setAdultThemesOpen] = useState(false);

  // 1. Deity/Entity Invocation
  const [deityEnabled, setDeityEnabled] = useState(false);
  const [deityName, setDeityName] = useState("");
  const [deityPantheon, setDeityPantheon] = useState("");

  // 2. Spell Weaving
  const [spellEnabled, setSpellEnabled] = useState(false);
  const [spellArchetype, setSpellArchetype] = useState("Attraction");
  const [spellCustom, setSpellCustom] = useState("");

  // 3. Soul Contract
  const [soulContractEnabled, setSoulContractEnabled] = useState(false);
  const [soulContractEntity, setSoulContractEntity] = useState("the Universe");

  // 4. Shadow Work Integration
  const [shadowWorkEnabled, setShadowWorkEnabled] = useState(false);
  const [shadowWorkBlock, setShadowWorkBlock] = useState("");

  // 5. Reality Scripting
  const [realityScriptEnabled, setRealityScriptEnabled] = useState(false);
  const [realityScriptTimeAgo, setRealityScriptTimeAgo] =
    useState("months ago");

  // 6. Frequency Attunement
  const [frequencyAttunementEnabled, setFrequencyAttunementEnabled] =
    useState(false);
  const [frequencyAttunementHz, setFrequencyAttunementHz] = useState("528");

  // 7. Sigil Activation
  const [sigilActivationEnabled, setSigilActivationEnabled] = useState(false);
  const [sigilName, setSigilName] = useState("");

  // 8. Kinesis Integration
  const [kinesisEnabled, setKinesisEnabled] = useState(false);
  const [selectedKinesis, setSelectedKinesis] = useState("");
  const [kinesisSearch, setKinesisSearch] = useState("");

  // Step 2 state
  const [affirmationCount, setAffirmationCount] = useState(50);
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [generationSource, setGenerationSource] = useState<
    "ai" | "rule-based" | null
  >(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Step 3 config
  const [voiceType, setVoiceType] = useState("Neural Female");
  const [voicePitch, setVoicePitch] = useState(0);

  // 3-Layer Audio Stack
  const [audioLayers, setAudioLayers] = useState([
    { enabled: true, speed: 1.0, volume: 0.8 }, // Layer 1 — Normal
    { enabled: true, speed: 1.8, volume: 0.6 }, // Layer 2 — Fast
    { enabled: true, speed: 0.55, volume: 0.6 }, // Layer 3 — Slow
  ]);
  const [repetitionCount, setRepetitionCount] = useState(10);
  const [whisperOverlay, setWhisperOverlay] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState("Theta Waves");
  const [subliminalFreq, setSubliminalFreq] = useState("528Hz");
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [subliminalVolume, setSubliminalVolume] = useState(0.7);
  const [waveformOverlay, setWaveformOverlay] = useState(false);
  const [stereoMovement, setStereoMovement] = useState(false);
  const [themeStyle, setThemeStyle] = useState("Dark Cosmic");
  const [colorPalette, setColorPalette] = useState("Violet/Indigo");
  const [resolution, setResolution] = useState("1080p");
  const [duration, setDuration] = useState(300);
  const [frameRate, setFrameRate] = useState(30);

  // Nature sound
  const [natureSound, setNatureSound] = useState("None");
  const [natureSoundVolume, setNatureSoundVolume] = useState(0.5);
  const [isNaturePlaying, setIsNaturePlaying] = useState(false);
  const natureSoundStopRef = useRef<(() => void) | null>(null);

  // Frequency tone
  const [frequencyHz, setFrequencyHz] = useState("528");
  const [frequencyWaveform, setFrequencyWaveform] =
    useState<OscillatorType>("sine");
  const [frequencyToneVolume, setFrequencyToneVolume] = useState(0.4);
  const [isFrequencyPlaying, setIsFrequencyPlaying] = useState(false);
  const frequencyStopRef = useRef<(() => void) | null>(null);

  // TTS
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);

  // Mix preview
  const [isMixPlaying, setIsMixPlaying] = useState(false);

  // Step 4 state
  const [projectJSON, setProjectJSON] = useState("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [loadedJSON, setLoadedJSON] = useState<string | null>(null);

  // Auto-sync frequencyAttunementHz from frequencyHz when Frequency Attunement is toggled on
  useEffect(() => {
    if (frequencyAttunementEnabled && frequencyHz) {
      setFrequencyAttunementHz(frequencyHz);
    }
  }, [frequencyAttunementEnabled, frequencyHz]);

  // Consume topic injected from Wiki Search
  useEffect(() => {
    if (injectedTopic?.trim()) {
      setTopic(injectedTopic.trim());
      onInjectedTopicConsumed?.();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [injectedTopic, onInjectedTopicConsumed]);

  // Cleanup all audio on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      natureSoundStopRef.current?.();
      frequencyStopRef.current?.();
    };
  }, []);

  const generateMutation = useGenerateAffirmations();
  const saveMutation = useSaveProject();
  const deleteMutation = useDeleteProject();
  const getProjectMutation = useGetProject();
  const { data: projects, isLoading: projectsLoading } = useListProjects();

  const toggleMode = useCallback((key: ModeKey) => {
    setModes((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleToggleChakra = useCallback((name: string) => {
    setSelectedChakras((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
  }, []);

  const allChakrasSelected = selectedChakras.length === CHAKRAS.length;

  const handleAllChakras = useCallback(() => {
    setSelectedChakras(allChakrasSelected ? [] : [...CHAKRAS]);
  }, [allChakrasSelected]);

  const handleToggleNatureSound = useCallback(() => {
    if (isNaturePlaying) {
      natureSoundStopRef.current?.();
      natureSoundStopRef.current = null;
      setIsNaturePlaying(false);
    } else {
      if (natureSound === "None") return;
      const stop = startNatureSound(natureSound, natureSoundVolume);
      natureSoundStopRef.current = stop;
      setIsNaturePlaying(true);
    }
  }, [isNaturePlaying, natureSound, natureSoundVolume]);

  const handleToggleFrequency = useCallback(() => {
    if (isFrequencyPlaying) {
      frequencyStopRef.current?.();
      frequencyStopRef.current = null;
      setIsFrequencyPlaying(false);
    } else {
      const hz = Number.parseFloat(frequencyHz);
      if (Number.isNaN(hz) || hz <= 0) return;
      const stop = startFrequencyTone(
        hz,
        frequencyWaveform,
        frequencyToneVolume,
      );
      frequencyStopRef.current = stop;
      setIsFrequencyPlaying(true);
    }
  }, [isFrequencyPlaying, frequencyHz, frequencyWaveform, frequencyToneVolume]);

  const handleTTSPlay = useCallback(() => {
    if (!affirmations.length) {
      toast.error("Generate affirmations first");
      return;
    }
    if (isTTSPlaying) {
      window.speechSynthesis.cancel();
      setIsTTSPlaying(false);
      return;
    }
    const text = affirmations.slice(0, 5).join(". ");
    const voices = window.speechSynthesis.getVoices();
    const femVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("female") ||
        v.name.includes("Samantha") ||
        v.name.includes("Victoria"),
    );
    const maleVoice = voices.find(
      (v) =>
        v.name.toLowerCase().includes("male") ||
        v.name.includes("Daniel") ||
        v.name.includes("Alex"),
    );
    const selectedVoice = voiceType.includes("Female")
      ? femVoice
      : voiceType.includes("Male")
        ? maleVoice
        : undefined;

    let completedCount = 0;
    const enabledLayers = audioLayers.filter((l) => l.enabled);

    for (const layer of enabledLayers) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = layer.speed;
      utter.volume = layer.volume;
      utter.pitch = 1 + voicePitch * 0.1;
      if (selectedVoice) utter.voice = selectedVoice;
      utter.onend = () => {
        completedCount++;
        if (completedCount >= enabledLayers.length) setIsTTSPlaying(false);
      };
      utter.onerror = () => {
        completedCount++;
        if (completedCount >= enabledLayers.length) setIsTTSPlaying(false);
      };
      window.speechSynthesis.speak(utter);
    }

    if (enabledLayers.length > 0) setIsTTSPlaying(true);
  }, [affirmations, isTTSPlaying, audioLayers, voicePitch, voiceType]);

  const handleToggleMix = useCallback(() => {
    if (isMixPlaying) {
      // Stop all
      window.speechSynthesis.cancel();
      natureSoundStopRef.current?.();
      natureSoundStopRef.current = null;
      frequencyStopRef.current?.();
      frequencyStopRef.current = null;
      setIsTTSPlaying(false);
      setIsNaturePlaying(false);
      setIsFrequencyPlaying(false);
      setIsMixPlaying(false);
    } else {
      if (!affirmations.length) {
        toast.error("Generate affirmations first");
        return;
      }
      // Start all enabled TTS layers simultaneously
      const text = affirmations.slice(0, 5).join(". ");
      const voices = window.speechSynthesis.getVoices();
      const femVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.includes("Samantha") ||
          v.name.includes("Victoria"),
      );
      const selectedVoice = voiceType.includes("Female") ? femVoice : undefined;
      let completedCount = 0;
      const enabledLayers = audioLayers.filter((l) => l.enabled);
      for (const layer of enabledLayers) {
        const utter = new SpeechSynthesisUtterance(text);
        utter.rate = layer.speed;
        utter.volume = layer.volume;
        utter.pitch = 1 + voicePitch * 0.1;
        if (selectedVoice) utter.voice = selectedVoice;
        utter.onend = () => {
          completedCount++;
          if (completedCount >= enabledLayers.length) setIsTTSPlaying(false);
        };
        window.speechSynthesis.speak(utter);
      }
      if (enabledLayers.length > 0) setIsTTSPlaying(true);

      // Start nature sound
      if (natureSound !== "None") {
        const stopNature = startNatureSound(natureSound, natureSoundVolume);
        natureSoundStopRef.current = stopNature;
        setIsNaturePlaying(true);
      }

      // Start frequency tone
      const hz = Number.parseFloat(frequencyHz);
      if (!Number.isNaN(hz) && hz > 0) {
        const stopFreq = startFrequencyTone(
          hz,
          frequencyWaveform,
          frequencyToneVolume,
        );
        frequencyStopRef.current = stopFreq;
        setIsFrequencyPlaying(true);
      }

      setIsMixPlaying(true);
    }
  }, [
    isMixPlaying,
    affirmations,
    audioLayers,
    voicePitch,
    voiceType,
    natureSound,
    natureSoundVolume,
    frequencyHz,
    frequencyWaveform,
    frequencyToneVolume,
  ]);

  /** Expand a base set of affirmations to exactly `count` by cycling through them */
  const expandToCount = useCallback(
    (base: string[], count: number): string[] => {
      if (base.length === 0) return [];
      if (base.length >= count) return base.slice(0, count);
      const expanded: string[] = [];
      for (let i = 0; i < count; i++) {
        expanded.push(base[i % base.length]);
      }
      return expanded;
    },
    [],
  );

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your affirmations.");
      return;
    }
    setIsGenerating(true);

    const advancedConfig = {
      deityEnabled,
      deityName,
      deityPantheon,
      spellEnabled,
      spellArchetype,
      spellCustom,
      soulContractEnabled,
      soulContractEntity,
      shadowWorkEnabled,
      shadowWorkBlock,
      realityScriptEnabled,
      realityScriptTimeAgo,
      frequencyAttunementEnabled,
      frequencyAttunementHz,
      sigilActivationEnabled,
      sigilName,
      kinesisEnabled,
      selectedKinesis,
    };

    // Effective topic for AI: join all stacked topics
    const effectiveTopic =
      stackEnabled && stackedTopics.length > 0
        ? [topic, ...stackedTopics].join(", ")
        : topic;

    // Active personal targets (non-empty names only), with group mode injection
    let activePersonalTargets =
      personalEnabled && personalTargets.filter((p) => p.name.trim()).length > 0
        ? personalTargets.filter((p) => p.name.trim())
        : undefined;
    if (personalEnabled && personalGroupMode && personalGroupDesc.trim()) {
      activePersonalTargets = [
        {
          id: "group-target",
          name: personalGroupDesc.trim(),
          relationship: "group",
          intent: "Healing",
          customIntent: "",
          wish: "",
          energyColor: "",
        },
      ];
    }

    // Active stacked topics
    const activeStackedTopics =
      stackEnabled && stackedTopics.length > 0 ? stackedTopics : undefined;

    try {
      const aiResult = await generateAffirmationsWithAI(
        effectiveTopic,
        modes.booster,
        modes.fantasy,
        modes.protection,
        selectedChakras.join(", "),
        modes.fantasy && characterEnabled ? characterName : undefined,
        modes.fantasy && characterEnabled ? characterSource : undefined,
        modes.fantasy && itemEnabled ? itemName : undefined,
        modes.fantasy && itemEnabled ? itemSource : undefined,
        modes.fantasy && symbioticEnabled ? symbioticName : undefined,
        modes.fantasy && symbioticEnabled ? symbioticSource : undefined,
        modes.fantasy && symbioticEnabled ? symbioticBondType : undefined,
        boosterLevel,
        boosterCustomPhrase,
        modes.fantasy && characterEnabled ? characterLocation : undefined,
        modes.fantasy && characterEnabled ? characterTimeFrame : undefined,
        modes.fantasy && itemEnabled ? itemLocation : undefined,
        modes.fantasy && itemEnabled ? itemTimeFrame : undefined,
        modes.fantasy && symbioticEnabled ? symbioticLocation : undefined,
        modes.fantasy && symbioticEnabled ? symbioticTimeFrame : undefined,
        advancedConfig,
        activePersonalTargets,
        activeStackedTopics,
        personalAffStyle,
        personalBlessingIntensity,
        personalProtectionSeal,
        personalManifestSpeed,
        personalMirrorMode,
        personalLoveFreq,
        personalCordCutting,
        personalCordDesc,
        personalAncestralHealing,
        personalTimeline,
        personalEmotionalLayers,
        personalSoulRetrieval,
        personalDNAReprog,
        personalInnerChildProtect,
        modes.protection
          ? {
              types: protectionTypes,
              strength: protectionStrength,
              entity: protectionEntity,
              geometry: protectionGeometry,
              duration: protectionDuration,
              boost: protectionBoost,
            }
          : undefined,
      );

      if (aiResult && aiResult.length > 0) {
        const expanded = expandToCount(aiResult, affirmationCount);
        setAffirmations(expanded);
        setGenerationSource("ai");
        toast.success(`Generated ${expanded.length} affirmations (AI)`);
        onSubliminalUpdate?.({
          topic,
          affirmations: expanded,
          modes,
          selectedChakras,
          colorPalette,
          themeStyle,
        });
        return;
      }

      // Use the rich frontend affirmation engine as the primary rule-based generator
      const { generateAffirmations: genLocal } = await import(
        "../utils/affirmationUtils"
      );
      const hasCharacter =
        modes.fantasy && characterEnabled && characterName.trim();
      const hasItem = modes.fantasy && itemEnabled && itemName.trim();
      const hasSymbiotic =
        modes.fantasy && symbioticEnabled && symbioticName.trim();
      const localResult = genLocal(
        topic,
        modes.booster,
        modes.fantasy,
        modes.protection,
        selectedChakras,
        hasCharacter ? characterName : undefined,
        hasCharacter ? characterSource : undefined,
        hasItem ? itemName : undefined,
        hasItem ? itemSource : undefined,
        hasSymbiotic ? symbioticName : undefined,
        hasSymbiotic ? symbioticSource : undefined,
        hasSymbiotic ? symbioticBondType : undefined,
        boosterLevel,
        boosterCustomPhrase,
        hasCharacter ? characterLocation : undefined,
        hasCharacter ? characterTimeFrame : undefined,
        hasItem ? itemLocation : undefined,
        hasItem ? itemTimeFrame : undefined,
        hasSymbiotic ? symbioticLocation : undefined,
        hasSymbiotic ? symbioticTimeFrame : undefined,
        advancedConfig,
        activePersonalTargets,
        activeStackedTopics,
        personalAffStyle,
        personalBlessingIntensity,
        personalProtectionSeal,
        personalManifestSpeed,
        personalMirrorMode,
        personalLoveFreq,
        personalCordCutting,
        personalCordDesc,
        personalAncestralHealing,
        personalTimeline,
        personalEmotionalLayers,
        personalSoulRetrieval,
        personalDNAReprog,
        personalInnerChildProtect,
        modes.protection
          ? {
              types: protectionTypes,
              strength: protectionStrength,
              entity: protectionEntity,
              geometry: protectionGeometry,
              duration: protectionDuration,
              boost: protectionBoost,
            }
          : undefined,
      );
      const expanded = expandToCount(localResult, affirmationCount);
      setAffirmations(expanded);
      setGenerationSource("rule-based");
      toast.success(`Generated ${expanded.length} affirmations`);
      onSubliminalUpdate?.({
        topic,
        affirmations: expanded,
        modes,
        selectedChakras,
        colorPalette,
        themeStyle,
      });
    } catch (_e) {
      toast.error("Failed to generate affirmations. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAffirmations = async () => {
    if (!affirmations.length) return;
    await navigator.clipboard.writeText(affirmations.join("\n"));
    setCopied(true);
    toast.success("Affirmations copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuild = () => {
    if (!affirmations.length) {
      toast.error("Please generate affirmations first.");
      return;
    }

    setIsBuilding(true);
    setShowVideoPreview(false);

    try {
      const ffmpegCmd = `ffmpeg -loop 1 -i background.jpg -filter_complex "[0:a][1:a][2:a]amix=inputs=3:duration=longest" -c:v libx264 -t ${duration} output.mp4`;

      const payload = {
        project: {
          topic,
          version: "1.0",
          format: "mp4",
          generated_at: new Date().toISOString(),
        },
        affirmations,
        modes: {
          booster: modes.booster,
          booster_level: modes.booster ? boosterLevel : null,
          booster_custom_phrase:
            modes.booster && boosterLevel === "custom"
              ? boosterCustomPhrase
              : null,
          fantasy_to_reality: modes.fantasy,
          protection: modes.protection,
          character_manifestation:
            modes.fantasy && characterEnabled
              ? {
                  enabled: true,
                  character: characterName,
                  source: characterSource || null,
                  location: characterLocation || null,
                  time_frame: characterTimeFrame || null,
                }
              : { enabled: false },
          item_manifestation:
            modes.fantasy && itemEnabled
              ? {
                  enabled: true,
                  item: itemName,
                  source: itemSource || null,
                  location: itemLocation || null,
                  time_frame: itemTimeFrame || null,
                }
              : { enabled: false },
          symbiotic_manifestation:
            modes.fantasy && symbioticEnabled
              ? {
                  enabled: true,
                  entity: symbioticName,
                  source: symbioticSource || null,
                  bond_type: symbioticBondType || "symbiotic bond",
                  location: symbioticLocation || null,
                  time_frame: symbioticTimeFrame || null,
                }
              : { enabled: false },
        },
        chakra: selectedChakras,
        voice: {
          type: voiceType,
          pitch: voicePitch,
          repetition_count: repetitionCount,
          whisper_overlay: whisperOverlay,
          layers: [
            {
              layer: 1,
              label: "Normal",
              enabled: audioLayers[0].enabled,
              speed: audioLayers[0].speed,
              volume: audioLayers[0].volume,
              alignment: "base",
            },
            {
              layer: 2,
              label: "Fast",
              enabled: audioLayers[1].enabled,
              speed: audioLayers[1].speed,
              volume: audioLayers[1].volume,
              alignment: "loops_to_match_duration",
            },
            {
              layer: 3,
              label: "Slow",
              enabled: audioLayers[2].enabled,
              speed: audioLayers[2].speed,
              volume: audioLayers[2].volume,
              alignment: "stretches_to_match_duration",
            },
          ],
        },
        audio: {
          background_music: backgroundMusic,
          subliminal_frequency: subliminalFreq,
          music_volume: musicVolume,
          subliminal_volume: subliminalVolume,
          waveform_overlay: waveformOverlay,
          stereo_movement: stereoMovement,
          nature_sound: {
            type: natureSound,
            volume: natureSoundVolume,
          },
          frequency_tone: {
            hz: Number.parseFloat(frequencyHz),
            waveform: frequencyWaveform,
            volume: frequencyToneVolume,
          },
        },
        visual: {
          theme: themeStyle,
          color_palette: colorPalette,
          waveform_overlay: waveformOverlay,
        },
        render: {
          resolution,
          duration_seconds: duration,
          frame_rate: frameRate,
          output_format: "mp4",
          encoder: "h264",
          audio_codec: "aac",
        },
        ffmpeg_command: ffmpegCmd,
        advanced_functions: {
          deity_invocation: deityEnabled
            ? {
                enabled: true,
                deity: deityName,
                pantheon: deityPantheon || null,
              }
            : { enabled: false },
          spell_weaving: spellEnabled
            ? {
                enabled: true,
                archetype: spellArchetype,
                custom: spellCustom || null,
              }
            : { enabled: false },
          soul_contract: soulContractEnabled
            ? { enabled: true, entity: soulContractEntity }
            : { enabled: false },
          shadow_work: shadowWorkEnabled
            ? { enabled: true, block: shadowWorkBlock || null }
            : { enabled: false },
          reality_scripting: realityScriptEnabled
            ? { enabled: true, time_ago: realityScriptTimeAgo }
            : { enabled: false },
          frequency_attunement: frequencyAttunementEnabled
            ? { enabled: true, hz: frequencyAttunementHz }
            : { enabled: false },
          sigil_activation: sigilActivationEnabled
            ? { enabled: true, sigil: sigilName }
            : { enabled: false },
          kinesis_integration:
            kinesisEnabled && selectedKinesis
              ? { enabled: true, power: selectedKinesis }
              : { enabled: false },
        },
        personal_subliminal: {
          enabled: personalEnabled,
          targets: personalEnabled
            ? personalTargets.filter((p) => p.name.trim())
            : [],
        },
        multi_stack: {
          enabled: stackEnabled,
          topics: stackEnabled ? stackedTopics : [],
        },
      };

      setProjectJSON(JSON.stringify(payload));
      toast.success("Project JSON built successfully");
    } catch (_e) {
      toast.error("Failed to build project JSON.");
    } finally {
      setIsBuilding(false);
    }
  };

  const handleSave = async () => {
    if (!saveTitle.trim() || !projectJSON) {
      toast.error("Please enter a title and build the JSON first.");
      return;
    }
    try {
      const id = await saveMutation.mutateAsync({
        title: saveTitle,
        jsonOutput: projectJSON,
      });
      toast.success(`Project saved with ID #${id}`);
      setSaveTitle("");
    } catch (_e) {
      toast.error("Failed to save project.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Project deleted");
    } catch (_e) {
      toast.error("Failed to delete project.");
    }
  };

  const handleLoadProject = async (id: bigint, title: string) => {
    try {
      const json = await getProjectMutation.mutateAsync(id);
      if (json) {
        setLoadedJSON(json);
        toast.success(`Loaded: ${title}`);
      }
    } catch (_e) {
      toast.error("Failed to load project.");
    }
  };

  const formatDate = (timestamp: bigint) => {
    const ms = Number(timestamp) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-6 sm:space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold gradient-text glow-text-primary">
          Subliminal Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto">
          Program your subconscious with precision-crafted affirmations, layered
          audio, and cinematic visuals.
        </p>
      </motion.div>

      {/* ── Step 1: Intent Panel ──────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="glass-card rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6"
        aria-label="Step 1: Intent Panel"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-mono text-primary">
            1
          </div>
          <h2 className="font-heading text-lg font-semibold">
            Define Your Intent
          </h2>
        </div>

        {/* Topic input */}
        <div className="space-y-2">
          <Label htmlFor="topic" className="text-sm text-muted-foreground">
            What do you want to program into your subconscious?
          </Label>
          <Textarea
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Unshakeable confidence and magnetic presence in social situations..."
            className="bg-input/50 border-border/50 focus:border-primary/50 resize-none h-24 text-sm font-sans"
            data-ocid="generator.topic.textarea"
          />

          {/* Wealth Presets */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setWealthPresetsOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-400/80 hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40 rounded"
              data-ocid="generator.wealth_presets.toggle"
            >
              <Coins className="w-3.5 h-3.5" />
              Wealth Presets
              <TrendingUp className="w-3 h-3 opacity-60" />
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-200 ${wealthPresetsOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {wealthPresetsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 pb-1">
                    <p className="text-[10px] text-amber-400/60 mb-2 leading-snug">
                      Tap any preset to auto-fill your topic with a wealth
                      subliminal focus
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Financial abundance",
                        "Passive income streams",
                        "Business success and growth",
                        "Debt-free living",
                        "Millionaire mindset",
                        "Luxury lifestyle manifestation",
                        "Career promotion and salary increase",
                        "Investment and wealth multiplication",
                        "Generational wealth",
                        "Unexpected money flowing to me",
                        "Abundance in all areas of life",
                        "Money comes to me easily and frequently",
                        "Crypto wealth flowing to me now",
                        "Real estate empire building effortlessly",
                        "My business grows exponentially",
                        "I am completely debt free and financially free",
                        "I live a luxurious abundant lifestyle",
                        "Abundance overflows in every area of my life",
                        "Web3 Wealth",
                        "Side Hustle Empire",
                        "Multiple Income Streams",
                        "Overnight Success",
                        "Lottery & Windfall",
                        "Manifestation Millionaire",
                        "Billionaire Blueprint",
                        "Financial Miracles",
                        "CEO Mindset",
                        "Sales Mastery",
                        "Client Attraction",
                        "Abundance Portal",
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setTopic(preset);
                            setWealthPresetsOpen(false);
                          }}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/40 ${
                            topic === preset
                              ? "bg-amber-400/20 text-amber-300 border-amber-400/50"
                              : "bg-amber-400/8 text-amber-400/70 border-amber-400/25 hover:bg-amber-400/15 hover:text-amber-300 hover:border-amber-400/50"
                          }`}
                          data-ocid="generator.wealth_preset.button"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* General Manifestation Signs */}
        <SignsPanel
          context={
            modes.fantasy && characterEnabled
              ? "character"
              : modes.fantasy && itemEnabled
                ? "item"
                : modes.fantasy && symbioticEnabled
                  ? "symbiotic"
                  : topic
                        .toLowerCase()
                        .match(
                          /wealth|money|financ|abundan|rich|income|prosper/,
                        )
                    ? "wealth"
                    : topic
                          .toLowerCase()
                          .match(/love|relationship|romance|partner|attract/)
                      ? "love"
                      : topic
                            .toLowerCase()
                            .match(/heal|health|pain|sick|recover|wellness/)
                        ? "health"
                        : "general"
          }
          compact={true}
          onNavigateToSigns={onNavigate ? () => onNavigate("signs") : undefined}
        />
        {/* Mode toggles */}
        <div className="space-y-3">
          <Label className="text-sm text-muted-foreground">
            Enhancement Modes
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const active = modes[mode.key];
              return (
                <button
                  type="button"
                  key={mode.key}
                  onClick={() => toggleMode(mode.key)}
                  className={`relative p-4 rounded-xl text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                    active
                      ? "mode-card-active"
                      : "mode-card-inactive hover:border-border"
                  }`}
                  aria-pressed={active}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: active
                          ? `${mode.color}20`
                          : "oklch(0.16 0.018 270 / 0.5)",
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={
                          {
                            color: active ? mode.color : "oklch(0.56 0.02 270)",
                          } as React.CSSProperties
                        }
                      />
                    </div>
                    <div>
                      <p
                        className="font-heading text-sm font-semibold"
                        style={{ color: active ? mode.color : undefined }}
                      >
                        {mode.label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                        {mode.description}
                      </p>
                    </div>
                  </div>
                  {active && (
                    <div
                      className="absolute top-2 right-2 w-2 h-2 rounded-full"
                      style={{ background: mode.color }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Personal Subliminal Panel ───────────────────────── */}
        <div className="space-y-0">
          <button
            type="button"
            onClick={() => setPersonalEnabled((v) => !v)}
            data-ocid="generator.personal_subliminal.toggle"
            className={`w-full relative p-4 rounded-xl text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.62_0.22_180)/50] ${
              personalEnabled
                ? "border border-[oklch(0.62_0.22_180)/60] bg-[oklch(0.62_0.22_180)/8]"
                : "mode-card-inactive hover:border-border"
            }`}
            aria-pressed={personalEnabled}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: personalEnabled
                    ? "oklch(0.62 0.22 180 / 0.2)"
                    : "oklch(0.16 0.018 270 / 0.5)",
                }}
              >
                <Users
                  className="w-4 h-4"
                  style={{
                    color: personalEnabled
                      ? "oklch(0.62 0.22 180)"
                      : "oklch(0.56 0.02 270)",
                  }}
                />
              </div>
              <div>
                <p
                  className="font-heading text-sm font-semibold"
                  style={{
                    color: personalEnabled ? "oklch(0.62 0.22 180)" : undefined,
                  }}
                >
                  Personal Subliminal
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                  Dedicate this subliminal to help specific people
                </p>
              </div>
            </div>
            {personalEnabled && (
              <div
                className="absolute top-2 right-2 w-2 h-2 rounded-full"
                style={{ background: "oklch(0.62 0.22 180)" }}
              />
            )}
          </button>

          <AnimatePresence>
            {personalEnabled && (
              <motion.div
                key="personal-subpanel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  className="space-y-3 p-4 rounded-b-xl border border-t-0 mt-0"
                  style={{
                    borderColor: "oklch(0.62 0.22 180 / 0.4)",
                    background: "oklch(0.62 0.22 180 / 0.05)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Users
                      className="w-4 h-4"
                      style={{ color: "oklch(0.62 0.22 180)" }}
                    />
                    <span
                      className="text-sm font-heading font-semibold"
                      style={{ color: "oklch(0.62 0.22 180)" }}
                    >
                      People to Help
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Affirmations will be written for/about these people, fully
                    compatible with all active modes.
                  </p>

                  {/* Person rows — hidden in group mode */}
                  {!personalGroupMode && (
                    <div className="space-y-2">
                      {personalTargets.map((target, idx) => (
                        <div
                          key={target.id}
                          className="space-y-1.5 pb-2 border-b last:border-b-0"
                          style={{ borderColor: "oklch(0.62 0.22 180 / 0.1)" }}
                          data-ocid={`generator.personal_target.item.${idx + 1}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <Input
                                value={target.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPersonalTargets((prev) =>
                                    prev.map((p) =>
                                      p.id === target.id
                                        ? { ...p, name: val }
                                        : p,
                                    ),
                                  );
                                }}
                                placeholder="Name — e.g. Sarah, Mom, Alex..."
                                className="bg-input/50 border-[oklch(0.62_0.22_180)/30] focus:border-[oklch(0.62_0.22_180)/60] text-sm h-9"
                                data-ocid={`generator.personal_target_name.input.${idx + 1}`}
                              />
                              <Input
                                value={target.relationship}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPersonalTargets((prev) =>
                                    prev.map((p) =>
                                      p.id === target.id
                                        ? { ...p, relationship: val }
                                        : p,
                                    ),
                                  );
                                }}
                                placeholder="Relationship — e.g. best friend, sister, partner..."
                                className="bg-input/50 border-[oklch(0.62_0.22_180)/30] focus:border-[oklch(0.62_0.22_180)/60] text-sm h-9"
                                data-ocid={`generator.personal_target_relationship.input.${idx + 1}`}
                              />
                              <div className="flex flex-col gap-1">
                                <select
                                  value={target.intent}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPersonalTargets((prev) =>
                                      prev.map((p) =>
                                        p.id === target.id
                                          ? { ...p, intent: val }
                                          : p,
                                      ),
                                    );
                                  }}
                                  className="h-9 rounded-md border bg-input/50 px-2 text-sm focus:outline-none focus:ring-2 w-full"
                                  style={{
                                    borderColor: "oklch(0.62 0.22 180 / 0.3)",
                                    color: "inherit",
                                  }}
                                  data-ocid={`generator.personal_target_intent.select.${idx + 1}`}
                                >
                                  <option value="Healing">🌿 Healing</option>
                                  <option value="Love & Attraction">
                                    💗 Love & Attraction
                                  </option>
                                  <option value="Protection">
                                    🛡️ Protection
                                  </option>
                                  <option value="Success & Abundance">
                                    ✨ Success & Abundance
                                  </option>
                                  <option value="Reconciliation">
                                    🤝 Reconciliation
                                  </option>
                                  <option value="Forgiveness">
                                    🕊️ Forgiveness
                                  </option>
                                  <option value="Spiritual Growth">
                                    🔮 Spiritual Growth
                                  </option>
                                  <option value="Custom">✏️ Custom</option>
                                </select>
                                {target.intent === "Custom" && (
                                  <Input
                                    value={target.customIntent}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      setPersonalTargets((prev) =>
                                        prev.map((p) =>
                                          p.id === target.id
                                            ? { ...p, customIntent: val }
                                            : p,
                                        ),
                                      );
                                    }}
                                    placeholder="Describe intent..."
                                    className="bg-input/50 border-[oklch(0.62_0.22_180)/30] text-sm h-8"
                                    data-ocid={`generator.personal_target_custom_intent.input.${idx + 1}`}
                                  />
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setPersonalTargets((prev) =>
                                  prev.filter((p) => p.id !== target.id),
                                )
                              }
                              disabled={personalTargets.length <= 1}
                              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                              data-ocid={`generator.personal_remove_person.button.${idx + 1}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          {/* Wish + Energy Color row */}
                          <div className="flex flex-col sm:flex-row gap-2 mt-1.5">
                            <Input
                              value={target.wish}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPersonalTargets((prev) =>
                                  prev.map((p) =>
                                    p.id === target.id
                                      ? { ...p, wish: val }
                                      : p,
                                  ),
                                );
                              }}
                              placeholder="What do you wish for them? e.g. deep inner peace and clarity"
                              className="flex-1 bg-input/50 border-[oklch(0.62_0.22_180)/20] focus:border-[oklch(0.62_0.22_180)/50] text-sm h-8"
                              data-ocid={`generator.personal_target_wish.input.${idx + 1}`}
                            />
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                Energy:
                              </span>
                              {[
                                {
                                  color: "bg-pink-400",
                                  value: "pink",
                                  label: "Pink",
                                },
                                {
                                  color: "bg-red-400",
                                  value: "red",
                                  label: "Red",
                                },
                                {
                                  color: "bg-yellow-400",
                                  value: "gold",
                                  label: "Gold",
                                },
                                {
                                  color: "bg-green-400",
                                  value: "green",
                                  label: "Green",
                                },
                                {
                                  color: "bg-blue-400",
                                  value: "blue",
                                  label: "Blue",
                                },
                                {
                                  color: "bg-purple-400",
                                  value: "purple",
                                  label: "Purple",
                                },
                                {
                                  color: "bg-white border border-gray-300",
                                  value: "white",
                                  label: "White",
                                },
                                {
                                  color: "bg-gray-300",
                                  value: "silver",
                                  label: "Silver",
                                },
                              ].map(({ color, value, label }) => (
                                <button
                                  key={value}
                                  type="button"
                                  title={label}
                                  onClick={() =>
                                    setPersonalTargets((prev) =>
                                      prev.map((p) =>
                                        p.id === target.id
                                          ? {
                                              ...p,
                                              energyColor:
                                                p.energyColor === value
                                                  ? ""
                                                  : value,
                                            }
                                          : p,
                                      ),
                                    )
                                  }
                                  className={`w-5 h-5 rounded-full ${color} transition-all`}
                                  style={
                                    target.energyColor === value
                                      ? {
                                          outline:
                                            "2px solid oklch(0.62 0.22 180)",
                                          outlineOffset: "2px",
                                        }
                                      : {}
                                  }
                                  data-ocid={`generator.personal_energy_color.toggle.${idx + 1}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add button */}
                  {!personalGroupMode && personalTargets.length < 10 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPersonalTargets((prev) => [
                          ...prev,
                          {
                            id: crypto.randomUUID(),
                            name: "",
                            relationship: "",
                            intent: "Healing",
                            customIntent: "",
                            wish: "",
                            energyColor: "",
                          },
                        ])
                      }
                      className="flex items-center gap-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.62_0.22_180)/40] rounded"
                      style={{ color: "oklch(0.62 0.22 180 / 0.75)" }}
                      data-ocid="generator.personal_add_person.button"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Another Person
                    </button>
                  )}

                  {/* ── Advanced Options ─────────────────────────────── */}
                  <div
                    className="mt-3 pt-3 border-t"
                    style={{ borderColor: "oklch(0.62 0.22 180 / 0.2)" }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "oklch(0.62 0.22 180 / 0.7)" }}
                      >
                        Advanced Options
                      </span>
                    </div>

                    {/* Affirmation Style toggle */}
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1.5">
                        Affirmation Style
                      </p>
                      <div
                        className="flex gap-1"
                        data-ocid="generator.personal_aff_style.toggle"
                      >
                        {(["about", "to", "hybrid"] as const).map((style) => (
                          <button
                            key={style}
                            type="button"
                            onClick={() => setPersonalAffStyle(style)}
                            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                            style={{
                              background:
                                personalAffStyle === style
                                  ? "oklch(0.62 0.22 180 / 0.2)"
                                  : "transparent",
                              color:
                                personalAffStyle === style
                                  ? "oklch(0.62 0.22 180)"
                                  : "oklch(0.62 0.22 180 / 0.5)",
                              border: `1px solid ${personalAffStyle === style ? "oklch(0.62 0.22 180 / 0.5)" : "oklch(0.62 0.22 180 / 0.2)"}`,
                            }}
                          >
                            {style === "about"
                              ? "About Them"
                              : style === "to"
                                ? "To Them"
                                : "Hybrid"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Relationship Healing Mode */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-foreground/80">
                            Relationship Healing Mode
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Focuses affirmations on healing relational wounds
                          </p>
                        </div>
                        <Switch
                          checked={personalRelHealingMode}
                          onCheckedChange={setPersonalRelHealingMode}
                          data-ocid="generator.personal_rel_healing.switch"
                        />
                      </div>
                      <AnimatePresence>
                        {personalRelHealingMode && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mt-2"
                          >
                            <textarea
                              value={personalCoreIssue}
                              onChange={(e) =>
                                setPersonalCoreIssue(e.target.value)
                              }
                              placeholder="e.g. past conflict, emotional distance, trust issues..."
                              rows={2}
                              className="w-full rounded-md border bg-input/50 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2"
                              style={{
                                borderColor: "oklch(0.62 0.22 180 / 0.3)",
                              }}
                              data-ocid="generator.personal_core_issue.textarea"
                            />

                            {/* Personal Subliminal Signs */}
                            <SignsPanel
                              context="personal"
                              title="Signs For Your Person"
                              compact={true}
                              onNavigateToSigns={
                                onNavigate
                                  ? () => onNavigate("signs")
                                  : undefined
                              }
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Group Subliminal Mode */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-foreground/80">
                            Group Subliminal Mode
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Generate affirmations for a collective
                          </p>
                        </div>
                        <Switch
                          checked={personalGroupMode}
                          onCheckedChange={setPersonalGroupMode}
                          data-ocid="generator.personal_group_mode.switch"
                        />
                      </div>
                      <AnimatePresence>
                        {personalGroupMode && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mt-2"
                          >
                            <textarea
                              value={personalGroupDesc}
                              onChange={(e) =>
                                setPersonalGroupDesc(e.target.value)
                              }
                              placeholder="e.g. my family, my coworkers, everyone I encounter..."
                              rows={2}
                              className="w-full rounded-md border bg-input/50 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2"
                              style={{
                                borderColor: "oklch(0.62 0.22 180 / 0.3)",
                              }}
                              data-ocid="generator.personal_group_desc.textarea"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Blessing Intensity */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-medium text-foreground/80">
                          Blessing Intensity
                        </p>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "oklch(0.62 0.22 180)" }}
                        >
                          {
                            [
                              "",
                              "Gentle",
                              "Soft",
                              "Balanced",
                              "Powerful",
                              "Transcendent",
                            ][personalBlessingIntensity]
                          }
                        </span>
                      </div>
                      <Slider
                        min={1}
                        max={5}
                        step={1}
                        value={[personalBlessingIntensity]}
                        onValueChange={([v]) => setPersonalBlessingIntensity(v)}
                        data-ocid="generator.personal_blessing_intensity.input"
                        className="w-full"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          Gentle
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Transcendent
                        </span>
                      </div>
                    </div>

                    {/* Protection Seal */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-foreground/80">
                          Protection Seal
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Surround all listed people with energetic protection
                        </p>
                      </div>
                      <Switch
                        checked={personalProtectionSeal}
                        onCheckedChange={setPersonalProtectionSeal}
                        data-ocid="generator.personal_protection_seal.switch"
                      />
                    </div>

                    {/* Manifestation Speed */}
                    <div
                      className="mb-3 mt-3 pt-3 border-t"
                      style={{ borderColor: "oklch(0.62 0.22 180 / 0.1)" }}
                    >
                      <p className="text-xs font-medium text-foreground/80 mb-1">
                        Manifestation Speed
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        How quickly you intend these changes to anchor in their
                        reality.
                      </p>
                      <div
                        className="flex gap-1"
                        data-ocid="generator.personal_manifest_speed.toggle"
                      >
                        {(["gradual", "accelerated", "instant"] as const).map(
                          (spd) => (
                            <button
                              key={spd}
                              type="button"
                              onClick={() => setPersonalManifestSpeed(spd)}
                              className="px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all"
                              style={{
                                background:
                                  personalManifestSpeed === spd
                                    ? "oklch(0.62 0.22 180 / 0.2)"
                                    : "transparent",
                                color:
                                  personalManifestSpeed === spd
                                    ? "oklch(0.62 0.22 180)"
                                    : "oklch(0.62 0.22 180 / 0.5)",
                                border: `1px solid ${personalManifestSpeed === spd ? "oklch(0.62 0.22 180 / 0.5)" : "oklch(0.62 0.22 180 / 0.2)"}`,
                              }}
                            >
                              {spd === "gradual"
                                ? "🌱 Gradual"
                                : spd === "accelerated"
                                  ? "⚡ Accelerated"
                                  : "✨ Instantaneous"}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Mirror Reflection Mode */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-foreground/80">
                            Mirror Reflection Mode
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sends back any negativity as healing energy
                          </p>
                        </div>
                        <Switch
                          checked={personalMirrorMode}
                          onCheckedChange={setPersonalMirrorMode}
                          data-ocid="generator.personal_mirror_mode.switch"
                        />
                      </div>
                      <AnimatePresence>
                        {personalMirrorMode && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mt-1"
                          >
                            <p className="text-xs text-muted-foreground italic">
                              Affirmations will include energetic return and
                              mirror shielding lines.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Love Frequency */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-foreground/80">
                            Love Frequency 💗
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Infuse all affirmations with 528Hz heart-opening
                            resonance
                          </p>
                        </div>
                        <Switch
                          checked={personalLoveFreq}
                          onCheckedChange={setPersonalLoveFreq}
                          data-ocid="generator.personal_love_freq.switch"
                        />
                      </div>
                    </div>

                    {/* Cord Cutting */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-foreground/80">
                            Cord Cutting ✂️
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Sever unhealthy energetic attachments before sending
                            healing
                          </p>
                        </div>
                        <Switch
                          checked={personalCordCutting}
                          onCheckedChange={setPersonalCordCutting}
                          data-ocid="generator.personal_cord_cutting.switch"
                        />
                      </div>
                      <AnimatePresence>
                        {personalCordCutting && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mt-2"
                          >
                            <textarea
                              value={personalCordDesc}
                              onChange={(e) =>
                                setPersonalCordDesc(e.target.value)
                              }
                              placeholder="e.g. resentment, dependency, old pain..."
                              rows={2}
                              className="w-full rounded-md border bg-input/50 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2"
                              style={{
                                borderColor: "oklch(0.62 0.22 180 / 0.3)",
                              }}
                              data-ocid="generator.personal_cord_desc.textarea"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Ancestral Healing */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-foreground/80">
                            Ancestral Healing 🌳
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Extend affirmations to heal ancestral trauma lines
                          </p>
                        </div>
                        <Switch
                          checked={personalAncestralHealing}
                          onCheckedChange={setPersonalAncestralHealing}
                          data-ocid="generator.personal_ancestral_healing.switch"
                        />
                      </div>
                    </div>

                    {/* Timeline Anchoring */}
                    <div className="mb-3">
                      <p className="text-xs font-medium text-foreground/80 mb-1">
                        Timeline Anchoring 🕰️
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Which timeline dimension to anchor the healing in.
                      </p>
                      <select
                        value={personalTimeline}
                        onChange={(e) => setPersonalTimeline(e.target.value)}
                        className="h-9 rounded-md border bg-input/50 px-2 text-sm focus:outline-none focus:ring-2 w-full"
                        style={{
                          borderColor: "oklch(0.62 0.22 180 / 0.3)",
                          color: "inherit",
                        }}
                        data-ocid="generator.personal_timeline.select"
                      >
                        <option value="Past">⏪ Past</option>
                        <option value="Present">⏺️ Present</option>
                        <option value="Future">⏩ Future</option>
                        <option value="All Timelines">∞ All Timelines</option>
                      </select>
                    </div>

                    {/* Emotional Layer Focus */}
                    <div className="mb-3">
                      <p className="text-xs font-medium text-foreground/80 mb-1">
                        Emotional Layer Focus
                      </p>
                      <p className="text-xs text-muted-foreground mb-2">
                        Select which layers to target in the affirmations.
                      </p>
                      <div
                        className="flex flex-wrap gap-1.5"
                        data-ocid="generator.personal_emotional_layers.toggle"
                      >
                        {[
                          "Mental",
                          "Emotional",
                          "Physical",
                          "Spiritual",
                          "Financial",
                          "Social",
                          "Romantic",
                        ].map((layer) => {
                          const active =
                            personalEmotionalLayers.includes(layer);
                          return (
                            <button
                              key={layer}
                              type="button"
                              onClick={() =>
                                setPersonalEmotionalLayers((prev) =>
                                  prev.includes(layer)
                                    ? prev.filter((l) => l !== layer)
                                    : [...prev, layer],
                                )
                              }
                              className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                              style={{
                                background: active
                                  ? "oklch(0.62 0.22 180 / 0.2)"
                                  : "oklch(0.62 0.22 180 / 0.05)",
                                color: active
                                  ? "oklch(0.62 0.22 180)"
                                  : "oklch(0.62 0.22 180 / 0.5)",
                                border: `1px solid ${active ? "oklch(0.62 0.22 180 / 0.5)" : "oklch(0.62 0.22 180 / 0.2)"}`,
                              }}
                            >
                              {layer}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Private Note */}
                    <div className="mb-1">
                      <button
                        type="button"
                        onClick={() => setPersonalNoteOpen((v) => !v)}
                        className="flex items-center gap-1.5 text-xs font-medium mb-1 transition-colors"
                        style={{ color: "oklch(0.62 0.22 180 / 0.7)" }}
                      >
                        <span>{personalNoteOpen ? "▼" : "▶"}</span>
                        Private Intention Note
                      </button>
                      <AnimatePresence>
                        {personalNoteOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <textarea
                              value={personalNote}
                              onChange={(e) => setPersonalNote(e.target.value)}
                              placeholder="Write a private note or intention for this subliminal set..."
                              rows={3}
                              className="w-full rounded-md border bg-input/50 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2"
                              style={{
                                borderColor: "oklch(0.62 0.22 180 / 0.3)",
                              }}
                              data-ocid="generator.personal_note.textarea"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Soul Connection Depth */}
                    <div className="space-y-2">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: "oklch(0.62 0.22 180)" }}
                      >
                        Soul Connection Depth
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Surface", "Heart", "Soul", "Cosmic Bond"].map(
                          (d) => (
                            <button
                              key={d}
                              type="button"
                              data-ocid="generator.soul_depth.toggle"
                              onClick={() => setPersonalSoulDepth(d)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${personalSoulDepth === d ? "bg-teal-500/30 text-teal-200 border-teal-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-teal-400/40"}`}
                              aria-pressed={personalSoulDepth === d}
                            >
                              {d}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    {/* Extra switches */}
                    <div className="space-y-2.5">
                      {[
                        {
                          label: "Divine Timing",
                          desc: "Trust divine timing in all things",
                          val: personalDivineTiming,
                          set: setPersonalDivineTiming,
                          ocid: "generator.personal_divine_timing.switch",
                        },
                        {
                          label: "Karma Clearing",
                          desc: "Clear karmic debt and residue between all parties",
                          val: personalKarmaClearing,
                          set: setPersonalKarmaClearing,
                          ocid: "generator.personal_karma_clearing.switch",
                        },
                        {
                          label: "Twin Flame Activation",
                          desc: "Activate the twin flame reunion frequency",
                          val: personalTwinFlame,
                          set: setPersonalTwinFlame,
                          ocid: "generator.personal_twin_flame.switch",
                        },
                        {
                          label: "Etheric Cord Strengthening",
                          desc: "Deepen and strengthen the energetic connection",
                          val: personalEthericCord,
                          set: setPersonalEthericCord,
                          ocid: "generator.personal_etheric_cord.switch",
                        },
                        {
                          label: "Vow & Oath Clearing",
                          desc: "Clear past-life vows and soul oaths that block connection",
                          val: personalVowClearing,
                          set: setPersonalVowClearing,
                          ocid: "generator.personal_vow_clearing.switch",
                        },
                        {
                          label: "DNA Love Code Activation",
                          desc: "Activate love codes encoded in your shared DNA field",
                          val: personalDNACode,
                          set: setPersonalDNACode,
                          ocid: "generator.personal_dna_code.switch",
                        },
                        {
                          label: "Akashic Record Update",
                          desc: "Update your shared soul record in the Akashic field",
                          val: personalAkashicUpdate,
                          set: setPersonalAkashicUpdate,
                          ocid: "generator.personal_akashic_update.switch",
                        },
                        {
                          label: "Shared Dream Activation",
                          desc: "Activate shared dreaming experiences during sleep",
                          val: personalSharedDream,
                          set: setPersonalSharedDream,
                          ocid: "generator.personal_shared_dream.switch",
                        },
                        {
                          label: "Heart Wall Removal",
                          desc: "Remove energetic walls around the heart for open love",
                          val: personalHeartWall,
                          set: setPersonalHeartWall,
                          ocid: "generator.personal_heart_wall.switch",
                        },
                        {
                          label: "Unconditional Love Transmission",
                          desc: "Transmit unconditional love across all dimensions",
                          val: personalUnconditionalLove,
                          set: setPersonalUnconditionalLove,
                          ocid: "generator.personal_unconditional_love.switch",
                        },
                        {
                          label: "🌟 Soul Retrieval",
                          desc: "Retrieve and reintegrate fragmented soul pieces, restoring wholeness and vitality",
                          val: personalSoulRetrieval,
                          set: setPersonalSoulRetrieval,
                          ocid: "generator.personal_soul_retrieval.switch",
                        },
                        {
                          label: "🧬 DNA Reprogramming",
                          desc: "Activate the highest potential DNA expression, unlocking the full genetic blueprint for this topic",
                          val: personalDNAReprog,
                          set: setPersonalDNAReprog,
                          ocid: "generator.personal_dna_reprog.switch",
                        },
                        {
                          label: "👶 Inner Child Protection",
                          desc: "Surround the inner child with unconditional love, safety, and healing light",
                          val: personalInnerChildProtect,
                          set: setPersonalInnerChildProtect,
                          ocid: "generator.personal_inner_child_protect.switch",
                        },
                      ].map(({ label, desc, val, set, ocid }) => (
                        <div
                          key={label}
                          className="flex items-start justify-between gap-3 p-2 rounded-lg"
                          style={{
                            background: "oklch(0.62 0.22 180 / 0.05)",
                            borderLeft: "2px solid oklch(0.62 0.22 180 / 0.3)",
                          }}
                        >
                          <div>
                            <p
                              className="text-xs font-semibold"
                              style={{ color: "oklch(0.72 0.22 180)" }}
                            >
                              {label}
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-snug">
                              {desc}
                            </p>
                          </div>
                          <Switch
                            checked={val}
                            onCheckedChange={set}
                            data-ocid={ocid}
                          />
                        </div>
                      ))}

                      {/* Frequency Matching with hz select */}
                      <div
                        className="p-2 rounded-lg space-y-2"
                        style={{
                          background: "oklch(0.62 0.22 180 / 0.05)",
                          borderLeft: "2px solid oklch(0.62 0.22 180 / 0.3)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p
                              className="text-xs font-semibold"
                              style={{ color: "oklch(0.72 0.22 180)" }}
                            >
                              Frequency Matching
                            </p>
                            <p className="text-[10px] text-muted-foreground leading-snug">
                              Tune both parties to the same Hz frequency
                            </p>
                          </div>
                          <Switch
                            checked={personalFreqMatch}
                            onCheckedChange={setPersonalFreqMatch}
                            data-ocid="generator.personal_freq_match.switch"
                          />
                        </div>
                        {personalFreqMatch && (
                          <div className="flex flex-wrap gap-1.5">
                            {["396Hz", "528Hz", "639Hz", "741Hz", "852Hz"].map(
                              (hz) => (
                                <button
                                  key={hz}
                                  type="button"
                                  data-ocid="generator.personal_freq_hz.toggle"
                                  onClick={() => setPersonalFreqHz(hz)}
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${personalFreqHz === hz ? "bg-teal-500/30 text-teal-200 border-teal-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-teal-400/40"}`}
                                  aria-pressed={personalFreqHz === hz}
                                >
                                  {hz}
                                </button>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="space-y-0">
          <button
            type="button"
            onClick={() => setStackEnabled((v) => !v)}
            data-ocid="generator.stack.toggle"
            className={`w-full relative p-4 rounded-xl text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(0.72_0.2_48)/50] ${
              stackEnabled
                ? "border border-[oklch(0.72_0.2_48)/60] bg-[oklch(0.72_0.2_48)/8]"
                : "mode-card-inactive hover:border-border"
            }`}
            aria-pressed={stackEnabled}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: stackEnabled
                    ? "oklch(0.72 0.2 48 / 0.2)"
                    : "oklch(0.16 0.018 270 / 0.5)",
                }}
              >
                <Layers
                  className="w-4 h-4"
                  style={{
                    color: stackEnabled
                      ? "oklch(0.72 0.2 48)"
                      : "oklch(0.56 0.02 270)",
                  }}
                />
              </div>
              <div className="flex-1 flex items-start justify-between">
                <div>
                  <p
                    className="font-heading text-sm font-semibold"
                    style={{
                      color: stackEnabled ? "oklch(0.72 0.2 48)" : undefined,
                    }}
                  >
                    Multi-Subliminal Stack
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                    Generate affirmations across multiple topics at once
                  </p>
                </div>
                {stackedTopics.length > 0 && (
                  <span
                    className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ml-2"
                    style={{
                      color: "oklch(0.72 0.2 48)",
                      borderColor: "oklch(0.72 0.2 48 / 0.5)",
                      background: "oklch(0.72 0.2 48 / 0.15)",
                    }}
                  >
                    {stackedTopics.length} stacked
                  </span>
                )}
              </div>
            </div>
            {stackEnabled && (
              <div
                className="absolute top-2 right-2 w-2 h-2 rounded-full"
                style={{ background: "oklch(0.72 0.2 48)" }}
              />
            )}
          </button>

          <AnimatePresence>
            {stackEnabled && (
              <motion.div
                key="stack-subpanel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div
                  className="space-y-3 p-4 rounded-b-xl border border-t-0"
                  style={{
                    borderColor: "oklch(0.72 0.2 48 / 0.4)",
                    background: "oklch(0.72 0.2 48 / 0.05)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Layers
                      className="w-4 h-4"
                      style={{ color: "oklch(0.72 0.2 48)" }}
                    />
                    <span
                      className="text-sm font-heading font-semibold"
                      style={{ color: "oklch(0.72 0.2 48)" }}
                    >
                      Topic Stack
                    </span>
                  </div>

                  {/* Add input */}
                  <div className="flex gap-2">
                    <Input
                      value={stackInputValue}
                      onChange={(e) => setStackInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = stackInputValue.trim();
                          if (val && !stackedTopics.includes(val)) {
                            setStackedTopics((prev) => [...prev, val]);
                            setStackInputValue("");
                          }
                        }
                      }}
                      placeholder="Add a topic to stack (e.g. Self-confidence)..."
                      className="bg-input/50 border-[oklch(0.72_0.2_48)/30] focus:border-[oklch(0.72_0.2_48)/60] text-sm flex-1 h-9"
                      data-ocid="generator.stack_topic.input"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const val = stackInputValue.trim();
                        if (val && !stackedTopics.includes(val)) {
                          setStackedTopics((prev) => [...prev, val]);
                          setStackInputValue("");
                        }
                      }}
                      className="h-9 border-[oklch(0.72_0.2_48)/40] text-amber-400 hover:bg-[oklch(0.72_0.2_48)/10] hover:text-amber-300 focus-visible:ring-amber-400/40"
                      data-ocid="generator.stack_add.button"
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </Button>
                  </div>

                  {/* Quick-add presets */}
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-2">
                      Quick-add presets — tap to add to stack:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Financial abundance",
                        "Self-confidence",
                        "Love & relationships",
                        "Health & healing",
                        "Spiritual growth",
                        "Career success",
                        "Inner peace",
                        "Physical transformation",
                        "Creativity",
                        "Protection",
                        "Manifestation power",
                        "Sleep & relaxation",
                        "Alien DNA Activation",
                        "Starseed Awakening",
                        "Dragon Bond",
                        "Mer/Atlantean Heritage",
                        "Phoenix Rebirth",
                        "Dark Goddess",
                        "Sacred Masculine",
                        "Void Walker",
                        "Time Traveler",
                        "Dimensional Shifter",
                        "Celestial Being",
                        "Fae Connection",
                      ].map((preset) => {
                        const isAdded = stackedTopics.includes(preset);
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              if (!isAdded) {
                                setStackedTopics((prev) => [...prev, preset]);
                              } else {
                                setStackedTopics((prev) =>
                                  prev.filter((t) => t !== preset),
                                );
                              }
                            }}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/30 ${
                              isAdded
                                ? "text-amber-200 border-amber-400/60"
                                : "text-muted-foreground border-border/40 hover:border-amber-400/40 hover:text-amber-300"
                            }`}
                            style={
                              isAdded
                                ? { background: "oklch(0.72 0.2 48 / 0.25)" }
                                : { background: "oklch(0.16 0.018 270 / 0.4)" }
                            }
                          >
                            {isAdded ? "✓ " : ""}
                            {preset}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stacked topics list */}
                  {stackedTopics.length > 0 ? (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground font-medium">
                        Stacked topics:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {stackedTopics.map((t, idx) => (
                          <span
                            key={t}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
                            style={{
                              color: "oklch(0.72 0.2 48)",
                              borderColor: "oklch(0.72 0.2 48 / 0.5)",
                              background: "oklch(0.72 0.2 48 / 0.12)",
                            }}
                          >
                            {t}
                            <button
                              type="button"
                              onClick={() =>
                                setStackedTopics((prev) =>
                                  prev.filter((_, i) => i !== idx),
                                )
                              }
                              className="ml-0.5 rounded-full hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400/40"
                              data-ocid={`generator.stack_remove.button.${idx + 1}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground/60 italic">
                      No topics stacked yet — add topics above
                    </p>
                  )}

                  <p className="text-[10px] text-muted-foreground/70 leading-snug">
                    All stacked topics will be combined in one affirmation
                    batch. Count is distributed across topics.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {modes.booster && (
            <motion.div
              key="booster-subpanel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 p-4 rounded-xl border border-[oklch(0.78_0.18_90)/40] bg-[oklch(0.78_0.18_90)/5]">
                <div className="flex items-center gap-2 mb-1">
                  <Zap
                    className="w-4 h-4"
                    style={{ color: "oklch(0.78 0.18 90)" }}
                  />
                  <span
                    className="text-sm font-heading font-semibold"
                    style={{ color: "oklch(0.78 0.18 90)" }}
                  >
                    Booster Intensity Level
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      {
                        level: "minimal" as BoosterLevel,
                        label: "Minimal",
                        subtext: "Gentle, opening language",
                        bg: "bg-slate-500/15 border-slate-500/40 text-slate-300",
                        activeBg:
                          "bg-slate-500/30 border-slate-400/70 text-slate-200",
                      },
                      {
                        level: "standard" as BoosterLevel,
                        label: "Standard",
                        subtext: "Balanced intensity (default)",
                        bg: "bg-violet-500/15 border-violet-500/40 text-violet-300",
                        activeBg:
                          "bg-violet-500/30 border-violet-400/70 text-violet-200",
                      },
                      {
                        level: "custom" as BoosterLevel,
                        label: "Custom",
                        subtext: "Your own intensity phrase",
                        bg: "bg-amber-500/15 border-amber-500/40 text-amber-300",
                        activeBg:
                          "bg-amber-500/30 border-amber-400/70 text-amber-200",
                      },
                      {
                        level: "extremely_powerful" as BoosterLevel,
                        label: "Extremely Powerful",
                        subtext: "Maximum absolute certainty",
                        bg: "bg-rose-500/15 border-rose-500/40 text-rose-300",
                        activeBg:
                          "bg-rose-500/30 border-rose-400/70 text-rose-200",
                      },
                      {
                        level: "evolving" as BoosterLevel,
                        label: "Evolving",
                        subtext: "Starts soft, escalates to max",
                        bg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-300",
                        activeBg:
                          "bg-emerald-500/30 border-emerald-400/70 text-emerald-200",
                      },
                    ] as const
                  ).map((opt) => {
                    const isActive = boosterLevel === opt.level;
                    return (
                      <button
                        key={opt.level}
                        type="button"
                        onClick={() => setBoosterLevel(opt.level)}
                        className={`flex flex-col items-start px-3 py-2 rounded-xl text-xs font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${isActive ? opt.activeBg : opt.bg}`}
                        aria-pressed={isActive}
                        data-ocid="generator.booster_level.button"
                      >
                        <span className="font-semibold">{opt.label}</span>
                        <span className="text-[10px] opacity-70 leading-snug mt-0.5">
                          {opt.subtext}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {boosterLevel === "custom" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <Input
                        value={boosterCustomPhrase}
                        onChange={(e) => setBoosterCustomPhrase(e.target.value)}
                        placeholder='Your intensity prefix phrase (e.g. "Powerfully and completely…")'
                        className="bg-input/50 border-amber-500/40 focus:border-amber-500/70 text-sm mt-2"
                        data-ocid="generator.booster_custom_phrase.input"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Booster Target */}
                <div className="space-y-2">
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "oklch(0.78 0.18 90)" }}
                  >
                    Booster Target
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Self",
                      "Topic",
                      "Relationship",
                      "Reality",
                      "Timeline",
                      "All",
                    ].map((t) => {
                      const isOn = boosterTargets.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          data-ocid={"generator.booster_target.toggle"}
                          onClick={() =>
                            setBoosterTargets((prev) =>
                              isOn ? prev.filter((x) => x !== t) : [...prev, t],
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${isOn ? "bg-amber-500/30 text-amber-200 border-amber-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-amber-400/40 hover:text-amber-300"}`}
                          aria-pressed={isOn}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Booster switches */}
                <div className="space-y-2.5">
                  {[
                    {
                      label: "Quantum Amplification",
                      desc: "Amplify across all quantum fields",
                      val: quantumAmp,
                      set: setQuantumAmp,
                      ocid: "generator.quantum_amp.switch",
                    },
                    {
                      label: "Parallel Universe Pull",
                      desc: "Pull desired reality from parallel timelines",
                      val: parallelUniversePull,
                      set: setParallelUniversePull,
                      ocid: "generator.parallel_universe_pull.switch",
                    },
                    {
                      label: "God-Mode Activation",
                      desc: "Activate omnipotent creative consciousness",
                      val: godMode,
                      set: setGodMode,
                      ocid: "generator.god_mode.switch",
                    },
                  ].map(({ label, desc, val, set, ocid }) => (
                    <div
                      key={label}
                      className="flex items-start justify-between gap-3 p-2 rounded-lg bg-amber-900/10 border border-amber-500/15"
                    >
                      <div>
                        <p className="text-xs font-semibold text-amber-200">
                          {label}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-snug">
                          {desc}
                        </p>
                      </div>
                      <Switch
                        checked={val}
                        onCheckedChange={set}
                        data-ocid={ocid}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {modes.fantasy && (
            <motion.div
              key="fantasy-subpanel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 p-4 rounded-xl border border-[oklch(0.62_0.22_295)/40] bg-[oklch(0.62_0.22_295)/5]">
                <div className="flex items-center gap-2 mb-1">
                  <Star
                    className="w-4 h-4"
                    style={{ color: "oklch(0.62 0.22 295)" }}
                  />
                  <span
                    className="text-sm font-heading font-semibold"
                    style={{ color: "oklch(0.62 0.22 295)" }}
                  >
                    Fantasy-to-Reality: Manifestation
                  </span>
                </div>

                {/* Character Manifestation */}
                <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-violet-400" />
                      <Label
                        className="text-sm font-semibold text-violet-300 cursor-pointer"
                        htmlFor="char-toggle"
                      >
                        Character Manifestation
                      </Label>
                    </div>
                    <Switch
                      id="char-toggle"
                      checked={characterEnabled}
                      onCheckedChange={setCharacterEnabled}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Physically bring a specific character into your reality —
                    they cross from their world into yours.
                  </p>
                  <AnimatePresence>
                    {characterEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <Input
                          value={characterName}
                          onChange={(e) => setCharacterName(e.target.value)}
                          placeholder="Character name (e.g. Naruto, Goku, Alastor)..."
                          className="bg-input/50 border-border/50 focus:border-violet-500/50 text-sm"
                        />
                        <Input
                          value={characterSource}
                          onChange={(e) => setCharacterSource(e.target.value)}
                          placeholder="Source / series (optional — e.g. Naruto, Hazbin Hotel)..."
                          className="bg-input/50 border-border/50 focus:border-violet-500/50 text-sm"
                        />
                        {/* Location + Time Frame */}
                        <div className="pt-1 space-y-2 border-t border-violet-500/20">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-violet-400/70" />
                            <span className="text-[10px] text-violet-400/70 font-medium">
                              Manifestation Location & Time Frame (optional)
                            </span>
                          </div>
                          <Input
                            value={characterLocation}
                            onChange={(e) =>
                              setCharacterLocation(e.target.value)
                            }
                            placeholder='Where will this manifest? (e.g. "my bedroom", "at my front door")...'
                            className="bg-input/40 border-violet-500/30 focus:border-violet-500/60 text-xs h-8"
                          />
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Timer className="w-3 h-3 text-violet-400/70" />
                              <span className="text-[10px] text-violet-400/60">
                                Time frame
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                "Now",
                                "Today",
                                "Within 3 Days",
                                "This Week",
                                "This Month",
                              ].map((tf) => (
                                <button
                                  key={tf}
                                  type="button"
                                  onClick={() =>
                                    setCharacterTimeFrame(
                                      characterTimeFrame === tf ? "" : tf,
                                    )
                                  }
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${characterTimeFrame === tf ? "bg-violet-500/30 text-violet-200 border-violet-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-violet-400/40 hover:text-violet-300"}`}
                                >
                                  {tf}
                                </button>
                              ))}
                            </div>
                            {(![
                              "Now",
                              "Today",
                              "Within 3 Days",
                              "This Week",
                              "This Month",
                            ].includes(characterTimeFrame) &&
                              characterTimeFrame !== "") ||
                            characterTimeFrame === "" ? (
                              <Input
                                value={
                                  [
                                    "Now",
                                    "Today",
                                    "Within 3 Days",
                                    "This Week",
                                    "This Month",
                                  ].includes(characterTimeFrame)
                                    ? ""
                                    : characterTimeFrame
                                }
                                onChange={(e) =>
                                  setCharacterTimeFrame(e.target.value)
                                }
                                placeholder='Custom time frame (e.g. "By midnight", "In 2 hours")...'
                                className="bg-input/40 border-violet-500/30 focus:border-violet-500/60 text-[10px] h-7"
                              />
                            ) : null}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Character Manifestation Signs */}
                <SignsPanel
                  context="character"
                  title="Character Manifestation Signs"
                  compact={true}
                  onNavigateToSigns={
                    onNavigate ? () => onNavigate("signs") : undefined
                  }
                />
                {/* Item Manifestation */}
                <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                      <Label
                        className="text-sm font-semibold text-amber-300 cursor-pointer"
                        htmlFor="item-toggle"
                      >
                        Item Manifestation
                      </Label>
                    </div>
                    <Switch
                      id="item-toggle"
                      checked={itemEnabled}
                      onCheckedChange={setItemEnabled}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Pull a specific item, artifact, or ability from fiction into
                    your physical reality.
                  </p>
                  <AnimatePresence>
                    {itemEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <Input
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                          placeholder="Item name (e.g. Excalibur, Sharingan, Death Note)..."
                          className="bg-input/50 border-border/50 focus:border-amber-500/50 text-sm"
                        />
                        <Input
                          value={itemSource}
                          onChange={(e) => setItemSource(e.target.value)}
                          placeholder="Source / origin (optional — e.g. Naruto, Arthurian legend)..."
                          className="bg-input/50 border-border/50 focus:border-amber-500/50 text-sm"
                        />
                        {/* Location + Time Frame */}
                        <div className="pt-1 space-y-2 border-t border-amber-500/20">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-amber-400/70" />
                            <span className="text-[10px] text-amber-400/70 font-medium">
                              Manifestation Location & Time Frame (optional)
                            </span>
                          </div>
                          <Input
                            value={itemLocation}
                            onChange={(e) => setItemLocation(e.target.value)}
                            placeholder='Where will this appear? (e.g. "in my home", "on my desk")...'
                            className="bg-input/40 border-amber-500/30 focus:border-amber-500/60 text-xs h-8"
                          />
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Timer className="w-3 h-3 text-amber-400/70" />
                              <span className="text-[10px] text-amber-400/60">
                                Time frame
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                "Now",
                                "Today",
                                "Within 3 Days",
                                "This Week",
                                "This Month",
                              ].map((tf) => (
                                <button
                                  key={tf}
                                  type="button"
                                  onClick={() =>
                                    setItemTimeFrame(
                                      itemTimeFrame === tf ? "" : tf,
                                    )
                                  }
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${itemTimeFrame === tf ? "bg-amber-500/30 text-amber-200 border-amber-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-amber-400/40 hover:text-amber-300"}`}
                                >
                                  {tf}
                                </button>
                              ))}
                            </div>
                            {(![
                              "Now",
                              "Today",
                              "Within 3 Days",
                              "This Week",
                              "This Month",
                            ].includes(itemTimeFrame) &&
                              itemTimeFrame !== "") ||
                            itemTimeFrame === "" ? (
                              <Input
                                value={
                                  [
                                    "Now",
                                    "Today",
                                    "Within 3 Days",
                                    "This Week",
                                    "This Month",
                                  ].includes(itemTimeFrame)
                                    ? ""
                                    : itemTimeFrame
                                }
                                onChange={(e) =>
                                  setItemTimeFrame(e.target.value)
                                }
                                placeholder='Custom time frame (e.g. "By tomorrow", "Tonight")...'
                                className="bg-input/40 border-amber-500/30 focus:border-amber-500/60 text-[10px] h-7"
                              />
                            ) : null}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Item Manifestation Signs */}
                <SignsPanel
                  context="item"
                  title="Item Manifestation Signs"
                  compact={true}
                  onNavigateToSigns={
                    onNavigate ? () => onNavigate("signs") : undefined
                  }
                />
                {/* Symbiotic / Bio-Engineered Manifestation */}
                <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Atom className="w-3.5 h-3.5 text-teal-400" />
                      <Label
                        className="text-sm font-semibold text-teal-300 cursor-pointer"
                        htmlFor="symbiotic-toggle"
                      >
                        Symbiotic / Bio-Engineered Bond
                      </Label>
                    </div>
                    <Switch
                      id="symbiotic-toggle"
                      checked={symbioticEnabled}
                      onCheckedChange={setSymbioticEnabled}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    For entities that are <em>both</em> a living being and a
                    physical extension — bio-engineered, sentient, or symbiotic
                    (e.g. Klyntar/Venom, TARDIS). They bond with you and become
                    part of your reality simultaneously as a character{" "}
                    <em>and</em> an object.
                  </p>
                  <AnimatePresence>
                    {symbioticEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <Input
                          value={symbioticName}
                          onChange={(e) => setSymbioticName(e.target.value)}
                          placeholder="Entity name (e.g. Klyntar, TARDIS, Evangelion Unit-01)..."
                          className="bg-input/50 border-border/50 focus:border-teal-500/50 text-sm"
                        />
                        <Input
                          value={symbioticSource}
                          onChange={(e) => setSymbioticSource(e.target.value)}
                          placeholder="Source / series (optional — e.g. Marvel, Doctor Who)..."
                          className="bg-input/50 border-border/50 focus:border-teal-500/50 text-sm"
                        />
                        <Input
                          value={symbioticBondType}
                          onChange={(e) => setSymbioticBondType(e.target.value)}
                          placeholder="Bond type (optional — e.g. symbiotic bond, neural merge, telepathic link)..."
                          className="bg-input/50 border-border/50 focus:border-teal-500/50 text-sm"
                        />
                        <p className="text-[10px] text-teal-400/70 leading-snug pt-0.5">
                          Affirmations will reflect the entity arriving in your
                          reality, the bond forming, and the merged state — you
                          and the entity as one unified presence.
                        </p>
                        {/* Location + Time Frame */}
                        <div className="pt-1 space-y-2 border-t border-teal-500/20">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-teal-400/70" />
                            <span className="text-[10px] text-teal-400/70 font-medium">
                              Bond Location & Time Frame (optional)
                            </span>
                          </div>
                          <Input
                            value={symbioticLocation}
                            onChange={(e) =>
                              setSymbioticLocation(e.target.value)
                            }
                            placeholder='Where does the bond form? (e.g. "in my home", "here with me")...'
                            className="bg-input/40 border-teal-500/30 focus:border-teal-500/60 text-xs h-8"
                          />
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <Timer className="w-3 h-3 text-teal-400/70" />
                              <span className="text-[10px] text-teal-400/60">
                                Time frame
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                "Now",
                                "Today",
                                "Within 3 Days",
                                "This Week",
                                "This Month",
                              ].map((tf) => (
                                <button
                                  key={tf}
                                  type="button"
                                  onClick={() =>
                                    setSymbioticTimeFrame(
                                      symbioticTimeFrame === tf ? "" : tf,
                                    )
                                  }
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${symbioticTimeFrame === tf ? "bg-teal-500/30 text-teal-200 border-teal-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-teal-400/40 hover:text-teal-300"}`}
                                >
                                  {tf}
                                </button>
                              ))}
                            </div>
                            {(![
                              "Now",
                              "Today",
                              "Within 3 Days",
                              "This Week",
                              "This Month",
                            ].includes(symbioticTimeFrame) &&
                              symbioticTimeFrame !== "") ||
                            symbioticTimeFrame === "" ? (
                              <Input
                                value={
                                  [
                                    "Now",
                                    "Today",
                                    "Within 3 Days",
                                    "This Week",
                                    "This Month",
                                  ].includes(symbioticTimeFrame)
                                    ? ""
                                    : symbioticTimeFrame
                                }
                                onChange={(e) =>
                                  setSymbioticTimeFrame(e.target.value)
                                }
                                placeholder='Custom time frame (e.g. "During this session", "At dawn")...'
                                className="bg-input/40 border-teal-500/30 focus:border-teal-500/60 text-[10px] h-7"
                              />
                            ) : null}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mythical Creature Bond */}
                <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-emerald-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🐉</span>
                      <Label
                        className="text-sm font-semibold text-emerald-300 cursor-pointer"
                        htmlFor="mythical-toggle"
                      >
                        Mythical Creature Bond
                      </Label>
                    </div>
                    <Switch
                      id="mythical-toggle"
                      checked={mythicalCreatureEnabled}
                      onCheckedChange={setMythicalCreatureEnabled}
                      data-ocid="generator.mythical_creature.switch"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Form a soul bond with a mythical creature — dragon, phoenix,
                    unicorn, or any other being.
                  </p>
                  <AnimatePresence>
                    {mythicalCreatureEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <Input
                          value={mythicalCreatureName}
                          onChange={(e) =>
                            setMythicalCreatureName(e.target.value)
                          }
                          placeholder="Creature name (e.g. Saphira, Fawkes)..."
                          className="bg-input/50 border-emerald-500/30 text-sm"
                          data-ocid="generator.mythical_creature_name.input"
                        />
                        <Input
                          value={mythicalCreatureSpecies}
                          onChange={(e) =>
                            setMythicalCreatureSpecies(e.target.value)
                          }
                          placeholder="Species/Type (e.g. Dragon, Phoenix, Kirin)..."
                          className="bg-input/50 border-emerald-500/30 text-sm"
                          data-ocid="generator.mythical_creature_species.input"
                        />
                        <Input
                          value={mythicalCreatureBondType}
                          onChange={(e) =>
                            setMythicalCreatureBondType(e.target.value)
                          }
                          placeholder="Bond type (e.g. rider bond, soul tether, telepathic link)..."
                          className="bg-input/50 border-emerald-500/30 text-sm"
                          data-ocid="generator.mythical_creature_bond.input"
                        />
                        <Input
                          value={mythicalCreatureLocation}
                          onChange={(e) =>
                            setMythicalCreatureLocation(e.target.value)
                          }
                          placeholder="Location of manifestation (optional)..."
                          className="bg-input/50 border-emerald-500/30 text-xs h-8"
                          data-ocid="generator.mythical_creature_location.input"
                        />
                        <div className="flex flex-wrap gap-1.5">
                          {["Now", "Today", "This Week", "This Month"].map(
                            (tf) => (
                              <button
                                key={tf}
                                type="button"
                                onClick={() =>
                                  setMythicalCreatureTimeFrame(
                                    mythicalCreatureTimeFrame === tf ? "" : tf,
                                  )
                                }
                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${mythicalCreatureTimeFrame === tf ? "bg-emerald-500/30 text-emerald-200 border-emerald-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-emerald-400/40"}`}
                              >
                                {tf}
                              </button>
                            ),
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Soul Fragment Retrieval */}
                <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-sky-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">✨</span>
                      <Label
                        className="text-sm font-semibold text-sky-300 cursor-pointer"
                        htmlFor="soulfrag-toggle"
                      >
                        Soul Fragment Retrieval
                      </Label>
                    </div>
                    <Switch
                      id="soulfrag-toggle"
                      checked={soulFragmentEnabled}
                      onCheckedChange={setSoulFragmentEnabled}
                      data-ocid="generator.soul_fragment.switch"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Retrieve and reintegrate lost or scattered soul fragments
                    from other timelines or realms.
                  </p>
                  <AnimatePresence>
                    {soulFragmentEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <Input
                          value={soulFragmentDesc}
                          onChange={(e) => setSoulFragmentDesc(e.target.value)}
                          placeholder="Fragment description (e.g. childhood innocence, warrior strength)..."
                          className="bg-input/50 border-sky-500/30 text-sm"
                          data-ocid="generator.soul_fragment_desc.input"
                        />
                        <Input
                          value={soulFragmentRealm}
                          onChange={(e) => setSoulFragmentRealm(e.target.value)}
                          placeholder="Origin realm (e.g. Akashic plane, past life 1450 AD)..."
                          className="bg-input/50 border-sky-500/30 text-sm"
                          data-ocid="generator.soul_fragment_realm.input"
                        />
                        <div className="flex flex-wrap gap-1.5">
                          {["Dream", "Ceremony", "Visualization", "Astral"].map(
                            (m) => (
                              <button
                                key={m}
                                type="button"
                                onClick={() => setSoulFragmentMethod(m)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${soulFragmentMethod === m ? "bg-sky-500/30 text-sky-200 border-sky-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-sky-400/40"}`}
                              >
                                {m}
                              </button>
                            ),
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {["Now", "Today", "This Week", "This Month"].map(
                            (tf) => (
                              <button
                                key={tf}
                                type="button"
                                onClick={() =>
                                  setSoulFragmentTimeFrame(
                                    soulFragmentTimeFrame === tf ? "" : tf,
                                  )
                                }
                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${soulFragmentTimeFrame === tf ? "bg-sky-500/30 text-sky-200 border-sky-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-sky-400/40"}`}
                              >
                                {tf}
                              </button>
                            ),
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Power Inheritance */}
                <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-rose-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">⚡</span>
                      <Label
                        className="text-sm font-semibold text-rose-300 cursor-pointer"
                        htmlFor="powerinherit-toggle"
                      >
                        Power Inheritance
                      </Label>
                    </div>
                    <Switch
                      id="powerinherit-toggle"
                      checked={powerInheritanceEnabled}
                      onCheckedChange={setPowerInheritanceEnabled}
                      data-ocid="generator.power_inheritance.switch"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    Inherit specific powers or abilities from a character,
                    deity, or entity and anchor them into your physical body.
                  </p>
                  <AnimatePresence>
                    {powerInheritanceEnabled && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <Input
                          value={powerInheritanceSource}
                          onChange={(e) =>
                            setPowerInheritanceSource(e.target.value)
                          }
                          placeholder="Source character/entity (e.g. Zeus, Saitama, Merlin)..."
                          className="bg-input/50 border-rose-500/30 text-sm"
                          data-ocid="generator.power_source.input"
                        />
                        <Input
                          value={powerInheritancePower}
                          onChange={(e) =>
                            setPowerInheritancePower(e.target.value)
                          }
                          placeholder="Specific power/ability (e.g. lightning control, one-punch strength)..."
                          className="bg-input/50 border-rose-500/30 text-sm"
                          data-ocid="generator.power_ability.input"
                        />
                        <Input
                          value={powerInheritanceTrigger}
                          onChange={(e) =>
                            setPowerInheritanceTrigger(e.target.value)
                          }
                          placeholder="Activation trigger (e.g. breathing deeply, touching ground)..."
                          className="bg-input/50 border-rose-500/30 text-sm"
                          data-ocid="generator.power_trigger.input"
                        />
                        <Input
                          value={powerInheritanceLocation}
                          onChange={(e) =>
                            setPowerInheritanceLocation(e.target.value)
                          }
                          placeholder="Location (optional)..."
                          className="bg-input/50 border-rose-500/30 text-xs h-8"
                          data-ocid="generator.power_location.input"
                        />
                        <div className="flex flex-wrap gap-1.5">
                          {["Now", "Today", "This Week", "This Month"].map(
                            (tf) => (
                              <button
                                key={tf}
                                type="button"
                                onClick={() =>
                                  setPowerInheritanceTimeFrame(
                                    powerInheritanceTimeFrame === tf ? "" : tf,
                                  )
                                }
                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${powerInheritanceTimeFrame === tf ? "bg-rose-500/30 text-rose-200 border-rose-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-rose-400/40"}`}
                              >
                                {tf}
                              </button>
                            ),
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* ── Protection Sub-Panel ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {modes.protection && (
            <motion.div
              key="protection-subpanel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 p-4 rounded-xl border border-[oklch(0.62_0.22_220)/40] bg-[oklch(0.62_0.22_220)/5]">
                <div className="flex items-center gap-2 mb-1">
                  <Shield
                    className="w-4 h-4"
                    style={{ color: "oklch(0.62 0.22 220)" }}
                  />
                  <span
                    className="text-sm font-heading font-semibold"
                    style={{ color: "oklch(0.62 0.22 220)" }}
                  >
                    Protection Configuration
                  </span>
                </div>

                {/* Protection Type chips */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-sky-300">
                    Protection Type (multi-select)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Energetic Shield",
                      "Psychic Defense",
                      "Aura Cleansing",
                      "Grounding Cord",
                      "Ward of Light",
                      "Mirror Shield",
                      "Ancestral Protection",
                      "Divine Armor",
                      "Karmic Shield",
                      "Crystal Barrier",
                      "Silver Cord Guard",
                      "Etheric Seal",
                      "Dimensional Lock",
                      "Soul Fortress",
                    ].map((t) => {
                      const isOn = protectionTypes.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          data-ocid="generator.protection_type.toggle"
                          onClick={() =>
                            setProtectionTypes((prev) =>
                              isOn ? prev.filter((x) => x !== t) : [...prev, t],
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${isOn ? "bg-sky-500/30 text-sky-200 border-sky-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-sky-400/40 hover:text-sky-300"}`}
                          aria-pressed={isOn}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Protection Strength */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-sky-300">
                    Protection Strength
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {["Subtle", "Moderate", "Absolute", "Unbreakable"].map(
                      (s) => (
                        <button
                          key={s}
                          type="button"
                          data-ocid="generator.protection_strength.toggle"
                          onClick={() => setProtectionStrength(s)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${protectionStrength === s ? "bg-sky-500/30 text-sky-200 border-sky-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-sky-400/40"}`}
                          aria-pressed={protectionStrength === s}
                        >
                          {s}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Protect From chips */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-sky-300">
                    What to Protect From
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Negative Energy",
                      "Psychic Attacks",
                      "Emotional Vampires",
                      "Evil Eye",
                      "Curses & Hexes",
                      "Low Vibrations",
                      "Past Trauma",
                      "External Manipulation",
                      "Energy Drains",
                      "Jealousy",
                      "Black Magic",
                      "Shadow Entities",
                      "Parasitic Thought-Forms",
                      "Dimensional Interference",
                    ].map((t) => {
                      const isOn = protectFrom.includes(t);
                      return (
                        <button
                          key={t}
                          type="button"
                          data-ocid="generator.protect_from.toggle"
                          onClick={() =>
                            setProtectFrom((prev) =>
                              isOn ? prev.filter((x) => x !== t) : [...prev, t],
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${isOn ? "bg-indigo-500/30 text-indigo-200 border-indigo-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-indigo-400/40 hover:text-indigo-300"}`}
                          aria-pressed={isOn}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Protection Entity */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-sky-300">
                    Protection Entity
                  </p>
                  <Input
                    value={protectionEntity}
                    onChange={(e) => setProtectionEntity(e.target.value)}
                    placeholder="Deity / Angel / Guardian to invoke (e.g. Archangel Michael, Hecate, Durga)..."
                    className="bg-input/50 border-sky-500/30 focus:border-sky-500/60 text-sm"
                    data-ocid="generator.protection_entity.input"
                  />
                </div>

                {/* Auric Layer */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-sky-300">
                    Auric Layer
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Physical",
                      "Emotional",
                      "Mental",
                      "Spiritual",
                      "Etheric",
                      "Causal",
                      "All Layers",
                    ].map((l) => (
                      <button
                        key={l}
                        type="button"
                        data-ocid="generator.auric_layer.toggle"
                        onClick={() => setAuricLayer(l)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${auricLayer === l ? "bg-sky-500/30 text-sky-200 border-sky-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-sky-400/40"}`}
                        aria-pressed={auricLayer === l}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sacred Geometry */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-sky-300">
                    Sacred Geometry Amplifiers
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Merkaba",
                      "Flower of Life",
                      "Sri Yantra",
                      "Metatron's Cube",
                      "Vesica Piscis",
                      "Seed of Life",
                    ].map((g) => {
                      const isOn = protectionGeometry.includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          data-ocid="generator.sacred_geometry.toggle"
                          onClick={() =>
                            setProtectionGeometry((prev) =>
                              isOn ? prev.filter((x) => x !== g) : [...prev, g],
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${isOn ? "bg-violet-500/30 text-violet-200 border-violet-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-violet-400/40 hover:text-violet-300"}`}
                          aria-pressed={isOn}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-sky-300">Duration</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Daily Renewal",
                      "Permanent",
                      "Until Cleared",
                      "Moon Cycle",
                    ].map((d) => (
                      <button
                        key={d}
                        type="button"
                        data-ocid="generator.protection_duration.toggle"
                        onClick={() => setProtectionDuration(d)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${protectionDuration === d ? "bg-sky-500/30 text-sky-200 border-sky-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-sky-400/40"}`}
                        aria-pressed={protectionDuration === d}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Affirmation Boost switch */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-sky-900/10 border border-sky-500/15">
                  <div>
                    <p className="text-xs font-semibold text-sky-200">
                      Protection Affirmation Boost
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Add extra protection lines to every affirmation set
                    </p>
                  </div>
                  <Switch
                    checked={protectionBoost}
                    onCheckedChange={setProtectionBoost}
                    data-ocid="generator.protection_boost.switch"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          <Label className="text-sm text-muted-foreground">
            Chakra Selection
          </Label>
          <div className="flex flex-wrap gap-2">
            {/* All Chakras pill */}
            <button
              type="button"
              onClick={handleAllChakras}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                allChakrasSelected
                  ? "text-white"
                  : "text-muted-foreground bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-border"
              }`}
              style={
                allChakrasSelected
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.58 0.22 25), oklch(0.65 0.2 48), oklch(0.78 0.18 90), oklch(0.62 0.2 145), oklch(0.58 0.2 220), oklch(0.5 0.22 270), oklch(0.55 0.22 310))",
                      borderColor: "transparent",
                    }
                  : undefined
              }
              aria-pressed={allChakrasSelected}
            >
              All Chakras
            </button>

            {/* Individual chakra pills */}
            {CHAKRAS.map((chakra) => {
              const isSelected = selectedChakras.includes(chakra);
              const color = CHAKRA_COLORS[chakra];
              return (
                <TooltipProvider key={chakra}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={() => handleToggleChakra(chakra)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                          isSelected
                            ? "text-white"
                            : "text-muted-foreground bg-secondary/50 hover:bg-secondary border border-border/50 hover:border-border"
                        }`}
                        style={
                          isSelected
                            ? { background: color, borderColor: "transparent" }
                            : undefined
                        }
                        aria-pressed={isSelected}
                        data-ocid="generator.chakra.toggle"
                      >
                        {CHAKRA_EMOJI[chakra] ? `${CHAKRA_EMOJI[chakra]} ` : ""}
                        {chakra}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {chakra} · {CHAKRA_HZ[chakra] ?? ""}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
          {selectedChakras.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedChakras.length === CHAKRAS.length
                ? "All 10 chakras selected — full alignment mode"
                : `${selectedChakras.length} chakra${selectedChakras.length > 1 ? "s" : ""} selected`}
            </p>
          )}

          {/* Chakra Tone Visualization */}
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/30 bg-secondary/10 mt-2">
            <div>
              <p className="text-xs font-semibold">Chakra Tone Visualization</p>
              <p className="text-[10px] text-muted-foreground leading-snug">
                Embed Hz tones for each selected chakra into the affirmation set
              </p>
            </div>
            <Switch
              checked={chakraToneViz}
              onCheckedChange={setChakraToneViz}
              data-ocid="generator.chakra_tone_viz.switch"
            />
          </div>
        </div>
        {/* Chakra Signs Panel */}
        <SignsPanel
          context="chakra"
          title="Chakra Activation Signs"
          compact={true}
          onNavigateToSigns={onNavigate ? () => onNavigate("signs") : undefined}
        />
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setAdvancedOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-purple-400/80 hover:text-purple-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/40 rounded"
            data-ocid="generator.advanced_functions.toggle"
          >
            <Wand2 className="w-4 h-4" />
            Advanced Functions
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 border-purple-500/40 text-purple-400"
            >
              {
                [
                  deityEnabled,
                  spellEnabled,
                  soulContractEnabled,
                  shadowWorkEnabled,
                  realityScriptEnabled,
                  frequencyAttunementEnabled,
                  sigilActivationEnabled,
                  kinesisEnabled,
                ].filter(Boolean).length
              }{" "}
              active
            </Badge>
            <ChevronDown
              className={`w-3 h-3 transition-transform duration-200 ${advancedOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {advancedOpen && (
              <motion.div
                key="advanced-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
                  <p className="text-xs text-purple-400/60 leading-snug">
                    Weave additional energetic operations into every affirmation
                    batch. All active functions are layered on top of your base
                    settings.
                  </p>

                  {/* 1. Deity / Entity Invocation */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-amber-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <Label
                          className="text-sm font-semibold text-amber-300 cursor-pointer"
                          htmlFor="deity-toggle"
                        >
                          Deity / Entity Invocation
                        </Label>
                      </div>
                      <Switch
                        id="deity-toggle"
                        checked={deityEnabled}
                        onCheckedChange={setDeityEnabled}
                        data-ocid="generator.deity.toggle"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Invoke a deity or entity to bless and co-create this
                      subliminal
                    </p>
                    <AnimatePresence>
                      {deityEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <Input
                            value={deityName}
                            onChange={(e) => setDeityName(e.target.value)}
                            placeholder="Deity or entity name (e.g. Hecate, Odin, Sekhmet, Oshun)..."
                            className="bg-input/50 border-amber-500/30 focus:border-amber-500/60 text-sm"
                            data-ocid="generator.deity_name.input"
                          />
                          <Input
                            value={deityPantheon}
                            onChange={(e) => setDeityPantheon(e.target.value)}
                            placeholder="Pantheon / origin (optional — e.g. Greek, Norse, Egyptian, Yoruba)..."
                            className="bg-input/50 border-amber-500/30 focus:border-amber-500/60 text-sm"
                            data-ocid="generator.deity_pantheon.input"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Deity Signs Panel */}
                  <SignsPanel
                    context="deity"
                    title="Deity Invocation Signs"
                    compact={true}
                    onNavigateToSigns={
                      onNavigate ? () => onNavigate("signs") : undefined
                    }
                  />
                  {/* 2. Spell Weaving */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-purple-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                        <Label
                          className="text-sm font-semibold text-purple-300 cursor-pointer"
                          htmlFor="spell-toggle"
                        >
                          Spell Weaving
                        </Label>
                      </div>
                      <Switch
                        id="spell-toggle"
                        checked={spellEnabled}
                        onCheckedChange={setSpellEnabled}
                        data-ocid="generator.spell.toggle"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Weave a specific energetic operation into every
                      affirmation
                    </p>
                    <AnimatePresence>
                      {spellEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2.5 overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              "Attraction",
                              "Transmutation",
                              "Amplification",
                              "Binding",
                              "Banishing",
                              "Illumination",
                              "Abundance",
                              "Protection Ward",
                            ].map((arch) => (
                              <button
                                key={arch}
                                type="button"
                                onClick={() => setSpellArchetype(arch)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                                  spellArchetype === arch
                                    ? "bg-purple-500/30 text-purple-200 border-purple-400/60"
                                    : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-purple-400/40 hover:text-purple-300"
                                }`}
                              >
                                {arch}
                              </button>
                            ))}
                          </div>
                          <Input
                            value={spellCustom}
                            onChange={(e) => setSpellCustom(e.target.value)}
                            placeholder="Custom spell type (optional — overrides preset above)..."
                            className="bg-input/50 border-purple-500/30 focus:border-purple-500/60 text-sm"
                            data-ocid="generator.spell_custom.input"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 3. Soul Contract */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-sky-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CircleDot className="w-3.5 h-3.5 text-sky-400" />
                        <Label
                          className="text-sm font-semibold text-sky-300 cursor-pointer"
                          htmlFor="soulcontract-toggle"
                        >
                          Soul Contract
                        </Label>
                      </div>
                      <Switch
                        id="soulcontract-toggle"
                        checked={soulContractEnabled}
                        onCheckedChange={setSoulContractEnabled}
                        data-ocid="generator.soul_contract.toggle"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Declare a sacred agreement that seals your reality as
                      already done
                    </p>
                    <AnimatePresence>
                      {soulContractEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              "the Universe",
                              "Higher Self",
                              "God/Source",
                              "My Soul",
                            ].map((ent) => (
                              <button
                                key={ent}
                                type="button"
                                onClick={() => setSoulContractEntity(ent)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                                  soulContractEntity === ent
                                    ? "bg-sky-500/30 text-sky-200 border-sky-400/60"
                                    : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-sky-400/40 hover:text-sky-300"
                                }`}
                              >
                                {ent}
                              </button>
                            ))}
                          </div>
                          <Input
                            value={soulContractEntity}
                            onChange={(e) =>
                              setSoulContractEntity(e.target.value)
                            }
                            placeholder="Entity / counterparty (e.g. the Universe, Higher Self, God/Source)..."
                            className="bg-input/50 border-sky-500/30 focus:border-sky-500/60 text-sm"
                            data-ocid="generator.soul_contract_entity.input"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 4. Shadow Work Integration */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-rose-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5 text-rose-400" />
                        <Label
                          className="text-sm font-semibold text-rose-300 cursor-pointer"
                          htmlFor="shadowwork-toggle"
                        >
                          Shadow Work Integration
                        </Label>
                      </div>
                      <Switch
                        id="shadowwork-toggle"
                        checked={shadowWorkEnabled}
                        onCheckedChange={setShadowWorkEnabled}
                        data-ocid="generator.shadow_work.toggle"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Release the shadow resistance around this topic and
                      reclaim your power
                    </p>
                    <AnimatePresence>
                      {shadowWorkEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <Input
                            value={shadowWorkBlock}
                            onChange={(e) => setShadowWorkBlock(e.target.value)}
                            placeholder="Specific block to address (optional — e.g. fear of success, imposter syndrome)..."
                            className="bg-input/50 border-rose-500/30 focus:border-rose-500/60 text-sm"
                            data-ocid="generator.shadow_work_block.input"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 5. Reality Scripting */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-emerald-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Save className="w-3.5 h-3.5 text-emerald-400" />
                        <Label
                          className="text-sm font-semibold text-emerald-300 cursor-pointer"
                          htmlFor="realityscript-toggle"
                        >
                          Reality Scripting
                        </Label>
                      </div>
                      <Switch
                        id="realityscript-toggle"
                        checked={realityScriptEnabled}
                        onCheckedChange={setRealityScriptEnabled}
                        data-ocid="generator.reality_script.toggle"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Affirmations that read as if your reality already changed
                      — past-tense story style
                    </p>
                    <AnimatePresence>
                      {realityScriptEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              "days ago",
                              "weeks ago",
                              "months ago",
                              "years ago",
                            ].map((ago) => (
                              <button
                                key={ago}
                                type="button"
                                onClick={() => setRealityScriptTimeAgo(ago)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                                  realityScriptTimeAgo === ago
                                    ? "bg-emerald-500/30 text-emerald-200 border-emerald-400/60"
                                    : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-emerald-400/40 hover:text-emerald-300"
                                }`}
                              >
                                {ago}
                              </button>
                            ))}
                          </div>
                          <Input
                            value={realityScriptTimeAgo}
                            onChange={(e) =>
                              setRealityScriptTimeAgo(e.target.value)
                            }
                            placeholder="Custom time ago (e.g. 6 months ago, a year ago)..."
                            className="bg-input/50 border-emerald-500/30 focus:border-emerald-500/60 text-sm"
                            data-ocid="generator.reality_script_timeago.input"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 6. Frequency Attunement */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-cyan-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Atom className="w-3.5 h-3.5 text-cyan-400" />
                        <Label
                          className="text-sm font-semibold text-cyan-300 cursor-pointer"
                          htmlFor="freqattune-toggle"
                        >
                          Frequency Attunement
                        </Label>
                      </div>
                      <Switch
                        id="freqattune-toggle"
                        checked={frequencyAttunementEnabled}
                        onCheckedChange={setFrequencyAttunementEnabled}
                        data-ocid="generator.freq_attunement.toggle"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Tie your chosen frequency into the affirmations — programs
                      the Hz directly into the subliminal language
                    </p>
                    <AnimatePresence>
                      {frequencyAttunementEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2.5 overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              "40",
                              "174",
                              "285",
                              "396",
                              "417",
                              "432",
                              "528",
                              "639",
                              "741",
                              "852",
                              "963",
                              "1111",
                            ].map((hz) => (
                              <button
                                key={hz}
                                type="button"
                                onClick={() => setFrequencyAttunementHz(hz)}
                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-all ${
                                  frequencyAttunementHz === hz
                                    ? "bg-cyan-500/30 text-cyan-200 border-cyan-400/60"
                                    : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-cyan-400/40 hover:text-cyan-300"
                                }`}
                              >
                                {hz}Hz
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              value={frequencyAttunementHz}
                              onChange={(e) =>
                                setFrequencyAttunementHz(e.target.value)
                              }
                              placeholder="Hz value (e.g. 528)..."
                              className="bg-input/50 border-cyan-500/30 focus:border-cyan-500/60 text-sm"
                              data-ocid="generator.freq_attunement_hz.input"
                            />
                            <span className="text-xs text-cyan-400/60 whitespace-nowrap">
                              Hz
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 7. Sigil Activation */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-orange-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-orange-400" />
                        <Label
                          className="text-sm font-semibold text-orange-300 cursor-pointer"
                          htmlFor="sigil-toggle"
                        >
                          Sigil Activation
                        </Label>
                      </div>
                      <Switch
                        id="sigil-toggle"
                        checked={sigilActivationEnabled}
                        onCheckedChange={setSigilActivationEnabled}
                        data-ocid="generator.sigil_activation.toggle"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Activate and charge a sigil — affirmations declare it
                      working on your behalf
                    </p>
                    <AnimatePresence>
                      {sigilActivationEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <Input
                            value={sigilName}
                            onChange={(e) => setSigilName(e.target.value)}
                            placeholder="Sigil name (e.g. Hecate's Wheel, Bind Rune, personal sigil, or from Sigil Codex)..."
                            className="bg-input/50 border-orange-500/30 focus:border-orange-500/60 text-sm"
                            data-ocid="generator.sigil_name.input"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Sigil Signs Panel */}
                  <SignsPanel
                    context="sigil"
                    title="Sigil Activation Signs"
                    compact={true}
                    onNavigateToSigns={
                      onNavigate ? () => onNavigate("signs") : undefined
                    }
                  />
                  {/* 8. Kinesis Power Integration */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-indigo-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-indigo-400" />
                        <Label
                          className="text-sm font-semibold text-indigo-300 cursor-pointer"
                          htmlFor="kinesis-toggle"
                        >
                          Kinesis Power Integration
                        </Label>
                      </div>
                      <Switch
                        id="kinesis-toggle"
                        checked={kinesisEnabled}
                        onCheckedChange={setKinesisEnabled}
                        data-ocid="generator.kinesis_integration.toggle"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Channel a kinesis ability into your subliminal —
                      affirmations will be tuned to your chosen power
                    </p>
                    <AnimatePresence>
                      {kinesisEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <Input
                            value={kinesisSearch}
                            onChange={(e) => setKinesisSearch(e.target.value)}
                            placeholder="Search kinesis types..."
                            className="bg-input/50 border-indigo-500/30 focus:border-indigo-500/60 text-sm"
                            data-ocid="generator.kinesis_search.input"
                          />
                          {selectedKinesis && (
                            <div
                              className="text-xs text-indigo-300 px-2 py-1 rounded-full inline-flex items-center gap-1"
                              style={{
                                background: "oklch(0.5 0.22 265 / 0.2)",
                                border: "1px solid oklch(0.5 0.22 265 / 0.4)",
                              }}
                            >
                              <Zap className="w-3 h-3" /> {selectedKinesis}{" "}
                              active
                            </div>
                          )}
                          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                            {[
                              "Telekinesis",
                              "Pyrokinesis",
                              "Electrokinesis",
                              "Hydrokinesis",
                              "Aerokinesis",
                              "Geokinesis",
                              "Cryokinesis",
                              "Chronokinesis",
                              "Photokinesis",
                              "Umbrakinesis",
                              "Gravitokinesis",
                              "Lunakinesis",
                              "Heliokinesis",
                              "Atmokinesis",
                              "Ergokinesis",
                              "Quantumkinesis",
                              "Cosmokinesis",
                              "Psionics",
                              "Onirokinesis",
                              "Psammokinesis",
                              "Nucleokinesis",
                              "Vitakinesis",
                              "Metallokinesis",
                              "Sonokinesis",
                              "Nanokinesis",
                              "Biokinesis",
                              "Plasmakinesis",
                              "Magnetokinesis",
                              "Spatiokinesis",
                              "Cytokinesis",
                              "Haemokinesis",
                              "Galekinesis",
                              "Litokinesis",
                              "Kinetomimicry",
                              "Astrakinesis",
                              "Chronoportation",
                              "Lexikinesis",
                              "Morphokinesis",
                              "Hyalokinesis",
                              "Audiognosia",
                              "Omnikinesis",
                              "Venokinesis",
                              "Tempestokinesis",
                            ]
                              .filter((k) =>
                                k
                                  .toLowerCase()
                                  .includes(kinesisSearch.toLowerCase()),
                              )
                              .map((k) => (
                                <button
                                  key={k}
                                  type="button"
                                  onClick={() =>
                                    setSelectedKinesis(
                                      k === selectedKinesis ? "" : k,
                                    )
                                  }
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium border transition-all ${selectedKinesis === k ? "bg-indigo-500/30 text-indigo-200 border-indigo-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-indigo-400/40 hover:text-indigo-300"}`}
                                >
                                  {k}
                                </button>
                              ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 9. Astral Projection Programming */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-indigo-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🌌</span>
                        <Label
                          className="text-sm font-semibold text-indigo-300 cursor-pointer"
                          htmlFor="astral-toggle"
                        >
                          Astral Projection Programming
                        </Label>
                      </div>
                      <Switch
                        id="astral-toggle"
                        checked={astralEnabled}
                        onCheckedChange={setAstralEnabled}
                        data-ocid="generator.astral.switch"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Program your subconscious for intentional out-of-body
                      experiences.
                    </p>
                    <AnimatePresence>
                      {astralEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <Textarea
                            value={astralIntent}
                            onChange={(e) => setAstralIntent(e.target.value)}
                            placeholder="Intent or destination (e.g. visit the Akashic library, explore the astral realm)..."
                            className="bg-input/50 border-indigo-500/30 text-sm resize-none"
                            rows={2}
                            data-ocid="generator.astral_intent.textarea"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 10. Lucid Dream Seeding */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-violet-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">💫</span>
                        <Label
                          className="text-sm font-semibold text-violet-300 cursor-pointer"
                          htmlFor="lucid-toggle"
                        >
                          Lucid Dream Seeding
                        </Label>
                      </div>
                      <Switch
                        id="lucid-toggle"
                        checked={lucidDreamEnabled}
                        onCheckedChange={setLucidDreamEnabled}
                        data-ocid="generator.lucid_dream.switch"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Plant a specific scenario or symbol to appear in your
                      lucid dreams.
                    </p>
                    <AnimatePresence>
                      {lucidDreamEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <Textarea
                            value={lucidDreamScenario}
                            onChange={(e) =>
                              setLucidDreamScenario(e.target.value)
                            }
                            placeholder="Dream scenario or symbol (e.g. a golden door, flying over mountains, meeting your guide)..."
                            className="bg-input/50 border-violet-500/30 text-sm resize-none"
                            rows={2}
                            data-ocid="generator.lucid_dream_scenario.textarea"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 11. Parallel Self Integration */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-cyan-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🪞</span>
                        <Label
                          className="text-sm font-semibold text-cyan-300 cursor-pointer"
                          htmlFor="parallel-toggle"
                        >
                          Parallel Self Integration
                        </Label>
                      </div>
                      <Switch
                        id="parallel-toggle"
                        checked={parallelSelfEnabled}
                        onCheckedChange={setParallelSelfEnabled}
                        data-ocid="generator.parallel_self.switch"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Merge with the version of yourself living your desired
                      reality.
                    </p>
                    <AnimatePresence>
                      {parallelSelfEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              "Wealthiest Self",
                              "Healthiest Self",
                              "Loved Self",
                              "Most Powerful Self",
                              "Healed Self",
                              "Enlightened Self",
                            ].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                data-ocid="generator.parallel_self_type.toggle"
                                onClick={() => setParallelSelfType(opt)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${parallelSelfType === opt ? "bg-cyan-500/30 text-cyan-200 border-cyan-400/60" : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-cyan-400/40"}`}
                                aria-pressed={parallelSelfType === opt}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 12. Void Meditation Anchor */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-slate-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">⬛</span>
                        <Label
                          className="text-sm font-semibold text-slate-300 cursor-pointer"
                          htmlFor="void-toggle"
                        >
                          Void Meditation Anchor
                        </Label>
                      </div>
                      <Switch
                        id="void-toggle"
                        checked={voidMeditationEnabled}
                        onCheckedChange={setVoidMeditationEnabled}
                        data-ocid="generator.void_meditation.switch"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Use the void as a reset and creation point — the silence
                      between thoughts where reality is formed.
                    </p>
                  </div>

                  {/* 13. Sacred Flame Invocation */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-orange-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🔥</span>
                        <Label
                          className="text-sm font-semibold text-orange-300 cursor-pointer"
                          htmlFor="flame-toggle"
                        >
                          Sacred Flame Invocation
                        </Label>
                      </div>
                      <Switch
                        id="flame-toggle"
                        checked={sacredFlameEnabled}
                        onCheckedChange={setSacredFlameEnabled}
                        data-ocid="generator.sacred_flame.switch"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Invoke a sacred flame to purify, transform, and amplify
                      your affirmations.
                    </p>
                    <AnimatePresence>
                      {sacredFlameEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              {
                                c: "Gold",
                                col: "text-yellow-300 border-yellow-400/60 bg-yellow-500/20",
                              },
                              {
                                c: "Violet",
                                col: "text-violet-300 border-violet-400/60 bg-violet-500/20",
                              },
                              {
                                c: "Blue",
                                col: "text-blue-300 border-blue-400/60 bg-blue-500/20",
                              },
                              {
                                c: "White",
                                col: "text-slate-200 border-slate-400/60 bg-slate-500/20",
                              },
                              {
                                c: "Emerald",
                                col: "text-emerald-300 border-emerald-400/60 bg-emerald-500/20",
                              },
                              {
                                c: "Ruby",
                                col: "text-rose-300 border-rose-400/60 bg-rose-500/20",
                              },
                              {
                                c: "Silver",
                                col: "text-gray-300 border-gray-400/60 bg-gray-500/20",
                              },
                            ].map(({ c, col }) => (
                              <button
                                key={c}
                                type="button"
                                data-ocid="generator.sacred_flame_color.toggle"
                                onClick={() => setSacredFlameColor(c)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${sacredFlameColor === c ? col : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-orange-400/40"}`}
                                aria-pressed={sacredFlameColor === c}
                              >
                                {c} Flame
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 14. Quantum Observer Collapse */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-lime-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">⚛️</span>
                        <Label
                          className="text-sm font-semibold text-lime-300 cursor-pointer"
                          htmlFor="quantum-toggle"
                        >
                          Quantum Observer Collapse
                        </Label>
                      </div>
                      <Switch
                        id="quantum-toggle"
                        checked={quantumObserverEnabled}
                        onCheckedChange={setQuantumObserverEnabled}
                        data-ocid="generator.quantum_observer.switch"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Collapse quantum possibilities into your desired reality
                      through conscious observation and certainty.
                    </p>
                  </div>

                  {/* 15. Divine Blueprint Activation */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-amber-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">📐</span>
                        <Label
                          className="text-sm font-semibold text-amber-300 cursor-pointer"
                          htmlFor="blueprint-toggle"
                        >
                          Divine Blueprint Activation
                        </Label>
                      </div>
                      <Switch
                        id="blueprint-toggle"
                        checked={divineBlueprintEnabled}
                        onCheckedChange={setDivineBlueprintEnabled}
                        data-ocid="generator.divine_blueprint.switch"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Activate your original soul blueprint — the perfect
                      template of who you are meant to become.
                    </p>
                  </div>

                  {/* 16. Morphic Field Resonance */}
                  <div className="space-y-2.5 p-3 rounded-lg bg-background/40 border border-teal-500/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🌊</span>
                        <Label
                          className="text-sm font-semibold text-teal-300 cursor-pointer"
                          htmlFor="morphic-toggle"
                        >
                          Morphic Field Resonance
                        </Label>
                      </div>
                      <Switch
                        id="morphic-toggle"
                        checked={morphicFieldEnabled}
                        onCheckedChange={setMorphicFieldEnabled}
                        data-ocid="generator.morphic_field.switch"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">
                      Tune into a morphic field or collective consciousness to
                      accelerate your manifestation.
                    </p>
                    <AnimatePresence>
                      {morphicFieldEnabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <Input
                            value={morphicFieldName}
                            onChange={(e) =>
                              setMorphicFieldName(e.target.value)
                            }
                            placeholder="Field name or collective (e.g. 'Olympic athletes', 'enlightened masters', 'billionaires')..."
                            className="bg-input/50 border-teal-500/30 text-sm"
                            data-ocid="generator.morphic_field_name.input"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setAdultThemesOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-rose-500/30 bg-rose-950/20 hover:bg-rose-900/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
            data-ocid="adult_themes.toggle"
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-semibold text-rose-300">
                Adult Themes
              </span>
              <span className="text-xs text-rose-500/70 ml-1 hidden sm:inline">
                Quick-fill presets for mature subliminals
              </span>
            </div>
            {adultThemesOpen ? (
              <ChevronUp className="w-4 h-4 text-rose-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-rose-400" />
            )}
          </button>

          <AnimatePresence>
            {adultThemesOpen && (
              <motion.div
                key="adult-themes-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 p-4 rounded-xl border border-rose-500/20 bg-rose-950/10">
                  {ADULT_THEME_PRESETS.map((group) => (
                    <div key={group.category}>
                      <p
                        className="text-xs font-semibold mb-2"
                        style={{ color: group.color }}
                      >
                        {group.category}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.presets.map((preset) => (
                          <motion.button
                            key={preset}
                            type="button"
                            data-ocid={`adult_themes.${preset.toLowerCase().replace(/[\s/]+/g, "_")}.button`}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40"
                            style={{
                              borderColor: `color-mix(in oklch, ${group.color} 40%, transparent)`,
                              color: group.color,
                              backgroundColor: `color-mix(in oklch, ${group.color} 10%, transparent)`,
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setTopic(preset);
                              setAdultThemesOpen(false);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            {preset}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="glass-card rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6"
        aria-label="Step 2: Generate Affirmations"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-mono text-primary">
            2
          </div>
          <h2 className="font-heading text-lg font-semibold">
            Generate Affirmations
          </h2>
        </div>

        {/* Affirmation Count Control */}
        <div className="space-y-3 p-4 rounded-xl bg-secondary/20 border border-border/40">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Label className="text-sm font-heading font-semibold">
              Affirmation Count
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={4000}
                value={affirmationCount}
                onChange={(e) =>
                  setAffirmationCount(
                    Math.max(1, Math.min(4000, Number(e.target.value) || 1)),
                  )
                }
                className="w-16 sm:w-20 h-8 text-sm text-center bg-input/50 border-border/50 focus:border-primary/50"
              />
              <span className="text-xs text-muted-foreground">/ 4000 max</span>
            </div>
          </div>
          <Slider
            min={1}
            max={4000}
            step={1}
            value={[affirmationCount]}
            onValueChange={([v]) => setAffirmationCount(v)}
            className="w-full"
          />
          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "25", value: 25 },
              { label: "50", value: 50 },
              { label: "100", value: 100 },
              { label: "250", value: 250 },
              { label: "500", value: 500 },
              { label: "15 min", value: 900 },
              { label: "1000", value: 1000 },
              { label: "2000", value: 2000 },
              { label: "4000 max", value: 4000 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setAffirmationCount(preset.value)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                  affirmationCount === preset.value
                    ? "bg-primary/20 text-primary border-primary/50"
                    : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-primary"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {affirmationCount === 900
              ? "~15 minutes of subliminal cycling at 1 affirmation/sec"
              : affirmationCount <= 50
                ? "Compact set — good for short sessions"
                : affirmationCount <= 500
                  ? "Standard set — suitable for 5–10 min sessions"
                  : affirmationCount <= 1000
                    ? "Extended set — ideal for 15–20 min sessions"
                    : "Maximum density — ultra-deep subliminal saturation"}
          </p>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || generateMutation.isPending || !topic.trim()}
          className="w-full h-14 text-base font-heading font-semibold glow-primary bg-primary/90 hover:bg-primary transition-all"
          size="lg"
        >
          {isGenerating || generateMutation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Affirmations...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Affirmations
            </>
          )}
        </Button>

        {/* Loading skeleton */}
        {(isGenerating || generateMutation.isPending) && (
          <div className="space-y-2">
            {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((k, i) => (
              <Skeleton
                key={k}
                className="h-10 rounded-lg"
                style={{ opacity: 1 - i * 0.1 }}
              />
            ))}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {affirmations.length > 0 &&
            !isGenerating &&
            !generateMutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">
                      {affirmations.length} affirmations generated
                    </span>
                    {generationSource === "ai" && (
                      <Badge className="text-[10px] px-2 py-0 h-5 bg-primary/20 text-primary border-primary/40">
                        AI
                      </Badge>
                    )}
                    {generationSource === "rule-based" && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-2 py-0 h-5 bg-muted/50 text-muted-foreground border-border/40"
                      >
                        Rule-Based
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAffirmations}
                    className="text-xs gap-1.5 hover:text-primary"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copied ? "Copied!" : "Copy All"}
                  </Button>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {affirmations.slice(0, 100).map((line, i) => (
                    <motion.div
                      key={`aff-${line.slice(0, 20)}-${i}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 1.2) }}
                      className="affirmation-line text-sm"
                    >
                      {line}
                    </motion.div>
                  ))}
                  {affirmations.length > 100 && (
                    <div className="text-xs text-muted-foreground text-center py-3 border border-border/30 rounded-lg bg-secondary/20">
                      Showing 100 of {affirmations.length} affirmations — all{" "}
                      {affirmations.length} are included in the video and JSON
                      export
                    </div>
                  )}
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="glass-card rounded-2xl p-4 sm:p-6"
        aria-label="Step 3: Project Configuration"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-mono text-primary">
            3
          </div>
          <h2 className="font-heading text-lg font-semibold">
            Project Configuration
          </h2>
        </div>

        <Accordion type="multiple" className="space-y-2">
          {/* Voice Config */}
          <AccordionItem
            value="voice"
            className="border border-border/40 rounded-xl px-4 bg-secondary/20"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2 text-sm font-heading font-semibold">
                <Volume2 className="w-4 h-4 text-accent" />
                Voice Configuration
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Voice Type
                  </Label>
                  <Select value={voiceType} onValueChange={setVoiceType}>
                    <SelectTrigger className="bg-input/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Neural Female",
                        "Neural Male",
                        "Whisper Female",
                        "Whisper Male",
                      ].map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Repetition Count: {repetitionCount}
                  </Label>
                  <Slider
                    min={1}
                    max={50}
                    step={1}
                    value={[repetitionCount]}
                    onValueChange={([v]) => setRepetitionCount(v)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2 col-span-1 sm:col-span-2">
                  {/* ── 3-Layer Audio Stack ── */}
                  <div className="p-4 rounded-xl bg-background/40 border border-border/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-accent" />
                      <Label className="text-sm font-heading font-semibold">
                        3-Layer Audio Stack
                      </Label>
                    </div>

                    {[
                      {
                        index: 0,
                        label: "Layer 1 — Normal",
                        desc: "Base subliminal layer",
                        color: "oklch(0.65 0.22 270)",
                        colorClass: "text-primary",
                        borderColor: "oklch(0.65 0.22 270)",
                        minSpeed: 0.5,
                        maxSpeed: 2.0,
                      },
                      {
                        index: 1,
                        label: "Layer 2 — Fast",
                        desc: "Micro-repetition, faster cycling",
                        color: "oklch(0.75 0.18 60)",
                        colorClass: "text-amber-400",
                        borderColor: "oklch(0.75 0.18 60)",
                        minSpeed: 1.2,
                        maxSpeed: 3.0,
                      },
                      {
                        index: 2,
                        label: "Layer 3 — Slow",
                        desc: "Deep subconscious absorption",
                        color: "oklch(0.65 0.2 185)",
                        colorClass: "text-teal-400",
                        borderColor: "oklch(0.65 0.2 185)",
                        minSpeed: 0.3,
                        maxSpeed: 0.9,
                      },
                    ].map((layerMeta) => {
                      const layer = audioLayers[layerMeta.index];
                      return (
                        <div
                          key={layerMeta.index}
                          className="rounded-lg p-3 space-y-3 transition-all duration-200 border border-border/30 bg-background/40"
                          style={{
                            opacity: layer.enabled ? 1 : 0.4,
                            borderLeftWidth: "3px",
                            borderLeftColor: layer.enabled
                              ? layerMeta.borderColor
                              : "transparent",
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                                style={{
                                  background: layer.enabled
                                    ? layerMeta.color
                                    : "oklch(0.4 0.01 270)",
                                }}
                              />
                              <div>
                                <p
                                  className="text-xs font-heading font-semibold"
                                  style={{
                                    color: layer.enabled
                                      ? layerMeta.color
                                      : undefined,
                                  }}
                                >
                                  {layerMeta.label}
                                </p>
                                <p className="text-[10px] text-muted-foreground leading-snug">
                                  {layerMeta.desc}
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={layer.enabled}
                              onCheckedChange={(checked) =>
                                setAudioLayers((prev) =>
                                  prev.map((l, i) =>
                                    i === layerMeta.index
                                      ? { ...l, enabled: checked }
                                      : l,
                                  ),
                                )
                              }
                            />
                          </div>
                          {layer.enabled && (
                            <div className="space-y-2.5 pl-4">
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <Label className="text-[10px] text-muted-foreground">
                                    Speed
                                  </Label>
                                  <span
                                    className="text-[10px] font-mono"
                                    style={{ color: layerMeta.color }}
                                  >
                                    {layer.speed.toFixed(2)}x
                                  </span>
                                </div>
                                <Slider
                                  min={layerMeta.minSpeed}
                                  max={layerMeta.maxSpeed}
                                  step={0.05}
                                  value={[layer.speed]}
                                  onValueChange={([v]) =>
                                    setAudioLayers((prev) =>
                                      prev.map((l, i) =>
                                        i === layerMeta.index
                                          ? { ...l, speed: v }
                                          : l,
                                      ),
                                    )
                                  }
                                  className="w-full"
                                />
                              </div>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <Label className="text-[10px] text-muted-foreground">
                                    Volume
                                  </Label>
                                  <span
                                    className="text-[10px] font-mono"
                                    style={{ color: layerMeta.color }}
                                  >
                                    {Math.round(layer.volume * 100)}%
                                  </span>
                                </div>
                                <Slider
                                  min={0}
                                  max={1}
                                  step={0.05}
                                  value={[layer.volume]}
                                  onValueChange={([v]) =>
                                    setAudioLayers((prev) =>
                                      prev.map((l, i) =>
                                        i === layerMeta.index
                                          ? { ...l, volume: v }
                                          : l,
                                      ),
                                    )
                                  }
                                  className="w-full"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <p className="text-[10px] text-muted-foreground leading-relaxed pt-1 border-t border-border/20">
                      All layers are synchronized to the same total duration.
                      Faster layers cycle more repetitions; slower layers cycle
                      fewer but deeper.
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Pitch: {voicePitch > 0 ? `+${voicePitch}` : voicePitch}
                  </Label>
                  <Slider
                    min={-5}
                    max={5}
                    step={1}
                    value={[voicePitch]}
                    onValueChange={([v]) => setVoicePitch(v)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/40 border border-border/30">
                <Label
                  htmlFor="whisper-overlay"
                  className="text-sm cursor-pointer"
                >
                  Whisper Overlay
                </Label>
                <Switch
                  id="whisper-overlay"
                  checked={whisperOverlay}
                  onCheckedChange={setWhisperOverlay}
                />
              </div>

              {/* TTS Preview */}
              <div className="p-4 rounded-xl bg-background/40 border border-border/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-accent" />
                  <Label className="text-sm font-heading font-semibold">
                    TTS Preview
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!affirmations.length}
                    onClick={handleTTSPlay}
                    className={`gap-2 font-heading font-semibold transition-all ${
                      isTTSPlaying
                        ? "border-green-500/60 text-green-400 bg-green-500/10 hover:bg-green-500/20"
                        : "border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/70"
                    }`}
                  >
                    {isTTSPlaying ? (
                      <>
                        <Square className="w-3.5 h-3.5" />
                        Stop TTS
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        Preview Layered TTS
                      </>
                    )}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Speaks first 5 affirmations across all enabled layers
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Audio Config */}
          <AccordionItem
            value="audio"
            className="border border-border/40 rounded-xl px-4 bg-secondary/20"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2 text-sm font-heading font-semibold">
                <Music className="w-4 h-4 text-accent" />
                Audio Configuration
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Background Music
                  </Label>
                  <Select
                    value={backgroundMusic}
                    onValueChange={setBackgroundMusic}
                  >
                    <SelectTrigger className="bg-input/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Theta Waves",
                        "Alpha Waves",
                        "Delta Waves",
                        "Binaural Beats",
                        "Nature Ambience",
                        "Cosmic Drone",
                      ].map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Subliminal Frequency
                  </Label>
                  <Select
                    value={subliminalFreq}
                    onValueChange={setSubliminalFreq}
                  >
                    <SelectTrigger className="bg-input/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["432Hz", "528Hz", "639Hz", "741Hz", "852Hz"].map(
                        (v) => (
                          <SelectItem key={v} value={v}>
                            {v}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Music Volume: {Math.round(musicVolume * 100)}%
                  </Label>
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    value={[musicVolume]}
                    onValueChange={([v]) => setMusicVolume(v)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Subliminal Volume: {Math.round(subliminalVolume * 100)}%
                  </Label>
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    value={[subliminalVolume]}
                    onValueChange={([v]) => setSubliminalVolume(v)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/40 border border-border/30">
                  <Label htmlFor="waveform" className="text-sm cursor-pointer">
                    Waveform Overlay
                  </Label>
                  <Switch
                    id="waveform"
                    checked={waveformOverlay}
                    onCheckedChange={setWaveformOverlay}
                  />
                </div>
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/40 border border-border/30">
                  <Label htmlFor="stereo" className="text-sm cursor-pointer">
                    Stereo Movement
                  </Label>
                  <Switch
                    id="stereo"
                    checked={stereoMovement}
                    onCheckedChange={setStereoMovement}
                  />
                </div>
              </div>

              {/* ── Foreground Sound ── */}
              <div className="space-y-4 p-4 rounded-xl bg-background/40 border border-border/30">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-accent" />
                  <Label className="text-sm font-heading font-semibold">
                    Foreground Sound
                  </Label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {NATURE_SOUNDS.map((sound) => {
                    const Icon = sound.icon;
                    const selected = natureSound === sound.label;
                    return (
                      <button
                        type="button"
                        key={sound.label}
                        onClick={() => {
                          setNatureSound(sound.label);
                          if (isNaturePlaying) {
                            natureSoundStopRef.current?.();
                            natureSoundStopRef.current = null;
                            setIsNaturePlaying(false);
                          }
                        }}
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-medium transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                          selected
                            ? "mode-card-active"
                            : "mode-card-inactive hover:border-border"
                        }`}
                        aria-pressed={selected}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: selected ? sound.color : undefined }}
                        />
                        <span
                          className="leading-tight text-center"
                          style={selected ? { color: sound.color } : undefined}
                        >
                          {sound.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Sound Volume: {Math.round(natureSoundVolume * 100)}%
                  </Label>
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    value={[natureSoundVolume]}
                    onValueChange={([v]) => setNatureSoundVolume(v)}
                    className="w-full"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={natureSound === "None"}
                  onClick={handleToggleNatureSound}
                  className={`gap-2 font-heading font-semibold transition-all ${
                    isNaturePlaying
                      ? "border-green-500/60 text-green-400 bg-green-500/10 hover:bg-green-500/20"
                      : "border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/70"
                  }`}
                >
                  {isNaturePlaying ? (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      Stop Sound
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Play Sound
                    </>
                  )}
                </Button>
              </div>

              {/* ── Frequency Tone ── */}
              <div className="space-y-4 p-4 rounded-xl bg-background/40 border border-border/30">
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-accent" />
                  <Label className="text-sm font-heading font-semibold">
                    Frequency Tone
                  </Label>
                </div>

                {/* Frequency presets */}
                <div className="flex flex-wrap gap-2">
                  {FREQUENCY_PRESETS.map((preset) => {
                    const selected = frequencyHz === String(preset.hz);
                    return (
                      <button
                        type="button"
                        key={preset.hz}
                        onClick={() => {
                          setFrequencyHz(String(preset.hz));
                          if (isFrequencyPlaying) {
                            frequencyStopRef.current?.();
                            const stop = startFrequencyTone(
                              preset.hz,
                              frequencyWaveform,
                              frequencyToneVolume,
                            );
                            frequencyStopRef.current = stop;
                          }
                        }}
                        className={`flex flex-col items-center px-3 py-2 rounded-full text-xs font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                          selected
                            ? "bg-primary/20 text-primary border-primary/50"
                            : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-primary"
                        }`}
                        aria-pressed={selected}
                      >
                        <span className="font-semibold">{preset.label}</span>
                        <span className="text-[10px] opacity-70 leading-tight">
                          {preset.sublabel}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom hz input */}
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={20000}
                    value={frequencyHz}
                    onChange={(e) => setFrequencyHz(e.target.value)}
                    className="w-28 h-8 text-sm text-center bg-input/50 border-border/50 focus:border-primary/50"
                    placeholder="Hz"
                  />
                  <span className="text-xs text-muted-foreground">
                    Custom frequency (Hz)
                  </span>
                </div>

                {/* Waveform selector */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Waveform
                  </Label>
                  <div className="flex gap-2 flex-wrap">
                    {WAVEFORMS.map((wf) => (
                      <button
                        type="button"
                        key={wf.type}
                        onClick={() => {
                          setFrequencyWaveform(wf.type);
                          if (isFrequencyPlaying) {
                            frequencyStopRef.current?.();
                            const hz = Number.parseFloat(frequencyHz);
                            const stop = startFrequencyTone(
                              hz,
                              wf.type,
                              frequencyToneVolume,
                            );
                            frequencyStopRef.current = stop;
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                          frequencyWaveform === wf.type
                            ? "bg-primary/20 text-primary border-primary/50"
                            : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-primary"
                        }`}
                        aria-pressed={frequencyWaveform === wf.type}
                      >
                        {wf.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Volume */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Tone Volume: {Math.round(frequencyToneVolume * 100)}%
                  </Label>
                  <Slider
                    min={0}
                    max={1}
                    step={0.05}
                    value={[frequencyToneVolume]}
                    onValueChange={([v]) => setFrequencyToneVolume(v)}
                    className="w-full"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleToggleFrequency}
                  className={`gap-2 font-heading font-semibold transition-all ${
                    isFrequencyPlaying
                      ? "border-green-500/60 text-green-400 bg-green-500/10 hover:bg-green-500/20"
                      : "border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/70"
                  }`}
                >
                  {isFrequencyPlaying ? (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      Stop Tone
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Play Tone
                    </>
                  )}
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Visual Config */}
          <AccordionItem
            value="visual"
            className="border border-border/40 rounded-xl px-4 bg-secondary/20"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2 text-sm font-heading font-semibold">
                <Eye className="w-4 h-4 text-accent" />
                Visual Configuration
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Theme Style
                  </Label>
                  <Select value={themeStyle} onValueChange={setThemeStyle}>
                    <SelectTrigger className="bg-input/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Dark Cosmic",
                        "Ethereal Light",
                        "Forest Depth",
                        "Ocean Void",
                        "Fire Core",
                        "Crystal Grid",
                      ].map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Color Palette
                  </Label>
                  <Select value={colorPalette} onValueChange={setColorPalette}>
                    <SelectTrigger className="bg-input/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Violet/Indigo",
                        "Gold/Amber",
                        "Teal/Cyan",
                        "Rose/Crimson",
                        "Emerald/Green",
                        "Monochrome",
                      ].map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Render Config */}
          <AccordionItem
            value="render"
            className="border border-border/40 rounded-xl px-4 bg-secondary/20"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2 text-sm font-heading font-semibold">
                <Film className="w-4 h-4 text-accent" />
                Render Configuration
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Resolution
                  </Label>
                  <Select value={resolution} onValueChange={setResolution}>
                    <SelectTrigger className="bg-input/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["720p", "1080p", "4K"].map((v) => (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Frame Rate
                  </Label>
                  <Select
                    value={String(frameRate)}
                    onValueChange={(v) => setFrameRate(Number(v))}
                  >
                    <SelectTrigger className="bg-input/50 border-border/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[24, 30, 60].map((v) => (
                        <SelectItem key={v} value={String(v)}>
                          {v}fps
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-1 sm:col-span-2">
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <Label className="text-xs text-muted-foreground">
                      Duration
                    </Label>
                    <span className="text-xs font-mono text-primary">
                      {Math.floor(duration / 3600) > 0
                        ? `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m ${duration % 60}s`
                        : Math.floor(duration / 60) > 0
                          ? `${Math.floor(duration / 60)}m ${duration % 60}s`
                          : `${duration}s`}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={14400}
                      value={duration}
                      onChange={(e) =>
                        setDuration(
                          Math.max(1, Math.min(14400, Number(e.target.value))),
                        )
                      }
                      className="bg-input/50 border-border/50 text-sm w-28"
                      placeholder="seconds"
                    />
                    <span className="text-xs text-muted-foreground self-center">
                      seconds
                    </span>
                  </div>
                  {/* Duration presets */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "1 min", value: 60 },
                      { label: "5 min", value: 300 },
                      { label: "10 min", value: 600 },
                      { label: "15 min", value: 900 },
                      { label: "30 min", value: 1800 },
                      { label: "1 hr", value: 3600 },
                      { label: "2 hr", value: 7200 },
                      { label: "3 hr", value: 10800 },
                      { label: "4 hr", value: 14400 },
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setDuration(p.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                          duration === p.value
                            ? "bg-primary/20 text-primary border-primary/50"
                            : "bg-secondary/50 text-muted-foreground border-border/40 hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    For 1hr+ recordings keep the browser tab active and do not
                    lock your screen. The recording streams directly to memory —
                    longer sessions require more RAM.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* ── Preview Audio Mix ── */}
        <div className="pt-2">
          <Button
            type="button"
            onClick={handleToggleMix}
            disabled={!affirmations.length}
            variant="outline"
            className={`w-full h-12 font-heading font-semibold gap-2 transition-all ${
              isMixPlaying
                ? "border-green-500/60 text-green-400 bg-green-500/10 hover:bg-green-500/20"
                : "border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/70"
            }`}
          >
            {isMixPlaying ? (
              <>
                <Square className="w-4 h-4" />
                Stop Mix
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Preview Audio Mix
              </>
            )}
          </Button>
          {!affirmations.length && (
            <p className="text-xs text-muted-foreground text-center mt-1.5">
              Generate affirmations first to preview the audio mix
            </p>
          )}
        </div>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="glass-card rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6"
        aria-label="Step 4: Build Project JSON"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-mono text-primary">
            4
          </div>
          <h2 className="font-heading text-lg font-semibold">
            Build & Export Project
          </h2>
        </div>

        <Button
          onClick={handleBuild}
          disabled={isBuilding || !affirmations.length}
          variant="outline"
          className="w-full h-12 font-heading font-semibold border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/70"
        >
          {isBuilding ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Building JSON...
            </>
          ) : (
            <>
              <Film className="w-4 h-4 mr-2" />
              Build Project JSON
            </>
          )}
        </Button>

        <AnimatePresence>
          {projectJSON && !isBuilding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* JSON display */}
              <div className="relative">
                <div className="terminal-block p-4 overflow-auto max-h-64 rounded-xl">
                  <pre className="text-xs whitespace-pre-wrap break-all">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(projectJSON), null, 2);
                      } catch {
                        return projectJSON;
                      }
                    })()}
                  </pre>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 h-7 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    navigator.clipboard.writeText(projectJSON);
                    toast.success("JSON copied to clipboard");
                  }}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>

              {/* Preview & Export Video button */}
              <Button
                onClick={() => setShowVideoPreview((v) => !v)}
                variant="outline"
                className="w-full h-11 font-heading font-semibold border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/70 gap-2"
              >
                <Video className="w-4 h-4" />
                {showVideoPreview
                  ? "Hide Video Preview"
                  : "Preview & Export Video"}
              </Button>

              {/* Canvas video preview */}
              <AnimatePresence>
                {showVideoPreview && (
                  <VideoPreview
                    affirmations={affirmations}
                    topic={topic}
                    chakra={selectedChakras.join(", ")}
                    palette={colorPalette}
                    theme={themeStyle}
                    duration={duration}
                    natureSound={natureSound}
                    natureSoundVolume={natureSoundVolume}
                    frequencyHz={frequencyHz}
                    frequencyWaveform={frequencyWaveform}
                    frequencyToneVolume={frequencyToneVolume}
                    audioLayers={audioLayers}
                    voiceType={voiceType}
                    voicePitch={voicePitch}
                  />
                )}
              </AnimatePresence>

              {/* Save project */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder="Project title..."
                  className="bg-input/50 border-border/50 focus:border-primary/50 w-full"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                <Button
                  onClick={handleSave}
                  disabled={saveMutation.isPending || !saveTitle.trim()}
                  className="shrink-0 bg-primary/90 hover:bg-primary w-full sm:w-auto"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span className="ml-2">Save</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="glass-card rounded-2xl overflow-hidden"
        aria-label="Saved Projects"
      >
        <Collapsible open={projectsOpen} onOpenChange={setProjectsOpen}>
          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-4 h-4 text-accent" />
              <h2 className="font-heading text-lg font-semibold">
                Saved Projects
              </h2>
              {projects && projects.length > 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-accent/15 text-accent border-accent/30"
                >
                  {projects.length}
                </Badge>
              )}
            </div>
            {projectsOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="px-3 sm:px-6 pb-4 sm:pb-6 space-y-3">
              {projectsLoading && (
                <div className="space-y-2">
                  {["p-sk-1", "p-sk-2", "p-sk-3"].map((k) => (
                    <Skeleton key={k} className="h-14 rounded-xl" />
                  ))}
                </div>
              )}
              {!projectsLoading && (!projects || projects.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No saved projects yet. Build and save your first project
                  above.
                </p>
              )}
              {projects?.map(([id, title, timestamp]) => (
                <div
                  key={id.toString()}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-border/40 hover:border-border/70 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">
                      {title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(timestamp)}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-accent hover:text-accent/80 hover:bg-accent/10"
                      onClick={() => handleLoadProject(id, title)}
                      disabled={getProjectMutation.isPending}
                    >
                      <FolderOpen className="w-3.5 h-3.5 mr-1" />
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                      onClick={() => handleDelete(id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Loaded JSON display */}
              <AnimatePresence>
                {loadedJSON && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">
                        Loaded Project JSON
                      </Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs"
                        onClick={() => setLoadedJSON(null)}
                      >
                        Close
                      </Button>
                    </div>
                    <div className="terminal-block p-4 overflow-auto max-h-48 rounded-xl">
                      <pre className="text-xs whitespace-pre-wrap break-all">
                        {(() => {
                          try {
                            return JSON.stringify(
                              JSON.parse(loadedJSON),
                              null,
                              2,
                            );
                          } catch {
                            return loadedJSON;
                          }
                        })()}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </motion.section>
    </div>
  );
}
