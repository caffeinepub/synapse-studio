import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  AlignLeft,
  Bold,
  Check,
  CheckCircle,
  Circle,
  Copy,
  Download,
  Eye,
  Image,
  ImagePlus,
  Lightbulb,
  Package,
  Paintbrush,
  Play,
  RefreshCw,
  Sparkles,
  Type,
  Youtube,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { SubliminalContext } from "./GeneratorPage";

interface YouTubePageProps {
  injectedTopic?: string;
  onInjectedTopicConsumed?: () => void;
  subliminalCtx?: SubliminalContext;
}

// --- Title suggestion templates (subliminal-specific only) ---
function suggestTitles(
  topic: string,
  modes?: {
    booster: boolean;
    fantasy: boolean;
    protection: boolean;
    chakraAlignment: boolean;
  },
  chakras?: string[],
): string[] {
  const t = topic.trim();
  if (!t) return [];
  const cap = t.charAt(0).toUpperCase() + t.slice(1);
  const chakraLabel =
    chakras && chakras.length > 0 ? ` | ${chakras[0]} Chakra` : "";
  const boosterTag = modes?.booster ? " ⚡ Boosted" : "";
  const protectionTag = modes?.protection ? " 🛡️ Protected" : "";

  return [
    `${cap} Subliminal${boosterTag} | Deep Subconscious Programming | Synapse Studio`,
    `${cap.toUpperCase()} SUBLIMINAL ✨ | 528Hz${chakraLabel} | Synapse Studio`,
    `Powerful ${cap} Subliminal${protectionTag} | Listen Daily | Synapse Studio`,
    `${cap} Subliminal Affirmations | Reprogram Your Subconscious | Synapse Studio`,
    `${cap} Subliminal${boosterTag}${chakraLabel} | Overnight Results | Synapse Studio`,
  ].slice(0, 5);
}

// --- Hashtag formatter ---
function formatHashtags(raw: string): string {
  return raw
    .split(",")
    .map((t) => t.trim().replace(/\s+/g, ""))
    .filter(Boolean)
    .map((t) => (t.startsWith("#") ? t : `#${t}`))
    .join(" ");
}

// --- Derive benefits from affirmation lines ---
function deriveBenefits(affirmations: string[], topic: string): string {
  if (affirmations.length === 0) {
    const cap = topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase();
    return [
      `• Rapid transformation of ${cap.toLowerCase()}`,
      `• Deep subconscious reprogramming for ${cap.toLowerCase()}`,
      `• Effortless embodiment of ${cap.toLowerCase()}`,
      `• Permanent identity-level shifts around ${cap.toLowerCase()}`,
      `• Daily reinforcement of your ${cap.toLowerCase()} mindset`,
    ].join("\n");
  }

  const strippers = [
    /^i am\s+/i,
    /^i have\s+/i,
    /^my\s+/i,
    /^i feel\s+/i,
    /^i possess\s+/i,
    /^i embody\s+/i,
    /^i attract\s+/i,
    /^i manifest\s+/i,
    /^i radiate\s+/i,
    /^i experience\s+/i,
    /^i embrace\s+/i,
    /^i choose\s+/i,
    /^i create\s+/i,
    /^i live\s+/i,
    /^i exist\s+/i,
    /^i breathe\s+/i,
    /^i trust\s+/i,
    /^i release\s+/i,
    /^i welcome\s+/i,
    /^i allow\s+/i,
  ];

  const lines = affirmations.slice(0, 5).map((aff) => {
    let text = aff.trim();
    for (const re of strippers) {
      text = text.replace(re, "");
    }
    // Capitalize first char
    text = text.charAt(0).toUpperCase() + text.slice(1);
    // Strip trailing period
    text = text.replace(/\.$/, "");
    return `• ${text}`;
  });

  return lines.join("\n");
}

// --- Color palette → gradient hex map ---
const PALETTE_COLORS: Record<string, { bg1: string; bg2: string }> = {
  "Violet/Indigo": { bg1: "#0d0014", bg2: "#1a0035" },
  "Gold/Amber": { bg1: "#1a0800", bg2: "#2d1500" },
  "Teal/Cyan": { bg1: "#001a1a", bg2: "#002d2d" },
  "Rose/Crimson": { bg1: "#1a0010", bg2: "#2d0020" },
  "Emerald/Green": { bg1: "#001a05", bg2: "#002d0a" },
  Monochrome: { bg1: "#111111", bg2: "#1a1a1a" },
};

// --- Canvas thumbnail renderer ---
type TextPosition = "top" | "center" | "bottom";

