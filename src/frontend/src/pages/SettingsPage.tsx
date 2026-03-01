import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Save,
  Settings,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type AISettings, getAISettings } from "../utils/aiGenerate";

const GROQ_MODELS = [
  { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B Versatile (Best)" },
  { value: "llama3-8b-8192", label: "Llama 3 8B (Fast)" },
  { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B (Creative)" },
];

const GEMINI_MODELS = [
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash (Latest)" },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash (Stable)" },
];

type Provider = "none" | "groq" | "gemini";

interface ProviderCard {
  id: Provider;
  label: string;
  description: string;
  keyUrl: string;
  keyLabel: string;
  icon: React.ElementType;
  color: string;
  tier: string;
}

const PROVIDERS: ProviderCard[] = [
  {
    id: "none",
    label: "Rule-Based",
    description: "Uses the built-in backend generator. No API key required.",
    keyUrl: "",
    keyLabel: "",
    icon: Settings,
    color: "oklch(0.56 0.02 270)",
    tier: "Built-in",
  },
  {
    id: "groq",
    label: "Groq",
    description:
      "Ultra-fast inference on open-source models. Free tier available with generous limits.",
    keyUrl: "https://console.groq.com",
    keyLabel: "Get free Groq key",
    icon: Zap,
    color: "oklch(0.78 0.18 90)",
    tier: "Free Tier",
  },
  {
    id: "gemini",
    label: "Google Gemini",
    description:
      "Google's multimodal AI. Free tier with Gemini Flash models is fast and capable.",
    keyUrl: "https://aistudio.google.com/apikey",
    keyLabel: "Get free Gemini key",
    icon: Sparkles,
    color: "oklch(0.62 0.22 220)",
    tier: "Free Tier",
  },
];

export default function SettingsPage() {
  const [provider, setProvider] = useState<Provider>("none");
  const [model, setModel] = useState(GROQ_MODELS[0].value);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Load existing settings on mount
  useEffect(() => {
    const existing = getAISettings();
    if (existing) {
      setProvider(existing.provider);
      setModel(existing.model);
      setApiKey(existing.apiKey);
    } else {
      // Check if there's a saved provider set to 'none'
      try {
        const raw = localStorage.getItem("synapse_ai_settings");
        if (raw) {
          const parsed: AISettings = JSON.parse(raw);
          setProvider(parsed.provider ?? "none");
          setModel(parsed.model ?? GROQ_MODELS[0].value);
          setApiKey(parsed.apiKey ?? "");
        }
      } catch {
        // ignore
      }
    }

    // Determine if AI is currently active
    const settings = getAISettings();
    setIsActive(!!settings);
  }, []);

  const handleProviderChange = (p: Provider) => {
    setProvider(p);
    // Reset model to first option for the new provider
    if (p === "groq") setModel(GROQ_MODELS[0].value);
    if (p === "gemini") setModel(GEMINI_MODELS[0].value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const settings: AISettings = { provider, model, apiKey: apiKey.trim() };
      localStorage.setItem("synapse_ai_settings", JSON.stringify(settings));
      setIsActive(provider !== "none" && !!apiKey.trim());
      toast.success("AI settings saved");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem("synapse_ai_settings");
    setProvider("none");
    setModel(GROQ_MODELS[0].value);
    setApiKey("");
    setIsActive(false);
    toast.success("Settings cleared");
  };

  const currentModels = provider === "groq" ? GROQ_MODELS : GEMINI_MODELS;

  return (
    <div className="container max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center glow-primary">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold gradient-text glow-text-primary">
                AI Settings
              </h1>
              <p className="text-muted-foreground text-sm">
                Connect a free AI API for smarter affirmation generation
              </p>
            </div>
          </div>

          {/* Status badge */}
          <Badge
            className={
              isActive
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 px-3 py-1"
                : "bg-muted/50 text-muted-foreground border-border/50 px-3 py-1"
            }
          >
            {isActive ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                AI Active
              </>
            ) : (
              <>
                <Settings className="w-3.5 h-3.5 mr-1.5" />
                Rule-Based Mode
              </>
            )}
          </Badge>
        </div>
      </motion.div>

      {/* Provider Selection */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="glass-card rounded-2xl p-6 space-y-5"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-mono text-primary">
            1
          </div>
          <h2 className="font-heading text-base font-semibold">
            Choose AI Provider
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROVIDERS.map((p) => {
            const Icon = p.icon;
            const isSelected = provider === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProviderChange(p.id)}
                className={`relative p-4 rounded-xl text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 border ${
                  isSelected
                    ? "border-primary/50 bg-primary/10"
                    : "border-border/40 bg-secondary/20 hover:border-border/70 hover:bg-secondary/40"
                }`}
                aria-pressed={isSelected}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: isSelected
                          ? `${p.color}25`
                          : "oklch(0.16 0.018 270 / 0.5)",
                      }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{
                          color: isSelected ? p.color : "oklch(0.56 0.02 270)",
                        }}
                      />
                    </div>
                    {p.tier && (
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                        style={{
                          background: isSelected
                            ? `${p.color}20`
                            : "oklch(0.16 0.018 270 / 0.5)",
                          color: isSelected ? p.color : "oklch(0.56 0.02 270)",
                        }}
                      >
                        {p.tier}
                      </span>
                    )}
                  </div>
                  <div>
                    <p
                      className="font-heading text-sm font-semibold"
                      style={{ color: isSelected ? p.color : undefined }}
                    >
                      {p.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-snug line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <div
                    className="absolute top-2 right-2 w-2 h-2 rounded-full"
                    style={{ background: p.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* API Key + Model Config */}
      {provider !== "none" && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="glass-card rounded-2xl p-6 space-y-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-mono text-primary">
              2
            </div>
            <h2 className="font-heading text-base font-semibold">
              Configure {provider === "groq" ? "Groq" : "Google Gemini"}
            </h2>
          </div>

          {/* Info card with link */}
          {PROVIDERS.find((p) => p.id === provider)?.keyUrl && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
              <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-sm text-foreground/80">
                  {provider === "groq"
                    ? "Groq offers a free API with fast Llama & Mixtral inference. No credit card needed to start."
                    : "Google AI Studio provides a free Gemini API key with generous daily limits."}
                </p>
                <a
                  href={PROVIDERS.find((p) => p.id === provider)?.keyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors font-medium"
                >
                  {PROVIDERS.find((p) => p.id === provider)?.keyLabel}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Model selector */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="bg-input/50 border-border/50 focus:border-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentModels.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* API Key input */}
          <div className="space-y-2">
            <Label htmlFor="api-key" className="text-sm text-muted-foreground">
              API Key
            </Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your API key here..."
                className="bg-input/50 border-border/50 focus:border-primary/50 pr-10 font-mono text-sm"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                aria-label={showKey ? "Hide API key" : "Show API key"}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your key is stored locally in your browser only — never sent to
              our servers.
            </p>
          </div>
        </motion.section>
      )}

      {/* Save / Clear actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex gap-3"
      >
        <Button
          onClick={handleSave}
          disabled={isSaving || (provider !== "none" && !apiKey.trim())}
          className="flex-1 h-12 font-heading font-semibold bg-primary/90 hover:bg-primary glow-primary transition-all"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>

        <Button
          onClick={handleClear}
          variant="outline"
          className="h-12 px-5 font-heading border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/70"
          size="lg"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </motion.div>

      {/* How it works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="glass-card rounded-2xl p-6 space-y-4"
      >
        <h2 className="font-heading text-base font-semibold text-muted-foreground uppercase tracking-widest text-xs">
          How It Works
        </h2>
        <Separator className="bg-border/40" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
              <span className="text-[11px] font-mono text-primary">1</span>
            </div>
            <p className="font-medium text-foreground/90">You save a key</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Add your free API key from Groq or Google AI Studio above.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
              <span className="text-[11px] font-mono text-accent">2</span>
            </div>
            <p className="font-medium text-foreground/90">AI generates</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When you hit Generate, the app calls the AI directly from your
              browser using your key.
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-[11px] font-mono text-emerald-400">3</span>
            </div>
            <p className="font-medium text-foreground/90">Smart fallback</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If AI fails or no key is set, the built-in rule-based engine kicks
              in automatically.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
