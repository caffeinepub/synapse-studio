import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Info, Search, X, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  type KinesisEntry,
  useGetAllKinesisEntries,
} from "../hooks/useQueries";

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "oklch(0.65 0.22 30)",
  Water: "oklch(0.58 0.2 220)",
  Air: "oklch(0.72 0.15 200)",
  Earth: "oklch(0.55 0.15 80)",
  Lightning: "oklch(0.78 0.18 90)",
  Time: "oklch(0.6 0.18 280)",
  Mind: "oklch(0.55 0.22 290)",
  Ice: "oklch(0.72 0.15 210)",
  Light: "oklch(0.85 0.1 85)",
  Shadow: "oklch(0.35 0.12 290)",
  Bio: "oklch(0.62 0.2 145)",
  Tech: "oklch(0.65 0.18 200)",
  Gravity: "oklch(0.5 0.2 270)",
  Plasma: "oklch(0.72 0.2 320)",
  Sound: "oklch(0.68 0.15 55)",
};

function getElementColor(element: string): string {
  return ELEMENT_COLORS[element] ?? "oklch(0.62 0.22 295)";
}

function KinesisCard({
  entry,
  onClick,
}: { entry: KinesisEntry; onClick: () => void }) {
  const color = getElementColor(entry.element);
  const firstSentence =
    entry.symbolicMeaning.split(/[.!?]/)[0] ?? entry.symbolicMeaning;

  return (
    <motion.button
      onClick={onClick}
      className="kinesis-card text-left w-full rounded-2xl border border-border/50 p-4 space-y-3 bg-secondary/20 hover:bg-secondary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      style={{
        borderColor: `${color}30`,
      }}
    >
      {/* Element badge */}
      <div className="flex items-center justify-between">
        <Badge
          className="text-xs font-mono"
          style={{
            background: `${color}20`,
            color,
            border: `1px solid ${color}40`,
          }}
        >
          {entry.element}
        </Badge>
        <Zap className="w-3.5 h-3.5" style={{ color: `${color}80` }} />
      </div>

      {/* Name */}
      <div>
        <h3
          className="font-heading text-base font-bold leading-tight"
          style={{ color }}
        >
          {entry.name}
        </h3>
        <span className="text-xs text-muted-foreground font-mono opacity-70">
          {entry.suffix}
        </span>
      </div>

      {/* Teaser */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
        {firstSentence}.
      </p>
    </motion.button>
  );
}

