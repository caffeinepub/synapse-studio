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
import { Textarea } from "@/components/ui/textarea";
import { Library, Plus, Search, Star, Trash2, Wand2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

interface VaultAffirmation {
  id: string;
  text: string;
  category: string;
  starred: boolean;
  dateAdded: string;
}

const STORAGE_KEY = "synapse_vault";
const CATEGORIES = [
  "Wealth",
  "Love",
  "Power",
  "Healing",
  "Manifestation",
  "Protection",
  "Chakra",
  "Entity",
  "Fantasy",
  "General",
];

const CATEGORY_COLORS: Record<string, string> = {
  Wealth: "bg-yellow-500/15 text-yellow-300 border-yellow-500/25",
  Love: "bg-rose-500/15 text-rose-300 border-rose-500/25",
  Power: "bg-orange-500/15 text-orange-300 border-orange-500/25",
  Healing: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
  Manifestation: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  Protection: "bg-blue-500/15 text-blue-300 border-blue-500/25",
  Chakra: "bg-purple-500/15 text-purple-300 border-purple-500/25",
  Entity: "bg-slate-500/15 text-slate-300 border-slate-500/25",
  Fantasy: "bg-violet-500/15 text-violet-300 border-violet-500/25",
  General: "bg-muted/30 text-muted-foreground border-border/30",
};

// Some seed affirmations to make the vault feel populated on first load
const SEED_AFFIRMATIONS: VaultAffirmation[] = [
  {
    id: "seed_1",
    text: "My mind is a magnet for wealth — money flows to me effortlessly from every direction.",
    category: "Wealth",
    starred: true,
    dateAdded: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "seed_2",
    text: "I radiate pure love and I am deeply loved in return by the universe.",
    category: "Love",
    starred: false,
    dateAdded: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "seed_3",
    text: "Every cell of my body is aligned with perfect healing and radiant vitality.",
    category: "Healing",
    starred: true,
    dateAdded: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "seed_4",
    text: "My Crown chakra is fully open — divine intelligence flows through me at all times.",
    category: "Chakra",
    starred: false,
    dateAdded: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "seed_5",
    text: "I carry the power of manifestation — what I envision, reality reshapes itself to deliver.",
    category: "Manifestation",
    starred: true,
    dateAdded: new Date(Date.now() - 3600000).toISOString(),
  },
];

function loadAffirmations(): VaultAffirmation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as VaultAffirmation[];
    // Seed on first load
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_AFFIRMATIONS));
    return SEED_AFFIRMATIONS;
  } catch {
    return SEED_AFFIRMATIONS;
  }
}

