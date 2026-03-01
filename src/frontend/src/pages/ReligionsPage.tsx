import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Search, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

interface Religion {
  name: string;
  symbol: string;
  category:
    | "Abrahamic"
    | "Eastern"
    | "Indigenous & Shamanic"
    | "New Age & Esoteric";
  overview: string;
  coreBeliefs: string[];
  sacredTexts: string[];
  keyFigures: string[];
  affirmationThemes: string[];
}

const RELIGIONS: Religion[] = [
  // Abrahamic
  {
    name: "Christianity",
    symbol: "✝️",
    category: "Abrahamic",
    overview:
      "Christianity is a monotheistic faith centered on the life, teachings, and resurrection of Jesus Christ. It emphasizes love, redemption, and eternal salvation through faith. With over 2 billion adherents, it is the world's largest religion.",
    coreBeliefs: [
      "Salvation through Christ",
      "Trinity (Father, Son, Holy Spirit)",
      "Resurrection and eternal life",
      "Love and forgiveness",
    ],
    sacredTexts: ["The Holy Bible", "New Testament", "Old Testament"],
    keyFigures: ["Jesus Christ", "Virgin Mary", "Saint Paul", "The Apostles"],
    affirmationThemes: ["faith", "divine love", "inner peace", "redemption"],
  },
  {
    name: "Islam",
    symbol: "☪️",
    category: "Abrahamic",
    overview:
      "Islam is a monotheistic Abrahamic religion founded by the Prophet Muhammad in 7th-century Arabia. Its followers, called Muslims, submit to the will of Allah (God) as revealed in the Quran. Islam emphasizes prayer, charity, and community.",
    coreBeliefs: [
      "Tawhid (oneness of God)",
      "Five Pillars of Islam",
      "Prophethood of Muhammad",
      "Day of Judgment",
    ],
    sacredTexts: ["The Quran", "Hadith (sayings of Muhammad)", "Sunnah"],
    keyFigures: [
      "Prophet Muhammad",
      "Allah",
      "Ibrahim (Abraham)",
      "Isa (Jesus)",
      "Musa (Moses)",
    ],
    affirmationThemes: [
      "surrender",
      "divine will",
      "community",
      "spiritual discipline",
    ],
  },
  {
    name: "Judaism",
    symbol: "✡️",
    category: "Abrahamic",
    overview:
      "Judaism is one of the oldest monotheistic religions, tracing its roots to the covenant between God and Abraham. It centers on the Torah and the Talmud, emphasizing ethical conduct, study, and connection to the divine. Judaism is the foundation of both Christianity and Islam.",
    coreBeliefs: [
      "Covenant with God",
      "Torah as divine law",
      "Tikkun Olam (repair of the world)",
      "Messianic hope",
    ],
    sacredTexts: [
      "Torah (Five Books of Moses)",
      "Talmud",
      "Tanakh",
      "Kabbalah",
    ],
    keyFigures: ["Abraham", "Moses", "David", "Solomon", "The Prophets"],
    affirmationThemes: ["wisdom", "covenant", "justice", "divine guidance"],
  },
  {
    name: "Gnosticism",
    symbol: "🔯",
    category: "Abrahamic",
    overview:
      "Gnosticism is an ancient esoteric tradition emphasizing direct personal knowledge (gnosis) of the divine. It views the material world as a creation of a lesser deity (Demiurge) and teaches that the soul can transcend to higher realms through inner illumination. Gnosticism heavily influenced early Christian and Hermetic thought.",
    coreBeliefs: [
      "Gnosis (direct divine knowledge)",
      "Soul's transcendence beyond the material world",
      "Hidden divine spark within each being",
      "Duality of material and spiritual",
    ],
    sacredTexts: ["Nag Hammadi Library", "Gospel of Thomas", "Pistis Sophia"],
    keyFigures: [
      "Sophia (divine wisdom)",
      "The Demiurge",
      "Valentinus",
      "Simon Magus",
    ],
    affirmationThemes: [
      "inner illumination",
      "hidden wisdom",
      "spiritual transcendence",
      "divine spark",
    ],
  },
  // Eastern
  {
    name: "Hinduism",
    symbol: "🕉️",
    category: "Eastern",
    overview:
      "Hinduism is one of the world's oldest religions, originating in ancient India. It encompasses a vast diversity of beliefs, rituals, and philosophies centered on dharma (right conduct), karma (cause and effect), and moksha (liberation). Hinduism venerates a vast pantheon of deities representing different aspects of the ultimate divine reality, Brahman.",
    coreBeliefs: [
      "Brahman (ultimate reality)",
      "Dharma, Karma, Samsara",
      "Moksha (liberation)",
      "Atman (individual soul)",
    ],
    sacredTexts: [
      "Vedas",
      "Upanishads",
      "Bhagavad Gita",
      "Ramayana",
      "Mahabharata",
    ],
    keyFigures: ["Brahma", "Vishnu", "Shiva", "Devi/Shakti", "Krishna", "Rama"],
    affirmationThemes: [
      "dharma",
      "spiritual liberation",
      "cosmic harmony",
      "divine consciousness",
    ],
  },
  {
    name: "Buddhism",
    symbol: "☸️",
    category: "Eastern",
    overview:
      "Buddhism was founded by Siddhartha Gautama (the Buddha) in ancient India around the 5th century BCE. It teaches that suffering arises from attachment and craving, and that liberation is achieved through the Noble Eightfold Path, mindfulness, and compassion. Buddhism has numerous branches including Theravada, Mahayana, and Vajrayana.",
    coreBeliefs: [
      "Four Noble Truths",
      "Noble Eightfold Path",
      "Impermanence (Anicca)",
      "Nirvana (liberation from suffering)",
    ],
    sacredTexts: [
      "Tripitaka (Pali Canon)",
      "Dhammapada",
      "Heart Sutra",
      "Lotus Sutra",
    ],
    keyFigures: [
      "Siddhartha Gautama (Buddha)",
      "Bodhisattvas",
      "Avalokitesvara",
      "Manjushri",
    ],
    affirmationThemes: [
      "mindfulness",
      "compassion",
      "inner peace",
      "liberation",
    ],
  },
  {
    name: "Taoism",
    symbol: "☯️",
    category: "Eastern",
    overview:
      "Taoism (Daoism) is a Chinese philosophical and religious tradition emphasizing living in harmony with the Tao (The Way), the fundamental nature of the universe. It values simplicity, naturalness, and non-action (wu wei). Taoism integrates cosmology, ethics, and practical spiritual cultivation.",
    coreBeliefs: [
      "The Tao as the source of all things",
      "Wu Wei (non-action/effortless flow)",
      "Yin-Yang balance",
      "Harmony with nature",
    ],
    sacredTexts: ["Tao Te Ching (Laozi)", "Zhuangzi", "I Ching"],
    keyFigures: ["Laozi (Lao-Tzu)", "Zhuangzi", "The Eight Immortals"],
    affirmationThemes: [
      "flow",
      "balance",
      "natural harmony",
      "effortless being",
    ],
  },
  {
    name: "Shinto",
    symbol: "⛩️",
    category: "Eastern",
    overview:
      "Shinto is the indigenous religion of Japan, centered on the veneration of kami — divine spirits present in nature, ancestors, and sacred places. It emphasizes purity, ritual practice, and gratitude. Shinto has no single founder, scripture, or formal doctrine, existing as a living spiritual tradition.",
    coreBeliefs: [
      "Kami (divine spirits in nature)",
      "Purity and purification rituals",
      "Ancestor reverence",
      "Sacred connection to the land",
    ],
    sacredTexts: ["Kojiki (Record of Ancient Matters)", "Nihon Shoki"],
    keyFigures: [
      "Amaterasu (Sun Goddess)",
      "Izanagi and Izanami",
      "Susanoo",
      "The Emperor as divine descendant",
    ],
    affirmationThemes: [
      "purity",
      "gratitude",
      "sacred presence",
      "ancestral connection",
    ],
  },
  {
    name: "Sikhism",
    symbol: "🪯",
    category: "Eastern",
    overview:
      "Sikhism was founded by Guru Nanak in 15th-century Punjab, India. It teaches devotion to one God (Waheguru), equality of all humans, service to others (seva), and meditation on the divine name. The Guru Granth Sahib serves as the eternal living Guru and supreme spiritual authority.",
    coreBeliefs: [
      "Ik Onkar (One God)",
      "Seva (selfless service)",
      "Simran (meditation on God's name)",
      "Equality of all beings",
    ],
    sacredTexts: ["Guru Granth Sahib", "Dasam Granth"],
    keyFigures: ["Guru Nanak", "Ten Sikh Gurus", "Waheguru (God)"],
    affirmationThemes: ["service", "equality", "devotion", "divine grace"],
  },
  {
    name: "Zoroastrianism",
    symbol: "🔥",
    category: "Eastern",
    overview:
      "Zoroastrianism is one of the world's oldest monotheistic religions, founded by the prophet Zarathustra in ancient Persia. It centers on the cosmic struggle between Ahura Mazda (the supreme deity of light and truth) and Angra Mainyu (the destructive spirit). Zoroastrianism profoundly influenced Judaism, Christianity, and Islam.",
    coreBeliefs: [
      "Ahura Mazda as supreme creator",
      "Good thoughts, good words, good deeds",
      "Cosmic dualism of light and dark",
      "Final renovation of the world",
    ],
    sacredTexts: ["Avesta", "Gathas (hymns of Zarathustra)", "Yasna"],
    keyFigures: [
      "Zarathustra (Zoroaster)",
      "Ahura Mazda",
      "Amesha Spentas (divine emanations)",
    ],
    affirmationThemes: ["truth", "light", "righteousness", "spiritual clarity"],
  },
  // Indigenous & Shamanic
  {
    name: "Shamanism",
    symbol: "🥁",
    category: "Indigenous & Shamanic",
    overview:
      "Shamanism is one of humanity's oldest spiritual practices, found across cultures worldwide. The shaman acts as an intermediary between the physical and spirit worlds through altered states of consciousness, drumming, and ritual. Shamanism emphasizes healing, nature connection, and soul journeys.",
    coreBeliefs: [
      "Interconnectedness of all life",
      "Spirit world and soul journeys",
      "Healing through spiritual intervention",
      "Animal spirits as guides",
    ],
    sacredTexts: [
      "Oral traditions and songs",
      "Rituals passed through lineages",
    ],
    keyFigures: [
      "Animal spirit guides",
      "Ancestor spirits",
      "Nature deities",
      "Plant spirits",
    ],
    affirmationThemes: [
      "healing",
      "nature connection",
      "spirit guidance",
      "inner journeys",
    ],
  },
  {
    name: "African Traditional Religion",
    symbol: "🌍",
    category: "Indigenous & Shamanic",
    overview:
      "African Traditional Religions encompass thousands of indigenous spiritual systems across the African continent. They honor a supreme creator deity, ancestral spirits, and nature forces. Practices vary widely by region but share themes of community, ancestors, and living in harmony with the spiritual world.",
    coreBeliefs: [
      "Supreme creator deity",
      "Ancestor veneration and communication",
      "Sacred community and family bonds",
      "Nature spirits and elemental forces",
    ],
    sacredTexts: ["Oral traditions, proverbs, and sacred stories"],
    keyFigures: [
      "Orishas (Yoruba divine beings)",
      "Ancestor spirits",
      "Anansi (spider wisdom)",
      "Oshun, Shango, Yemoja",
    ],
    affirmationThemes: [
      "ancestral wisdom",
      "community strength",
      "natural forces",
      "spiritual heritage",
    ],
  },
  {
    name: "Native American Spirituality",
    symbol: "🦅",
    category: "Indigenous & Shamanic",
    overview:
      "Native American spirituality encompasses hundreds of distinct tribal traditions across North America. Common themes include reverence for the Earth as a living mother, the importance of vision quests and ceremonies, communication with spirit guides, and maintaining balance with the natural world.",
    coreBeliefs: [
      "Earth as sacred living mother",
      "Vision quests and spiritual rites of passage",
      "Medicine wheel and four directions",
      "All living beings as relatives",
    ],
    sacredTexts: ["Oral traditions, songs, and ceremonies"],
    keyFigures: [
      "Great Spirit / Wakan Tanka",
      "Animal totems and spirit guides",
      "Trickster spirits (Coyote, Raven)",
      "Medicine men/women",
    ],
    affirmationThemes: [
      "earth connection",
      "vision",
      "sacred balance",
      "honoring all life",
    ],
  },
  // New Age & Esoteric
  {
    name: "Wicca",
    symbol: "🌙",
    category: "New Age & Esoteric",
    overview:
      "Wicca is a modern pagan religion developed in the 20th century, drawing from ancient nature-based traditions. It honors the Triple Goddess and the Horned God, celebrates the cycles of nature through eight sabbats, and incorporates magical practice through intention, ritual, and energy work.",
    coreBeliefs: [
      "Threefold law (what you send returns threefold)",
      "Goddess and God as dual divine principles",
      "Magic as intentional energy direction",
      "Harmony with nature's cycles",
    ],
    sacredTexts: [
      "Book of Shadows (personal grimoire)",
      "The Charge of the Goddess",
      "Doreen Valiente's works",
      "Gerald Gardner's writings",
    ],
    keyFigures: [
      "The Triple Goddess (Maiden, Mother, Crone)",
      "The Horned God",
      "Gerald Gardner",
      "Doreen Valiente",
    ],
    affirmationThemes: [
      "magic",
      "sacred cycles",
      "intentional manifestation",
      "divine feminine",
    ],
  },
  {
    name: "Hermeticism",
    symbol: "🐍",
    category: "New Age & Esoteric",
    overview:
      "Hermeticism is an ancient philosophical and spiritual tradition attributed to Hermes Trismegistus. Its core teachings, expressed in the Hermetic Corpus, explore the nature of the divine, the universe, and the human soul. The famous maxim 'As above, so below' captures its emphasis on cosmic correspondence and inner transformation.",
    coreBeliefs: [
      "Seven Hermetic Principles",
      "As above, so below (correspondence)",
      "Mind as the foundation of reality",
      "Alchemy as spiritual transformation",
    ],
    sacredTexts: [
      "Corpus Hermeticum",
      "Emerald Tablet",
      "Kybalion",
      "Book of Thoth",
    ],
    keyFigures: [
      "Hermes Trismegistus",
      "Mercury/Thoth",
      "Paracelsus",
      "Aleister Crowley",
    ],
    affirmationThemes: [
      "universal law",
      "mental mastery",
      "spiritual alchemy",
      "inner transformation",
    ],
  },
  {
    name: "Theosophy",
    symbol: "🌟",
    category: "New Age & Esoteric",
    overview:
      "Theosophy is a spiritual movement founded by Helena Blavatsky in 1875, synthesizing Eastern and Western esoteric traditions. It teaches that all religions contain a common esoteric core, that the universe is guided by divine intelligences, and that humanity evolves through cycles of reincarnation toward spiritual perfection.",
    coreBeliefs: [
      "Universal brotherhood of humanity",
      "Hidden divine wisdom in all religions",
      "Spiritual evolution through reincarnation",
      "Seven planes of existence",
    ],
    sacredTexts: [
      "The Secret Doctrine (Blavatsky)",
      "Isis Unveiled",
      "The Voice of the Silence",
    ],
    keyFigures: [
      "Helena Blavatsky",
      "Colonel Henry Olcott",
      "Annie Besant",
      "Ascended Masters",
    ],
    affirmationThemes: [
      "universal wisdom",
      "spiritual evolution",
      "divine brotherhood",
      "hidden truth",
    ],
  },
  {
    name: "Kabbalah",
    symbol: "🔷",
    category: "New Age & Esoteric",
    overview:
      "Kabbalah is the mystical tradition within Judaism exploring the hidden nature of God, the universe, and the human soul. Its central diagram, the Tree of Life (Sefirot), maps ten divine emanations through which the infinite enters creation. Kabbalah has influenced Western occultism, Hermeticism, and New Age spirituality.",
    coreBeliefs: [
      "Ein Sof (infinite divine source)",
      "Ten Sefirot as divine emanations",
      "Tree of Life as map of existence",
      "Gematria (sacred numerology)",
    ],
    sacredTexts: [
      "Zohar (Book of Splendor)",
      "Sefer Yetzirah (Book of Formation)",
      "Torah",
      "Tanya",
    ],
    keyFigures: [
      "Rabbi Shimon bar Yochai",
      "Isaac Luria (the Ari)",
      "Moses de León",
      "The Archangels of the Sefirot",
    ],
    affirmationThemes: [
      "divine wisdom",
      "sacred structure",
      "mystical ascent",
      "light of creation",
    ],
  },
];

