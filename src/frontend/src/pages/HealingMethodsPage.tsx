import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Search, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

type HealingCategory =
  | "Emotional & Psychological"
  | "Divine Energy"
  | "Energy & Chakra"
  | "Sound & Frequency"
  | "Spiritual Lineage";

interface HealingMethod {
  name: string;
  symbol: string;
  category: HealingCategory;
  description: string;
  overview: string;
  themes: string[];
  keyPractices: string[];
  affirmations: string[];
}

const HEALING_METHODS: HealingMethod[] = [
  // Emotional & Psychological
  {
    name: "Inner Child Healing",
    symbol: "🧒",
    category: "Emotional & Psychological",
    description:
      "Reconnect with the wounded inner child through reparenting, compassion, and emotional safety.",
    overview:
      "Inner Child Healing is a psychological and spiritual practice centered on reconnecting with the younger, wounded part of yourself that formed during childhood experiences. By acknowledging unmet needs, healing old wounds, and reparenting the inner child with compassion and safety, profound transformation occurs at the emotional and identity level. This work integrates play, nurturing, boundaries, and self-trust to restore wholeness.",
    themes: [
      "Safety",
      "Self-compassion",
      "Play & Joy",
      "Nurturing",
      "Trust",
      "Emotional Safety",
    ],
    keyPractices: [
      "Mirror work and loving self-dialogue",
      "Inner child journaling and letters",
      "Reparenting through daily rituals",
      "Somatic movement and play",
      "Visualization of healing the younger self",
      "Setting boundaries from self-love",
    ],
    affirmations: [
      "I am safe to be myself",
      "I nurture my inner child with love and gentleness",
      "My inner child is healed, free, and joyful",
      "I give myself the love I always deserved",
      "It is safe to feel and express all my emotions",
      "I reparent myself with infinite compassion",
    ],
  },
  {
    name: "Shadow Work",
    symbol: "🌑",
    category: "Emotional & Psychological",
    description:
      "Jungian integration of the unconscious shadow self for wholeness, power, and authentic self-expression.",
    overview:
      "Shadow Work is a Jungian psychological practice of confronting and integrating the unconscious 'shadow' — the parts of ourselves we have denied, repressed, or projected onto others. Rather than fighting darkness within, shadow work invites radical acceptance and integration, transforming what was once hidden into a source of immense personal power. True wholeness comes from welcoming all aspects of the self.",
    themes: [
      "Acceptance",
      "Integration",
      "Self-honesty",
      "Reclaiming Power",
      "Authenticity",
      "Wholeness",
    ],
    keyPractices: [
      "Journaling about triggers and projections",
      "Active imagination and inner dialogue",
      "Dream analysis and symbolism",
      "Exploring childhood shame and suppression",
      "Reclaiming disowned traits and desires",
      "Alchemy of darkness into strength",
    ],
    affirmations: [
      "I embrace all parts of myself with love",
      "My shadow is a source of wisdom and strength",
      "I integrate my darkness with grace and power",
      "Every part of me belongs and is welcome",
      "I reclaim the power I have given away",
      "My wholeness includes all of my shadows",
    ],
  },
  {
    name: "Somatic Healing",
    symbol: "🌿",
    category: "Emotional & Psychological",
    description:
      "Body-centered trauma release through nervous system regulation, movement, and embodied awareness.",
    overview:
      "Somatic Healing recognizes that trauma is stored not just in the mind but in the physical body — in the muscles, fascia, nervous system, and cellular memory. Approaches like Somatic Experiencing (Peter Levine), TRE (Tension and Trauma Releasing Exercises), and Sensorimotor Psychotherapy guide practitioners to gently discharge stored stress and reset the nervous system. The body becomes the gateway to deep emotional release and restoration.",
    themes: [
      "Body Awareness",
      "Trauma Release",
      "Grounding",
      "Nervous System Regulation",
      "Embodiment",
      "Cellular Healing",
    ],
    keyPractices: [
      "TRE (Tension & Trauma Releasing Exercises)",
      "Somatic Experiencing sessions",
      "Grounding practices and earthing",
      "Breath-body connection work",
      "Intentional shaking and tremoring",
      "Body scan meditation and tracking",
    ],
    affirmations: [
      "My body is safe to feel everything",
      "I release stored tension from every cell with ease",
      "My nervous system is calm, regulated, and at peace",
      "I am fully at home in my body",
      "My body holds profound wisdom and healing",
      "Trauma releases gently and completely from my being",
    ],
  },
  // Divine Energy
  {
    name: "Divine Feminine",
    symbol: "🌸",
    category: "Divine Energy",
    description:
      "Embodying goddess archetypes, healing the feminine wound, and awakening intuition, creation, and flow.",
    overview:
      "The Divine Feminine is the sacred, receptive, creative, and intuitive principle that exists within all beings regardless of gender. Healing the Divine Feminine means releasing patriarchal conditioning, shame around the body and emotions, and ancestral feminine wounds. The archetypes of the Maiden (new beginnings), Mother (creation and nurturing), Wild Woman (instinct and freedom), and Crone (wisdom and death/rebirth) guide this journey back to wholeness.",
    themes: [
      "Receptivity",
      "Intuition",
      "Creativity",
      "Cyclical Nature",
      "Goddess Energy",
      "Feminine Wisdom",
      "Flow",
    ],
    keyPractices: [
      "Moon cycle rituals and lunar tracking",
      "Goddess archetype embodiment",
      "Womb healing and feminine ceremony",
      "Sensual movement and dance",
      "Feminine lineage healing",
      "Softening and surrender practices",
    ],
    affirmations: [
      "I am the embodiment of divine feminine power",
      "My intuition is my greatest guide and gift",
      "I flow effortlessly with the cycles of life",
      "My creative power is boundless and sacred",
      "I honor the goddess within and around me",
      "My femininity is a source of immense strength",
    ],
  },
  {
    name: "Divine Masculine",
    symbol: "⚡",
    category: "Divine Energy",
    description:
      "Healing the masculine wound through divine warrior, king, and sage archetypes — integrity, action, and sacred strength.",
    overview:
      "The Divine Masculine represents the active, protective, purposeful, and structuring principle that exists within all beings. Healing the Divine Masculine means moving beyond toxic or wounded expressions of masculinity toward true sovereignty, integrity, and purpose. The archetypes of the Warrior (courageous action), King (wise leadership), Sage (discernment and truth), and Lover (passionate presence) illuminate the path toward whole and sacred masculine expression.",
    themes: [
      "Integrity",
      "Protection",
      "Purpose",
      "Accountability",
      "Divine Strength",
      "Sovereignty",
      "Sacred Action",
    ],
    keyPractices: [
      "Purpose-clarity rituals and vision work",
      "Physical discipline and embodied action",
      "King archetype meditations",
      "Accountability and integrity practices",
      "Warrior breathwork and cold exposure",
      "Mentorship and lineage honoring",
    ],
    affirmations: [
      "I embody divine masculine strength and grace",
      "I act with integrity, purpose, and unwavering power",
      "I protect what I love with clarity and presence",
      "My word is sacred and I honor every commitment",
      "I lead from wisdom, love, and inner sovereignty",
      "The divine masculine moves fully through me",
    ],
  },
  // Energy & Chakra
  {
    name: "Chakra Healing",
    symbol: "🔮",
    category: "Energy & Chakra",
    description:
      "Working with the 7 primary chakras to remove energetic blockages, restore flow, and achieve full-body alignment.",
    overview:
      "Chakra Healing works with the seven major energy centers of the subtle body, each governing different physical, emotional, and spiritual aspects of being. When chakras become blocked or imbalanced, it manifests as mental, emotional, or physical distress. Practices of visualization, sound, breathwork, crystals, yoga, and meditation restore flow and alignment through the entire energetic system — from the grounding Root to the divine Crown.",
    themes: [
      "Energy Flow",
      "Balance",
      "Alignment",
      "Vitality",
      "Subtle Body",
      "Kundalini Awakening",
    ],
    keyPractices: [
      "Chakra-specific meditation and visualization",
      "Solfeggio frequencies for each center",
      "Yoga poses targeting each chakra",
      "Crystal placement on energy centers",
      "Affirmation work per chakra",
      "Kundalini activation practices",
    ],
    affirmations: [
      "My chakras are balanced, clear, and fully aligned",
      "Energy flows freely and powerfully through my entire being",
      "I am a radiant column of light from root to crown",
      "Each energy center within me vibrates in perfect harmony",
      "My life force is abundant, vital, and unstoppable",
      "I am completely aligned with universal energy",
    ],
  },
  {
    name: "Reiki Healing",
    symbol: "✨",
    category: "Energy & Chakra",
    description:
      "Japanese universal life force healing system channeling divine energy through intention and sacred hand positions.",
    overview:
      "Reiki is a Japanese energy healing system rediscovered by Mikao Usui in the early 20th century, rooted in the principle that universal life force energy (Ki) can be channeled through the practitioner to support healing. The Three Degrees (Shoden, Okuden, Shinpiden) progressively deepen the practitioner's connection to this energy. The Five Reiki Principles — Just for today, do not anger, do not worry, be grateful, work diligently, be kind to all beings — form the ethical foundation of Reiki practice.",
    themes: [
      "Universal Life Force",
      "Channeling",
      "Intention",
      "Relaxation",
      "Energy Transfer",
      "Self-Healing",
    ],
    keyPractices: [
      "Self-Reiki hand positions (12-position system)",
      "Distant healing techniques (Okuden)",
      "Reiki symbols and sacred activations",
      "Attunement ceremonies",
      "Five Reiki Principles daily practice",
      "Intention-setting before sessions",
    ],
    affirmations: [
      "I channel healing energy with ease and precision",
      "Universal life force flows through me in abundance",
      "I am a clear and powerful conduit for divine healing",
      "Reiki energy heals every layer of my being",
      "I release all that no longer serves my highest good",
      "My hands carry the frequency of love and healing",
    ],
  },
  {
    name: "Crystal Healing",
    symbol: "💎",
    category: "Energy & Chakra",
    description:
      "Using gemstones' unique vibrational frequencies to influence energetic fields, amplify intentions, and restore balance.",
    overview:
      "Crystal Healing works on the principle that each crystal or gemstone carries a unique vibrational frequency that interacts with the human energy field. Different stones resonate with specific chakras and intentions: Amethyst for the Crown (spiritual connection), Lapis Lazuli for the Third Eye (intuition), Sodalite for the Throat (expression), Rose Quartz for the Heart (love), Citrine for the Solar Plexus (power), Carnelian for the Sacral (creativity), and Obsidian for the Root (grounding). Crystal grids amplify these energies exponentially.",
    themes: [
      "Resonance",
      "Amplification",
      "Protection",
      "Grounding",
      "Vibrational Medicine",
      "Sacred Geometry",
    ],
    keyPractices: [
      "Crystal grid creation and activation",
      "Chakra stone placement during meditation",
      "Crystal water infusion (indirect method)",
      "Carrying or wearing attuned crystals",
      "Moon charging and solar cleansing",
      "Dowsing and pendulum work with crystals",
    ],
    affirmations: [
      "I am deeply attuned to the healing power of crystals",
      "My energy field is clear, protected, and radiant",
      "Crystals amplify my intentions into physical reality",
      "I am in perfect resonance with the Earth's healing frequencies",
      "Sacred stones support my transformation and evolution",
      "I am grounded, protected, and energetically sovereign",
    ],
  },
  // Sound & Frequency
  {
    name: "Sound Healing",
    symbol: "🔔",
    category: "Sound & Frequency",
    description:
      "Using vibration and frequency through Tibetan bowls, gongs, tuning forks, and solfeggio tones for cellular and energetic healing.",
    overview:
      "Sound Healing is one of the oldest healing modalities known to humanity, used across cultures through drumming, chanting, singing bowls, and sacred instruments. Modern sound healing utilizes Tibetan singing bowls, crystal bowls, gongs, tuning forks, and solfeggio frequencies to entrain brainwaves, reduce stress hormones, clear energetic blockages, and support cellular repair. The principle of resonance means that healing frequencies literally reorganize the body's vibrational patterns toward coherence and health.",
    themes: [
      "Resonance",
      "Entrainment",
      "Cellular Healing",
      "Vibrational Alignment",
      "Brainwave States",
      "Sacred Sound",
    ],
    keyPractices: [
      "Tibetan singing bowl meditation",
      "Crystal bowl sound baths",
      "Gong immersion ceremonies",
      "Tuning fork therapy on meridian points",
      "Binaural beat entrainment",
      "Mantra and sacred chanting",
    ],
    affirmations: [
      "Sound heals every cell of my being",
      "I am in perfect vibrational harmony with all of life",
      "My body responds to healing frequencies with ease",
      "Every sound I emit and receive carries divine healing",
      "I am aligned with the healing vibration of the universe",
      "Sacred sound restores me to perfect wholeness",
    ],
  },
  {
    name: "Breathwork",
    symbol: "🌬️",
    category: "Sound & Frequency",
    description:
      "Conscious breathing techniques activating life force, releasing stored emotions, and expanding states of consciousness.",
    overview:
      "Breathwork encompasses a wide range of conscious breathing techniques used for healing, emotional release, spiritual expansion, and nervous system regulation. Pranayama (yogic breath control), Holotropic Breathwork (Stanislav Grof), Box Breathing, Wim Hof Method, and Rebirthing Breathwork each access different aspects of the mind-body system. The breath is the only autonomic function we can consciously control, making it a direct bridge between the unconscious and conscious self.",
    themes: [
      "Life Force Activation",
      "Emotional Release",
      "Oxygenation",
      "Presence",
      "Consciousness Expansion",
      "Nervous System Reset",
    ],
    keyPractices: [
      "Holotropic Breathwork sessions",
      "Pranayama — Nadi Shodhana (alternate nostril)",
      "Wim Hof Method (round breathing + cold)",
      "Box Breathing for nervous system regulation",
      "Rebirthing circular breath",
      "4-7-8 relaxation breath technique",
    ],
    affirmations: [
      "Each breath fills me with pure healing energy",
      "I breathe in unlimited life and breathe out all limitation",
      "My breath is a sacred portal to my deepest healing",
      "With every inhale I expand, with every exhale I release",
      "My breath connects me to the infinite source of life",
      "I am fully alive, fully present, fully free",
    ],
  },
  // Spiritual Lineage
  {
    name: "Ancestral Healing",
    symbol: "🌳",
    category: "Spiritual Lineage",
    description:
      "Clearing inherited trauma and patterns through lineage work, epigenetics, and ancestral blessing ceremonies.",
    overview:
      "Ancestral Healing recognizes that we carry not only the genetic code but the emotional wounds, beliefs, survival patterns, and unresolved traumas of our ancestors in our bodies and nervous systems — a phenomenon supported by epigenetic research. By intentionally working with the ancestral field through ceremony, prayer, constellation work (Bert Hellinger's Family Constellations), and somatic practices, we can break generational cycles, receive ancestral wisdom, and transmit healing backward and forward through the lineage.",
    themes: [
      "Lineage Clearing",
      "Generational Cycles",
      "Ancestral Wisdom",
      "Epigenetics",
      "Continuation",
      "Family Constellations",
    ],
    keyPractices: [
      "Family constellation therapy",
      "Ancestral altar creation and offerings",
      "Lineage prayer and ceremony",
      "Epigenetic reprogramming techniques",
      "Journaling the ancestral wound",
      "Communicating with ancestor spirits in meditation",
    ],
    affirmations: [
      "I heal the wounds of my ancestors with love and grace",
      "Generational trauma ends with me — I break the cycle now",
      "I carry forward only love, wisdom, and strength",
      "My ancestors support and celebrate my healing",
      "I am the healing my lineage has been waiting for",
      "I honor where I come from while creating something new",
    ],
  },
  {
    name: "Akashic Records",
    symbol: "📖",
    category: "Spiritual Lineage",
    description:
      "Accessing the cosmic library of all souls' experiences for karmic clearing, soul contracts, and past-life healing.",
    overview:
      "The Akashic Records are described in many mystical traditions as the cosmic library or 'Book of Life' — a vibrational record of every soul's journey across all lifetimes, dimensions, and possibilities. Accessing the Records through sacred prayer, meditation, or trained practitioners allows for deep insight into soul purpose, karmic patterns, past-life wounds, and soul contracts. The healing that occurs within the Records can shift deeply embedded patterns that have followed the soul across many incarnations.",
    themes: [
      "Soul Purpose",
      "Karmic Release",
      "Past-Life Healing",
      "Divine Wisdom",
      "Soul Contracts",
      "Timeless Healing",
    ],
    keyPractices: [
      "Akashic Records opening prayer (Linda Howe method)",
      "Past-life regression hypnosis",
      "Soul contract review and release",
      "Karmic pattern identification",
      "Higher self channel journaling",
      "Soul retrieval ceremonies",
    ],
    affirmations: [
      "My Akashic Records are fully open to healing and truth",
      "I release all karmic debt across all timelines with grace",
      "My soul is free, whole, and aligned with its highest purpose",
      "I heal patterns that have followed me across many lifetimes",
      "Divine wisdom flows through every record of my soul",
      "I am complete — past, present, and future aligned as one",
    ],
  },
];

