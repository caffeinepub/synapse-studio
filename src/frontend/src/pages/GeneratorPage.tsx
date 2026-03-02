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
  Check,
  ChevronDown,
  ChevronUp,
  CircleDot,
  Copy,
  Download,
  Droplets,
  Eye,
  Film,
  Flame,
  FolderOpen,
  Leaf,
  Loader2,
  Music,
  Package,
  Play,
  Save,
  Shield,
  Square,
  Star,
  Trash2,
  User,
  Video,
  Volume2,
  VolumeX,
  Wand2,
  Wind,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useDeleteProject,
  useGenerateAffirmations,
  useGetProject,
  useListProjects,
  useSaveProject,
} from "../hooks/useQueries";
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
];

const CHAKRA_COLORS: Record<string, string> = {
  Root: "oklch(0.58 0.22 25)",
  Sacral: "oklch(0.65 0.2 48)",
  "Solar Plexus": "oklch(0.78 0.18 90)",
  Heart: "oklch(0.62 0.2 145)",
  Throat: "oklch(0.58 0.2 220)",
  "Third Eye": "oklch(0.5 0.22 270)",
  Crown: "oklch(0.55 0.22 310)",
};

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
  const [itemEnabled, setItemEnabled] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemSource, setItemSource] = useState("");

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
    try {
      const aiResult = await generateAffirmationsWithAI(
        topic,
        modes.booster,
        modes.fantasy,
        modes.protection,
        selectedChakras.join(", "),
        modes.fantasy && characterEnabled ? characterName : undefined,
        modes.fantasy && characterEnabled ? characterSource : undefined,
        modes.fantasy && itemEnabled ? itemName : undefined,
        modes.fantasy && itemEnabled ? itemSource : undefined,
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

      const backendResult = await generateMutation.mutateAsync({
        topic,
        boosterEnabled: modes.booster,
        fantasyEnabled: modes.fantasy,
        protectionEnabled: modes.protection,
        chakraName: selectedChakras.join(", "),
      });
      // Append character/item manifestation lines from local engine when applicable
      const hasCharacter =
        modes.fantasy && characterEnabled && characterName.trim();
      const hasItem = modes.fantasy && itemEnabled && itemName.trim();
      let result = [...backendResult];
      if (hasCharacter || hasItem) {
        const { generateAffirmations: genLocal } = await import(
          "../utils/affirmationUtils"
        );
        const extra = genLocal(
          topic,
          false,
          true,
          false,
          "",
          hasCharacter ? characterName : undefined,
          hasCharacter ? characterSource : undefined,
          hasItem ? itemName : undefined,
          hasItem ? itemSource : undefined,
        );
        // Only take lines that reference the character or item names
        const filterTerms = [
          ...(hasCharacter ? [characterName.trim().toLowerCase()] : []),
          ...(hasItem ? [itemName.trim().toLowerCase()] : []),
        ];
        const manifestLines = extra.filter((line) =>
          filterTerms.some((t) => line.toLowerCase().includes(t)),
        );
        result = [...result, ...manifestLines];
      }
      const expanded = expandToCount(result, affirmationCount);
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
          fantasy_to_reality: modes.fantasy,
          protection: modes.protection,
          character_manifestation:
            modes.fantasy && characterEnabled
              ? {
                  enabled: true,
                  character: characterName,
                  source: characterSource || null,
                }
              : { enabled: false },
          item_manifestation:
            modes.fantasy && itemEnabled
              ? { enabled: true, item: itemName, source: itemSource || null }
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
          />
        </div>

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

        {/* Fantasy-to-Reality sub-functions */}
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chakra selector */}
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
                <button
                  type="button"
                  key={chakra}
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
                >
                  {chakra}
                </button>
              );
            })}
          </div>
          {selectedChakras.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {selectedChakras.length === CHAKRAS.length
                ? "All 7 chakras selected — full alignment mode"
                : `${selectedChakras.length} chakra${selectedChakras.length > 1 ? "s" : ""} selected`}
            </p>
          )}
        </div>
      </motion.section>

      {/* ── Step 2: Generate ──────────────────────────────────── */}
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

      {/* ── Step 3: Project Config ────────────────────────────── */}
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

      {/* ── Step 4: Build JSON + Video Preview ───────────────── */}
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

      {/* ── Saved Projects Panel ─────────────────────────────── */}
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
