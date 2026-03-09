import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookMarked,
  ChevronDown,
  ChevronUp,
  Plus,
  StickyNote,
  Trash2,
  Wand2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface JournalEntry {
  id: string;
  date: string;
  topic: string;
  modes: {
    booster: boolean;
    fantasy: boolean;
    protection: boolean;
    chakraAlignment: boolean;
  };
  selectedChakras: string[];
  affirmationCount: number;
  notes: string;
  tags: string[];
}

const STORAGE_KEY = "synapse_journal";
const ALL_TAGS = [
  "Wealth",
  "Love",
  "Power",
  "Healing",
  "Manifestation",
  "Protection",
  "Chakra",
  "Energy",
  "Entity",
  "Fantasy",
];
const CHAKRA_NAMES = [
  "Root",
  "Sacral",
  "Solar Plexus",
  "Heart",
  "Throat",
  "Third Eye",
  "Crown",
];

const CHAKRA_COLORS: Record<string, string> = {
  Root: "bg-red-500/20 text-red-300 border-red-500/30",
  Sacral: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Solar Plexus": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Heart: "bg-green-500/20 text-green-300 border-green-500/30",
  Throat: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Third Eye": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  Crown: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

const MODE_COLORS: Record<string, string> = {
  booster: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  fantasy: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  protection: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  chakraAlignment: "bg-teal-500/20 text-teal-300 border-teal-500/30",
};

const TAG_COLORS: Record<string, string> = {
  Wealth: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25",
  Love: "bg-rose-500/15 text-rose-300 border-rose-500/25",
  Power: "bg-orange-500/15 text-orange-300 border-orange-500/25",
  Healing: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  Manifestation: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  Protection: "bg-blue-500/15 text-blue-300 border-blue-500/25",
  Chakra: "bg-purple-500/15 text-purple-300 border-purple-500/25",
  Energy: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/25",
  Entity: "bg-slate-500/15 text-slate-300 border-slate-500/25",
  Fantasy: "bg-violet-500/15 text-violet-300 border-violet-500/25",
};

function loadEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as JournalEntry[]) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: JournalEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

interface JournalPageProps {
  onUseForSubliminal?: (topic: string) => void;
}

