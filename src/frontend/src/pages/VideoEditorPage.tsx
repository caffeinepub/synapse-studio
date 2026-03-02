import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AudioLines,
  Download,
  Droplets,
  FileAudio,
  Film,
  Flame,
  ImagePlus,
  Key,
  Layers,
  Leaf,
  Loader2,
  Mic,
  Moon,
  Mountain,
  Music,
  Play,
  Radio,
  Sparkles,
  Square,
  Star,
  Sun,
  Trees,
  Upload,
  Volume2,
  VolumeX,
  Waves,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  connectFrequencyToneToCtx,
  connectFrequencyToneWithAnalyser,
  connectNatureSoundToCtx,
  connectNatureSoundWithAnalyser,
  startFrequencyTone,
  startNatureSound,
} from "../utils/audioEngine";
import type { SubliminalContext } from "./GeneratorPage";

// ── Types ─────────────────────────────────────────────────────────────────────

interface VideoEditorPageProps {
  subliminalCtx?: SubliminalContext;
}

interface AudioLayer {
  enabled: boolean;
  speed: number;
  volume: number;
}

type WaveformType = OscillatorType;

// ── Constants ─────────────────────────────────────────────────────────────────

const SAMPLE_AFFIRMATIONS = [
  "I am in perfect alignment with my highest self",
  "My energy radiates abundance and clarity",
  "Every cell in my body vibrates with health and vitality",
  "I attract exactly what I need in divine timing",
  "My mind is open to infinite possibilities",
  "I am worthy of all my desires manifesting now",
  "The universe conspires in my favor always",
  "I walk in confidence and unwavering self-trust",
];

const FREQUENCY_PRESETS = [
  { label: "40 Hz – Focus", hz: 40 },
  { label: "174 Hz – Pain Relief", hz: 174 },
  { label: "285 Hz – Tissue Healing", hz: 285 },
  { label: "396 Hz – Root", hz: 396 },
  { label: "417 Hz – Sacral", hz: 417 },
  { label: "528 Hz – DNA/Heart", hz: 528 },
  { label: "639 Hz – Throat", hz: 639 },
  { label: "741 Hz – Third Eye", hz: 741 },
  { label: "852 Hz – Crown", hz: 852 },
  { label: "963 Hz – Pineal", hz: 963 },
  { label: "1111 Hz – Spiritual", hz: 1111 },
];

const WAVEFORMS: { type: WaveformType; label: string }[] = [
  { type: "sine", label: "Sine" },
  { type: "triangle", label: "Triangle" },
  { type: "square", label: "Square" },
  { type: "sawtooth", label: "Sawtooth" },
];

const NATURE_SOUNDS: {
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { label: "None", icon: VolumeX, color: "oklch(0.45 0.02 270)" },
  { label: "Rain", icon: Droplets, color: "oklch(0.58 0.18 220)" },
  { label: "Campfire", icon: Flame, color: "oklch(0.65 0.2 40)" },
  { label: "Forest / Birds", icon: Leaf, color: "oklch(0.62 0.2 145)" },
  { label: "Ocean Waves", icon: Waves, color: "oklch(0.58 0.2 200)" },
  { label: "Thunder Storm", icon: Zap, color: "oklch(0.65 0.18 260)" },
  { label: "Flowing River", icon: Droplets, color: "oklch(0.55 0.2 210)" },
  { label: "Wind", icon: Wind, color: "oklch(0.6 0.12 200)" },
  { label: "Night Crickets", icon: Moon, color: "oklch(0.5 0.15 270)" },
  { label: "Deep Space", icon: Star, color: "oklch(0.42 0.18 280)" },
  { label: "Cave Drips", icon: Mountain, color: "oklch(0.5 0.1 230)" },
  { label: "Tibetan Bowls", icon: Radio, color: "oklch(0.65 0.2 55)" },
  { label: "Waterfall", icon: Waves, color: "oklch(0.6 0.18 205)" },
  { label: "Morning Dew", icon: Sun, color: "oklch(0.72 0.16 75)" },
  { label: "Storm at Sea", icon: Zap, color: "oklch(0.48 0.2 225)" },
  { label: "Sacred Silence", icon: Sparkles, color: "oklch(0.55 0.12 300)" },
  { label: "Jungle", icon: Trees, color: "oklch(0.55 0.22 140)" },
  { label: "Desert Wind", icon: Wind, color: "oklch(0.65 0.15 60)" },
];

const PALETTES = [
  "Violet/Indigo",
  "Gold/Amber",
  "Teal/Cyan",
  "Rose/Crimson",
  "Emerald/Green",
  "Monochrome",
];

const THEMES = [
  "Dark Cosmic",
  "Ethereal Light",
  "Ocean Void",
  "Fire Core",
  "Crystal Grid",
  "Forest Depth",
];

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

const DURATION_PRESETS = [
  { label: "1 min", secs: 60 },
  { label: "5 min", secs: 300 },
  { label: "10 min", secs: 600 },
  { label: "15 min", secs: 900 },
  { label: "30 min", secs: 1800 },
  { label: "1 hr", secs: 3600 },
  { label: "2 hr", secs: 7200 },
  { label: "3 hr", secs: 10800 },
  { label: "4 hr", secs: 14400 },
];

const THUMBNAIL_STYLES = [
  "Cosmic",
  "Dark Fantasy",
  "Sacred Geometry",
  "Neon",
  "Abstract",
  "Minimal",
];

type TextPosition = "top" | "center" | "bottom";

interface ThumbnailConfig {
  bgColor1: string;
  bgColor2: string;
  mainText: string;
  mainFontSize: number;
  mainColor: string;
  subText: string;
  subFontSize: number;
  subColor: string;
  aiImageData?: string | null;
}