interface ThumbnailConfig {
  bgType: "solid" | "gradient";
  bgColor1: string;
  bgColor2: string;
  bgImage: HTMLImageElement | null;
  mainText: string;
  mainFontSize: number;
  mainColor: string;
  mainBold: boolean;
  mainPosition: TextPosition;
  subText: string;
  subFontSize: number;
  subColor: string;
  subBold: boolean;
  subPosition: TextPosition;
}

function renderThumbnail(
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
  if (config.bgImage) {
    ctx.drawImage(config.bgImage, 0, 0, W, H);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, 0, W, H);
  } else if (config.bgType === "gradient") {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, config.bgColor1);
    grad.addColorStop(1, config.bgColor2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = config.bgColor1;
    ctx.fillRect(0, 0, W, H);
  }

  const yPos = (pos: TextPosition, size: number, offset: number) => {
    if (pos === "top") return size * exportScale + 20 * exportScale + offset;
    if (pos === "center") return H / 2 + offset;
    return H - 40 * exportScale - offset;
  };

  const drawText = (
    text: string,
    fontSize: number,
    color: string,
    bold: boolean,
    position: TextPosition,
    shadow: boolean,
    yOffset = 0,
  ) => {
    if (!text.trim()) return;
    const sz = fontSize * exportScale;
    ctx.font = `${bold ? "bold" : "normal"} ${sz}px sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline =
      position === "top" ? "top" : position === "center" ? "middle" : "bottom";
    if (shadow) {
      ctx.shadowColor = "rgba(0,0,0,0.9)";
      ctx.shadowBlur = 10 * exportScale;
    }
    // Word wrap
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
    const startY =
      yPos(position, sz, yOffset) -
      (position === "center" ? totalH / 2 - lineH / 2 : 0);
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
    config.mainBold,
    config.mainPosition,
    true,
    0,
  );
  drawText(
    config.subText,
    config.subFontSize,
    config.subColor,
    config.subBold,
    config.subPosition,
    true,
    config.mainPosition === config.subPosition ? config.mainFontSize * 1.4 : 0,
  );
}

// --- Placeholder thumbnail ---
function PlaceholderThumbnail() {
  return (
    <div
      className="w-full aspect-video rounded-lg flex flex-col items-center justify-center gap-2 border border-border/40"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.15 0.04 270), oklch(0.22 0.06 295))",
      }}
    >
      <ImagePlus className="w-10 h-10 text-muted-foreground/40" />
      <p className="text-xs text-muted-foreground/50">Thumbnail preview</p>
    </div>
  );
}

export default function YouTubePage({
  injectedTopic,
  onInjectedTopicConsumed,
  subliminalCtx,
}: YouTubePageProps) {
  // Track whether title was auto-set so we don't override manual edits
  const [titleWasAutoSet, setTitleWasAutoSet] = useState(false);

  // --- Section 1: Title ---
  const [title, setTitle] = useState("");
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [titleCopied, setTitleCopied] = useState(false);
  const [topicKeyword, setTopicKeyword] = useState("");

  // --- Section 2: Description ---
  const [descIntro, setDescIntro] = useState("");
  const [descBenefits, setDescBenefits] = useState("");
  const [descKeyPoints, setDescKeyPoints] = useState("");
  const [descLinks, setDescLinks] = useState("");
  const [descHashtagsRaw, setDescHashtagsRaw] = useState("");
  const [descCta, setDescCta] = useState("");
  const [assembledDesc, setAssembledDesc] = useState("");
  const [descCopied, setDescCopied] = useState(false);

  // --- Section 3: Thumbnail ---
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bgType, setBgType] = useState<"solid" | "gradient">("gradient");
  const [bgColor1, setBgColor1] = useState("#1a0a3a");
  const [bgColor2, setBgColor2] = useState("#0d1f4a");
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [bgImageName, setBgImageName] = useState("");
  const [mainText, setMainText] = useState("");
  const [mainFontSize, setMainFontSize] = useState(52);
  const [mainColor, setMainColor] = useState("#ffffff");
  const [mainBold, setMainBold] = useState(true);
  const [mainPosition, setMainPosition] = useState<TextPosition>("center");
  const [subText, setSubText] = useState("");
  const [subFontSize, setSubFontSize] = useState(28);
  const [subColor, setSubColor] = useState("#e0d0ff");
  const [subBold, setSubBold] = useState(false);
  const [subPosition, setSubPosition] = useState<TextPosition>("bottom");
  const [thumbnailDrawn, setThumbnailDrawn] = useState(false);
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string>("");

  // --- Section 4: Preview ---
  const [channelName, setChannelName] = useState("Synapse Studio");

  // ── Sync from subliminal generator ───────────────────────────────────────
  const syncFromCtx = useCallback(
    (ctx: SubliminalContext) => {
      if (!ctx.topic) return;

      const cap =
        ctx.topic.charAt(0).toUpperCase() + ctx.topic.slice(1).toLowerCase();

      // Title — subliminal-specific, reflects active modes and chakras
      const chakraLabel =
        ctx.selectedChakras.length > 0
          ? ` | ${ctx.selectedChakras[0]} Chakra`
          : "";
      const boosterTag = ctx.modes.booster ? " ⚡ Boosted" : "";
      const protectionTag = ctx.modes.protection ? " 🛡️ Protected" : "";
      const autoTitle = `${cap}${boosterTag}${protectionTag} Subliminal${chakraLabel} | Synapse Studio`;
      if (!title || titleWasAutoSet) {
        setTitle(autoTitle);
        setTitleWasAutoSet(true);
      }

      // Topic keyword
      setTopicKeyword(ctx.topic);

      // Description fields
      setDescIntro(
        `This powerful subliminal is designed to help you ${ctx.topic.toLowerCase()}. Listen daily for best results. Created with Synapse Studio's advanced subliminal engine.`,
      );

      setDescBenefits(deriveBenefits(ctx.affirmations, ctx.topic));

      setDescKeyPoints(
        [
          `Deep subconscious reprogramming for ${ctx.topic.toLowerCase()}`,
          "3-layer audio stack for maximum absorption",
          ...(ctx.modes.booster ? ["Booster mode — amplified intensity"] : []),
          ...(ctx.modes.fantasy
            ? ["Fantasy-to-Reality mode — manifestation activated"]
            : []),
          ...(ctx.modes.protection
            ? ["Protection mode — grounded, stable energy"]
            : []),
          ...(ctx.modes.chakraAlignment
            ? ["Chakra Alignment — energetic balance"]
            : []),
          ...(ctx.selectedChakras.length > 0
            ? [`Chakras: ${ctx.selectedChakras.join(", ")}`]
            : []),
        ].join("\n"),
      );

      const hashtagTopics = [
        "subliminals",
        ctx.topic.toLowerCase().replace(/\s+/g, ""),
        "manifestation",
        "subconscious",
        "affirmations",
        "synapsestudio",
        ...ctx.selectedChakras.map((c) => c.toLowerCase().replace(/\s+/g, "")),
        ...(ctx.modes.booster ? ["booster"] : []),
        ...(ctx.modes.fantasy ? ["fantasyreality"] : []),
        ...(ctx.modes.protection ? ["protection"] : []),
      ];
      setDescHashtagsRaw(hashtagTopics.join(", "));

      setDescCta(
        "Like & Subscribe for weekly subliminals! 🔔 New videos every week from Synapse Studio.",
      );

      // Thumbnail colors
      const palColors =
        PALETTE_COLORS[ctx.colorPalette] ?? PALETTE_COLORS["Violet/Indigo"];
      setBgColor1(palColors.bg1);
      setBgColor2(palColors.bg2);
      setBgType("gradient");

      // Thumbnail text
      setMainText(ctx.topic.toUpperCase());
      setSubText("Synapse Studio");

      toast.success("Synced from subliminal generator!");
    },
    [title, titleWasAutoSet],
  );

  // Auto-sync and build description when subliminalCtx changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: syncFromCtx is stable memoized fn; including it causes infinite loops
  useEffect(() => {
    if (subliminalCtx?.topic) {
      syncFromCtx(subliminalCtx);
    }
  }, [subliminalCtx]);

  // Build description automatically after sync fields are set
  useEffect(() => {
    if (descIntro || descBenefits || descKeyPoints || descHashtagsRaw) {
      buildDescription();
    }
  }, [descIntro, descBenefits, descKeyPoints, descHashtagsRaw]);

  // Inject topic from wiki
  useEffect(() => {
    if (injectedTopic) {
      setTopicKeyword(injectedTopic);
      setTitle(injectedTopic);
      setTitleWasAutoSet(true);
      setMainText(injectedTopic.toUpperCase());
      onInjectedTopicConsumed?.();
    }
  }, [injectedTopic, onInjectedTopicConsumed]);

  // --- Title logic ---
  const handleSuggestTitles = () => {
    const kw = topicKeyword.trim() || title.trim();
    if (!kw) {
      toast.error("Enter a topic or title keyword first");
      return;
    }
    setTitleSuggestions(
      suggestTitles(kw, subliminalCtx?.modes, subliminalCtx?.selectedChakras),
    );
  };

  const copyTitle = () => {
    if (!title.trim()) return;
    navigator.clipboard.writeText(title).then(() => {
      setTitleCopied(true);
      setTimeout(() => setTitleCopied(false), 2000);
      toast.success("Title copied!");
    });
  };

  // --- Description logic ---
  const buildDescription = useCallback(() => {
    const parts: string[] = [];
    if (descIntro.trim()) parts.push(descIntro.trim());
    if (descBenefits.trim()) {
      parts.push(`\n🌟 BENEFITS\n${descBenefits.trim()}`);
    }
    if (descKeyPoints.trim()) {
      parts.push(`\n📌 KEY POINTS\n${descKeyPoints.trim()}`);
    }
    if (descLinks.trim()) {
      parts.push(`\n🔗 LINKS & RESOURCES\n${descLinks.trim()}`);
    }
    if (descHashtagsRaw.trim()) {
      parts.push(`\n${formatHashtags(descHashtagsRaw)}`);
    }
    if (descCta.trim()) {
      parts.push(`\n📣 ${descCta.trim()}`);
    }
    // Always append tagline
    parts.push("\n\n✨ Created by: Synapse Studio");
    setAssembledDesc(parts.join("\n\n"));
  }, [
    descIntro,
    descBenefits,
    descKeyPoints,
    descLinks,
    descHashtagsRaw,
    descCta,
  ]);

  const copyDescription = () => {
    if (!assembledDesc) return;
    navigator.clipboard.writeText(assembledDesc).then(() => {
      setDescCopied(true);
      setTimeout(() => setDescCopied(false), 2000);
      toast.success("Description copied!");
    });
  };

  // --- Generate Description: sync + build in one action ---
  const handleGenerateDescription = useCallback(() => {
    if (subliminalCtx) {
      syncFromCtx(subliminalCtx);
      // buildDescription is triggered via the useEffect watching desc fields
    } else {
      buildDescription();
    }
    toast.success("Description generated!");
  }, [subliminalCtx, syncFromCtx, buildDescription]);

  // --- Download Package (.zip) ---
  const handleDownloadPackage = useCallback(async () => {
    if (!title && !assembledDesc && !thumbnailDataUrl) {
      toast.error(
        "Nothing to package yet — generate a title and description first.",
      );
      return;
    }
    if (!assembledDesc) {
      toast.warning(
        "Build the description first to include it in the package.",
      );
    }
    if (!thumbnailDataUrl) {
      toast.warning("Draw the thumbnail first to include it in the package.");
    }

    try {
      // Download files individually (jszip not available; use direct downloads)
      const downloadText = (content: string, filename: string) => {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
      };

      if (title) {
        downloadText(title, "title.txt");
      }
      if (assembledDesc) {
        downloadText(assembledDesc, "description.txt");
      }
      if (thumbnailDataUrl) {
        const link = document.createElement("a");
        link.href = thumbnailDataUrl;
        link.download = "thumbnail.png";
        link.click();
      }
      toast.success("Package files downloaded!");
    } catch (err) {
      console.error("Package download failed:", err);
      toast.error("Failed to download package. Please try again.");
    }
  }, [title, assembledDesc, thumbnailDataUrl]);

  // --- Thumbnail logic ---
  const getConfig = useCallback(
    (): ThumbnailConfig => ({
      bgType,
      bgColor1,
      bgColor2,
      bgImage,
      mainText,
      mainFontSize,
      mainColor,
      mainBold,
      mainPosition,
      subText,
      subFontSize,
      subColor,
      subBold,
      subPosition,
    }),
    [
      bgType,
      bgColor1,
      bgColor2,
      bgImage,
      mainText,
      mainFontSize,
      mainColor,
      mainBold,
      mainPosition,
      subText,
      subFontSize,
      subColor,
      subBold,
      subPosition,
    ],
  );

  const drawThumbnail = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderThumbnail(canvas, getConfig(), 1);
    setThumbnailDataUrl(canvas.toDataURL("image/png"));
    setThumbnailDrawn(true);
    toast.success("Thumbnail rendered!");
  }, [getConfig]);

  const downloadThumbnail = () => {
    const exportCanvas = document.createElement("canvas");
    renderThumbnail(exportCanvas, getConfig(), 2);
    const link = document.createElement("a");
    link.download = "thumbnail-1280x720.png";
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
    toast.success("Thumbnail downloaded at 1280×720!");
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBgImageName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new window.Image();
      img.onload = () => setBgImage(img);
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Auto-sync main text with title
  useEffect(() => {
    if (title && !mainText) setMainText(title.toUpperCase());
  }, [title, mainText]);

  const descCharCount = assembledDesc.length;
  const hasSubliminalData = Boolean(subliminalCtx?.topic);

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
          <Youtube className="w-3.5 h-3.5 text-red-400" />
          <span>YouTube Content Creator</span>
        </div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl gradient-text">
          YouTube Studio
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Craft your perfect title, description, and thumbnail — all in one
          place.
        </p>
      </motion.div>

      {/* ─── PIPELINE STATUS ─── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2"
      >
        {[
          {
            label: "Affirmations",
            done: (subliminalCtx?.affirmations?.length ?? 0) > 0,
            note: subliminalCtx?.affirmations?.length
              ? `${subliminalCtx.affirmations.length} ready`
              : "Generate in Studio",
          },
          {
            label: "Audio Config",
            done: true,
            note: "Configure anytime",
          },
          {
            label: "Video Export",
            done: false,
            note: "Export from Generator",
          },
          {
            label: "YouTube Package",
            done: Boolean(title && assembledDesc),
            note: title && assembledDesc ? "Ready to download" : "Build below",
          },
        ].map((step, i) => (
          <div
            key={step.label}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs transition-all ${
              step.done
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-border/30 bg-secondary/10"
            }`}
          >
            <span className="shrink-0">
              {step.done ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-muted-foreground/40" />
              )}
            </span>
            <div className="min-w-0">
              <p
                className={`font-semibold truncate ${step.done ? "text-emerald-400" : "text-muted-foreground"}`}
              >
                {i + 1}. {step.label}
              </p>
              <p className="text-muted-foreground/60 truncate">{step.note}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ─── SYNC BANNER ─── */}
      {hasSubliminalData && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Subliminal ready to sync
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Topic:{" "}
                <span className="text-primary font-medium">
                  {subliminalCtx?.topic}
                </span>{" "}
                · {subliminalCtx?.affirmations.length ?? 0} affirmations
              </p>
            </div>
            <Badge
              variant="secondary"
              className="hidden sm:inline-flex text-[10px] px-2 py-0.5 bg-primary/10 border-primary/20 text-primary"
            >
              {subliminalCtx?.topic}
            </Badge>
          </div>
          <Button
            onClick={() => subliminalCtx && syncFromCtx(subliminalCtx)}
            className="gap-2 shrink-0 w-full sm:w-auto"
            style={{ background: "oklch(0.55 0.22 295)", color: "#fff" }}
          >
            <Sparkles className="w-4 h-4" />
            Sync from Generator
          </Button>
        </motion.div>
      )}

      {/* ─── SECTION 1: TITLE CREATOR ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="rounded-xl border border-border/40 bg-secondary/10 p-5 sm:p-6 space-y-5"
        aria-labelledby="title-heading"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
            <Type className="w-4 h-4 text-red-400" />
          </div>
          <div>
            <h2
              id="title-heading"
              className="font-heading font-semibold text-base sm:text-lg text-foreground"
            >
              Title Creator
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Craft a click-worthy title for your video
            </p>
          </div>
        </div>

        {/* Topic keyword + suggest */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Topic keyword (for suggestions)
            </Label>
            <Input
              value={topicKeyword}
              onChange={(e) => setTopicKeyword(e.target.value)}
              placeholder="e.g. meditation, subliminals, manifesting…"
              className="bg-background/50 border-border/40 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSuggestTitles()}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={handleSuggestTitles}
              className="border-border/40 hover:border-primary/40 gap-2 w-full sm:w-auto"
            >
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              Suggest Titles
            </Button>
          </div>
        </div>

        {/* Suggestions */}
        {titleSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2"
          >
            <p className="text-xs text-muted-foreground">
              Click a suggestion to use it:
            </p>
            <div className="grid gap-2">
              {titleSuggestions.map((s, i) => (
                <motion.button
                  key={s}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => {
                    setTitle(s);
                    setTitleWasAutoSet(false);
                    toast.success("Title applied!");
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-lg border border-border/30 bg-background/40 hover:border-primary/40 hover:bg-primary/5 text-sm text-foreground/90 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Title input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">
              Your Video Title
            </Label>
            <span
              className={`text-xs tabular-nums ${title.length > 90 ? "text-red-400" : title.length > 70 ? "text-yellow-400" : "text-muted-foreground"}`}
            >
              {title.length} / 100
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setTitle(e.target.value);
                  setTitleWasAutoSet(false);
                }
              }}
              placeholder="Enter or pick a title above…"
              className="bg-background/50 border-border/40 text-sm flex-1"
              maxLength={100}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyTitle}
              className="shrink-0 border-border/40 hover:border-primary/40"
              aria-label="Copy title"
            >
              {titleCopied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </motion.section>

      {/* ─── SECTION 2: DESCRIPTION CREATOR ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="rounded-xl border border-border/40 bg-secondary/10 p-5 sm:p-6 space-y-5"
        aria-labelledby="desc-heading"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
            <AlignLeft className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2
              id="desc-heading"
              className="font-heading font-semibold text-base sm:text-lg text-foreground"
            >
              Description Creator
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Build a structured, SEO-friendly description
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Intro */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Intro — Hook (2–3 sentences)
            </Label>
            <Textarea
              value={descIntro}
              onChange={(e) => setDescIntro(e.target.value)}
              placeholder="Grab attention in the first 2 lines. Tell viewers what they'll get."
              rows={3}
              className="bg-background/50 border-border/40 text-sm resize-none"
            />
          </div>

          {/* Benefits */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Benefits (what the listener will experience)
            </Label>
            <Textarea
              value={descBenefits}
              onChange={(e) => setDescBenefits(e.target.value)}
              placeholder={
                "• Unshakeable confidence\n• Magnetic presence\n• Deep inner peace"
              }
              rows={3}
              className="bg-background/50 border-border/40 text-sm resize-none"
            />
          </div>

          {/* Key points */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Key Points (one per line)
            </Label>
            <Textarea
              value={descKeyPoints}
              onChange={(e) => setDescKeyPoints(e.target.value)}
              placeholder={
                "What you'll learn today\nThe secret technique revealed\nStep-by-step breakdown"
              }
              rows={3}
              className="bg-background/50 border-border/40 text-sm resize-none"
            />
          </div>

          {/* Links */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Links & Resources
            </Label>
            <Textarea
              value={descLinks}
              onChange={(e) => setDescLinks(e.target.value)}
              placeholder={
                "Website: https://example.com\nInstagram: @handle\nMerch: https://shop.example.com"
              }
              rows={3}
              className="bg-background/50 border-border/40 text-sm resize-none"
            />
          </div>

          {/* Hashtags */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Hashtags / Tags (comma-separated)
            </Label>
            <Textarea
              value={descHashtagsRaw}
              onChange={(e) => setDescHashtagsRaw(e.target.value)}
              placeholder="subliminals, manifestation, meditation, law of attraction"
              rows={3}
              className="bg-background/50 border-border/40 text-sm resize-none"
            />
          </div>

          {/* CTA */}
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs text-muted-foreground">
              Call to Action
            </Label>
            <Input
              value={descCta}
              onChange={(e) => setDescCta(e.target.value)}
              placeholder="Subscribe for weekly subliminals! 🔔 Like & share if this helped you."
              className="bg-background/50 border-border/40 text-sm"
            />
          </div>
        </div>

        {/* Tagline notice */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border/20 bg-background/30 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary/70 shrink-0" />
          <span>
            The tagline{" "}
            <span className="text-primary font-medium">
              ✨ Created by: Synapse Studio
            </span>{" "}
            is automatically appended to every description.
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleGenerateDescription}
            className="gap-2"
            style={{ background: "oklch(0.55 0.22 295)", color: "#fff" }}
          >
            <Sparkles className="w-4 h-4" />
            Generate Description
          </Button>
          <Button
            onClick={buildDescription}
            variant="outline"
            className="gap-2 border-border/40 hover:border-primary/40"
          >
            <RefreshCw className="w-4 h-4" />
            Rebuild Description
          </Button>
        </div>

        {/* Preview */}
        {assembledDesc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Assembled Description
              </Label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs tabular-nums ${descCharCount > 4800 ? "text-red-400" : descCharCount > 4000 ? "text-yellow-400" : "text-muted-foreground"}`}
                >
                  {descCharCount} / 5000
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyDescription}
                  className="border-border/40 hover:border-primary/40 gap-1.5 text-xs h-7"
                >
                  {descCopied ? (
                    <Check className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {descCopied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            <Textarea
              readOnly
              value={assembledDesc}
              rows={8}
              className="bg-background/30 border-border/30 text-sm text-foreground/80 resize-none font-mono"
            />
          </motion.div>
        )}
      </motion.section>

      {/* ─── SECTIONS 3 & 4: THUMBNAIL + PREVIEW (side by side on lg) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 3: THUMBNAIL CREATOR */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="rounded-xl border border-border/40 bg-secondary/10 p-5 sm:p-6 space-y-5"
          aria-labelledby="thumb-heading"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Paintbrush className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h2
                id="thumb-heading"
                className="font-heading font-semibold text-base sm:text-lg text-foreground"
              >
                Thumbnail Creator
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                1280×720 export — drag, design, download
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
            {!thumbnailDrawn && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.12 0.04 270), oklch(0.18 0.06 295))",
                }}
              >
                <Image className="w-10 h-10 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground/40">
                  Click "Draw Thumbnail" to preview
                </p>
              </div>
            )}
          </div>

          {/* Background controls */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Background
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBgType("solid")}
                className={`flex-1 py-1.5 rounded-lg text-xs border transition-all ${bgType === "solid" ? "border-primary/50 bg-primary/10 text-primary" : "border-border/30 bg-background/30 text-muted-foreground hover:border-border/60"}`}
              >
                Solid
              </button>
              <button
                type="button"
                onClick={() => setBgType("gradient")}
                className={`flex-1 py-1.5 rounded-lg text-xs border transition-all ${bgType === "gradient" ? "border-primary/50 bg-primary/10 text-primary" : "border-border/30 bg-background/30 text-muted-foreground hover:border-border/60"}`}
              >
                Gradient
              </button>
            </div>
            <div className="flex gap-3 items-center">
              <label className="flex items-center gap-2 flex-1 cursor-pointer">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {bgType === "gradient" ? "Color 1" : "Color"}
                </span>
                <input
                  type="color"
                  value={bgColor1}
                  onChange={(e) => setBgColor1(e.target.value)}
                  className="w-8 h-8 rounded-md border border-border/40 cursor-pointer bg-transparent p-0.5"
                />
              </label>
              {bgType === "gradient" && (
                <label className="flex items-center gap-2 flex-1 cursor-pointer">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    Color 2
                  </span>
                  <input
                    type="color"
                    value={bgColor2}
                    onChange={(e) => setBgColor2(e.target.value)}
                    className="w-8 h-8 rounded-md border border-border/40 cursor-pointer bg-transparent p-0.5"
                  />
                </label>
              )}
            </div>
            {/* Image upload */}
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleBgImageUpload}
                className="hidden"
                id="bg-image-upload"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="border-border/40 hover:border-primary/40 gap-1.5 text-xs"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                {bgImageName ? "Change Image" : "Upload Background"}
              </Button>
              {bgImageName && (
                <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                  {bgImageName}
                </span>
              )}
              {bgImage && (
                <button
                  type="button"
                  onClick={() => {
                    setBgImage(null);
                    setBgImageName("");
                  }}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Main text controls */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Main Text
            </Label>
            <Input
              value={mainText}
              onChange={(e) => setMainText(e.target.value)}
              placeholder="Title overlay…"
              className="bg-background/50 border-border/40 text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Font size: {mainFontSize}px
                </Label>
                <Slider
                  value={[mainFontSize]}
                  onValueChange={([v]) => setMainFontSize(v)}
                  min={24}
                  max={96}
                  step={2}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-muted-foreground">Color</span>
                  <input
                    type="color"
                    value={mainColor}
                    onChange={(e) => setMainColor(e.target.value)}
                    className="w-8 h-8 rounded-md border border-border/40 cursor-pointer bg-transparent p-0.5"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setMainBold((b) => !b)}
                  className={`w-8 h-8 rounded-md border flex items-center justify-center transition-all ${mainBold ? "border-primary/50 bg-primary/10 text-primary" : "border-border/30 text-muted-foreground hover:border-border/60"}`}
                  aria-label="Toggle bold"
                  aria-pressed={mainBold}
                >
                  <Bold className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              {(["top", "center", "bottom"] as TextPosition[]).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setMainPosition(pos)}
                  className={`flex-1 py-1 rounded-lg text-xs border transition-all capitalize ${mainPosition === pos ? "border-primary/50 bg-primary/10 text-primary" : "border-border/30 bg-background/30 text-muted-foreground hover:border-border/60"}`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Subtitle text controls */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Subtitle
            </Label>
            <Input
              value={subText}
              onChange={(e) => setSubText(e.target.value)}
              placeholder="Subtitle or tagline (optional)…"
              className="bg-background/50 border-border/40 text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Font size: {subFontSize}px
                </Label>
                <Slider
                  value={[subFontSize]}
                  onValueChange={([v]) => setSubFontSize(v)}
                  min={12}
                  max={60}
                  step={2}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs text-muted-foreground">Color</span>
                  <input
                    type="color"
                    value={subColor}
                    onChange={(e) => setSubColor(e.target.value)}
                    className="w-8 h-8 rounded-md border border-border/40 cursor-pointer bg-transparent p-0.5"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setSubBold((b) => !b)}
                  className={`w-8 h-8 rounded-md border flex items-center justify-center transition-all ${subBold ? "border-primary/50 bg-primary/10 text-primary" : "border-border/30 text-muted-foreground hover:border-border/60"}`}
                  aria-label="Toggle subtitle bold"
                  aria-pressed={subBold}
                >
                  <Bold className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              {(["top", "center", "bottom"] as TextPosition[]).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setSubPosition(pos)}
                  className={`flex-1 py-1 rounded-lg text-xs border transition-all capitalize ${subPosition === pos ? "border-primary/50 bg-primary/10 text-primary" : "border-border/30 bg-background/30 text-muted-foreground hover:border-border/60"}`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={drawThumbnail}
              className="gap-2 flex-1 sm:flex-none"
              style={{ background: "oklch(0.55 0.22 295)", color: "#fff" }}
            >
              <Play className="w-4 h-4" />
              Draw Thumbnail
            </Button>
            <Button
              variant="outline"
              onClick={downloadThumbnail}
              disabled={!thumbnailDrawn}
              className="gap-2 flex-1 sm:flex-none border-border/40 hover:border-primary/40 disabled:opacity-40"
            >
              <Download className="w-4 h-4" />
              Download PNG
            </Button>
          </div>
        </motion.section>

        {/* SECTION 4: YOUTUBE PREVIEW CARD */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="rounded-xl border border-border/40 bg-secondary/10 p-5 sm:p-6 space-y-5"
          aria-labelledby="preview-heading"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h2
                id="preview-heading"
                className="font-heading font-semibold text-base sm:text-lg text-foreground"
              >
                YouTube Preview
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                See how your video looks in search results
              </p>
            </div>
          </div>

          {/* Channel name field */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Channel Name
            </Label>
            <Input
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Your channel name…"
              className="bg-background/50 border-border/40 text-sm"
              maxLength={60}
            />
          </div>

          {/* YouTube-style card */}
          <div className="rounded-xl overflow-hidden border border-border/20 bg-background/40 shadow-xl">
            {/* Thumbnail area */}
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              {thumbnailDataUrl ? (
                <img
                  src={thumbnailDataUrl}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <PlaceholderThumbnail />
              )}
              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                12:34
              </div>
            </div>

            {/* Video metadata */}
            <div className="p-3 flex gap-3">
              {/* Channel avatar */}
              <div
                className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5"
                style={{ background: "oklch(0.55 0.22 295)" }}
              >
                {channelName.charAt(0).toUpperCase() || "C"}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                {/* Title */}
                <p
                  className="text-sm font-semibold text-foreground leading-snug line-clamp-2"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {title || "Your video title will appear here"}
                </p>

                {/* Channel + stats */}
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {channelName || "Channel Name"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    142K views · 3 days ago
                  </span>
                </div>
              </div>

              {/* Options button */}
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
                aria-label="More options"
              >
                <span className="text-lg leading-none tracking-tighter font-bold">
                  ⋮
                </span>
              </button>
            </div>
          </div>

          {/* Second card (related) */}
          <div className="rounded-xl overflow-hidden border border-border/10 bg-background/20 opacity-40">
            <div className="flex gap-3 p-3">
              <div className="w-36 h-20 rounded-lg bg-border/20 shrink-0" />
              <div className="flex-1 space-y-1.5 py-1">
                <div className="h-3 bg-border/30 rounded w-full" />
                <div className="h-3 bg-border/20 rounded w-4/5" />
                <div className="h-2.5 bg-border/15 rounded w-2/3 mt-2" />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground/50 text-center">
            Preview updates live as you edit your title and thumbnail.
          </p>

          {/* Quick-copy all */}
          <div className="pt-2 border-t border-border/20 space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Quick Export
            </Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyTitle}
                disabled={!title}
                className="border-border/40 hover:border-primary/40 gap-1.5 text-xs disabled:opacity-40"
              >
                {titleCopied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Copy Title
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyDescription}
                disabled={!assembledDesc}
                className="border-border/40 hover:border-primary/40 gap-1.5 text-xs disabled:opacity-40"
              >
                {descCopied ? (
                  <Check className="w-3 h-3 text-green-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                Copy Description
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadThumbnail}
                disabled={!thumbnailDrawn}
                className="border-border/40 hover:border-primary/40 gap-1.5 text-xs disabled:opacity-40"
              >
                <Download className="w-3 h-3" />
                Download Thumbnail
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPackage}
                disabled={!title && !assembledDesc}
                className="border-border/40 hover:border-emerald-500/40 hover:text-emerald-400 gap-1.5 text-xs disabled:opacity-40"
              >
                <Package className="w-3 h-3" />
                Download Package (.zip)
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
