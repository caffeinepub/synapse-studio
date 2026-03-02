import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  AudioLines,
  Download,
  Droplets,
  Film,
  Flame,
  ImagePlus,
  Key,
  Layers,
  Leaf,
  Loader2,
  Mic,
  Music,
  Play,
  Sparkles,
  Square,
  Volume2,
  VolumeX,
  Waves,
  Wind,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { startFrequencyTone, startNatureSound } from "../utils/audioEngine";
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
type NatureSoundType =
  | "None"
  | "Rain"
  | "Campfire"
  | "Forest / Birds"
  | "Ocean Waves"
  | "Thunder Storm"
  | "Flowing River"
  | "Wind";

// ── Constants ─────────────────────────────────────────────────────────────────

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
  label: NatureSoundType;
  icon: React.ElementType;
  color: string;
}[] = [
  { label: "None", icon: VolumeX, color: "oklch(0.45 0.02 270)" },
  { label: "Rain", icon: Droplets, color: "oklch(0.58 0.18 220)" },
  { label: "Campfire", icon: Flame, color: "oklch(0.65 0.2 40)" },
  { label: "Forest / Birds", icon: Leaf, color: "oklch(0.62 0.2 145)" },
  { label: "Ocean Waves", icon: Droplets, color: "oklch(0.58 0.2 200)" },
  { label: "Thunder Storm", icon: Zap, color: "oklch(0.65 0.18 260)" },
  { label: "Flowing River", icon: Droplets, color: "oklch(0.55 0.2 210)" },
  { label: "Wind", icon: Wind, color: "oklch(0.6 0.12 200)" },
];

const THUMBNAIL_STYLES = [
  "Cosmic",
  "Dark Fantasy",
  "Sacred Geometry",
  "Neon",
  "Abstract",
  "Minimal",
];

// Canvas thumbnail renderer (same as YouTubePage pattern)
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

  // Background
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

    // Decorative overlay: radial glow
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

  // Helper: draw text with wrapping
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

// ── Main Component ────────────────────────────────────────────────────────────