function renderThumbnailCanvas(
  canvas: HTMLCanvasElement,
  config: ThumbnailConfig,
  exportScale = 1,
) {
  const W = 640 * exportScale;
  const H = 360 * exportScale;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  if (config.aiImageData) {
    const img = new window.Image();
    img.src = config.aiImageData;
    ctx.drawImage(img, 0, 0, W, H);
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(0, 0, W, H);
  } else {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, config.bgColor1);
    grad.addColorStop(1, config.bgColor2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(
      W / 2,
      H / 2,
      0,
      W / 2,
      H / 2,
      W * 0.55,
    );
    glow.addColorStop(0, "rgba(120,60,240,0.18)");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
  }

  const drawText = (
    text: string,
    fontSize: number,
    color: string,
    bold: boolean,
    position: TextPosition,
    yOffset = 0,
  ) => {
    if (!text.trim()) return;
    const sz = fontSize * exportScale;
    ctx.font = `${bold ? "bold" : "normal"} ${sz}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.95)";
    ctx.shadowBlur = 12 * exportScale;
    const maxW = W * 0.88;
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxW && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    const lineH = sz * 1.25;
    const totalH = lines.length * lineH;
    let startY = 0;
    if (position === "top") startY = sz + 20 * exportScale + yOffset;
    else if (position === "center")
      startY = H / 2 - totalH / 2 + lineH / 2 + yOffset;
    else startY = H - 40 * exportScale - totalH + lineH + yOffset;
    ctx.textBaseline = "middle";
    lines.forEach((line, i) => {
      ctx.fillText(line, W / 2, startY + i * lineH);
    });
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  };

  drawText(
    config.mainText,
    config.mainFontSize,
    config.mainColor,
    true,
    "center",
    0,
  );
  drawText(
    config.subText,
    config.subFontSize,
    config.subColor,
    false,
    "bottom",
    0,
  );
}

// ── Waveform Visualizer Component ─────────────────────────────────────────────

function WaveformVisualizer({
  analyserNode,
  accentColor = "#a855f7",
}: {
  analyserNode: AnalyserNode | null;
  accentColor?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      if (!analyserNode) {
        // Flat line
        ctx.beginPath();
        ctx.strokeStyle = `${accentColor}40`;
        ctx.lineWidth = 1;
        ctx.moveTo(0, H / 2);
        ctx.lineTo(W, H / 2);
        ctx.stroke();
        return;
      }

      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserNode.getByteFrequencyData(dataArray);

      const barWidth = (W / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * H;
        const alpha = 0.4 + (dataArray[i] / 255) * 0.6;
        ctx.fillStyle = `${accentColor}${Math.round(alpha * 255)
          .toString(16)
          .padStart(2, "0")}`;
        ctx.fillRect(x, H - barHeight, barWidth, barHeight);
        x += barWidth + 1;
        if (x > W) break;
      }
    };

    draw();
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [analyserNode, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={48}
      className="w-full h-12 rounded-lg bg-background/40 border border-border/20"
    />
  );
}

// ── Canvas Video Preview Component ───────────────────────────────────────────

function VideoCanvas({
  affirmations,
  topic,
  palette,
  theme,
  isRecording,
  progress,
  canvasRef,
}: {
  affirmations: string[];
  topic: string;
  palette: string;
  theme: string;
  isRecording: boolean;
  progress: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const animRef = useRef<number | null>(null);
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; r: number; a: number }[]
  >([]);
  const affIndexRef = useRef(0);
  const lastSwapRef = useRef(0);
  const textAlphaRef = useRef(0);
  const fadingInRef = useRef(true);

  const colors = PALETTE_COLORS[palette] ?? PALETTE_COLORS["Violet/Indigo"];
  const accent = PALETTE_ACCENT[palette] ?? "#a855f7";

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

  const drawFrame = useCallback(
    (ctx: CanvasRenderingContext2D, elapsed: number) => {
      const W = 1280;
      const H = 720;

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

      if (theme === "Dark Cosmic" || theme === "Ethereal Light") {
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
        ctx.globalAlpha = 0.05;
        for (let i = -H; i < W + H; i += spacing * 2) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + H, H);
          ctx.stroke();
        }
        ctx.restore();
      } else if (theme === "Forest Depth") {
        const mist = ctx.createLinearGradient(0, H * 0.4, 0, H);
        mist.addColorStop(0, "transparent");
        mist.addColorStop(1, `${accent}20`);
        ctx.fillStyle = mist;
        ctx.fillRect(0, 0, W, H);
      }

      // Vignette
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

      // Affirmation cycling
      const DISPLAY_TIME = 1500;
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

      // Text
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
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
        } else line = test;
      }
      if (line) lines.push(line);
      const lineHeight = fontSize * 1.4;
      const totalHeight = lines.length * lineHeight;
      const startY = H / 2 - totalHeight / 2 + lineHeight / 2;
      ctx.shadowColor = accent;
      ctx.shadowBlur = 24;
      for (let li = 0; li < lines.length; li++) {
        ctx.fillStyle = "#ffffff";
        ctx.fillText(lines[li], W / 2, startY + li * lineHeight);
      }
      ctx.restore();

      // Progress bar
      if (isRecording) {
        const barW = W * Math.min(progress / 100, 1);
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = `${accent}40`;
        ctx.fillRect(0, H - 4, W, 4);
        ctx.fillStyle = accent;
        ctx.fillRect(0, H - 4, barW, 4);
        ctx.restore();
      }

      // Bottom label
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.font = "14px 'Segoe UI', system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(
        topic ? topic.toUpperCase() : "SYNAPSE STUDIO",
        W / 2,
        H - 14,
      );
      ctx.restore();
    },
    [colors, accent, theme, affirmations, topic, isRecording, progress],
  );

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
      drawFrame(ctx, now - startTime);
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [drawFrame, canvasRef]);

  return null;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function VideoEditorPage({
  subliminalCtx,
}: VideoEditorPageProps) {
  // ── Canvas ───────────────────────────────────────────────────────────────
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPalette, setSelectedPalette] = useState("Violet/Indigo");
  const [selectedTheme, setSelectedTheme] = useState("Dark Cosmic");

  // ── Recording state ──────────────────────────────────────────────────────
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [isConverting, setIsConverting] = useState(false);
  const [mp4Url, setMp4Url] = useState<string | null>(null);
  const [webmFallbackUrl, setWebmFallbackUrl] = useState<string | null>(null);
  const [isTTSRecording, setIsTTSRecording] = useState(false);
  const [ttsAudioUrl, setTtsAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(300);
  const [customDurationStr, setCustomDurationStr] = useState("300");

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

  // ── Frequency state ──────────────────────────────────────────────────────
  const [selectedFreqHz, setSelectedFreqHz] = useState(528);
  const [customHz, setCustomHz] = useState<string>("528");
  const [waveform, setWaveform] = useState<WaveformType>("sine");
  const [freqVolume, setFreqVolume] = useState(0.3);
  const [freqPlaying, setFreqPlaying] = useState(false);
  const freqStopRef = useRef<(() => void) | null>(null);
  const [freqAnalyser, setFreqAnalyser] = useState<AnalyserNode | null>(null);
  const freqCtxRef = useRef<AudioContext | null>(null);

  // ── TTS state ────────────────────────────────────────────────────────────
  const [voiceType, setVoiceType] = useState<
    "Feminine" | "Masculine" | "Neutral"
  >("Feminine");
  const [ttsSpeed, setTtsSpeed] = useState(1.0);
  const [ttsPitch, setTtsPitch] = useState(1.0);
  const [layers, setLayers] = useState<AudioLayer[]>([
    { enabled: true, speed: 1.0, volume: 0.9 },
    { enabled: false, speed: 1.8, volume: 0.7 },
    { enabled: false, speed: 0.6, volume: 0.75 },
  ]);
  const [ttsSpeaking, setTtsSpeaking] = useState(false);

  // ── TTS master volume ────────────────────────────────────────────────────
  const [ttsMasterVolume, setTtsMasterVolume] = useState(0.9);

  // ── Nature sound state ───────────────────────────────────────────────────
  const [natureSound, setNatureSound] = useState<string>("None");
  const [natureSoundVolume, setNatureSoundVolume] = useState(0.4);
  const [naturePlaying, setNaturePlaying] = useState(false);
  const natureStopRef = useRef<(() => void) | null>(null);
  const [natureAnalyser, setNatureAnalyser] = useState<AnalyserNode | null>(
    null,
  );
  const natureCtxRef = useRef<AudioContext | null>(null);

  // ── Uploaded TTS state ───────────────────────────────────────────────────
  const [uploadedTTSFile, setUploadedTTSFile] = useState<File | null>(null);
  const [uploadedTTSBuffer, setUploadedTTSBuffer] =
    useState<AudioBuffer | null>(null);
  // Raw bytes stored so we can re-decode into any new AudioContext
  const [uploadedTTSBytes, setUploadedTTSBytes] = useState<ArrayBuffer | null>(
    null,
  );
  const [uploadedTTSVolume, setUploadedTTSVolume] = useState(0.9);
  const [uploadedTTSLoop, setUploadedTTSLoop] = useState(false);
  const [uploadedTTSPlaying, setUploadedTTSPlaying] = useState(false);
  const uploadedTTSStopRef = useRef<(() => void) | null>(null);
  const uploadedTTSCtxRef = useRef<AudioContext | null>(null);
  const ttsUploadInputRef = useRef<HTMLInputElement | null>(null);
  const [ttsAudioDropActive, setTtsAudioDropActive] = useState(false);

  // ── Uploaded audio state ─────────────────────────────────────────────────
  const [uploadedAudioFile, setUploadedAudioFile] = useState<File | null>(null);
  const [uploadedAudioBuffer, setUploadedAudioBuffer] =
    useState<AudioBuffer | null>(null);
  const [uploadedAudioVolume, setUploadedAudioVolume] = useState(0.8);
  const [uploadedAudioLoop, setUploadedAudioLoop] = useState(true);
  const [uploadedAudioPlaying, setUploadedAudioPlaying] = useState(false);
  const uploadedAudioStopRef = useRef<(() => void) | null>(null);
  const uploadedAudioCtxRef = useRef<AudioContext | null>(null);
  const audioUploadInputRef = useRef<HTMLInputElement>(null);
  const [audioDropActive, setAudioDropActive] = useState(false);

  // ── Uploaded thumbnail image state ───────────────────────────────────────
  const [uploadedThumbFile, setUploadedThumbFile] = useState<File | null>(null);
  const [uploadedThumbDataUrl, setUploadedThumbDataUrl] = useState<
    string | null
  >(null);
  const thumbUploadInputRef = useRef<HTMLInputElement>(null);
  const [thumbDropActive, setThumbDropActive] = useState(false);

  // ── Mix master volume ────────────────────────────────────────────────────
  const [masterVolume, setMasterVolume] = useState(0.85);
  const [mixFreqVolume, setMixFreqVolume] = useState(0.3);
  const [mixNatureVolume, setMixNatureVolume] = useState(0.4);

  // ── Thumbnail state ──────────────────────────────────────────────────────
  const thumbCanvasRef = useRef<HTMLCanvasElement>(null);
  const [thumbPrompt, setThumbPrompt] = useState("");
  const [thumbStyle, setThumbStyle] = useState("Cosmic");
  const [bgColor1, setBgColor1] = useState("#0d0014");
  const [bgColor2, setBgColor2] = useState("#1a0035");
  const [mainText, setMainText] = useState("");
  const [mainFontSize, setMainFontSize] = useState(52);
  const [mainColor, setMainColor] = useState("#ffffff");
  const [subText, setSubText] = useState("Synapse Studio");
  const [subFontSize, setSubFontSize] = useState(28);
  const [subColor, setSubColor] = useState("#e0d0ff");
  const [thumbDrawn, setThumbDrawn] = useState(false);
  const [aiImageData, setAiImageData] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  // ── Derived data ─────────────────────────────────────────────────────────
  const affirmations = subliminalCtx?.affirmations?.length
    ? subliminalCtx.affirmations
    : SAMPLE_AFFIRMATIONS;
  const topic = subliminalCtx?.topic ?? "";
  const currentHz = Number.parseFloat(customHz) || selectedFreqHz;

  // ── Sync from subliminal context ─────────────────────────────────────────
  useEffect(() => {
    if (subliminalCtx?.topic) {
      const t = subliminalCtx.topic;
      const cap = t.charAt(0).toUpperCase() + t.slice(1);
      setMainText(cap.toUpperCase());
      setThumbPrompt(
        `Epic subliminal background for ${t}, mystical cosmic dark atmosphere, purple and indigo tones, sacred geometry, high quality`,
      );
    }
    if (subliminalCtx?.colorPalette)
      setSelectedPalette(subliminalCtx.colorPalette);
    if (subliminalCtx?.themeStyle) setSelectedTheme(subliminalCtx.themeStyle);
  }, [
    subliminalCtx?.topic,
    subliminalCtx?.colorPalette,
    subliminalCtx?.themeStyle,
  ]);

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      freqStopRef.current?.();
      freqCtxRef.current?.close().catch(() => {});
      natureStopRef.current?.();
      natureCtxRef.current?.close().catch(() => {});
      uploadedAudioStopRef.current?.();
      uploadedAudioCtxRef.current?.close().catch(() => {});
      uploadedTTSStopRef.current?.();
      uploadedTTSCtxRef.current?.close().catch(() => {});
      window.speechSynthesis.cancel();
      stopRecordingCleanup();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Format duration helper ────────────────────────────────────────────────
  const fmtDuration = (secs: number): string => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h${m > 0 ? ` ${m}m` : ""}`;
    if (m > 0) return `${m}m${s > 0 ? ` ${s}s` : ""}`;
    return `${s}s`;
  };

  // ── Frequency controls ───────────────────────────────────────────────────
  const toggleFrequency = () => {
    if (freqPlaying) {
      freqStopRef.current?.();
      freqStopRef.current = null;
      freqCtxRef.current?.close().catch(() => {});
      freqCtxRef.current = null;
      setFreqAnalyser(null);
      setFreqPlaying(false);
    } else {
      const hz = Number.parseFloat(customHz) || selectedFreqHz;
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtxClass();
      freqCtxRef.current = ctx;
      const [stopFn, analyser] = connectFrequencyToneWithAnalyser(
        hz,
        waveform,
        freqVolume,
        ctx,
        ctx.destination,
      );
      freqStopRef.current = stopFn;
      setFreqAnalyser(analyser);
      setFreqPlaying(true);
    }
  };

  const stopFrequency = () => {
    freqStopRef.current?.();
    freqStopRef.current = null;
    freqCtxRef.current?.close().catch(() => {});
    freqCtxRef.current = null;
    setFreqAnalyser(null);
    setFreqPlaying(false);
  };

  // ── Nature sound controls ─────────────────────────────────────────────────
  const toggleNatureSound = () => {
    if (naturePlaying) {
      natureStopRef.current?.();
      natureStopRef.current = null;
      natureCtxRef.current?.close().catch(() => {});
      natureCtxRef.current = null;
      setNatureAnalyser(null);
      setNaturePlaying(false);
    } else {
      if (natureSound === "None") {
        toast.info("Select a nature sound first");
        return;
      }
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtxClass();
      natureCtxRef.current = ctx;
      const [stopFn, analyser] = connectNatureSoundWithAnalyser(
        natureSound,
        natureSoundVolume,
        ctx,
        ctx.destination,
      );
      natureStopRef.current = stopFn;
      setNatureAnalyser(analyser);
      setNaturePlaying(true);
    }
  };

  // Stop when changing selection
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    natureStopRef.current?.();
    natureStopRef.current = null;
    natureCtxRef.current?.close().catch(() => {});
    natureCtxRef.current = null;
    setNatureAnalyser(null);
    setNaturePlaying(false);
  }, [natureSound]);

  // ── Uploaded TTS handlers ─────────────────────────────────────────────────
  const handleTTSFileSelect = async (file: File) => {
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const tmpCtx = new AudioCtxClass();
      const arrayBuffer = await file.arrayBuffer();
      // Store raw bytes so we can re-decode into any new AudioContext later
      setUploadedTTSBytes(arrayBuffer);
      // Decode a copy for preview/duration display
      const audioBuffer = await tmpCtx.decodeAudioData(arrayBuffer.slice(0));
      await tmpCtx.close();
      setUploadedTTSFile(file);
      setUploadedTTSBuffer(audioBuffer);
      toast.success(`TTS audio loaded: ${file.name}`);
    } catch (err) {
      console.error("Failed to decode TTS audio:", err);
      toast.error("Could not decode TTS file. Try MP3, WAV, or OGG.");
    }
  };

  const handleTTSFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setTtsAudioDropActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("audio/")) {
      handleTTSFileSelect(file);
    } else {
      toast.error("Please drop an audio file (MP3, WAV, OGG, etc.)");
    }
  };

  const toggleUploadedTTS = () => {
    if (uploadedTTSPlaying) {
      uploadedTTSStopRef.current?.();
      uploadedTTSStopRef.current = null;
      uploadedTTSCtxRef.current?.close().catch(() => {});
      uploadedTTSCtxRef.current = null;
      setUploadedTTSPlaying(false);
    } else {
      if (!uploadedTTSBuffer) {
        toast.info("Upload a TTS audio file first");
        return;
      }
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtxClass();
      uploadedTTSCtxRef.current = ctx;
      const gainNode = ctx.createGain();
      gainNode.gain.value = uploadedTTSVolume;
      gainNode.connect(ctx.destination);
      const source = ctx.createBufferSource();
      source.buffer = uploadedTTSBuffer;
      source.loop = uploadedTTSLoop;
      source.connect(gainNode);
      source.start(0);
      source.onended = () => {
        if (!uploadedTTSLoop) setUploadedTTSPlaying(false);
      };
      uploadedTTSStopRef.current = () => {
        try {
          source.stop();
        } catch (_) {}
      };
      setUploadedTTSPlaying(true);
    }
  };

  const clearUploadedTTS = () => {
    uploadedTTSStopRef.current?.();
    uploadedTTSStopRef.current = null;
    uploadedTTSCtxRef.current?.close().catch(() => {});
    uploadedTTSCtxRef.current = null;
    setUploadedTTSPlaying(false);
    setUploadedTTSFile(null);
    setUploadedTTSBuffer(null);
    setUploadedTTSBytes(null);
  };

  // ── Uploaded audio handlers ───────────────────────────────────────────────
  const handleAudioFileSelect = async (file: File) => {
    try {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const tmpCtx = new AudioCtxClass();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await tmpCtx.decodeAudioData(arrayBuffer);
      await tmpCtx.close();
      setUploadedAudioFile(file);
      setUploadedAudioBuffer(audioBuffer);
      toast.success(`Audio loaded: ${file.name}`);
    } catch (err) {
      console.error("Failed to decode audio:", err);
      toast.error("Could not decode audio file. Try MP3, WAV, or OGG.");
    }
  };

  const handleAudioFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setAudioDropActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("audio/")) {
      handleAudioFileSelect(file);
    } else {
      toast.error("Please drop an audio file (MP3, WAV, OGG, etc.)");
    }
  };

  const toggleUploadedAudio = () => {
    if (uploadedAudioPlaying) {
      uploadedAudioStopRef.current?.();
      uploadedAudioStopRef.current = null;
      uploadedAudioCtxRef.current?.close().catch(() => {});
      uploadedAudioCtxRef.current = null;
      setUploadedAudioPlaying(false);
    } else {
      if (!uploadedAudioBuffer) {
        toast.info("Upload an audio file first");
        return;
      }
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AudioCtxClass();
      uploadedAudioCtxRef.current = ctx;
      const gainNode = ctx.createGain();
      gainNode.gain.value = uploadedAudioVolume;
      gainNode.connect(ctx.destination);
      const source = ctx.createBufferSource();
      source.buffer = uploadedAudioBuffer;
      source.loop = uploadedAudioLoop;
      source.connect(gainNode);
      source.start(0);
      source.onended = () => {
        if (!uploadedAudioLoop) setUploadedAudioPlaying(false);
      };
      uploadedAudioStopRef.current = () => {
        try {
          source.stop();
        } catch (_) {}
      };
      setUploadedAudioPlaying(true);
    }
  };

  const clearUploadedAudio = () => {
    uploadedAudioStopRef.current?.();
    uploadedAudioStopRef.current = null;
    uploadedAudioCtxRef.current?.close().catch(() => {});
    uploadedAudioCtxRef.current = null;
    setUploadedAudioPlaying(false);
    setUploadedAudioFile(null);
    setUploadedAudioBuffer(null);
  };

  const formatFileDuration = (secs: number): string => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0)
      return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ── Uploaded thumbnail handlers ───────────────────────────────────────────
  const handleThumbFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedThumbFile(file);
      setUploadedThumbDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleThumbFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setThumbDropActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) {
      handleThumbFileSelect(file);
    } else {
      toast.error("Please drop an image file (PNG, JPG, WEBP, GIF)");
    }
  };

  const useUploadedThumbAsBackground = () => {
    if (!uploadedThumbDataUrl) return;
    setAiImageData(uploadedThumbDataUrl);
    drawWithData(uploadedThumbDataUrl);
    toast.success("Image set as thumbnail background!");
  };

  const clearUploadedThumb = () => {
    setUploadedThumbFile(null);
    setUploadedThumbDataUrl(null);
  };

  // ── TTS controls ──────────────────────────────────────────────────────────
  const getVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;
    const keywords: Record<string, string[]> = {
      Feminine: [
        "female",
        "woman",
        "girl",
        "zira",
        "samantha",
        "victoria",
        "karen",
        "moira",
      ],
      Masculine: [
        "male",
        "man",
        "guy",
        "david",
        "mark",
        "daniel",
        "alex",
        "tom",
      ],
      Neutral: ["neutral", "google"],
    };
    const kws = keywords[voiceType];
    const found = voices.find((v) =>
      kws.some((k) => v.name.toLowerCase().includes(k)),
    );
    if (found) return found;
    if (voiceType === "Feminine") return voices[0] ?? null;
    if (voiceType === "Masculine") return voices[1] ?? voices[0] ?? null;
    return voices[Math.floor(voices.length / 2)] ?? voices[0] ?? null;
  }, [voiceType]);

  const handlePreviewTTS = () => {
    if (!window.speechSynthesis) {
      toast.error("Browser doesn't support TTS");
      return;
    }
    window.speechSynthesis.cancel();
    const enabledLayers = layers.filter((l) => l.enabled);
    if (enabledLayers.length === 0) {
      toast.info("Enable at least one TTS layer");
      return;
    }
    setTtsSpeaking(true);
    const preview = affirmations.slice(0, 5);
    for (const [idx, layer] of enabledLayers.entries()) {
      const utt = new SpeechSynthesisUtterance(preview.join(". "));
      const voice = getVoice();
      if (voice) utt.voice = voice;
      utt.rate = ttsSpeed * layer.speed;
      utt.pitch = ttsPitch;
      utt.volume = layer.volume * ttsMasterVolume;
      if (idx === enabledLayers.length - 1)
        utt.onend = () => setTtsSpeaking(false);
      setTimeout(() => window.speechSynthesis.speak(utt), idx * 80);
    }
  };

  const handleStopTTS = () => {
    window.speechSynthesis.cancel();
    setTtsSpeaking(false);
  };

  const updateLayer = (idx: number, patch: Partial<AudioLayer>) => {
    setLayers((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)),
    );
  };

  // ── Recording pipeline ────────────────────────────────────────────────────
  const stopRecordingCleanup = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
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
    if (recorderRef.current && recorderRef.current.state !== "inactive")
      recorderRef.current.stop();
  }, []);

  const handleRecord = useCallback(async () => {
    const canvas = videoCanvasRef.current;
    if (!canvas) return;

    if (isRecording) {
      stopRecordingCleanup();
      return;
    }

    chunksRef.current = [];
    setMp4Url(null);
    setWebmFallbackUrl(null);
    setIsConverting(false);
    setRecordProgress(0);

    const videoStream = canvas.captureStream(30);

    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const audioCtx = new AudioCtxClass();
    audioCtxRef.current = audioCtx;
    const dest = audioCtx.createMediaStreamDestination();
    const stopFns: (() => void)[] = [];

    // Master gain for recording
    const recMasterGain = audioCtx.createGain();
    recMasterGain.gain.value = masterVolume;
    recMasterGain.connect(dest);

    if (natureSound !== "None") {
      const stopNature = connectNatureSoundToCtx(
        natureSound,
        mixNatureVolume,
        audioCtx,
        recMasterGain,
      );
      stopFns.push(stopNature);
    }
    const hz = Number.parseFloat(customHz) || selectedFreqHz;
    if (!Number.isNaN(hz) && hz > 0) {
      const stopFreq = connectFrequencyToneToCtx(
        hz,
        waveform,
        mixFreqVolume,
        audioCtx,
        recMasterGain,
      );
      stopFns.push(stopFreq);
    }
    // Uploaded audio file integration
    if (uploadedAudioBuffer) {
      const uploadedSource = audioCtx.createBufferSource();
      uploadedSource.buffer = uploadedAudioBuffer;
      uploadedSource.loop = uploadedAudioLoop;
      const uploadedGain = audioCtx.createGain();
      uploadedGain.gain.value = uploadedAudioVolume;
      uploadedSource.connect(uploadedGain);
      uploadedGain.connect(recMasterGain);
      uploadedSource.start(0);
      stopFns.push(() => {
        try {
          uploadedSource.stop();
        } catch (_) {}
      });
    }

    // Uploaded TTS audio — re-decode from raw bytes into this AudioContext
    if (uploadedTTSBytes) {
      try {
        const freshBuffer = await audioCtx.decodeAudioData(
          uploadedTTSBytes.slice(0),
        );
        const ttsSource = audioCtx.createBufferSource();
        ttsSource.buffer = freshBuffer;
        ttsSource.loop = uploadedTTSLoop;
        const ttsGain = audioCtx.createGain();
        ttsGain.gain.value = uploadedTTSVolume;
        ttsSource.connect(ttsGain);
        ttsGain.connect(recMasterGain);
        ttsSource.start(0);
        stopFns.push(() => {
          try {
            ttsSource.stop();
          } catch (_) {}
        });
      } catch (err) {
        console.error("Failed to re-decode TTS bytes:", err);
      }
    }

    audioStopFnsRef.current = stopFns;

    // TTS cycling (Web Speech — plays through speakers during recording)
    // Only fires if no uploaded TTS file is active
    if (!uploadedTTSBytes) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find((v) => {
        const n = v.name.toLowerCase();
        if (voiceType === "Feminine")
          return n.includes("female") || n.includes("samantha");
        if (voiceType === "Masculine")
          return n.includes("male") || n.includes("daniel");
        return false;
      });
      const enabledLayers = layers.filter((l) => l.enabled);
      for (const layer of enabledLayers) {
        const utt = new SpeechSynthesisUtterance(
          affirmations.slice(0, 10).join(". "),
        );
        utt.rate = layer.speed * ttsSpeed;
        utt.volume = layer.volume * ttsMasterVolume;
        utt.pitch = ttsPitch;
        if (selectedVoice) utt.voice = selectedVoice;
        window.speechSynthesis.speak(utt);
      }
    }

    const combined = new MediaStream([
      ...videoStream.getVideoTracks(),
      ...dest.stream.getAudioTracks(),
    ]);
    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
        ? "video/webm;codecs=vp8,opus"
        : "video/webm";
    const recorder = new MediaRecorder(combined, { mimeType });
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      setIsRecording(false);
      setRecordProgress(100);
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

      // FFmpeg WASM requires SharedArrayBuffer which needs cross-origin isolation
      if (!crossOriginIsolated) {
        const webmUrl = URL.createObjectURL(blob);
        setWebmFallbackUrl(webmUrl);
        setIsConverting(false);
        toast.info(
          "Video ready as .webm — MP4 conversion requires cross-origin isolation headers not available in this environment.",
        );
        return;
      }

      setIsConverting(true);
      setMp4Url(null);
      setWebmFallbackUrl(null);

      try {
        // Load ffmpeg from CDN via script tag (avoids build-time resolution)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const win = window as any;
        if (!win.__ffmpegLoaded) {
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement("script");
            s.src =
              "https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.js";
            s.onload = () => {
              win.__ffmpegLoaded = true;
              resolve();
            };
            s.onerror = reject;
            document.head.appendChild(s);
          });
        }
        if (!win.__ffmpegUtilLoaded) {
          await new Promise<void>((resolve, reject) => {
            const s = document.createElement("script");
            s.src = "https://unpkg.com/@ffmpeg/util@0.12.1/dist/umd/index.js";
            s.onload = () => {
              win.__ffmpegUtilLoaded = true;
              resolve();
            };
            s.onerror = reject;
            document.head.appendChild(s);
          });
        }
        const { FFmpeg } = win.FFmpegWASM ?? win["@ffmpeg/ffmpeg"] ?? {};
        const { fetchFile, toBlobURL } =
          win.FFmpegUtil ?? win["@ffmpeg/util"] ?? {};
        if (!ffmpegRef.current) ffmpegRef.current = new FFmpeg();
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
          "libx264",
          "-preset",
          "ultrafast",
          "-c:a",
          "aac",
          "-movflags",
          "+faststart",
          "output.mp4",
        ]);
        const data = await ffmpeg.readFile("output.mp4");
        const rawData = data as Uint8Array | string;
        const mp4BlobParts: BlobPart[] =
          typeof rawData === "string"
            ? [rawData]
            : [new Uint8Array(rawData.buffer as ArrayBuffer)];
        const mp4Blob = new Blob(mp4BlobParts, { type: "video/mp4" });
        const mp4ObjectUrl = URL.createObjectURL(mp4Blob);
        setMp4Url(mp4ObjectUrl);
        toast.success("MP4 ready! Click Download to save.");
      } catch (err) {
        console.error("FFmpeg failed, falling back to WebM:", err);
        const webmUrl = URL.createObjectURL(blob);
        setWebmFallbackUrl(webmUrl);
        toast.warning("MP4 conversion failed — downloading as .webm instead.");
      } finally {
        setIsConverting(false);
      }
    };

    recorder.start(100);
    setIsRecording(true);
    startTimeRef.current = performance.now();

    progressIntervalRef.current = setInterval(() => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      setRecordProgress(Math.min((elapsed / duration) * 100, 99));
    }, 300);

    stopTimeoutRef.current = setTimeout(() => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      if (recorder.state !== "inactive") recorder.stop();
    }, duration * 1000);
  }, [
    isRecording,
    duration,
    natureSound,
    mixNatureVolume,
    customHz,
    selectedFreqHz,
    waveform,
    mixFreqVolume,
    masterVolume,
    affirmations,
    layers,
    voiceType,
    ttsSpeed,
    ttsPitch,
    ttsMasterVolume,
    uploadedAudioBuffer,
    uploadedAudioLoop,
    uploadedAudioVolume,
    uploadedTTSBytes,
    uploadedTTSLoop,
    uploadedTTSVolume,
    stopRecordingCleanup,
  ]);

  // ── TTS Export ────────────────────────────────────────────────────────────
  const handleTTSExport = useCallback(async () => {
    if (isTTSRecording) {
      window.speechSynthesis?.cancel();
      if (ttsRecorderRef.current && ttsRecorderRef.current.state !== "inactive")
        ttsRecorderRef.current.stop();
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

    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const audioCtx = new AudioCtxClass();
    ttsAudioCtxRef.current = audioCtx;
    const dest = audioCtx.createMediaStreamDestination();
    const stopFns: (() => void)[] = [];

    if (natureSound !== "None") {
      stopFns.push(
        connectNatureSoundToCtx(natureSound, mixNatureVolume, audioCtx, dest),
      );
      stopFns.push(
        connectNatureSoundToCtx(
          natureSound,
          mixNatureVolume,
          audioCtx,
          audioCtx.destination,
        ),
      );
    }
    const hz = Number.parseFloat(customHz) || selectedFreqHz;
    if (!Number.isNaN(hz) && hz > 0) {
      stopFns.push(
        connectFrequencyToneToCtx(hz, waveform, mixFreqVolume, audioCtx, dest),
      );
      stopFns.push(
        connectFrequencyToneToCtx(
          hz,
          waveform,
          mixFreqVolume,
          audioCtx,
          audioCtx.destination,
        ),
      );
    }
    // Uploaded TTS audio — re-decode from raw bytes and route through capture dest
    if (uploadedTTSBytes) {
      try {
        const freshBuffer = await audioCtx.decodeAudioData(
          uploadedTTSBytes.slice(0),
        );
        const ttsSource = audioCtx.createBufferSource();
        ttsSource.buffer = freshBuffer;
        ttsSource.loop = uploadedTTSLoop;
        const ttsGain = audioCtx.createGain();
        ttsGain.gain.value = uploadedTTSVolume;
        ttsSource.connect(ttsGain);
        ttsGain.connect(dest);
        // Also play through speakers so user can hear it
        const ttsGainSpeakers = audioCtx.createGain();
        ttsGainSpeakers.gain.value = uploadedTTSVolume;
        ttsSource.connect(ttsGainSpeakers);
        ttsGainSpeakers.connect(audioCtx.destination);
        ttsSource.start(0);
        stopFns.push(() => {
          try {
            ttsSource.stop();
          } catch (_) {}
        });
      } catch (err) {
        console.error("Failed to re-decode TTS bytes for export:", err);
      }
    }

    ttsAudioStopFnsRef.current = stopFns;

    const mimeTypeAudio = MediaRecorder.isTypeSupported(
      "audio/webm;codecs=opus",
    )
      ? "audio/webm;codecs=opus"
      : "audio/webm";
    const ttsRec = new MediaRecorder(dest.stream, { mimeType: mimeTypeAudio });
    ttsRecorderRef.current = ttsRec;

    ttsRec.ondataavailable = (e) => {
      if (e.data.size > 0) ttsChunksRef.current.push(e.data);
    };

    ttsRec.onstop = () => {
      setIsTTSRecording(false);
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

    ttsRec.start(100);
    setIsTTSRecording(true);

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice = voices.find((v) => {
      const n = v.name.toLowerCase();
      if (voiceType === "Feminine")
        return n.includes("female") || n.includes("samantha");
      if (voiceType === "Masculine")
        return n.includes("male") || n.includes("daniel");
      return false;
    });
    const speakAll = () => {
      const utt = new SpeechSynthesisUtterance(affirmations.join(". "));
      utt.rate = ttsSpeed;
      utt.volume = ttsMasterVolume;
      utt.pitch = ttsPitch;
      if (selectedVoice) utt.voice = selectedVoice;
      utt.onend = () => {
        setTimeout(() => {
          if (
            ttsRecorderRef.current &&
            ttsRecorderRef.current.state !== "inactive"
          )
            ttsRecorderRef.current.stop();
        }, 500);
      };
      window.speechSynthesis.speak(utt);
    };
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = speakAll;
    } else {
      speakAll();
    }
  }, [
    isTTSRecording,
    affirmations,
    voiceType,
    ttsSpeed,
    ttsPitch,
    ttsMasterVolume,
    natureSound,
    mixNatureVolume,
    customHz,
    selectedFreqHz,
    waveform,
    mixFreqVolume,
    uploadedTTSBytes,
    uploadedTTSVolume,
    uploadedTTSLoop,
  ]);

  // ── Preview Mix ───────────────────────────────────────────────────────────
  const mixPreviewStopRef = useRef<(() => void) | null>(null);
  const [mixPreviewing, setMixPreviewing] = useState(false);

  const handlePreviewMix = () => {
    if (mixPreviewing) {
      mixPreviewStopRef.current?.();
      mixPreviewStopRef.current = null;
      window.speechSynthesis.cancel();
      setMixPreviewing(false);
      return;
    }
    setMixPreviewing(true);
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const ctx = new AudioCtxClass();
    const masterGain = ctx.createGain();
    masterGain.gain.value = masterVolume;
    masterGain.connect(ctx.destination);
    const stopFns: (() => void)[] = [];
    if (natureSound !== "None")
      stopFns.push(
        connectNatureSoundToCtx(natureSound, mixNatureVolume, ctx, masterGain),
      );
    const hz = Number.parseFloat(customHz) || selectedFreqHz;
    if (!Number.isNaN(hz) && hz > 0)
      stopFns.push(
        connectFrequencyToneToCtx(hz, waveform, mixFreqVolume, ctx, masterGain),
      );
    // TTS preview
    const enabledLayers = layers.filter((l) => l.enabled);
    const preview = affirmations.slice(0, 3).join(". ");
    for (const layer of enabledLayers) {
      const utt = new SpeechSynthesisUtterance(preview);
      utt.rate = layer.speed * ttsSpeed;
      utt.volume = layer.volume * ttsMasterVolume;
      utt.pitch = ttsPitch;
      const v = getVoice();
      if (v) utt.voice = v;
      window.speechSynthesis.speak(utt);
    }
    mixPreviewStopRef.current = () => {
      for (const fn of stopFns) {
        try {
          fn();
        } catch (_) {}
      }
      ctx.close().catch(() => {});
    };
    // Auto-stop after 15s
    setTimeout(() => {
      if (mixPreviewing) {
        mixPreviewStopRef.current?.();
        mixPreviewStopRef.current = null;
        window.speechSynthesis.cancel();
        setMixPreviewing(false);
      }
    }, 15000);
  };

  // ── Thumbnail ─────────────────────────────────────────────────────────────
  const hasGeminiKey =
    (localStorage.getItem("aiProvider") ?? "") === "gemini" &&
    Boolean(localStorage.getItem("aiApiKey"));

  const drawWithData = useCallback(
    (imageData: string | null) => {
      const canvas = thumbCanvasRef.current;
      if (!canvas) return;
      renderThumbnailCanvas(
        canvas,
        {
          bgColor1,
          bgColor2,
          mainText,
          mainFontSize,
          mainColor,
          subText,
          subFontSize,
          subColor,
          aiImageData: imageData,
        },
        1,
      );
      setThumbDrawn(true);
    },
    [
      bgColor1,
      bgColor2,
      mainText,
      mainFontSize,
      mainColor,
      subText,
      subFontSize,
      subColor,
    ],
  );

  const handleDrawThumbnail = useCallback(() => {
    drawWithData(aiImageData);
    toast.success("Thumbnail rendered!");
  }, [drawWithData, aiImageData]);

  const handleDownloadThumbnail = useCallback(() => {
    const exportCanvas = document.createElement("canvas");
    renderThumbnailCanvas(
      exportCanvas,
      {
        bgColor1,
        bgColor2,
        mainText,
        mainFontSize,
        mainColor,
        subText,
        subFontSize,
        subColor,
        aiImageData,
      },
      2,
    );
    const link = document.createElement("a");
    link.download = "synapse-thumbnail-1280x720.png";
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
    toast.success("Thumbnail downloaded at 1280×720!");
  }, [
    bgColor1,
    bgColor2,
    mainText,
    mainFontSize,
    mainColor,
    subText,
    subFontSize,
    subColor,
    aiImageData,
  ]);

  const handleGenerateAIThumbnail = async () => {
    const apiKey = localStorage.getItem("aiApiKey");
    const provider = localStorage.getItem("aiProvider") ?? "gemini";
    if (!apiKey || provider !== "gemini") {
      toast.info(
        "Add a Gemini key in Settings for AI thumbnail. Using canvas fallback.",
      );
      handleDrawThumbnail();
      return;
    }
    setAiGenerating(true);
    try {
      const styleMap: Record<string, string> = {
        Cosmic: "cosmic space, nebula, stars, deep purple and indigo, mystical",
        "Dark Fantasy":
          "dark fantasy, gothic, mystical forest, deep shadows, ethereal glow",
        "Sacred Geometry":
          "sacred geometry, flower of life, mandala, golden lines, dark background",
        Neon: "neon lights, cyberpunk, glowing lines, deep black background",
        Abstract: "abstract art, fluid shapes, high contrast, dramatic",
        Minimal: "minimalist, simple, elegant, black background, soft glow",
      };
      const fullPrompt = `${thumbPrompt}, ${styleMap[thumbStyle] ?? ""}, no text, digital art, 16:9 aspect ratio`;
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            instances: [{ prompt: fullPrompt }],
            parameters: { sampleCount: 1 },
          }),
        },
      );
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const base64 = data?.predictions?.[0]?.bytesBase64Encoded;
      if (!base64) throw new Error("No image in response");
      const dataUrl = `data:image/png;base64,${base64}`;
      setAiImageData(dataUrl);
      toast.success("AI thumbnail generated!");
      setTimeout(() => drawWithData(dataUrl), 100);
    } catch (err) {
      console.error("AI thumbnail error:", err);
      toast.error("AI generation failed — using canvas fallback");
      setAiImageData(null);
      handleDrawThumbnail();
    } finally {
      setAiGenerating(false);
    }
  };

  // ── Layer metadata ────────────────────────────────────────────────────────
  const layerMeta = [
    {
      label: "Layer 1 — Normal",
      color: "text-violet-400",
      borderColor: "border-violet-500/40",
      bgColor: "bg-violet-500/10",
      speedMin: 0.5,
      speedMax: 2.0,
    },
    {
      label: "Layer 2 — Fast",
      color: "text-amber-400",
      borderColor: "border-amber-500/40",
      bgColor: "bg-amber-500/10",
      speedMin: 1.2,
      speedMax: 3.0,
    },
    {
      label: "Layer 3 — Slow",
      color: "text-teal-400",
      borderColor: "border-teal-500/40",
      bgColor: "bg-teal-500/10",
      speedMin: 0.3,
      speedMax: 0.9,
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="container max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/40 bg-secondary/20 text-xs text-muted-foreground mb-1">
          <Film className="w-3.5 h-3.5 text-rose-400" />
          <span>Video Editor</span>
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl gradient-text">
          Subliminal Video Editor
        </h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Full studio: canvas preview, frequency tones, layered TTS, ambient
          audio, and thumbnail creation.
        </p>
      </motion.div>

      {/* Context banner */}
      {subliminalCtx?.topic && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-5 py-3"
        >
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <p className="text-sm text-foreground">
            Synced from generator:{" "}
            <span className="text-primary font-semibold">
              {subliminalCtx.topic}
            </span>
            {" · "}
            <span className="text-muted-foreground">
              {subliminalCtx.affirmations.length} affirmations
            </span>
          </p>
        </motion.div>
      )}

      {/* ── Canvas Preview (full width) ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        className="rounded-2xl border border-border/40 bg-black overflow-hidden shadow-2xl"
        aria-label="Video preview"
      >
        {/* Canvas */}
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <canvas
            ref={videoCanvasRef}
            width={1280}
            height={720}
            className="absolute inset-0 w-full h-full"
          />
          {/* Recording indicator overlay */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/80 text-white text-xs font-semibold backdrop-blur-sm"
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                REC
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* VideoCanvas animation driver */}
        <VideoCanvas
          affirmations={affirmations}
          topic={topic}
          palette={selectedPalette}
          theme={selectedTheme}
          isRecording={isRecording}
          progress={recordProgress}
          canvasRef={videoCanvasRef}
        />

        {/* Controls beneath canvas */}
        <div className="p-4 sm:p-5 space-y-4 border-t border-border/20 bg-background/60 backdrop-blur-sm">
          {/* Palette + Theme selectors */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1.5">
              <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Palette
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {PALETTES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPalette(p)}
                    className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${selectedPalette === p ? "border-violet-500/60 bg-violet-500/15 text-violet-300" : "border-border/30 bg-background/30 text-muted-foreground hover:border-violet-500/40"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Theme
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTheme(t)}
                    className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${selectedTheme === t ? "border-cyan-500/60 bg-cyan-500/15 text-cyan-300" : "border-border/30 bg-background/30 text-muted-foreground hover:border-cyan-500/40"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Duration picker */}
          <div className="space-y-1.5">
            <Label className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Duration
            </Label>
            <div className="flex flex-wrap gap-1.5 items-center">
              {DURATION_PRESETS.map((d) => (
                <button
                  key={d.secs}
                  type="button"
                  onClick={() => {
                    setDuration(d.secs);
                    setCustomDurationStr(String(d.secs));
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${duration === d.secs ? "border-rose-500/60 bg-rose-500/15 text-rose-300" : "border-border/30 bg-background/30 text-muted-foreground hover:border-rose-500/40"}`}
                >
                  {d.label}
                </button>
              ))}
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min={10}
                  max={14400}
                  value={customDurationStr}
                  onChange={(e) => {
                    setCustomDurationStr(e.target.value);
                    const n = Number.parseInt(e.target.value, 10);
                    if (!Number.isNaN(n) && n >= 10) setDuration(n);
                  }}
                  className="w-20 h-7 text-[11px] bg-background/50 border-border/40 text-center"
                  placeholder="secs"
                />
                <span className="text-[11px] text-muted-foreground">
                  s custom
                </span>
              </div>
            </div>
          </div>

          {/* Progress + converting banners */}
          <AnimatePresence>
            {isRecording && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                    Recording…
                  </span>
                  <span>
                    {Math.round(recordProgress)}% · {fmtDuration(duration)}
                  </span>
                </div>
                <Progress value={recordProgress} className="h-1.5" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isConverting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-xs text-amber-400/90 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                Preparing video… this may take a moment on first run
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isTTSRecording && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-xs text-rose-400/90 bg-rose-400/10 border border-rose-400/20 rounded-lg px-3 py-2"
              >
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse shrink-0" />
                Recording TTS + audio mix… affirmations are playing through
                speakers
              </motion.div>
            )}
          </AnimatePresence>

          {/* Record + Download row */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleRecord}
              disabled={isConverting}
              variant={isRecording ? "destructive" : "default"}
              className={`gap-2 font-semibold ${isRecording ? "" : ""}`}
              style={
                isRecording
                  ? {}
                  : { background: "oklch(0.58 0.22 340)", color: "#fff" }
              }
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Film className="w-4 h-4" />
                  Record ({fmtDuration(duration)})
                </>
              )}
            </Button>

            {mp4Url && !isConverting && (
              <Button
                asChild
                className="gap-2"
                style={{ background: "oklch(0.5 0.22 295)", color: "#fff" }}
              >
                <a href={mp4Url} download="synapse-subliminal.mp4">
                  <Download className="w-4 h-4" />
                  Download (.mp4)
                </a>
              </Button>
            )}
            {webmFallbackUrl && !isConverting && !mp4Url && (
              <Button
                asChild
                variant="outline"
                className="gap-2 border-border/40"
              >
                <a href={webmFallbackUrl} download="synapse-subliminal.webm">
                  <Download className="w-4 h-4" />
                  Download (.webm)
                </a>
              </Button>
            )}

            <Button
              onClick={handleTTSExport}
              disabled={isRecording || isConverting}
              variant="outline"
              className={`gap-2 ${isTTSRecording ? "border-rose-500/60 text-rose-400" : "border-border/40 text-muted-foreground"}`}
            >
              {isTTSRecording ? (
                <>
                  <Square className="w-4 h-4" />
                  Stop TTS Recording
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Capture TTS Audio
                </>
              )}
            </Button>
            {ttsAudioUrl && !isTTSRecording && (
              <Button
                asChild
                variant="outline"
                className="gap-2 border-border/40 text-muted-foreground"
              >
                <a href={ttsAudioUrl} download="synapse-tts.webm">
                  <Download className="w-4 h-4" />
                  Download TTS
                </a>
              </Button>
            )}
          </div>
        </div>
      </motion.section>

      {/* ── Tabbed Panels ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <Tabs defaultValue="frequency" className="w-full">
          <TabsList className="w-full flex overflow-x-auto h-auto flex-wrap sm:flex-nowrap gap-0 bg-secondary/20 border border-border/30 rounded-xl p-1 mb-0">
            <TabsTrigger
              value="frequency"
              className="flex-1 min-w-[80px] gap-1.5 text-xs data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300"
            >
              <Waves className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Frequency</span>
              <span className="sm:hidden">Hz</span>
            </TabsTrigger>
            <TabsTrigger
              value="tts"
              className="flex-1 min-w-[80px] gap-1.5 text-xs data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>TTS</span>
            </TabsTrigger>
            <TabsTrigger
              value="ambient"
              className="flex-1 min-w-[80px] gap-1.5 text-xs data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-300"
            >
              <Music className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ambient</span>
              <span className="sm:hidden">Amb</span>
            </TabsTrigger>
            <TabsTrigger
              value="mix"
              className="flex-1 min-w-[80px] gap-1.5 text-xs data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-300"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mix</span>
            </TabsTrigger>
            <TabsTrigger
              value="thumbnail"
              className="flex-1 min-w-[80px] gap-1.5 text-xs data-[state=active]:bg-rose-500/20 data-[state=active]:text-rose-300"
            >
              <ImagePlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Thumbnail</span>
              <span className="sm:hidden">Thumb</span>
            </TabsTrigger>
          </TabsList>

          {/* ── Frequency Tab ── */}
          <TabsContent value="frequency" className="mt-4">
            <div className="rounded-xl border border-violet-500/20 bg-secondary/10 p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center shrink-0">
                  <Waves className="w-4 h-4 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h2 className="font-heading font-semibold text-base text-foreground">
                    Frequency Tone
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Solfeggio frequencies & custom Hz
                  </p>
                </div>
                {freqPlaying && (
                  <Badge className="text-[10px] bg-violet-500/15 border-violet-500/30 text-violet-400 animate-pulse">
                    ● Playing
                  </Badge>
                )}
              </div>

              {/* Real-time visualizer */}
              <WaveformVisualizer
                analyserNode={freqPlaying ? freqAnalyser : null}
                accentColor="#a855f7"
              />

              {/* Preset pills */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Presets
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {FREQUENCY_PRESETS.map((p) => (
                    <button
                      key={p.hz}
                      type="button"
                      onClick={() => {
                        setSelectedFreqHz(p.hz);
                        setCustomHz(String(p.hz));
                        if (freqPlaying) stopFrequency();
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${selectedFreqHz === p.hz && customHz === String(p.hz) ? "border-violet-500/60 bg-violet-500/15 text-violet-300" : "border-border/30 bg-background/30 text-muted-foreground hover:border-violet-500/40 hover:text-violet-300"}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Custom Hz */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Custom Hz (40–20000)
                  </Label>
                  <Input
                    type="number"
                    min={40}
                    max={20000}
                    value={customHz}
                    onChange={(e) => {
                      setCustomHz(e.target.value);
                      const n = Number.parseFloat(e.target.value);
                      if (!Number.isNaN(n)) setSelectedFreqHz(n);
                      if (freqPlaying) stopFrequency();
                    }}
                    className="bg-background/50 border-border/40 text-sm"
                  />
                </div>

                {/* Volume */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" />
                      Volume
                    </Label>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {Math.round(freqVolume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[freqVolume]}
                    onValueChange={([v]) => setFreqVolume(v)}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </div>
              </div>

              {/* Waveform */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Waveform
                </Label>
                <div className="flex gap-1.5">
                  {WAVEFORMS.map((w) => (
                    <button
                      key={w.type}
                      type="button"
                      onClick={() => {
                        setWaveform(w.type);
                        if (freqPlaying) stopFrequency();
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-xs border transition-all ${waveform === w.type ? "border-violet-500/60 bg-violet-500/15 text-violet-300" : "border-border/30 bg-background/30 text-muted-foreground hover:border-violet-500/40"}`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={toggleFrequency}
                className="w-full gap-2"
                variant={freqPlaying ? "outline" : "default"}
                style={
                  freqPlaying
                    ? {}
                    : { background: "oklch(0.5 0.22 295)", color: "#fff" }
                }
              >
                {freqPlaying ? (
                  <>
                    <Square className="w-4 h-4 fill-current" />
                    Stop Frequency ({currentHz} Hz)
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Play {currentHz} Hz ·{" "}
                    {waveform.charAt(0).toUpperCase() + waveform.slice(1)}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* ── TTS Tab ── */}
          <TabsContent value="tts" className="mt-4">
            <div className="rounded-xl border border-amber-500/20 bg-secondary/10 p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Mic className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h2 className="font-heading font-semibold text-base text-foreground">
                    Text-to-Speech
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    3-layer voice stack — all play simultaneously
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {uploadedTTSBuffer && (
                    <Badge className="text-[10px] bg-orange-500/15 border-orange-500/30 text-orange-300">
                      ✓ Uploaded TTS Active
                    </Badge>
                  )}
                  {ttsSpeaking && (
                    <Badge className="text-[10px] bg-amber-500/15 border-amber-500/30 text-amber-400 animate-pulse">
                      ● Speaking
                    </Badge>
                  )}
                </div>
              </div>

              {/* ── Upload TTS Audio Section ── */}
              <div className="rounded-xl border border-orange-500/25 bg-orange-500/5 p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-orange-500/15 border border-orange-500/30 flex items-center justify-center shrink-0">
                    <FileAudio className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-orange-300">
                      Upload TTS Audio
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Upload your own pre-recorded TTS — replaces browser voice
                      during recording
                    </p>
                  </div>
                  {uploadedTTSBuffer && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/30 text-green-400 shrink-0">
                      Using Uploaded File
                    </span>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={ttsUploadInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleTTSFileSelect(file);
                    e.target.value = "";
                  }}
                />

                {!uploadedTTSFile ? (
                  /* Drop zone */
                  <button
                    type="button"
                    aria-label="Upload TTS audio file"
                    onClick={() => ttsUploadInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setTtsAudioDropActive(true);
                    }}
                    onDragLeave={() => setTtsAudioDropActive(false)}
                    onDrop={handleTTSFileDrop}
                    className={`w-full border-dashed border-2 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all select-none ${
                      ttsAudioDropActive
                        ? "border-orange-400/80 bg-orange-500/15"
                        : "border-orange-500/30 bg-background/20 hover:bg-background/30 hover:border-orange-500/50"
                    }`}
                  >
                    <FileAudio className="w-8 h-8 text-orange-400/60" />
                    <p className="text-xs text-muted-foreground text-center">
                      Drop TTS audio here or{" "}
                      <span className="text-orange-400 underline underline-offset-2">
                        click to browse
                      </span>
                    </p>
                    <p className="text-[10px] text-muted-foreground/50">
                      MP3 · WAV · OGG · AAC · FLAC · M4A
                    </p>
                  </button>
                ) : (
                  /* File info card */
                  <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3 space-y-3">
                    {/* File name + remove */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileAudio className="w-4 h-4 text-orange-400 shrink-0" />
                        <span className="text-xs text-orange-300 font-medium truncate">
                          {uploadedTTSFile.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-muted-foreground/70 bg-background/40 px-2 py-0.5 rounded-full border border-border/20">
                          {formatFileSize(uploadedTTSFile.size)}
                        </span>
                        {uploadedTTSBuffer && (
                          <span className="text-[10px] text-orange-400/80 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                            {formatFileDuration(uploadedTTSBuffer.duration)}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={clearUploadedTTS}
                          className="w-5 h-5 rounded-full bg-background/50 border border-border/30 flex items-center justify-center hover:border-red-400/50 hover:text-red-400 transition-colors"
                          aria-label="Remove uploaded TTS audio"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Volume */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Volume2 className="w-3 h-3" />
                          Volume
                        </Label>
                        <span className="text-[10px] tabular-nums text-muted-foreground">
                          {Math.round(uploadedTTSVolume * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[uploadedTTSVolume]}
                        onValueChange={([v]) => setUploadedTTSVolume(v)}
                        min={0}
                        max={1}
                        step={0.01}
                      />
                    </div>

                    {/* Loop toggle + play button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={uploadedTTSLoop}
                          onCheckedChange={setUploadedTTSLoop}
                          id="tts-loop"
                        />
                        <Label
                          htmlFor="tts-loop"
                          className="text-[10px] text-muted-foreground cursor-pointer"
                        >
                          Loop
                        </Label>
                      </div>
                      <Button
                        size="sm"
                        onClick={toggleUploadedTTS}
                        variant={uploadedTTSPlaying ? "outline" : "default"}
                        className="h-7 px-3 text-[11px] gap-1.5"
                        style={
                          uploadedTTSPlaying
                            ? {}
                            : {
                                background: "oklch(0.6 0.2 45)",
                                color: "#fff",
                              }
                        }
                      >
                        {uploadedTTSPlaying ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            Play
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {uploadedTTSBuffer && (
                  <p className="text-[10px] text-orange-400/70 flex items-center gap-1.5">
                    <Mic className="w-3 h-3 shrink-0" />
                    Uploaded TTS will be baked into the video recording and TTS
                    export, replacing browser voice.
                  </p>
                )}
              </div>

              {/* Divider between upload TTS and browser TTS */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border/20" />
                <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                  {uploadedTTSBuffer ? "or use browser tts" : "browser tts"}
                </span>
                <div className="flex-1 h-px bg-border/20" />
              </div>

              {/* Voice type */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Voice Type
                </Label>
                <div className="flex gap-1.5">
                  {(["Feminine", "Masculine", "Neutral"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVoiceType(v)}
                      className={`flex-1 py-1.5 rounded-lg text-xs border transition-all ${voiceType === v ? "border-amber-500/60 bg-amber-500/15 text-amber-300" : "border-border/30 bg-background/30 text-muted-foreground hover:border-amber-500/40"}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed, Pitch, Master volume */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">
                      Speed
                    </Label>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {ttsSpeed.toFixed(1)}×
                    </span>
                  </div>
                  <Slider
                    value={[ttsSpeed]}
                    onValueChange={([v]) => setTtsSpeed(v)}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">
                      Pitch
                    </Label>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {ttsPitch.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    value={[ttsPitch]}
                    onValueChange={([v]) => setTtsPitch(v)}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">
                      Master Vol
                    </Label>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {Math.round(ttsMasterVolume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[ttsMasterVolume]}
                    onValueChange={([v]) => setTtsMasterVolume(v)}
                    min={0}
                    max={1}
                    step={0.05}
                  />
                </div>
              </div>

              {/* Layer stack */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Audio Layers
                </Label>
                {layers.map((layer, idx) => {
                  const meta = layerMeta[idx];
                  return (
                    <div
                      key={meta.label}
                      className={`rounded-lg border ${meta.borderColor} ${meta.bgColor} p-3 space-y-2.5`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${meta.color}`}>
                          {meta.label}
                        </span>
                        <Switch
                          checked={layer.enabled}
                          onCheckedChange={(v) =>
                            updateLayer(idx, { enabled: v })
                          }
                        />
                      </div>
                      <AnimatePresence>
                        {layer.enabled && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid grid-cols-2 gap-3 overflow-hidden"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground">
                                  Speed
                                </span>
                                <span className="text-[10px] tabular-nums text-muted-foreground">
                                  {layer.speed.toFixed(1)}×
                                </span>
                              </div>
                              <Slider
                                value={[layer.speed]}
                                onValueChange={([v]) =>
                                  updateLayer(idx, { speed: v })
                                }
                                min={meta.speedMin}
                                max={meta.speedMax}
                                step={0.1}
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground">
                                  Volume
                                </span>
                                <span className="text-[10px] tabular-nums text-muted-foreground">
                                  {Math.round(layer.volume * 100)}%
                                </span>
                              </div>
                              <Slider
                                value={[layer.volume]}
                                onValueChange={([v]) =>
                                  updateLayer(idx, { volume: v })
                                }
                                min={0}
                                max={1}
                                step={0.05}
                              />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* TTS actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handlePreviewTTS}
                  disabled={ttsSpeaking}
                  className="flex-1 gap-2"
                  style={{ background: "oklch(0.62 0.19 55)", color: "#fff" }}
                >
                  {ttsSpeaking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )}
                  {ttsSpeaking ? "Speaking…" : "Preview TTS"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleStopTTS}
                  disabled={!ttsSpeaking}
                  className="gap-2 border-amber-500/30 hover:border-amber-500/50 disabled:opacity-40"
                >
                  <Square className="w-4 h-4 fill-current" />
                  Stop
                </Button>
              </div>

              {!subliminalCtx?.affirmations?.length && (
                <p className="text-[11px] text-muted-foreground/60 text-center">
                  Using sample affirmations — generate in Studio for custom
                  content
                </p>
              )}
            </div>
          </TabsContent>

          {/* ── Ambient Tab ── */}
          <TabsContent value="ambient" className="mt-4">
            <div className="rounded-xl border border-teal-500/20 bg-secondary/10 p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
                  <Music className="w-4 h-4 text-teal-400" />
                </div>
                <div className="flex-1">
                  <h2 className="font-heading font-semibold text-base text-foreground">
                    Ambient Audio
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Upload your own audio or choose from 17 synthesized sounds
                  </p>
                </div>
                {(naturePlaying || uploadedAudioPlaying) && (
                  <Badge className="text-[10px] bg-teal-500/15 border-teal-500/30 text-teal-400 animate-pulse">
                    ● Playing
                  </Badge>
                )}
              </div>

              {/* ── Upload Your Own Audio ── */}
              <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
                    <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-indigo-300">
                      Upload Audio File
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      MP3, WAV, OGG, AAC, FLAC, M4A — plays in the mix &amp;
                      gets recorded into the video
                    </p>
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={audioUploadInputRef}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAudioFileSelect(file);
                    e.target.value = "";
                  }}
                />

                {!uploadedAudioFile ? (
                  /* Drop zone */
                  <button
                    type="button"
                    aria-label="Upload audio file"
                    onClick={() => audioUploadInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setAudioDropActive(true);
                    }}
                    onDragLeave={() => setAudioDropActive(false)}
                    onDrop={handleAudioFileDrop}
                    className={`w-full border-dashed border-2 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all select-none ${
                      audioDropActive
                        ? "border-indigo-400/80 bg-indigo-500/15"
                        : "border-indigo-500/30 bg-background/20 hover:bg-background/30 hover:border-indigo-500/50"
                    }`}
                  >
                    <FileAudio className="w-8 h-8 text-indigo-400/60" />
                    <p className="text-xs text-muted-foreground text-center">
                      Drop audio file here or{" "}
                      <span className="text-indigo-400 underline underline-offset-2">
                        click to browse
                      </span>
                    </p>
                    <p className="text-[10px] text-muted-foreground/50">
                      MP3 · WAV · OGG · AAC · FLAC · M4A
                    </p>
                  </button>
                ) : (
                  /* File info card */
                  <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 space-y-3">
                    {/* File name + remove */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileAudio className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-xs text-indigo-300 font-medium truncate">
                          {uploadedAudioFile.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-muted-foreground/70 bg-background/40 px-2 py-0.5 rounded-full border border-border/20">
                          {formatFileSize(uploadedAudioFile.size)}
                        </span>
                        {uploadedAudioBuffer && (
                          <span className="text-[10px] text-indigo-400/80 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                            {formatFileDuration(uploadedAudioBuffer.duration)}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={clearUploadedAudio}
                          className="w-5 h-5 rounded-full bg-background/50 border border-border/30 flex items-center justify-center hover:border-red-400/50 hover:text-red-400 transition-colors"
                          aria-label="Remove uploaded audio"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Volume */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Volume2 className="w-3 h-3" />
                          Volume
                        </Label>
                        <span className="text-[10px] tabular-nums text-muted-foreground">
                          {Math.round(uploadedAudioVolume * 100)}%
                        </span>
                      </div>
                      <Slider
                        value={[uploadedAudioVolume]}
                        onValueChange={([v]) => setUploadedAudioVolume(v)}
                        min={0}
                        max={1}
                        step={0.01}
                      />
                    </div>

                    {/* Loop toggle + play button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={uploadedAudioLoop}
                          onCheckedChange={setUploadedAudioLoop}
                          id="audio-loop"
                        />
                        <Label
                          htmlFor="audio-loop"
                          className="text-[10px] text-muted-foreground cursor-pointer"
                        >
                          Loop
                        </Label>
                      </div>
                      <Button
                        size="sm"
                        onClick={toggleUploadedAudio}
                        variant={uploadedAudioPlaying ? "outline" : "default"}
                        className="h-7 px-3 text-[11px] gap-1.5"
                        style={
                          uploadedAudioPlaying
                            ? {}
                            : {
                                background: "oklch(0.5 0.22 265)",
                                color: "#fff",
                              }
                        }
                      >
                        {uploadedAudioPlaying ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            Play
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border/20" />
                <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                  or synthesized sounds
                </span>
                <div className="flex-1 h-px bg-border/20" />
              </div>

              {/* Real-time visualizer */}
              <WaveformVisualizer
                analyserNode={naturePlaying ? natureAnalyser : null}
                accentColor="#2dd4bf"
              />

              {/* Nature sound pills */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Sound Type
                </Label>
                <div className="flex flex-wrap gap-2">
                  {NATURE_SOUNDS.map((s) => {
                    const Icon = s.icon;
                    const isActive = natureSound === s.label;
                    return (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setNatureSound(s.label)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${isActive ? "border-teal-500/60 bg-teal-500/15 text-teal-300" : "border-border/30 bg-background/30 text-muted-foreground hover:border-teal-500/40 hover:text-teal-300"}`}
                      >
                        <Icon className="w-3 h-3" />
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Volume */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5" />
                    Volume
                  </Label>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {Math.round(natureSoundVolume * 100)}%
                  </span>
                </div>
                <Slider
                  value={[natureSoundVolume]}
                  onValueChange={([v]) => setNatureSoundVolume(v)}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>

              <Button
                onClick={toggleNatureSound}
                disabled={natureSound === "None"}
                variant={naturePlaying ? "outline" : "default"}
                className="w-full gap-2 disabled:opacity-40"
                style={
                  naturePlaying
                    ? {}
                    : { background: "oklch(0.55 0.18 185)", color: "#fff" }
                }
              >
                {naturePlaying ? (
                  <>
                    <Square className="w-4 h-4 fill-current" />
                    Stop {natureSound}
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Play {natureSound === "None" ? "Sound" : natureSound}
                  </>
                )}
              </Button>

              <div className="rounded-lg border border-border/20 bg-background/20 px-4 py-3 text-xs text-muted-foreground space-y-1">
                <p className="flex items-center gap-1.5">
                  <AudioLines className="w-3.5 h-3.5 text-teal-400/70 shrink-0" />
                  All 17 sounds synthesized using the Web Audio API — zero
                  external files.
                </p>
                <p className="text-muted-foreground/60">
                  New sounds: Night Crickets, Deep Space, Cave Drips, Tibetan
                  Bowls, Waterfall, Morning Dew, Storm at Sea, Sacred Silence,
                  Jungle, Desert Wind.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* ── Mix Tab ── */}
          <TabsContent value="mix" className="mt-4">
            <div className="rounded-xl border border-purple-500/20 bg-secondary/10 p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-base text-foreground">
                    Audio Mix
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Combined levels for recording
                  </p>
                </div>
              </div>

              {/* Active layers summary */}
              <div className="rounded-lg border border-border/20 bg-background/20 p-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Active Sources
                </p>
                <div className="flex flex-wrap gap-2">
                  {layers.map((l, i) => (
                    <span
                      key={layerMeta[i].label}
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] border ${l.enabled ? "border-amber-500/40 bg-amber-500/10 text-amber-300" : "border-border/20 bg-background/20 text-muted-foreground/40"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${l.enabled ? "bg-amber-400" : "bg-muted"}`}
                      />
                      {layerMeta[i].label}
                    </span>
                  ))}
                  <span
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] border ${natureSound !== "None" ? "border-teal-500/40 bg-teal-500/10 text-teal-300" : "border-border/20 bg-background/20 text-muted-foreground/40"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${natureSound !== "None" ? "bg-teal-400" : "bg-muted"}`}
                    />
                    {natureSound === "None" ? "No ambient" : natureSound}
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] border border-violet-500/40 bg-violet-500/10 text-violet-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                    {currentHz} Hz {waveform}
                  </span>
                </div>
              </div>

              {/* Individual volume controls */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Mix Levels (for Recording)
                </Label>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-amber-400" />
                      TTS Master
                    </Label>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {Math.round(ttsMasterVolume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[ttsMasterVolume]}
                    onValueChange={([v]) => setTtsMasterVolume(v)}
                    min={0}
                    max={1}
                    step={0.05}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Music className="w-3.5 h-3.5 text-teal-400" />
                      Nature Sound
                    </Label>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {Math.round(mixNatureVolume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[mixNatureVolume]}
                    onValueChange={([v]) => setMixNatureVolume(v)}
                    min={0}
                    max={1}
                    step={0.05}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Waves className="w-3.5 h-3.5 text-violet-400" />
                      Frequency Tone
                    </Label>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {Math.round(mixFreqVolume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[mixFreqVolume]}
                    onValueChange={([v]) => setMixFreqVolume(v)}
                    min={0}
                    max={1}
                    step={0.05}
                  />
                </div>

                <div className="pt-1 border-t border-border/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                      Master Output
                    </Label>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {Math.round(masterVolume * 100)}%
                    </span>
                  </div>
                  <Slider
                    value={[masterVolume]}
                    onValueChange={([v]) => setMasterVolume(v)}
                    min={0}
                    max={1}
                    step={0.05}
                  />
                </div>
              </div>

              {/* Preview Mix button */}
              <div className="flex gap-2">
                <Button
                  onClick={handlePreviewMix}
                  className="flex-1 gap-2"
                  variant={mixPreviewing ? "outline" : "default"}
                  style={
                    mixPreviewing
                      ? {}
                      : { background: "oklch(0.55 0.2 285)", color: "#fff" }
                  }
                >
                  {mixPreviewing ? (
                    <>
                      <Square className="w-4 h-4 fill-current" />
                      Stop Mix
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      Preview Audio Mix
                    </>
                  )}
                </Button>
              </div>

              <p className="text-[11px] text-muted-foreground/50 text-center">
                Preview plays TTS + nature sound + frequency together for 15
                seconds
              </p>
            </div>
          </TabsContent>

          {/* ── Thumbnail Tab ── */}
          <TabsContent value="thumbnail" className="mt-4">
            <div className="rounded-xl border border-rose-500/20 bg-secondary/10 p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <ImagePlus className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-base text-foreground">
                    Thumbnail Creator
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    AI-powered or canvas-based 1280×720 thumbnail
                  </p>
                </div>
              </div>

              {/* ── Upload Image Section ── */}
              <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                    <Upload className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-rose-300">
                      Upload Image
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      PNG, JPG, WEBP, GIF — use as thumbnail background
                    </p>
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={thumbUploadInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleThumbFileSelect(file);
                    e.target.value = "";
                  }}
                />

                {!uploadedThumbFile ? (
                  /* Drop zone */
                  <button
                    type="button"
                    aria-label="Upload thumbnail image"
                    onClick={() => thumbUploadInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setThumbDropActive(true);
                    }}
                    onDragLeave={() => setThumbDropActive(false)}
                    onDrop={handleThumbFileDrop}
                    className={`w-full border-dashed border-2 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all select-none ${
                      thumbDropActive
                        ? "border-rose-400/80 bg-rose-500/15"
                        : "border-rose-500/30 bg-background/20 hover:bg-background/30 hover:border-rose-500/50"
                    }`}
                  >
                    <ImagePlus className="w-8 h-8 text-rose-400/60" />
                    <p className="text-xs text-muted-foreground text-center">
                      Drop image here or{" "}
                      <span className="text-rose-400 underline underline-offset-2">
                        click to browse
                      </span>
                    </p>
                    <p className="text-[10px] text-muted-foreground/50">
                      PNG · JPG · WEBP · GIF
                    </p>
                  </button>
                ) : (
                  /* Preview card */
                  <div className="space-y-3">
                    {/* 16:9 preview */}
                    <div className="relative w-full rounded-lg overflow-hidden border border-rose-500/30 bg-background/30">
                      <div
                        style={{ paddingBottom: "56.25%" }}
                        className="relative"
                      >
                        {uploadedThumbDataUrl && (
                          <img
                            src={uploadedThumbDataUrl}
                            alt="Uploaded thumbnail preview"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>

                    {/* File info + actions */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <ImagePlus className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="text-xs text-rose-300 font-medium truncate">
                          {uploadedThumbFile.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground/70 bg-background/40 px-2 py-0.5 rounded-full border border-border/20 shrink-0">
                          {formatFileSize(uploadedThumbFile.size)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={clearUploadedThumb}
                        className="w-5 h-5 rounded-full bg-background/50 border border-border/30 flex items-center justify-center hover:border-red-400/50 hover:text-red-400 transition-colors shrink-0"
                        aria-label="Remove uploaded image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <Button
                      onClick={useUploadedThumbAsBackground}
                      className="w-full gap-2 h-8 text-xs"
                      style={{
                        background: "oklch(0.58 0.2 340)",
                        color: "#fff",
                      }}
                    >
                      <ImagePlus className="w-3.5 h-3.5" />
                      Use as Background
                    </Button>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border/20" />
                <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                  or generate with AI
                </span>
                <div className="flex-1 h-px bg-border/20" />
              </div>

              {/* Canvas preview */}
              <div className="relative w-full rounded-lg overflow-hidden border border-border/40 bg-background/30">
                <canvas
                  ref={thumbCanvasRef}
                  width={640}
                  height={360}
                  className="w-full h-auto block"
                  style={{ aspectRatio: "16/9" }}
                />
                {!thumbDrawn && (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.12 0.04 270), oklch(0.18 0.06 295))",
                    }}
                  >
                    <ImagePlus className="w-10 h-10 text-muted-foreground/30" />
                    <p className="text-xs text-muted-foreground/40">
                      Click Generate or Draw to preview
                    </p>
                  </div>
                )}
              </div>

              {/* AI prompt */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">
                    AI Prompt
                  </Label>
                  {!hasGeminiKey && (
                    <span className="flex items-center gap-1 text-[10px] text-amber-400/80">
                      <Key className="w-3 h-3" />
                      Add Gemini key in Settings
                    </span>
                  )}
                </div>
                <Textarea
                  value={thumbPrompt}
                  onChange={(e) => setThumbPrompt(e.target.value)}
                  placeholder={`Epic subliminal background for ${topic || "your topic"}, mystical cosmic dark atmosphere…`}
                  rows={3}
                  className="bg-background/50 border-border/40 text-sm resize-none"
                />
              </div>

              {/* Style picker */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Style</Label>
                <div className="flex flex-wrap gap-1.5">
                  {THUMBNAIL_STYLES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setThumbStyle(s)}
                      className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${thumbStyle === s ? "border-rose-500/60 bg-rose-500/15 text-rose-300" : "border-border/30 bg-background/30 text-muted-foreground hover:border-rose-500/40"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text overlay */}
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Text Overlay
                </Label>
                <div className="space-y-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Main Text
                    </Label>
                    <Input
                      value={mainText}
                      onChange={(e) => setMainText(e.target.value)}
                      placeholder="SUBLIMINAL TITLE"
                      className="bg-background/50 border-border/40 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-[11px] text-muted-foreground">
                          Font size
                        </Label>
                        <span className="text-[11px] tabular-nums text-muted-foreground">
                          {mainFontSize}px
                        </span>
                      </div>
                      <Slider
                        value={[mainFontSize]}
                        onValueChange={([v]) => setMainFontSize(v)}
                        min={24}
                        max={96}
                        step={2}
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-[11px] text-muted-foreground">
                        Color
                      </span>
                      <input
                        type="color"
                        value={mainColor}
                        onChange={(e) => setMainColor(e.target.value)}
                        className="w-8 h-8 rounded-md border border-border/40 cursor-pointer bg-transparent p-0.5"
                      />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">
                      Subtitle
                    </Label>
                    <Input
                      value={subText}
                      onChange={(e) => setSubText(e.target.value)}
                      placeholder="Synapse Studio"
                      className="bg-background/50 border-border/40 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-[11px] text-muted-foreground">
                          Font size
                        </Label>
                        <span className="text-[11px] tabular-nums text-muted-foreground">
                          {subFontSize}px
                        </span>
                      </div>
                      <Slider
                        value={[subFontSize]}
                        onValueChange={([v]) => setSubFontSize(v)}
                        min={12}
                        max={60}
                        step={2}
                      />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-[11px] text-muted-foreground">
                        Color
                      </span>
                      <input
                        type="color"
                        value={subColor}
                        onChange={(e) => setSubColor(e.target.value)}
                        className="w-8 h-8 rounded-md border border-border/40 cursor-pointer bg-transparent p-0.5"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Background gradient */}
              {!aiImageData && (
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Background Gradient
                  </Label>
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-muted-foreground">
                        Color 1
                      </span>
                      <input
                        type="color"
                        value={bgColor1}
                        onChange={(e) => setBgColor1(e.target.value)}
                        className="w-8 h-8 rounded-md border border-border/40 cursor-pointer bg-transparent p-0.5"
                      />
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-xs text-muted-foreground">
                        Color 2
                      </span>
                      <input
                        type="color"
                        value={bgColor2}
                        onChange={(e) => setBgColor2(e.target.value)}
                        className="w-8 h-8 rounded-md border border-border/40 cursor-pointer bg-transparent p-0.5"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleGenerateAIThumbnail}
                  disabled={aiGenerating}
                  className="flex-1 gap-2"
                  style={{ background: "oklch(0.58 0.2 340)", color: "#fff" }}
                >
                  {aiGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {aiGenerating ? "Generating…" : "Generate AI Thumbnail"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDrawThumbnail}
                  className="flex-1 gap-2 border-border/40 hover:border-rose-500/40"
                >
                  <Play className="w-4 h-4" />
                  Draw Canvas
                </Button>
              </div>

              {aiImageData && (
                <button
                  type="button"
                  onClick={() => {
                    setAiImageData(null);
                    setThumbDrawn(false);
                  }}
                  className="text-xs text-muted-foreground/60 hover:text-muted-foreground w-full text-center"
                >
                  Clear AI image &amp; use canvas
                </button>
              )}

              <Button
                variant="outline"
                onClick={handleDownloadThumbnail}
                disabled={!thumbDrawn}
                className="w-full gap-2 border-border/40 hover:border-rose-500/40 disabled:opacity-40"
              >
                <Download className="w-4 h-4" />
                Download PNG (1280×720)
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