const CATEGORY_COLORS: Record<Religion["category"], string> = {
  Abrahamic: "oklch(0.65 0.2 220)",
  Eastern: "oklch(0.68 0.2 30)",
  "Indigenous & Shamanic": "oklch(0.62 0.2 145)",
  "New Age & Esoteric": "oklch(0.62 0.22 295)",
};

const CATEGORIES = [
  "All",
  "Abrahamic",
  "Eastern",
  "Indigenous & Shamanic",
  "New Age & Esoteric",
] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

interface ReligionsPageProps {
  onUseForSubliminal: (topic: string) => void;
}

export default function ReligionsPage({
  onUseForSubliminal,
}: ReligionsPageProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return RELIGIONS.filter((r) => {
      const matchesSearch =
        search === "" ||
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.overview.toLowerCase().includes(search.toLowerCase()) ||
        r.affirmationThemes.some((t) =>
          t.toLowerCase().includes(search.toLowerCase()),
        );
      const matchesCategory =
        activeCategory === "All" || r.category === activeCategory;
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
            <Globe className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl font-bold gradient-text">
          World Religions
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          An encyclopedic reference to humanity's spiritual traditions — from
          ancient monotheisms to modern esoteric paths. Use any tradition's
          energy as the foundation for your subliminal.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge
            className="text-xs font-mono"
            style={{
              background: "oklch(0.62 0.22 295 / 0.2)",
              color: "oklch(0.62 0.22 295)",
              border: "1px solid oklch(0.62 0.22 295 / 0.4)",
            }}
          >
            {RELIGIONS.length} Traditions
          </Badge>
          <Badge
            className="text-xs font-mono"
            style={{
              background: "oklch(0.68 0.2 30 / 0.2)",
              color: "oklch(0.68 0.2 30)",
              border: "1px solid oklch(0.68 0.2 30 / 0.4)",
            }}
          >
            4 Categories
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search religions, beliefs, themes..."
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
                : CATEGORY_COLORS[cat as Religion["category"]];
            return (
              <button
                key={cat}
                type="button"
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
          Showing {filtered.length} of {RELIGIONS.length} traditions
        </p>
      )}

      {/* Religion Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {filtered.map((religion, idx) => {
            const color = CATEGORY_COLORS[religion.category];
            const isExpanded = expandedId === religion.name;
            return (
              <motion.div
                key={religion.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="rounded-2xl border bg-secondary/20 overflow-hidden"
                style={{ borderColor: `${color}30` }}
              >
                {/* Header row */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : religion.name)
                  }
                  className="w-full text-left p-3 sm:p-5 flex items-start justify-between gap-3 sm:gap-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <span className="text-2xl sm:text-3xl shrink-0">
                      {religion.symbol}
                    </span>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className="font-heading text-base sm:text-lg font-bold"
                          style={{ color }}
                        >
                          {religion.name}
                        </h3>
                        <Badge
                          className="text-xs"
                          style={{
                            background: `${color}20`,
                            color,
                            border: `1px solid ${color}40`,
                          }}
                        >
                          {religion.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-1">
                        {religion.overview.split(".")[0]}.
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
                          {religion.overview}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                              Core Beliefs
                            </h4>
                            <ul className="space-y-1">
                              {religion.coreBeliefs.map((b) => (
                                <li
                                  key={b}
                                  className="text-xs text-foreground/80 flex items-start gap-2"
                                >
                                  <span style={{ color }} className="mt-0.5">
                                    •
                                  </span>
                                  {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                              Sacred Texts
                            </h4>
                            <ul className="space-y-1">
                              {religion.sacredTexts.map((t) => (
                                <li
                                  key={t}
                                  className="text-xs text-foreground/80 flex items-start gap-2"
                                >
                                  <span style={{ color }} className="mt-0.5">
                                    •
                                  </span>
                                  {t}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                              Key Figures
                            </h4>
                            <ul className="space-y-1">
                              {religion.keyFigures.map((f) => (
                                <li
                                  key={f}
                                  className="text-xs text-foreground/80 flex items-start gap-2"
                                >
                                  <span style={{ color }} className="mt-0.5">
                                    •
                                  </span>
                                  {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-muted-foreground">
                              Affirmation themes:
                            </span>
                            {religion.affirmationThemes.map((theme) => (
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
                          <Button
                            size="sm"
                            onClick={() =>
                              onUseForSubliminal(
                                `${religion.name} spiritual energy and divine connection`,
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
                            Use for Subliminal
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
            className="text-center py-16 space-y-3"
          >
            <Globe className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">
              No traditions found for &quot;{search}&quot;
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
