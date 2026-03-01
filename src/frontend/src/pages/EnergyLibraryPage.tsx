import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ChevronDown, Info } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  type BeliefSystem,
  type ChakraEntry,
  useGetAllChakras,
  useGetBeliefSystems,
} from "../hooks/useQueries";

const CHAKRA_COLOR: Record<string, string> = {
  Root: "oklch(0.58 0.22 25)",
  Sacral: "oklch(0.65 0.2 48)",
  "Solar Plexus": "oklch(0.78 0.18 90)",
  Heart: "oklch(0.62 0.2 145)",
  Throat: "oklch(0.58 0.2 220)",
  "Third Eye": "oklch(0.5 0.22 270)",
  Crown: "oklch(0.55 0.22 310)",
};

const CHAKRA_SYMBOL: Record<string, string> = {
  Root: "⬛",
  Sacral: "🔶",
  "Solar Plexus": "🔆",
  Heart: "💚",
  Throat: "🔵",
  "Third Eye": "🔮",
  Crown: "💜",
};

function ChakraCard({ chakra }: { chakra: ChakraEntry }) {
  const [expanded, setExpanded] = useState(false);
  const color = CHAKRA_COLOR[chakra.name] ?? "oklch(0.62 0.22 295)";

  return (
    <motion.div
      layout
      className="rounded-2xl border border-border/50 overflow-hidden cursor-pointer hover:border-opacity-80 transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${color}15, oklch(0.11 0.015 275))`,
        borderColor: expanded ? `${color}60` : undefined,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Header */}
      <div className="p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
        {/* Orb */}
        <div
          className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-xl border-2"
          style={{
            background: `radial-gradient(circle, ${color}40, ${color}10)`,
            borderColor: `${color}60`,
            boxShadow: expanded ? `0 0 20px ${color}30` : "none",
          }}
        >
          {CHAKRA_SYMBOL[chakra.name] ?? "◉"}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h3
                className="font-heading text-base font-bold"
                style={{ color }}
              >
                {chakra.name}
              </h3>
              <p className="text-xs text-muted-foreground">{chakra.location}</p>
            </div>
            <ChevronDown
              className="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200"
              style={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
          <p className="text-sm text-foreground/80 mt-2 line-clamp-2 leading-relaxed">
            {chakra.overview}
          </p>
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-5 pb-5 space-y-4 border-t"
              style={{ borderColor: `${color}30` }}
            >
              {/* Psychological Interpretation */}
              <div className="space-y-1.5 pt-4">
                <h4 className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">
                  Psychological Interpretation
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {chakra.psychologicalInterpretation}
                </p>
              </div>

              {/* Emotional Themes */}
              <div className="space-y-2">
                <h4 className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">
                  Emotional Themes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {chakra.emotionalThemes.map((theme) => (
                    <Badge
                      key={theme}
                      className="text-xs"
                      style={{
                        background: `${color}20`,
                        color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Balanced State Traits */}
              <div className="space-y-2">
                <h4 className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">
                  Balanced State Traits
                </h4>
                <ul className="space-y-1">
                  {chakra.balancedTraits.map((trait) => (
                    <li
                      key={trait}
                      className="flex items-center gap-2 text-sm text-foreground/80"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: color }}
                      />
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Associated Affirmations */}
              <div className="space-y-2">
                <h4 className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">
                  Affirmations
                </h4>
                <div className="space-y-1.5">
                  {chakra.affirmations.map((affirmation) => (
                    <p
                      key={affirmation}
                      className="text-sm italic leading-relaxed pl-3 border-l-2"
                      style={{
                        borderColor: `${color}60`,
                        color: "oklch(0.82 0.04 280)",
                      }}
                    >
                      "{affirmation}"
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function BeliefSystemCard({
  system,
  index,
}: { system: BeliefSystem; index: number }) {
  return (
    <AccordionItem
      value={`belief-${index}`}
      className="border border-border/40 rounded-xl px-4 bg-secondary/20 mb-2"
    >
      <AccordionTrigger className="hover:no-underline py-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="font-heading text-sm font-semibold">{system.name}</p>
            <p className="text-xs text-muted-foreground">{system.category}</p>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4 space-y-4">
        <p className="text-sm text-foreground/80 leading-relaxed">
          {system.summary}
        </p>
        <div className="space-y-2">
          <h4 className="text-xs font-heading font-semibold uppercase tracking-widest text-muted-foreground">
            Key Principles
          </h4>
          <ul className="space-y-1.5">
            {system.keyPrinciples.map((principle) => (
              <li
                key={principle}
                className="flex items-start gap-2 text-sm text-foreground/80"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent/70 flex-shrink-0 mt-1.5" />
                {principle}
              </li>
            ))}
          </ul>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function EnergyLibraryPage() {
  const {
    data: chakras,
    isLoading: chakrasLoading,
    error: chakrasError,
  } = useGetAllChakras();
  const {
    data: beliefSystems,
    isLoading: beliefLoading,
    error: beliefError,
  } = useGetBeliefSystems();

  return (
    <div className="container max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10 space-y-10 sm:space-y-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold gradient-text glow-text-primary">
          Energy & Consciousness Library
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          A philosophical and psychological exploration of energy systems,
          consciousness frameworks, and inner development models.
        </p>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs text-muted-foreground border border-border/50"
          style={{ background: "oklch(0.11 0.015 275 / 0.7)" }}
        >
          <Info className="w-3.5 h-3.5" />
          This content is presented as symbolic and philosophical in nature. It
          is not medical advice.
        </div>
      </motion.div>

      {/* ── Chakra Section ───────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="space-y-1">
          <h2 className="font-heading text-2xl font-bold">The Seven Chakras</h2>
          <div className="glow-divider" />
          <p className="text-sm text-muted-foreground pt-2">
            Ancient energy centers mapped to psychological states, emotional
            patterns, and personal development themes.
          </p>
        </div>

        {chakrasLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {["c-1", "c-2", "c-3", "c-4", "c-5", "c-6", "c-7"].map((k) => (
              <Skeleton key={k} className="h-40 rounded-2xl" />
            ))}
          </div>
        )}

        {chakrasError && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">
              Failed to load chakra data. Please refresh the page.
            </p>
          </div>
        )}

        {chakras && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {chakras.map((chakra, i) => (
              <motion.div
                key={chakra.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <ChakraCard chakra={chakra} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ── Belief Systems Section ───────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="space-y-1">
          <h2 className="font-heading text-2xl font-bold">
            Mental Models & Belief Frameworks
          </h2>
          <div className="glow-divider" />
          <p className="text-sm text-muted-foreground pt-2">
            Frameworks for understanding consciousness, intention, and
            psychological transformation. Presented as belief systems and mental
            models.
          </p>
        </div>

        {beliefLoading && (
          <div className="space-y-2">
            {["b-1", "b-2", "b-3", "b-4", "b-5", "b-6"].map((k) => (
              <Skeleton key={k} className="h-16 rounded-xl" />
            ))}
          </div>
        )}

        {beliefError && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">
              Failed to load belief system data. Please refresh the page.
            </p>
          </div>
        )}

        {beliefSystems && (
          <Accordion type="multiple" className="space-y-0">
            {beliefSystems.map((system, i) => (
              <motion.div
                key={system.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <BeliefSystemCard system={system} index={i} />
              </motion.div>
            ))}
          </Accordion>
        )}
      </motion.section>
    </div>
  );
}