const CATEGORY_COLORS: Record<HealingCategory, string> = {
  "Emotional & Psychological": "oklch(0.65 0.2 350)",
  "Divine Energy": "oklch(0.68 0.2 320)",
  "Energy & Chakra": "oklch(0.62 0.22 295)",
  "Sound & Frequency": "oklch(0.65 0.2 220)",
  "Spiritual Lineage": "oklch(0.62 0.2 145)",
};

const CATEGORIES = [
  "All",
  "Emotional & Psychological",
  "Divine Energy",
  "Energy & Chakra",
  "Sound & Frequency",
  "Spiritual Lineage",
] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const HEALING_CONNECTIONS: Record<
  string,
  { entities: string[]; spells: string[] }
> = {
  "Inner Child Healing": {
    entities: ["Chamuel", "Isis", "The Anima / Animus"],
    spells: ["Healing Transmission", "Cord Cutting", "Mirror Magic"],
  },
  "Shadow Work": {
    entities: ["The Shadow", "Lilith", "Hecate"],
    spells: ["Mirror Magic", "Cord Cutting", "Desire Sigil"],
  },
  "Somatic Healing": {
    entities: ["Raphael", "The Serpent", "Pele"],
    spells: ["Earth Grounding", "Healing Transmission", "Water Ritual"],
  },
  "Divine Feminine": {
    entities: ["Isis", "Freya", "Oshun", "Kali"],
    spells: ["Moon Spell", "Glamour Spell", "Water Ritual"],
  },
  "Divine Masculine": {
    entities: ["Odin", "Thor", "Shiva"],
    spells: ["Fire Spell", "Runic Bind Rune", "Protection Circle"],
  },
  "Chakra Healing": {
    entities: ["Shiva", "Ganesha", "Metatron"],
    spells: ["Chakra Clearing", "Energy Shield", "Healing Transmission"],
  },
  Reiki: {
    entities: ["Raphael", "Metatron", "Michael"],
    spells: ["Healing Transmission", "Aura Cleansing", "Energy Shield"],
  },
  "Crystal Healing": {
    entities: ["Uriel", "Metatron", "Ganesha"],
    spells: ["Talisman Creation", "Chakra Clearing", "Earth Grounding"],
  },
  "Sound Healing": {
    entities: ["Apollo", "Gabriel", "Odin"],
    spells: ["Air Invocation", "Healing Transmission", "Chakra Clearing"],
  },
  Breathwork: {
    entities: ["Gabriel", "Raphael"],
    spells: ["Air Invocation", "Chakra Clearing", "Aura Cleansing"],
  },
  "Ancestral Healing": {
    entities: ["Anubis", "The Morrigan", "Odin"],
    spells: ["Cord Cutting", "Earth Grounding", "Herb Pouch (Mojo Bag)"],
  },
  "Akashic Records": {
    entities: ["Metatron", "Isis", "The Self"],
    spells: ["Sigil Charging", "Invocation", "Talisman Creation"],
  },
};