function saveAffirmations(items: VaultAffirmation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

interface VaultPageProps {
  onUseForSubliminal?: (text: string) => void;
}

export default function VaultPage({ onUseForSubliminal }: VaultPageProps) {
  const [items, setItems] = useState<VaultAffirmation[]>(loadAffirmations);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Add form state
  const [addText, setAddText] = useState("");
  const [addMulti, setAddMulti] = useState(false);
  const [addCategory, setAddCategory] = useState<string>("General");

  const handleAdd = () => {
    const lines = addMulti
      ? addText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
      : [addText.trim()];

    if (lines.length === 0) return;

    const newItems: VaultAffirmation[] = lines.map((line, i) => ({
      id: `vault_${Date.now()}_${i}`,
      text: line,
      category: addCategory,
      starred: false,
      dateAdded: new Date().toISOString(),
    }));

    const updated = [...newItems, ...items];
    setItems(updated);
    saveAffirmations(updated);
    setAddText("");
    setAddCategory("General");
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    const updated = items.filter((a) => a.id !== id);
    setItems(updated);
    saveAffirmations(updated);
  };

  const handleToggleStar = (id: string) => {
    const updated = items.map((a) =>
      a.id === id ? { ...a, starred: !a.starred } : a,
    );
    setItems(updated);
    saveAffirmations(updated);
  };

  const filtered = useMemo(() => {
    let result = items;
    if (filterCategory !== "all") {
      result = result.filter((a) => a.category === filterCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.text.toLowerCase().includes(q));
    }
    // Starred first, then newest
    return [...result].sort((a, b) => {
      if (a.starred !== b.starred) return a.starred ? -1 : 1;
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });
  }, [items, filterCategory, search]);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const starredCount = items.filter((a) => a.starred).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-1 self-stretch rounded bg-gradient-to-b from-accent to-primary" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center glow-accent">
              <Library className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl gradient-text">
                Affirmation Vault
              </h1>
              <p className="text-muted-foreground text-sm mt-0.5">
                {items.length} saved · {starredCount} starred
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setShowAdd((v) => !v)}
          className="gap-2 bg-accent/15 hover:bg-accent/25 border border-accent/30 text-accent"
          variant="outline"
          data-ocid="vault.open_modal_button"
        >
          {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span className="hidden sm:inline">{showAdd ? "Cancel" : "Add"}</span>
        </Button>
      </motion.div>

      {/* Add Form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden mb-8"
            data-ocid="vault.dialog"
          >
            <div className="glass-card rounded-2xl p-6 border-accent/20 space-y-4">
              <h2 className="font-heading font-semibold text-lg gradient-text flex items-center gap-2">
                <Library className="w-4 h-4" />
                Save to Vault
              </h2>

              {/* Multi-line toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAddMulti(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                    !addMulti
                      ? "bg-accent/15 text-accent border-accent/30"
                      : "text-muted-foreground border-border/40"
                  }`}
                  data-ocid="vault.single_toggle"
                >
                  Single Affirmation
                </button>
                <button
                  type="button"
                  onClick={() => setAddMulti(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                    addMulti
                      ? "bg-accent/15 text-accent border-accent/30"
                      : "text-muted-foreground border-border/40"
                  }`}
                  data-ocid="vault.multi_toggle"
                >
                  Paste Multiple (one per line)
                </button>
              </div>

              {addMulti ? (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Affirmations (one per line)
                  </Label>
                  <Textarea
                    value={addText}
                    onChange={(e) => setAddText(e.target.value)}
                    placeholder={
                      "I am magnetic and powerful\nMoney flows to me effortlessly\nI radiate confidence…"
                    }
                    rows={6}
                    className="bg-secondary/30 border-border/50 resize-none font-display italic"
                    data-ocid="vault.textarea"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Affirmation
                  </Label>
                  <Input
                    value={addText}
                    onChange={(e) => setAddText(e.target.value)}
                    placeholder="Type or paste your affirmation…"
                    className="bg-secondary/30 border-border/50"
                    data-ocid="vault.input"
                  />
                </div>
              )}

              {/* Category */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                  Category
                </Label>
                <Select value={addCategory} onValueChange={setAddCategory}>
                  <SelectTrigger
                    className="w-48 bg-secondary/30 border-border/50"
                    data-ocid="vault.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleAdd}
                  disabled={!addText.trim()}
                  className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                  data-ocid="vault.submit_button"
                >
                  <Library className="w-4 h-4" />
                  Save to Vault
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAdd(false)}
                  className="border-border/50"
                  data-ocid="vault.cancel_button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + Filter Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search affirmations…"
            className="pl-9 bg-secondary/30 border-border/50"
            data-ocid="vault.search_input"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilterCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
              filterCategory === "all"
                ? "bg-accent/15 text-accent border-accent/30"
                : "text-muted-foreground border-border/40 hover:border-border/60"
            }`}
            data-ocid="vault.filter.tab"
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() =>
                setFilterCategory(cat === filterCategory ? "all" : cat)
              }
              className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${
                filterCategory === cat
                  ? CATEGORY_COLORS[cat]
                  : "text-muted-foreground border-border/40 hover:border-border/60"
              }`}
              data-ocid="vault.filter.tab"
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Count */}
      {items.length > 0 && (
        <p className="text-xs text-muted-foreground mb-4">
          {filtered.length} affirmation{filtered.length !== 1 ? "s" : ""}
          {filterCategory !== "all" || search ? " matching" : ""}
        </p>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-12 text-center"
          data-ocid="vault.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-5">
            <Library className="w-8 h-8 text-accent/60" />
          </div>
          <h3 className="font-heading font-bold text-lg text-foreground/80 mb-2">
            Your vault is empty
          </h3>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
            Save your most powerful affirmations here. Build a personal library
            you can revisit and send back to the generator any time.
          </p>
          <Button
            onClick={() => setShowAdd(true)}
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
            data-ocid="vault.primary_button"
          >
            <Plus className="w-4 h-4" />
            Add First Affirmation
          </Button>
        </motion.div>
      )}

      {/* No Search Results */}
      {items.length > 0 && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-2xl p-8 text-center"
          data-ocid="vault.empty_state"
        >
          <p className="text-muted-foreground text-sm">
            No affirmations match your current search or filter.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setFilterCategory("all");
            }}
            className="mt-3 text-accent"
          >
            Clear filters
          </Button>
        </motion.div>
      )}

      {/* Affirmation Grid */}
      <div className="space-y-3" data-ocid="vault.list">
        <AnimatePresence>
          {filtered.map((aff, idx) => (
            <motion.div
              key={aff.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20, height: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.25 }}
              className={`glass-card rounded-xl p-4 transition-all hover:border-accent/30 group ${
                aff.starred ? "border-accent/20" : ""
              }`}
              data-ocid={`vault.item.${idx + 1}`}
            >
              <div className="flex items-start gap-3">
                {/* Star */}
                <button
                  type="button"
                  onClick={() => handleToggleStar(aff.id)}
                  className={`mt-0.5 shrink-0 transition-all ${
                    aff.starred
                      ? "text-yellow-400"
                      : "text-muted-foreground/30 hover:text-yellow-400/60"
                  }`}
                  data-ocid={`vault.toggle.${idx + 1}`}
                  aria-label={aff.starred ? "Unstar" : "Star"}
                >
                  <Star
                    className="w-4 h-4"
                    fill={aff.starred ? "currentColor" : "none"}
                  />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/90 leading-relaxed font-display italic mb-2">
                    "{aff.text}"
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium border ${
                        CATEGORY_COLORS[aff.category] || CATEGORY_COLORS.General
                      }`}
                    >
                      {aff.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground/50">
                      {formatDate(aff.dateAdded)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onUseForSubliminal && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onUseForSubliminal(aff.text)}
                      className="h-7 px-2 text-accent hover:bg-accent/10"
                      data-ocid={`vault.use_button.${idx + 1}`}
                      title="Send to Generator"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(aff.id)}
                    className="h-7 px-2 text-destructive hover:bg-destructive/10"
                    data-ocid={`vault.delete_button.${idx + 1}`}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