function KinesisModal({
  entry,
  open,
  onClose,
}: { entry: KinesisEntry | null; open: boolean; onClose: () => void }) {
  if (!entry) return null;
  const color = getElementColor(entry.element);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl max-h-[85vh] overflow-y-auto"
        style={{
          background: "oklch(0.1 0.02 275)",
          borderColor: `${color}40`,
        }}
      >
        <DialogHeader>
          <div className="flex items-start gap-4">
            {/* Icon orb */}
            <div
              className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center border"
              style={{
                background: `radial-gradient(circle, ${color}30, ${color}05)`,
                borderColor: `${color}50`,
                boxShadow: `0 0 20px ${color}20`,
              }}
            >
              <Zap className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <DialogTitle
                className="font-display text-2xl font-bold leading-tight"
                style={{ color }}
              >
                {entry.name}
              </DialogTitle>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {entry.suffix}
              </p>
              <Badge
                className="text-xs mt-2"
                style={{
                  background: `${color}20`,
                  color,
                  border: `1px solid ${color}40`,
                }}
              >
                {entry.element}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Disclaimer */}
          <div
            className="flex items-start gap-2 p-3 rounded-lg text-xs text-muted-foreground"
            style={{
              background: "oklch(0.13 0.015 275)",
              border: "1px solid oklch(0.22 0.025 270 / 0.5)",
            }}
          >
            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            Presented as a fictional, mythological, or symbolic construct.
          </div>

          {/* Fictional Origins */}
          <div className="space-y-2">
            <h4
              className="text-xs font-heading font-semibold uppercase tracking-widest"
              style={{ color: `${color}cc` }}
            >
              Fictional Origins
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {entry.fictionalOrigins}
            </p>
          </div>

          {/* Media References */}
          <div className="space-y-2">
            <h4
              className="text-xs font-heading font-semibold uppercase tracking-widest"
              style={{ color: `${color}cc` }}
            >
              Media References
            </h4>
            <div className="flex flex-wrap gap-2">
              {entry.mediaReferences.map((ref) => (
                <Badge
                  key={ref}
                  variant="secondary"
                  className="text-xs bg-secondary/50 text-muted-foreground border-border/50"
                >
                  {ref}
                </Badge>
              ))}
            </div>
          </div>

          {/* Symbolic Meaning */}
          <div className="space-y-2">
            <h4
              className="text-xs font-heading font-semibold uppercase tracking-widest"
              style={{ color: `${color}cc` }}
            >
              Symbolic Meaning
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {entry.symbolicMeaning}
            </p>
          </div>

          {/* Psychological Metaphor */}
          <div
            className="p-4 rounded-xl space-y-2"
            style={{ background: `${color}10`, border: `1px solid ${color}30` }}
          >
            <h4
              className="text-xs font-heading font-semibold uppercase tracking-widest"
              style={{ color }}
            >
              Psychological Metaphor
            </h4>
            <p
              className="text-sm leading-relaxed font-display italic"
              style={{ color: "oklch(0.9 0.04 260)" }}
            >
              "{entry.psychologicalMetaphor}"
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function KinesisArchivePage() {
  const { data: entries, isLoading, error } = useGetAllKinesisEntries();
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<KinesisEntry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!entries) return [];
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.element.toLowerCase().includes(q) ||
        e.symbolicMeaning.toLowerCase().includes(q) ||
        e.psychologicalMetaphor.toLowerCase().includes(q),
    );
  }, [entries, search]);

  const handleOpen = (entry: KinesisEntry) => {
    setSelectedEntry(entry);
    setModalOpen(true);
  };

  return (
    <div className="container max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-6 sm:space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold gradient-text glow-text-primary">
          Kinesis Archive
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          An encyclopedia of elemental manipulation abilities from mythology,
          folklore, and fiction — translated into psychological metaphors.
        </p>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-muted-foreground border border-border/50"
          style={{ background: "oklch(0.11 0.015 275 / 0.7)" }}
        >
          <Info className="w-3.5 h-3.5" />
          All entries are presented as fictional, mythological, or symbolic
          constructs. These abilities do not physically exist.
        </div>
      </motion.div>

      {/* Search bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-md mx-auto"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search kinesis types, elements, metaphors..."
          className="pl-10 pr-10 bg-card/50 border-border/50 focus:border-primary/50 h-11"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>

      {/* Stats */}
      {entries && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-center"
        >
          <p className="text-xs text-muted-foreground">
            {search
              ? `${filtered.length} of ${entries.length}`
              : entries.length}{" "}
            entries
          </p>
        </motion.div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            "k-1",
            "k-2",
            "k-3",
            "k-4",
            "k-5",
            "k-6",
            "k-7",
            "k-8",
            "k-9",
            "k-10",
            "k-11",
            "k-12",
          ].map((k) => (
            <Skeleton key={k} className="h-40 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">
            Failed to load kinesis archive. Please refresh the page.
          </p>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((entry, i) => (
              <motion.div
                key={entry.name}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
              >
                <KinesisCard entry={entry} onClick={() => handleOpen(entry)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Empty state (post-filter) */}
      {!isLoading && !error && filtered.length === 0 && search && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 space-y-3"
        >
          <BookOpen className="w-8 h-8 mx-auto text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No kinesis types match "{search}"
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearch("")}
            className="text-xs"
          >
            Clear search
          </Button>
        </motion.div>
      )}

      {/* Modal */}
      <KinesisModal
        entry={selectedEntry}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTimeout(() => setSelectedEntry(null), 300);
        }}
      />
    </div>
  );
}