export default function VideoEditorPage({
  subliminalCtx,
}: VideoEditorPageProps) {
  // ── Frequency state ──────────────────────────────────────────────────────
  const [selectedFreqHz, setSelectedFreqHz] = useState(528);
  const [customHz, setCustomHz] = useState<string>("528");
  const [waveform, setWaveform] = useState<WaveformType>("sine");
  const [freqVolume, setFreqVolume] = useState(0.3);
  const [freqPlaying, setFreqPlaying] = useState(false);
  const freqStopRef = useRef<(() => void) | null>(null);

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

  // ── Nature sound state ───────────────────────────────────────────────────
  const [natureSound, setNatureSound] = useState<NatureSoundType>("None");
  const [natureSoundVolume, setNatureSoundVolume] = useState(0.4);
  const [naturePlaying, setNaturePlaying] = useState(false);
  const natureStopRef = useRef<(() => void) | null>(null);

  // ── Thumbnail state ──────────────────────────────────────────────────────
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  // ── Sync from subliminal context ─────────────────────────────────────────
  useEffect(() => {
    if (subliminalCtx?.topic) {
      const topic = subliminalCtx.topic;
      const cap = topic.charAt(0).toUpperCase() + topic.slice(1);
      setMainText(cap.toUpperCase());
      setThumbPrompt(
        `Epic subliminal background for ${topic}, mystical cosmic dark atmosphere, purple and indigo tones, sacred geometry, high quality`,
      );
    }
  }, [subliminalCtx?.topic]);

  // ── Frequency controls ───────────────────────────────────────────────────
  const toggleFrequency = () => {
    if (freqPlaying) {
      freqStopRef.current?.();
      freqStopRef.current = null;
      setFreqPlaying(false);
    } else {
      const hz = Number.parseFloat(customHz) || selectedFreqHz;
      const stop = startFrequencyTone(hz, waveform, freqVolume);
      freqStopRef.current = stop;
      setFreqPlaying(true);
    }
  };

  const stopFrequency = () => {
    freqStopRef.current?.();
    freqStopRef.current = null;
    setFreqPlaying(false);
  };

  // Stop frequency when unmounting
  useEffect(() => {
    return () => {
      freqStopRef.current?.();
      natureStopRef.current?.();
      window.speechSynthesis.cancel();
    };
  }, []);

  // ── Nature sound controls ─────────────────────────────────────────────────
  const toggleNatureSound = () => {
    if (naturePlaying) {
      natureStopRef.current?.();
      natureStopRef.current = null;
      setNaturePlaying(false);
    } else {
      if (natureSound === "None") {
        toast.info("Select a nature sound first");
        return;
      }
      const stop = startNatureSound(natureSound, natureSoundVolume);
      natureStopRef.current = stop;
      setNaturePlaying(true);
    }
  };

  // Stop nature sound when changing selection
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only runs when natureSound changes
  useEffect(() => {
    natureStopRef.current?.();
    natureStopRef.current = null;
    setNaturePlaying(false);
  }, [natureSound]);

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
    // Fallback: pick by index
    if (voiceType === "Feminine") return voices[0] ?? null;
    if (voiceType === "Masculine") return voices[1] ?? voices[0] ?? null;
    return voices[Math.floor(voices.length / 2)] ?? voices[0] ?? null;
  }, [voiceType]);

  const handlePreviewTTS = () => {
    if (!window.speechSynthesis) {
      toast.error("Your browser doesn't support text-to-speech");
      return;
    }
    window.speechSynthesis.cancel();
    const affirmations = subliminalCtx?.affirmations?.slice(0, 5) ?? [
      "Your subliminal affirmations will be spoken here",
    ];

    const enabledLayers = layers.filter((l) => l.enabled);
    if (enabledLayers.length === 0) {
      toast.info("Enable at least one TTS layer");
      return;
    }

    setTtsSpeaking(true);

    for (const [idx, layer] of enabledLayers.entries()) {
      const text = affirmations.join(". ");
      const utt = new SpeechSynthesisUtterance(text);
      const voice = getVoice();
      if (voice) utt.voice = voice;
      utt.rate = ttsSpeed * layer.speed;
      utt.pitch = ttsPitch;
      utt.volume = layer.volume;
      if (idx === enabledLayers.length - 1) {
        utt.onend = () => setTtsSpeaking(false);
      }
      // Small stagger so layers start "simultaneously" but avoid conflicts
      setTimeout(() => {
        window.speechSynthesis.speak(utt);
      }, idx * 80);
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

  // ── Thumbnail: AI generation ──────────────────────────────────────────────
  const handleGenerateAIThumbnail = async () => {
    const apiKey = localStorage.getItem("aiApiKey");
    const provider = localStorage.getItem("aiProvider") ?? "gemini";

    if (!apiKey || provider !== "gemini") {
      toast.info(
        "Add a Gemini API key in Settings to use AI thumbnail generation. Using canvas fallback.",
      );
      handleDrawThumbnail();
      return;
    }

    setAiGenerating(true);
    try {
      const stylePromptMap: Record<string, string> = {
        Cosmic: "cosmic space, nebula, stars, deep purple and indigo, mystical",
        "Dark Fantasy":
          "dark fantasy, gothic, mystical forest, deep shadows, ethereal glow",
        "Sacred Geometry":
          "sacred geometry, flower of life, mandala, golden lines, dark background",
        Neon: "neon lights, cyberpunk, glowing lines, deep black background",
        Abstract: "abstract art, fluid shapes, high contrast, dramatic",
        Minimal: "minimalist, simple, elegant, black background, soft glow",
      };
      const styleHint = stylePromptMap[thumbStyle] ?? "";
      const fullPrompt = `${thumbPrompt}, ${styleHint}, no text, digital art, 16:9 aspect ratio`;

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
      // Draw with AI image
      setTimeout(() => {
        drawWithData(dataUrl);
      }, 100);
    } catch (err) {
      console.error("AI thumbnail error:", err);
      toast.error("AI generation failed — using canvas fallback");
      setAiImageData(null);
      handleDrawThumbnail();
    } finally {
      setAiGenerating(false);
    }
  };

  const drawWithData = useCallback(
    (imageData: string | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const config: ThumbnailConfig = {
        bgColor1,
        bgColor2,
        mainText,
        mainFontSize,
        mainColor,
        subText,
        subFontSize,
        subColor,
        aiImageData: imageData,
      };
      renderThumbnailCanvas(canvas, config, 1);
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
    const config: ThumbnailConfig = {
      bgColor1,
      bgColor2,
      mainText,
      mainFontSize,
      mainColor,
      subText,
      subFontSize,
      subColor,
      aiImageData,
    };
    renderThumbnailCanvas(exportCanvas, config, 2);
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

  // ── Layer label metadata ──────────────────────────────────────────────────
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

  const currentHz = Number.parseFloat(customHz) || selectedFreqHz;
  const hasGeminiKey =
    (localStorage.getItem("aiProvider") ?? "") === "gemini" &&
    Boolean(localStorage.getItem("aiApiKey"));

  return (
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/40 bg-secondary/20 text-xs text-muted-foreground mb-2">
          <Film className="w-3.5 h-3.5 text-rose-400" />
          <span>Video Editor</span>
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl gradient-text">
          Video Editor
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Craft your frequency, voice layers, ambient audio, and thumbnail — all
          in one workspace.
        </p>
      </motion.div>

      {/* Context banner */}
      {subliminalCtx?.topic && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-5 py-3.5"
        >
          <Sparkles className="w-4 h-4 text-primary shrink-0" />
          <p className="text-sm text-foreground">
            Synced from generator:{" "}
            <span className="text-primary font-semibold">
              {subliminalCtx.topic}
            </span>{" "}
            ·{" "}
            <span className="text-muted-foreground">
              {subliminalCtx.affirmations.length} affirmations
            </span>
          </p>
        </motion.div>
      )}

      {/* Two-column grid on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Section 1: Frequency ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
          className="rounded-xl border border-violet-500/20 bg-secondary/10 p-5 sm:p-6 space-y-5"
          aria-labelledby="freq-heading"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center shrink-0">
              <Waves className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2
                id="freq-heading"
                className="font-heading font-semibold text-base sm:text-lg text-foreground"
              >
                Frequency Tone
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Solfeggio frequencies & custom Hz
              </p>
            </div>
            {freqPlaying && (
              <Badge className="shrink-0 text-[10px] bg-violet-500/15 border-violet-500/30 text-violet-400 animate-pulse">
                ● Playing
              </Badge>
            )}
          </div>

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
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                    selectedFreqHz === p.hz && customHz === String(p.hz)
                      ? "border-violet-500/60 bg-violet-500/15 text-violet-300"
                      : "border-border/30 bg-background/30 text-muted-foreground hover:border-violet-500/40 hover:text-violet-300"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

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

          {/* Waveform */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Waveform</Label>
            <div className="flex gap-1.5">
              {WAVEFORMS.map((w) => (
                <button
                  key={w.type}
                  type="button"
                  onClick={() => {
                    setWaveform(w.type);
                    if (freqPlaying) stopFrequency();
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs border transition-all ${
                    waveform === w.type
                      ? "border-violet-500/60 bg-violet-500/15 text-violet-300"
                      : "border-border/30 bg-background/30 text-muted-foreground hover:border-violet-500/40"
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Volume */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5" /> Volume
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
              className="w-full"
            />
          </div>

          {/* Play/Stop */}
          <Button
            onClick={toggleFrequency}
            className={`w-full gap-2 ${freqPlaying ? "border-violet-500/40 hover:border-violet-500/60" : ""}`}
            style={
              freqPlaying
                ? {}
                : { background: "oklch(0.5 0.22 295)", color: "#fff" }
            }
            variant={freqPlaying ? "outline" : "default"}
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
        </motion.section>

        {/* ── Section 2: TTS ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
          className="rounded-xl border border-amber-500/20 bg-secondary/10 p-5 sm:p-6 space-y-5"
          aria-labelledby="tts-heading"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Mic className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2
                id="tts-heading"
                className="font-heading font-semibold text-base sm:text-lg text-foreground"
              >
                Text-to-Speech
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                3-layer voice stack — all play simultaneously
              </p>
            </div>
            {ttsSpeaking && (
              <Badge className="shrink-0 text-[10px] bg-amber-500/15 border-amber-500/30 text-amber-400 animate-pulse">
                ● Speaking
              </Badge>
            )}
          </div>

          {/* Voice type */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Voice Type</Label>
            <div className="flex gap-1.5">
              {(["Feminine", "Masculine", "Neutral"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVoiceType(v)}
                  className={`flex-1 py-1.5 rounded-lg text-xs border transition-all ${
                    voiceType === v
                      ? "border-amber-500/60 bg-amber-500/15 text-amber-300"
                      : "border-border/30 bg-background/30 text-muted-foreground hover:border-amber-500/40"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Speed & Pitch */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Speed</Label>
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
                className="w-full"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Pitch</Label>
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
                className="w-full"
              />
            </div>
          </div>

          {/* Layer stack */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Audio Layers
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
                      onCheckedChange={(v) => updateLayer(idx, { enabled: v })}
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
                            className="w-full"
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
                            className="w-full"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* TTS controls */}
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
              Generate affirmations in Studio to preview real content
            </p>
          )}
        </motion.section>

        {/* ── Section 3: Audio / Nature Sound ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16, duration: 0.4 }}
          className="rounded-xl border border-teal-500/20 bg-secondary/10 p-5 sm:p-6 space-y-5"
          aria-labelledby="audio-heading"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Music className="w-4 h-4 text-teal-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2
                id="audio-heading"
                className="font-heading font-semibold text-base sm:text-lg text-foreground"
              >
                Ambient Audio
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Nature sounds synthesized in your browser
              </p>
            </div>
            {naturePlaying && (
              <Badge className="shrink-0 text-[10px] bg-teal-500/15 border-teal-500/30 text-teal-400 animate-pulse">
                ● Playing
              </Badge>
            )}
          </div>

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
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all ${
                      isActive
                        ? "border-teal-500/60 bg-teal-500/15 text-teal-300"
                        : "border-border/30 bg-background/30 text-muted-foreground hover:border-teal-500/40 hover:text-teal-300"
                    }`}
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
                <Volume2 className="w-3.5 h-3.5" /> Volume
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
              className="w-full"
            />
          </div>

          {/* Play/Stop */}
          <Button
            onClick={toggleNatureSound}
            disabled={natureSound === "None"}
            className={`w-full gap-2 disabled:opacity-40 ${
              naturePlaying ? "border-teal-500/40 hover:border-teal-500/60" : ""
            }`}
            style={
              naturePlaying
                ? {}
                : { background: "oklch(0.55 0.18 185)", color: "#fff" }
            }
            variant={naturePlaying ? "outline" : "default"}
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

          {/* Info */}
          <div className="rounded-lg border border-border/20 bg-background/20 px-4 py-3 text-xs text-muted-foreground space-y-1">
            <p className="flex items-center gap-1.5">
              <AudioLines className="w-3.5 h-3.5 text-teal-400/70 shrink-0" />
              All sounds are synthesized using the Web Audio API — no external
              files needed.
            </p>
            <p className="text-muted-foreground/60">
              Layer this with your frequency tone in the Generator's video
              recorder to bake both into the exported video.
            </p>
          </div>
        </motion.section>

        {/* ── Section 4: Thumbnail ── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-xl border border-rose-500/20 bg-secondary/10 p-5 sm:p-6 space-y-5"
          aria-labelledby="thumb-heading"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
              <ImagePlus className="w-4 h-4 text-rose-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2
                id="thumb-heading"
                className="font-heading font-semibold text-base sm:text-lg text-foreground"
              >
                Thumbnail Creator
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                AI-powered or canvas-based 1280×720 thumbnail
              </p>
            </div>
          </div>

          {/* Canvas preview */}
          <div className="relative w-full rounded-lg overflow-hidden border border-border/40 bg-background/30">
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              className="w-full h-auto block"
              style={{ aspectRatio: "16/9", imageRendering: "auto" }}
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
              <Label className="text-xs text-muted-foreground">AI Prompt</Label>
              {!hasGeminiKey && (
                <span className="flex items-center gap-1 text-[10px] text-amber-400/80">
                  <Key className="w-3 h-3" /> Add Gemini key in Settings
                </span>
              )}
            </div>
            <Textarea
              value={thumbPrompt}
              onChange={(e) => setThumbPrompt(e.target.value)}
              placeholder={`Epic subliminal background for ${subliminalCtx?.topic ?? "your topic"}, mystical cosmic dark atmosphere…`}
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
                  className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${
                    thumbStyle === s
                      ? "border-rose-500/60 bg-rose-500/15 text-rose-300"
                      : "border-border/30 bg-background/30 text-muted-foreground hover:border-rose-500/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Text overlay controls */}
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
                    className="w-full"
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
                    className="w-full"
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

          {/* Background color pickers (canvas fallback) */}
          {!aiImageData && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Background Gradient
              </Label>
              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-muted-foreground">Color 1</span>
                  <input
                    type="color"
                    value={bgColor1}
                    onChange={(e) => setBgColor1(e.target.value)}
                    className="w-8 h-8 rounded-md border border-border/40 cursor-pointer bg-transparent p-0.5"
                  />
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-muted-foreground">Color 2</span>
                  <input
                    type="color"
                    value={bgColor2}
                    onChange={(e) => setBgColor2(e.target.value)}
                    className="w-8 h-8 rounded-md border border-border/40 cursor-pointer bg-transparent p-0.5"
                  />
                </label>
                {aiImageData && (
                  <button
                    type="button"
                    onClick={() => setAiImageData(null)}
                    className="text-xs text-red-400 hover:text-red-300 ml-auto"
                  >
                    Clear AI Image
                  </button>
                )}
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
        </motion.section>
      </div>
    </div>
  );
}