export default function JournalPage({ onUseForSubliminal }: JournalPageProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(loadEntries);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<string | null>(null);

  // Form state
  const [formTopic, setFormTopic] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formCount, setFormCount] = useState(100);
  const [formTags, setFormTags] = useState<string[]>([]);
  const [formChakras, setFormChakras] = useState<string[]>([]);
  const [formModes, setFormModes] = useState({
    booster: false,
    fantasy: false,
    protection: false,
    chakraAlignment: false,
  });

  const toggleFormTag = (tag: string) => {
    setFormTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const toggleFormChakra = (chakra: string) => {
    setFormChakras((prev) =>
      prev.includes(chakra)
        ? prev.filter((c) => c !== chakra)
        : [...prev, chakra],
    );
  };

  const handleSubmit = () => {
    if (!formTopic.trim()) return;
    const newEntry: JournalEntry = {
      id: `journal_${Date.now()}`,
      date: new Date().toISOString(),
      topic: formTopic.trim(),
      modes: { ...formModes },
      selectedChakras: [...formChakras],
      affirmationCount: formCount,
      notes: formNotes.trim(),
      tags: [...formTags],
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    // reset
    setFormTopic("");
    setFormNotes("");
    setFormCount(100);
    setFormTags([]);
    setFormChakras([]);
    setFormModes({
      booster: false,
      fantasy: false,
      protection: false,
      chakraAlignment: false,
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveEntries(updated);
  };

  const filteredEntries = entries.filter((e) => {
    if (filterTag && !e.tags.includes(filterTag)) return false;
    if (filterMode) {
      if (filterMode === "booster" && !e.modes.booster) return false;
      if (filterMode === "fantasy" && !e.modes.fantasy) return false;
      if (filterMode === "protection" && !e.modes.protection) return false;
      if (filterMode === "chakraAlignment" && !e.modes.chakraAlignment)
        return false;
    }
    return true;
  });

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="page-header flex items-center gap-4">
          <div className="w-1 self-stretch rounded bg-gradient-to-b from-primary to-accent" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center glow-primary">
              <BookMarked className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl gradient-text">
                Session Journal
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                Track your subliminal sessions & insights
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="gap-2 bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary"
          variant="outline"
          data-ocid="journal.open_modal_button"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span className="hidden sm:inline">
            {showForm ? "Cancel" : "New Entry"}
          </span>
        </Button>
      </motion.div>

      {/* New Entry Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden mb-8"
            data-ocid="journal.dialog"
          >
            <div className="glass-card rounded-2xl p-6 border-primary/20 space-y-5">
              <h2 className="font-heading font-semibold text-lg gradient-text flex items-center gap-2">
                <StickyNote className="w-4 h-4" />
                New Journal Entry
              </h2>

              {/* Topic */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Subliminal Topic *
                </Label>
                <Input
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="e.g. confidence, wealth, Naruto powers…"
                  className="bg-secondary/30 border-border/50"
                  data-ocid="journal.input"
                />
              </div>

              {/* Affirmation Count */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Affirmation Count
                </Label>
                <Input
                  type="number"
                  value={formCount}
                  onChange={(e) =>
                    setFormCount(
                      Math.max(1, Number.parseInt(e.target.value) || 1),
                    )
                  }
                  min={1}
                  max={4000}
                  className="bg-secondary/30 border-border/50 w-40"
                  data-ocid="journal.count_input"
                />
              </div>

              {/* Active Modes */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Active Modes
                </Label>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "booster",
                      "fantasy",
                      "protection",
                      "chakraAlignment",
                    ] as const
                  ).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() =>
                        setFormModes((prev) => ({
                          ...prev,
                          [mode]: !prev[mode],
                        }))
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        formModes[mode]
                          ? MODE_COLORS[mode]
                          : "bg-secondary/30 text-muted-foreground border-border/40 hover:border-border/70"
                      }`}
                      data-ocid={`journal.${mode}_toggle`}
                    >
                      {mode === "chakraAlignment"
                        ? "Chakra Align"
                        : mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chakras */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Chakras Used
                </Label>
                <div className="flex flex-wrap gap-2">
                  {CHAKRA_NAMES.map((chakra) => (
                    <button
                      key={chakra}
                      type="button"
                      onClick={() => toggleFormChakra(chakra)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        formChakras.includes(chakra)
                          ? CHAKRA_COLORS[chakra]
                          : "bg-secondary/30 text-muted-foreground border-border/40 hover:border-border/70"
                      }`}
                      data-ocid="journal.chakra_toggle"
                    >
                      {chakra}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tags
                </Label>
                <div className="flex flex-wrap gap-2">
                  {ALL_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleFormTag(tag)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        formTags.includes(tag)
                          ? TAG_COLORS[tag]
                          : "bg-secondary/30 text-muted-foreground border-border/40 hover:border-border/70"
                      }`}
                      data-ocid="journal.tag_toggle"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Notes / Intentions
                </Label>
                <Textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="What were your intentions? What did you feel? Any observations…"
                  rows={4}
                  className="bg-secondary/30 border-border/50 resize-none"
                  data-ocid="journal.textarea"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={!formTopic.trim()}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  data-ocid="journal.submit_button"
                >
                  <BookMarked className="w-4 h-4" />
                  Save Entry
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-border/50"
                  data-ocid="journal.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      {entries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 space-y-3"
        >
          {/* Tag filters */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Filter by Tag
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setFilterTag(null)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                  !filterTag
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "text-muted-foreground border-border/40 hover:border-border/60"
                }`}
                data-ocid="journal.filter.tab"
              >
                All
              </button>
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setFilterTag(tag === filterTag ? null : tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                    filterTag === tag
                      ? TAG_COLORS[tag]
                      : "text-muted-foreground border-border/40 hover:border-border/60"
                  }`}
                  data-ocid="journal.filter.tab"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Mode filters */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
              Filter by Mode
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setFilterMode(null)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                  !filterMode
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "text-muted-foreground border-border/40 hover:border-border/60"
                }`}
                data-ocid="journal.mode_filter.tab"
              >
                All Modes
              </button>
              {(
                ["booster", "fantasy", "protection", "chakraAlignment"] as const
              ).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() =>
                    setFilterMode(mode === filterMode ? null : mode)
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                    filterMode === mode
                      ? MODE_COLORS[mode]
                      : "text-muted-foreground border-border/40 hover:border-border/60"
                  }`}
                  data-ocid="journal.mode_filter.tab"
                >
                  {mode === "chakraAlignment"
                    ? "Chakra Align"
                    : mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Entry Count */}
      {entries.length > 0 && (
        <p className="text-xs text-muted-foreground mb-4">
          {filteredEntries.length} of {entries.length} entr
          {entries.length === 1 ? "y" : "ies"}
        </p>
      )}

      {/* Empty State */}
      {entries.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-12 text-center"
          data-ocid="journal.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
            <BookMarked className="w-8 h-8 text-primary/60" />
          </div>
          <h3 className="font-heading font-bold text-lg text-foreground/80 mb-2">
            Your journal awaits
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
            Record your subliminal sessions, intentions, and insights. Every
            journey worth taking is worth documenting.
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            data-ocid="journal.primary_button"
          >
            <Plus className="w-4 h-4" />
            Create First Entry
          </Button>
        </motion.div>
      )}

      {/* Filtered Empty */}
      {entries.length > 0 && filteredEntries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-8 text-center"
          data-ocid="journal.empty_state"
        >
          <p className="text-muted-foreground text-sm">
            No entries match the current filter.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilterTag(null);
              setFilterMode(null);
            }}
            className="mt-3 text-primary"
          >
            Clear filters
          </Button>
        </motion.div>
      )}

      {/* Entry List */}
      <div className="space-y-4" data-ocid="journal.list">
        <AnimatePresence>
          {filteredEntries.map((entry, idx) => {
            const isExpanded = expandedId === entry.id;
            const activeModes = Object.entries(entry.modes)
              .filter(([, v]) => v)
              .map(([k]) => k);

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.3 }}
                className="glass-card rounded-2xl overflow-hidden"
                data-ocid={`journal.item.${idx + 1}`}
              >
                {/* Entry Header */}
                <button
                  type="button"
                  className="w-full text-left p-5 hover:bg-primary/5 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-heading font-bold text-base text-foreground">
                          {entry.topic}
                        </h3>
                        <span className="text-xs text-muted-foreground/60">
                          {entry.affirmationCount} affirmations
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground mb-3">
                        {formatDate(entry.date)}
                      </p>

                      {/* Mode badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {activeModes.map((mode) => (
                          <span
                            key={mode}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${MODE_COLORS[mode]}`}
                          >
                            {mode === "chakraAlignment"
                              ? "Chakra Align"
                              : mode.charAt(0).toUpperCase() + mode.slice(1)}
                          </span>
                        ))}
                        {entry.selectedChakras.map((chakra) => (
                          <span
                            key={chakra}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${CHAKRA_COLORS[chakra] || "bg-muted/20 text-muted-foreground border-border/30"}`}
                          >
                            {chakra}
                          </span>
                        ))}
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${TAG_COLORS[tag] || "bg-muted/20 text-muted-foreground border-border/30"}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-border/30 pt-4 space-y-4">
                        {entry.notes && (
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                              Notes & Intentions
                            </p>
                            <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed font-display italic">
                              "{entry.notes}"
                            </p>
                          </div>
                        )}

                        {!entry.notes && (
                          <p className="text-sm text-muted-foreground/50 italic">
                            No notes recorded for this session.
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 pt-2">
                          {onUseForSubliminal && (
                            <Button
                              size="sm"
                              onClick={() => onUseForSubliminal(entry.topic)}
                              className="gap-1.5 bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary"
                              variant="outline"
                              data-ocid={`journal.use_button.${idx + 1}`}
                            >
                              <Wand2 className="w-3.5 h-3.5" />
                              Use Again
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(entry.id)}
                            className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
                            data-ocid={`journal.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
