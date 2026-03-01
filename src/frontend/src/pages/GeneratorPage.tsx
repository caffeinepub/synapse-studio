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
  Copy,
  Eye,
  Film,
  FolderOpen,
  Loader2,
  Music,
  Save,
  Shield,
  Star,
  Trash2,
  Volume2,
  Wand2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  useBuildProjectJSON,
  useDeleteProject,
  useGenerateAffirmations,
  useGetProject,
  useListProjects,
  useSaveProject,
} from "../hooks/useQueries";

const CHAKRAS = [
  "None",
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

type ModeKey = "booster" | "fantasy" | "protection";

interface ModeConfig {
  key: ModeKey;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const MODES: ModeConfig[] = [
  {
    key: "booster",
    label: "Booster",
    description: "Amplify intensity and repetition density",
    icon: Zap,
    color: "oklch(0.78 0.18 90)",
  },
  {
    key: "fantasy",
    label: "Fantasy-to-Reality",
    description:
      "Opens the subconscious to symbolic empowerment and reality expansion",
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
];

export default function GeneratorPage() {
  // Step 1 state
  const [topic, setTopic] = useState("");
  const [modes, setModes] = useState<Record<ModeKey, boolean>>({
    booster: false,
    fantasy: false,
    protection: false,
  });
  const [selectedChakra, setSelectedChakra] = useState("None");

  // Step 2 state
  const [affirmations, setAffirmations] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Step 3 config
  const [voiceType, setVoiceType] = useState("Neural Female");
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(0);
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

  // Step 4 state
  const [projectJSON, setProjectJSON] = useState("");
  const [saveTitle, setSaveTitle] = useState("");
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [loadedJSON, setLoadedJSON] = useState<string | null>(null);

  const generateMutation = useGenerateAffirmations();
  const buildMutation = useBuildProjectJSON();
  const saveMutation = useSaveProject();
  const deleteMutation = useDeleteProject();
  const getProjectMutation = useGetProject();
  const { data: projects, isLoading: projectsLoading } = useListProjects();

  const toggleMode = useCallback((key: ModeKey) => {
    setModes((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic for your affirmations.");
      return;
    }
    try {
      const result = await generateMutation.mutateAsync({
        topic,
        boosterEnabled: modes.booster,
        fantasyEnabled: modes.fantasy,
        protectionEnabled: modes.protection,
        chakraName: selectedChakra === "None" ? "" : selectedChakra,
      });
      setAffirmations(result);
      toast.success(`Generated ${result.length} affirmations`);
    } catch (_e) {
      toast.error("Failed to generate affirmations. Please try again.");
    }
  };

  const handleCopyAffirmations = async () => {
    if (!affirmations.length) return;
    await navigator.clipboard.writeText(affirmations.join("\n"));
    setCopied(true);
    toast.success("Affirmations copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuild = async () => {
    if (!affirmations.length) {
      toast.error("Please generate affirmations first.");
      return;
    }
    try {
      const result = await buildMutation.mutateAsync({
        topic,
        affirmations,
        boosterEnabled: modes.booster,
        fantasyEnabled: modes.fantasy,
        fantasyInput: "",
        protectionEnabled: modes.protection,
        chakraName: selectedChakra === "None" ? "" : selectedChakra,
        voiceType,
        voiceSpeed,
        voicePitch,
        repetitionCount,
        whisperOverlay,
        backgroundMusicType: backgroundMusic,
        subliminalFrequency: subliminalFreq,
        musicVolume,
        subliminalVolume,
        waveformOverlay,
        stereoMovement,
        themeStyle,
        colorPalette,
        resolution,
        durationSeconds: duration,
        frameRate,
      });
      setProjectJSON(result);
      toast.success("Project JSON built successfully");
    } catch (_e) {
      toast.error("Failed to build project JSON.");
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
    <div className="container max-w-4xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-3"
      >
        <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text glow-text-primary">
          Subliminal Generator
        </h1>
        <p className="text-muted-foreground text-base max-w-lg mx-auto">
          Program your subconscious with precision-crafted affirmations, layered
          audio, and cinematic visuals.
        </p>
      </motion.div>

      {/* ── Step 1: Intent Panel ──────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="glass-card rounded-2xl p-6 space-y-6"
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

        {/* Chakra selector */}
        <div className="space-y-3">
          <Label className="text-sm text-muted-foreground">
            Chakra Alignment
          </Label>
          <div className="flex flex-wrap gap-2">
            {CHAKRAS.map((chakra) => {
              const isSelected = selectedChakra === chakra;
              const color = CHAKRA_COLORS[chakra];
              return (
                <button
                  type="button"
                  key={chakra}
                  onClick={() => setSelectedChakra(chakra)}
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
        </div>
      </motion.section>

      {/* ── Step 2: Generate ──────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="glass-card rounded-2xl p-6 space-y-6"
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

        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !topic.trim()}
          className="w-full h-14 text-base font-heading font-semibold glow-primary bg-primary/90 hover:bg-primary transition-all"
          size="lg"
        >
          {generateMutation.isPending ? (
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
        {generateMutation.isPending && (
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
          {affirmations.length > 0 && !generateMutation.isPending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {affirmations.length} affirmations generated
                </span>
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
                {affirmations.map((line, i) => (
                  <motion.div
                    key={`aff-${line.slice(0, 20)}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="affirmation-line text-sm"
                  >
                    {line}
                  </motion.div>
                ))}
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
        className="glass-card rounded-2xl p-6"
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
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Speed: {voiceSpeed.toFixed(1)}x
                  </Label>
                  <Slider
                    min={0.5}
                    max={2.0}
                    step={0.1}
                    value={[voiceSpeed]}
                    onValueChange={([v]) => setVoiceSpeed(v)}
                    className="w-full"
                  />
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
              <div className="grid grid-cols-2 gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">
                    Duration: {duration}s
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={3600}
                      value={duration}
                      onChange={(e) =>
                        setDuration(
                          Math.max(1, Math.min(3600, Number(e.target.value))),
                        )
                      }
                      className="bg-input/50 border-border/50 text-sm"
                    />
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.section>

      {/* ── Step 4: Build JSON ────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="glass-card rounded-2xl p-6 space-y-6"
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
          disabled={buildMutation.isPending || !affirmations.length}
          variant="outline"
          className="w-full h-12 font-heading font-semibold border-accent/40 text-accent hover:bg-accent/10 hover:border-accent/70"
        >
          {buildMutation.isPending ? (
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
          {projectJSON && !buildMutation.isPending && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
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

              {/* Save project */}
              <div className="flex gap-2">
                <Input
                  value={saveTitle}
                  onChange={(e) => setSaveTitle(e.target.value)}
                  placeholder="Project title..."
                  className="bg-input/50 border-border/50 focus:border-primary/50"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                <Button
                  onClick={handleSave}
                  disabled={saveMutation.isPending || !saveTitle.trim()}
                  className="shrink-0 bg-primary/90 hover:bg-primary"
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
          <CollapsibleTrigger className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors">
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
            <div className="px-6 pb-6 space-y-3">
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