interface HealingMethodsPageProps {
  onUseForSubliminal: (topic: string) => void;
  onNavigate?: (page: string) => void;
}

export default function HealingMethodsPage({
  onUseForSubliminal,
  onNavigate,
}: HealingMethodsPageProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return HEALING_METHODS.filter((m) => {
      const matchesSearch =
        search === "" ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.description.toLowerCase().includes(search.toLowerCase()) ||
        m.overview.toLowerCase().includes(search.toLowerCase()) ||
        m.themes.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        m.affirmations.some((a) =>
          a.toLowerCase().includes(search.toLowerCase()),
        );
      const matchesCategory =
        activeCategory === "All" || m.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className="container max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center glow-primary">
            <Heart className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl font-bold gradient-text">
          Healing Methods
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          An encyclopedic reference to spiritual, energetic, and psychological
          healing modalities. Use any method's energy as the foundation for your
          subliminal healing journey.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge
            className="text-xs font-mono"
            style={{
              background: "oklch(0.62 0.22 295 / 0.2)",
              color: "oklch(0.62 0.22 295)",
              border: "1px solid oklch(0.62 0.22 295 / 0.4)",
            }}
          >
            {HEALING_METHODS.length} Healing Methods
          </Badge>
          <Badge
            className="text-xs font-mono"
            style={{
              background: "oklch(0.65 0.2 350 / 0.2)",
              color: "oklch(0.65 0.2 350)",
              border: "1px solid oklch(0.65 0.2 350 / 0.4)",
            }}
          >
            {CATEGORIES.length - 1} Categories
          </Badge>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-ocid="healing.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search healing methods, themes, affirmations..."
            className="pl-10 pr-10 bg-secondary/30 border-border/50 focus:border-primary/50"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const color =
              cat === "All"
                ? "oklch(0.62 0.22 295)"
                : CATEGORY_COLORS[cat as HealingCategory];
            return (
              <button
                key={cat}
                type="button"
                data-ocid={`healing.${cat === "All" ? "tab" : cat.toLowerCase().replace(/[^a-z0-9]/g, "_")}.tab`}
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border"
                style={{
                  background: isActive ? `${color}25` : "transparent",
                  borderColor: isActive
                    ? `${color}60`
                    : "oklch(0.3 0.02 260 / 0.5)",
                  color: isActive ? color : "oklch(0.6 0.02 260)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Results count */}
      {search && (
        <p className="text-muted-foreground text-sm">
          Showing {filtered.length} of {HEALING_METHODS.length} healing methods
        </p>
      )}

      {/* Method Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map((method, idx) => {
            const color = CATEGORY_COLORS[method.category];
            const isExpanded = expandedId === method.name;
            return (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                data-ocid={`healing.item.${idx + 1}`}
                className="rounded-2xl border bg-secondary/20 overflow-hidden"
                style={{ borderColor: `${color}30` }}
              >
                {/* Header row */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : method.name)}
                  className="w-full text-left p-3 sm:p-5 flex items-start justify-between gap-3 sm:gap-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className="text-2xl sm:text-3xl shrink-0">
                      {method.symbol}
                    </span>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className="font-heading text-base sm:text-lg font-bold"
                          style={{ color }}
                        >
                          {method.name}
                        </h3>
                        <Badge
                          className="text-xs"
                          style={{
                            background: `${color}20`,
                            color,
                            border: `1px solid ${color}40`,
                          }}
                        >
                          {method.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-1">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground mt-1 shrink-0"
                  >
                    ▼
                  </motion.div>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 sm:px-5 pb-4 sm:pb-5 space-y-4 sm:space-y-5 border-t border-border/30 pt-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {method.overview}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {/* Key Themes */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                              Key Themes
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {method.themes.map((theme) => (
                                <Badge
                                  key={theme}
                                  className="text-xs"
                                  style={{
                                    background: `${color}15`,
                                    color,
                                    border: `1px solid ${color}30`,
                                  }}
                                >
                                  {theme}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Key Practices */}
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                              Key Practices
                            </h4>
                            <ul className="space-y-1">
                              {method.keyPractices.map((practice) => (
                                <li
                                  key={practice}
                                  className="text-xs text-foreground/80 flex items-start gap-2"
                                >
                                  <span
                                    style={{ color }}
                                    className="mt-0.5 shrink-0"
                                  >
                                    •
                                  </span>
                                  {practice}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Affirmations */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Associated Affirmations
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {method.affirmations.map((aff) => (
                              <div
                                key={aff}
                                className="text-xs text-foreground/80 flex items-start gap-2 p-2 rounded-lg"
                                style={{
                                  background: `${color}08`,
                                  border: `1px solid ${color}20`,
                                }}
                              >
                                <span
                                  style={{ color }}
                                  className="mt-0.5 shrink-0"
                                >
                                  ✦
                                </span>
                                <span className="italic">{aff}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Connections */}
                        {(() => {
                          const conn = HEALING_CONNECTIONS[method.name] ?? {
                            entities: ["Raphael", "Metatron"],
                            spells: ["Healing Transmission", "Sigil Charging"],
                          };
                          if (!onNavigate) return null;
                          return (
                            <div className="space-y-2 pt-2 border-t border-border/20">
                              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                ◈ Connections
                              </p>
                              <div className="space-y-1.5">
                                <p
                                  className="text-xs font-semibold uppercase tracking-widest"
                                  style={{
                                    color: "oklch(0.68 0.18 195 / 0.8)",
                                  }}
                                >
                                  👁 Entities
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {conn.entities.map((ent) => (
                                    <button
                                      key={ent}
                                      type="button"
                                      onClick={() => onNavigate("entities")}
                                      className="text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all hover:scale-105"
                                      style={{
                                        background:
                                          "oklch(0.68 0.18 195 / 0.12)",
                                        color: "oklch(0.68 0.18 195)",
                                        border:
                                          "1px solid oklch(0.68 0.18 195 / 0.3)",
                                      }}
                                    >
                                      {ent}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                <p
                                  className="text-xs font-semibold uppercase tracking-widest"
                                  style={{
                                    color: "oklch(0.62 0.22 295 / 0.8)",
                                  }}
                                >
                                  ⚔ Spells
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {conn.spells.map((spell) => (
                                    <button
                                      key={spell}
                                      type="button"
                                      onClick={() => onNavigate("spells")}
                                      className="text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all hover:scale-105"
                                      style={{
                                        background:
                                          "oklch(0.62 0.22 295 / 0.12)",
                                        color: "oklch(0.62 0.22 295)",
                                        border:
                                          "1px solid oklch(0.62 0.22 295 / 0.3)",
                                      }}
                                    >
                                      {spell}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 pt-1">
                          <Button
                            size="sm"
                            data-ocid={`healing.item.${idx + 1}.button`}
                            onClick={() =>
                              onUseForSubliminal(
                                `${method.name}: ${method.description}`,
                              )
                            }
                            className="gap-2 text-xs w-full sm:w-auto"
                            style={{
                              background: `${color}25`,
                              border: `1px solid ${color}60`,
                              color: color,
                            }}
                          >
                            <Sparkles className="w-3 h-3" />
                            Use in Generator
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

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="healing.empty_state"
            className="text-center py-16 space-y-3"
          >
            <Heart className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">
              No healing methods found for &quot;{search}&quot;
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
            >
              Clear filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
