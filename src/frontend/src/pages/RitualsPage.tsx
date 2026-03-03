import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface RitualsPageProps {
  onUseForSubliminal: (topic: string) => void;
  onNavigate?: (page: string) => void;
}

const RITUAL_CONNECTIONS: Record<
  string,
  { entities: string[]; spells: string[] }
> = {
  "New Moon": {
    entities: ["Hecate", "Isis", "Inanna / Ishtar"],
    spells: ["Moon Spell", "Desire Sigil", "Candle Magic"],
  },
  "Full Moon": {
    entities: ["Isis", "Freya", "Hecate"],
    spells: ["Moon Spell", "Abundance Ritual", "Sigil Charging"],
  },
  "Waxing Crescent": {
    entities: ["Freya", "Inanna / Ishtar"],
    spells: ["Moon Spell", "Candle Magic"],
  },
  "First Quarter": {
    entities: ["Michael", "Thor"],
    spells: ["Protection Circle", "Fire Spell"],
  },
  "Waxing Gibbous": {
    entities: ["Isis", "Lakshmi"],
    spells: ["Abundance Ritual", "Sigil Charging"],
  },
  "Disseminating Moon": {
    entities: ["Hermes", "Gabriel"],
    spells: ["Invocation", "Air Invocation"],
  },
  "Third Quarter": {
    entities: ["Kali", "Anubis"],
    spells: ["Cord Cutting", "Binding Spell"],
  },
  "Waning Crescent": {
    entities: ["Hecate", "Lilith"],
    spells: ["Mirror Magic", "Cord Cutting"],
  },
  Samhain: {
    entities: ["The Morrigan", "Anubis", "Hecate"],
    spells: ["Cord Cutting", "Mirror Magic", "Protection Circle"],
  },
  Imbolc: {
    entities: ["Brigid", "Freya"],
    spells: ["Candle Magic", "Abundance Ritual"],
  },
  Beltane: {
    entities: ["Freya", "Cernunnos", "Oshun"],
    spells: ["Glamour Spell", "Abundance Ritual", "Fire Spell"],
  },
  "Litha / Midsummer": {
    entities: ["Ra", "Apollo", "Shango"],
    spells: ["Fire Spell", "Candle Magic", "Planetary Seal"],
  },
  Ostara: {
    entities: ["Freya", "Brigid", "Inanna / Ishtar"],
    spells: ["Abundance Ritual", "Earth Grounding", "Moon Spell"],
  },
  Lammas: {
    entities: ["Cernunnos", "Lakshmi"],
    spells: ["Abundance Ritual", "Earth Grounding"],
  },
  Mabon: {
    entities: ["Anubis", "The Morrigan"],
    spells: ["Cord Cutting", "Earth Grounding"],
  },
  Yule: {
    entities: ["Odin", "Brigid"],
    spells: ["Candle Magic", "Protection Circle", "Runic Bind Rune"],
  },
  "Daily Morning": {
    entities: ["Ra", "Apollo", "Michael"],
    spells: ["Air Invocation", "Candle Magic", "Protection Circle"],
  },
  "Evening Wind Down": {
    entities: ["Hecate", "Isis"],
    spells: ["Moon Spell", "Aura Cleansing"],
  },
  "Weekly Reset": {
    entities: ["Hermes", "Metatron"],
    spells: ["Sigil Charging", "Talisman Creation"],
  },
  "Monthly Inventory": {
    entities: ["Anubis", "Odin"],
    spells: ["Mirror Magic", "Cord Cutting"],
  },
};

// ── Moon Phases ──────────────────────────────────────────────────────────────
interface MoonPhase {
  name: string;
  emoji: string;
  symbolicMeaning: string;
  intentions: string[];
  affirmationThemes: string[];
}

const MOON_PHASES: MoonPhase[] = [
  {
    name: "New Moon",
    emoji: "🌑",
    symbolicMeaning:
      "The New Moon is the dark of the moon — a time of beginnings, potential, and the void before creation. It represents the seed moment before growth, the breath before the word, the idea before form.",
    intentions: [
      "Setting new intentions",
      "Starting new projects",
      "Planting seeds of desire",
      "Entering new chapters",
    ],
    affirmationThemes: [
      "new beginnings",
      "infinite potential",
      "planting seeds",
      "fresh starts",
    ],
  },
  {
    name: "Waxing Crescent",
    emoji: "🌒",
    symbolicMeaning:
      "The first light after darkness, the Waxing Crescent represents hope, faith, and the first evidence that your intention is beginning to stir. It is the time of intention, hope, and early momentum.",
    intentions: [
      "Building momentum",
      "Taking first steps",
      "Nurturing early growth",
      "Strengthening faith in your intention",
    ],
    affirmationThemes: ["momentum", "hope", "first steps", "growing belief"],
  },
  {
    name: "First Quarter",
    emoji: "🌓",
    symbolicMeaning:
      "The half-moon of the First Quarter represents the challenges and decisions that arise when early momentum meets resistance. It is the time to act decisively, push through obstacles, and commit to the path chosen at the New Moon.",
    intentions: [
      "Overcoming obstacles",
      "Making key decisions",
      "Taking decisive action",
      "Committing fully",
    ],
    affirmationThemes: [
      "decisiveness",
      "breaking through",
      "committed action",
      "resilience",
    ],
  },
  {
    name: "Waxing Gibbous",
    emoji: "🌔",
    symbolicMeaning:
      "The Waxing Gibbous moon is a time of refinement — the energy is building, the intention is developing, and you are asked to adjust, perfect, and prepare for fulfillment. It is the time of patient cultivation.",
    intentions: [
      "Refinement and adjustment",
      "Patient cultivation",
      "Preparing for fulfillment",
      "Fine-tuning your approach",
    ],
    affirmationThemes: ["refinement", "patience", "development", "preparation"],
  },
  {
    name: "Full Moon",
    emoji: "🌕",
    symbolicMeaning:
      "The Full Moon is the peak of the lunar cycle — the time of maximum illumination, manifestation, heightened intuition, and the harvest of what was seeded at the New Moon. Emotions and energy are at their peak intensity.",
    intentions: [
      "Manifestation and harvest",
      "Gratitude and celebration",
      "Heightened magical work",
      "Releasing what no longer serves",
    ],
    affirmationThemes: [
      "manifestation",
      "abundance",
      "gratitude",
      "peak power",
    ],
  },
  {
    name: "Waning Gibbous",
    emoji: "🌖",
    symbolicMeaning:
      "The Waning Gibbous moon invites gratitude and sharing — after the harvest of the Full Moon, this phase is about integration, sharing the gifts received, and beginning to release what has been consumed or completed.",
    intentions: [
      "Gratitude and integration",
      "Sharing and teaching",
      "Beginning release",
      "Giving back",
    ],
    affirmationThemes: ["gratitude", "sharing", "integration", "wisdom"],
  },
  {
    name: "Last Quarter",
    emoji: "🌗",
    symbolicMeaning:
      "The Last Quarter moon is a powerful time for release, banishing, and clearing. Just as the moon decreases in light, this phase supports the release of habits, relationships, beliefs, or situations that no longer serve growth.",
    intentions: [
      "Releasing and letting go",
      "Breaking old habits",
      "Forgiveness work",
      "Clearing space",
    ],
    affirmationThemes: ["release", "forgiveness", "clearing", "liberation"],
  },
  {
    name: "Waning Crescent",
    emoji: "🌘",
    symbolicMeaning:
      "The Waning Crescent is the time of surrender and rest before the New Moon. It is the dark night before the new dawn — a time for deep rest, dreamwork, introspection, and preparation for the new cycle about to begin.",
    intentions: [
      "Rest and introspection",
      "Dreamwork and inner guidance",
      "Surrender and trust",
      "Preparing for the new cycle",
    ],
    affirmationThemes: [
      "surrender",
      "rest",
      "inner guidance",
      "trust in cycles",
    ],
  },
];

// ── Astrology ─────────────────────────────────────────────────────────────────
interface ZodiacSign {
  name: string;
  symbol: string;
  dates: string;
  element: string;
  planet: string;
  coreTraits: string[];
  shadowTraits: string[];
  affirmationKeywords: string[];
}

const ZODIAC_SIGNS: ZodiacSign[] = [
  {
    name: "Aries",
    symbol: "♈",
    dates: "Mar 21 – Apr 19",
    element: "Fire",
    planet: "Mars",
    coreTraits: ["Courageous", "Pioneering", "Energetic", "Direct"],
    shadowTraits: ["Impulsive", "Aggressive", "Impatient"],
    affirmationKeywords: ["courage", "action", "leadership", "initiative"],
  },
  {
    name: "Taurus",
    symbol: "♉",
    dates: "Apr 20 – May 20",
    element: "Earth",
    planet: "Venus",
    coreTraits: ["Stable", "Reliable", "Sensual", "Patient"],
    shadowTraits: ["Stubborn", "Possessive", "Resistant to change"],
    affirmationKeywords: [
      "abundance",
      "stability",
      "sensory pleasure",
      "patience",
    ],
  },
  {
    name: "Gemini",
    symbol: "♊",
    dates: "May 21 – Jun 20",
    element: "Air",
    planet: "Mercury",
    coreTraits: ["Curious", "Adaptable", "Communicative", "Witty"],
    shadowTraits: ["Scattered", "Inconsistent", "Superficial"],
    affirmationKeywords: [
      "mental agility",
      "communication",
      "curiosity",
      "adaptability",
    ],
  },
  {
    name: "Cancer",
    symbol: "♋",
    dates: "Jun 21 – Jul 22",
    element: "Water",
    planet: "Moon",
    coreTraits: ["Nurturing", "Intuitive", "Protective", "Empathic"],
    shadowTraits: ["Moody", "Over-protective", "Clingy"],
    affirmationKeywords: [
      "emotional intelligence",
      "nurturing",
      "intuition",
      "home",
    ],
  },
  {
    name: "Leo",
    symbol: "♌",
    dates: "Jul 23 – Aug 22",
    element: "Fire",
    planet: "Sun",
    coreTraits: ["Confident", "Generous", "Creative", "Charismatic"],
    shadowTraits: ["Arrogant", "Demanding", "Attention-seeking"],
    affirmationKeywords: ["confidence", "creativity", "generosity", "radiance"],
  },
  {
    name: "Virgo",
    symbol: "♍",
    dates: "Aug 23 – Sep 22",
    element: "Earth",
    planet: "Mercury",
    coreTraits: ["Analytical", "Precise", "Helpful", "Hardworking"],
    shadowTraits: ["Critical", "Perfectionist", "Anxious"],
    affirmationKeywords: ["precision", "service", "improvement", "mastery"],
  },
  {
    name: "Libra",
    symbol: "♎",
    dates: "Sep 23 – Oct 22",
    element: "Air",
    planet: "Venus",
    coreTraits: ["Harmonious", "Diplomatic", "Aesthetic", "Fair"],
    shadowTraits: ["Indecisive", "People-pleasing", "Conflict-avoidant"],
    affirmationKeywords: ["harmony", "beauty", "balance", "justice"],
  },
  {
    name: "Scorpio",
    symbol: "♏",
    dates: "Oct 23 – Nov 21",
    element: "Water",
    planet: "Pluto/Mars",
    coreTraits: ["Intense", "Perceptive", "Transformative", "Magnetic"],
    shadowTraits: ["Controlling", "Jealous", "Secretive"],
    affirmationKeywords: ["transformation", "depth", "power", "rebirth"],
  },
  {
    name: "Sagittarius",
    symbol: "♐",
    dates: "Nov 22 – Dec 21",
    element: "Fire",
    planet: "Jupiter",
    coreTraits: ["Expansive", "Philosophical", "Adventurous", "Optimistic"],
    shadowTraits: ["Restless", "Blunt", "Overcommitted"],
    affirmationKeywords: ["expansion", "freedom", "wisdom", "adventure"],
  },
  {
    name: "Capricorn",
    symbol: "♑",
    dates: "Dec 22 – Jan 19",
    element: "Earth",
    planet: "Saturn",
    coreTraits: ["Ambitious", "Disciplined", "Responsible", "Persistent"],
    shadowTraits: ["Rigid", "Cold", "Overly cautious"],
    affirmationKeywords: ["achievement", "discipline", "structure", "mastery"],
  },
  {
    name: "Aquarius",
    symbol: "♒",
    dates: "Jan 20 – Feb 18",
    element: "Air",
    planet: "Uranus/Saturn",
    coreTraits: ["Innovative", "Humanitarian", "Independent", "Visionary"],
    shadowTraits: ["Detached", "Rebellious", "Eccentric"],
    affirmationKeywords: ["innovation", "independence", "vision", "humanity"],
  },
  {
    name: "Pisces",
    symbol: "♓",
    dates: "Feb 19 – Mar 20",
    element: "Water",
    planet: "Neptune/Jupiter",
    coreTraits: ["Compassionate", "Intuitive", "Imaginative", "Spiritual"],
    shadowTraits: ["Escapist", "Over-sensitive", "Unfocused"],
    affirmationKeywords: ["compassion", "spirituality", "imagination", "flow"],
  },
];

const ELEMENT_COLORS: Record<string, string> = {
  Fire: "oklch(0.68 0.2 30)",
  Earth: "oklch(0.62 0.2 145)",
  Air: "oklch(0.72 0.15 200)",
  Water: "oklch(0.65 0.2 220)",
};

// ── Tarot ─────────────────────────────────────────────────────────────────────
interface TarotCard {
  number: string;
  name: string;
  uprightMeaning: string;
  psychologicalInterpretation: string;
  affirmationTheme: string;
}

const MAJOR_ARCANA: TarotCard[] = [
  {
    number: "0",
    name: "The Fool",
    uprightMeaning: "New beginnings, innocence, spontaneity, free spirit",
    psychologicalInterpretation:
      "The Fool represents the unconditional openness of pure beginner's mind — the courage to start without knowing the outcome, to leap into life with trust and wonder.",
    affirmationTheme: "I embrace new beginnings with open-hearted courage",
  },
  {
    number: "I",
    name: "The Magician",
    uprightMeaning: "Willpower, mastery, skill, concentration, inspired action",
    psychologicalInterpretation:
      "The Magician represents the fully integrated conscious will — all four elements (tools) at the disposal of focused intention. 'As above, so below.'",
    affirmationTheme: "I have all the tools I need to create what I desire",
  },
  {
    number: "II",
    name: "The High Priestess",
    uprightMeaning: "Intuition, sacred knowledge, divine feminine, inner voice",
    psychologicalInterpretation:
      "The High Priestess represents the deep intuitive wisdom that transcends logic — the inner knowing accessed through stillness, dreams, and the spaces between words.",
    affirmationTheme: "I trust the deep wisdom of my inner knowing",
  },
  {
    number: "III",
    name: "The Empress",
    uprightMeaning:
      "Fertility, abundance, beauty, nature, nurturing, creativity",
    psychologicalInterpretation:
      "The Empress embodies the abundance of nature itself — the creative life force that generates, nurtures, and sustains. She represents unconditional love as a generative power.",
    affirmationTheme: "I am abundant, creative, and deeply nourished",
  },
  {
    number: "IV",
    name: "The Emperor",
    uprightMeaning: "Authority, structure, stability, protection, fatherhood",
    psychologicalInterpretation:
      "The Emperor represents the power of structure and authority aligned with wisdom — not control for its own sake, but the stability and protection of earned mastery.",
    affirmationTheme:
      "I build structures that create lasting security and freedom",
  },
  {
    number: "V",
    name: "The Hierophant",
    uprightMeaning: "Spiritual wisdom, tradition, conformity, morality, ethics",
    psychologicalInterpretation:
      "The Hierophant represents the bridge between the sacred and the everyday — spiritual teachings, traditions, and the mentor figures who transmit accumulated wisdom.",
    affirmationTheme:
      "I honor the wisdom traditions that resonate with my soul",
  },
  {
    number: "VI",
    name: "The Lovers",
    uprightMeaning: "Love, union, alignment, choices, values, harmony",
    psychologicalInterpretation:
      "The Lovers card is about alignment — between inner and outer, between personal values and life choices, between the parts of the self that have been separated.",
    affirmationTheme: "I am aligned with my deepest values and highest love",
  },
  {
    number: "VII",
    name: "The Chariot",
    uprightMeaning:
      "Willpower, control, victory, determination, self-discipline",
    psychologicalInterpretation:
      "The Chariot represents the mastery of opposing inner forces (two sphinxes, dark and light) through disciplined willpower — moving forward despite inner conflict through sheer focused direction.",
    affirmationTheme:
      "I direct all my forces toward my goals with unstoppable will",
  },
  {
    number: "VIII",
    name: "Strength",
    uprightMeaning:
      "Inner strength, courage, compassion, patience, gentle control",
    psychologicalInterpretation:
      "Strength shows the figure gently taming the lion with love rather than force — representing the inner mastery that comes from compassion, patience, and authentic self-acceptance rather than suppression.",
    affirmationTheme:
      "My greatest strength comes from gentleness, patience, and love",
  },
  {
    number: "IX",
    name: "The Hermit",
    uprightMeaning:
      "Soul-searching, introspection, solitude, inner guidance, wisdom",
    psychologicalInterpretation:
      "The Hermit represents the sacred necessity of solitude and inner seeking — the wisdom that can only be found by temporarily withdrawing from the noise of the outer world to hear the voice within.",
    affirmationTheme:
      "In solitude I find my deepest wisdom and clearest guidance",
  },
  {
    number: "X",
    name: "Wheel of Fortune",
    uprightMeaning: "Good luck, karma, life cycles, destiny, turning point",
    psychologicalInterpretation:
      "The Wheel of Fortune represents the turning cycles of fate and how consciousness relates to change — the capacity to remain centered and trust the process even when circumstances shift dramatically.",
    affirmationTheme:
      "I trust the cycles of life to carry me toward my highest destiny",
  },
  {
    number: "XI",
    name: "Justice",
    uprightMeaning: "Fairness, truth, cause and effect, law, accountability",
    psychologicalInterpretation:
      "Justice represents the law of cause and effect applied to consciousness — personal accountability, the recognition that your thoughts and actions create your reality, and the courage to face truth.",
    affirmationTheme:
      "I take full responsibility for my reality and align with truth",
  },
  {
    number: "XII",
    name: "The Hanged Man",
    uprightMeaning: "Surrender, new perspectives, pause, letting go",
    psychologicalInterpretation:
      "The Hanged Man represents the radical shift that comes from voluntary surrender — the willingness to stop forcing outcomes and see the situation from an entirely different angle, even upside-down.",
    affirmationTheme:
      "I surrender control and discover new perspectives through trust",
  },
  {
    number: "XIII",
    name: "Death",
    uprightMeaning:
      "Endings, change, transformation, transition, new beginnings",
    psychologicalInterpretation:
      "The Death card almost never means physical death — it represents transformation through the necessary ending of what has served its purpose, making space for genuine new life.",
    affirmationTheme:
      "I embrace transformation and release what no longer serves me",
  },
  {
    number: "XIV",
    name: "Temperance",
    uprightMeaning: "Balance, moderation, patience, purpose, integration",
    psychologicalInterpretation:
      "Temperance represents the alchemical integration of opposites — the capacity to hold paradox, blend contrasting energies, and find the still point between extremes where flow and purpose merge.",
    affirmationTheme:
      "I integrate all aspects of myself into harmonious wholeness",
  },
  {
    number: "XV",
    name: "The Devil",
    uprightMeaning: "Shadow self, attachment, addiction, bondage, materialism",
    psychologicalInterpretation:
      "The Devil represents the chains of unconscious attachment — the ways we believe we are bound when in truth we hold our own chains. Shadow work with the Devil is liberation through self-awareness.",
    affirmationTheme: "I recognize my chains and consciously choose my freedom",
  },
  {
    number: "XVI",
    name: "The Tower",
    uprightMeaning: "Sudden change, upheaval, chaos, revelation, awakening",
    psychologicalInterpretation:
      "The Tower represents the structures we build on false foundations — and their inevitable, sudden collapse. Tower moments, though painful, are liberations: the false is destroyed so the true can be built.",
    affirmationTheme:
      "I release false structures and welcome the freedom of truth",
  },
  {
    number: "XVII",
    name: "The Star",
    uprightMeaning:
      "Hope, faith, renewal, serenity, inspiration, spiritual connection",
    psychologicalInterpretation:
      "The Star represents the return of hope after darkness — the quiet, profound faith that the universe is benevolent, that you are guided, and that healing and beauty are your natural birthright.",
    affirmationTheme:
      "I am guided by starlight and sustained by unshakeable hope",
  },
  {
    number: "XVIII",
    name: "The Moon",
    uprightMeaning:
      "Illusion, fear, the unconscious, intuition, dreams, mystery",
    psychologicalInterpretation:
      "The Moon illuminates the unconscious realms — the fears, illusions, and deep intuitive currents that influence our behavior from below the surface of awareness. Moon work is dreamwork and shadow integration.",
    affirmationTheme:
      "I navigate the unconscious depths with clarity and courage",
  },
  {
    number: "XIX",
    name: "The Sun",
    uprightMeaning: "Positivity, joy, success, vitality, confidence, clarity",
    psychologicalInterpretation:
      "The Sun represents the full emergence of authentic self — pure, radiant, joyful being without masks or shadows. After all the inner journey, The Sun is the experience of simply being alive, whole, and truly yourself.",
    affirmationTheme: "I radiate joy, confidence, and authentic vitality",
  },
  {
    number: "XX",
    name: "Judgement",
    uprightMeaning:
      "Reflection, reckoning, awakening, absolution, inner calling",
    psychologicalInterpretation:
      "Judgement represents the moment of profound inner reckoning and answering the soul's deepest call — rising above past mistakes, releasing self-judgment, and awakening to a new, more authentic life.",
    affirmationTheme: "I answer my soul's calling and rise into my truest self",
  },
  {
    number: "XXI",
    name: "The World",
    uprightMeaning:
      "Completion, integration, accomplishment, travel, wholeness",
    psychologicalInterpretation:
      "The World represents the completion of the Fool's journey — the integration of all experiences into a unified, whole self. Not an ending but a celebration of having become who you were always meant to be.",
    affirmationTheme:
      "I am whole, complete, and fully alive in my own unique existence",
  },
];

// ── Sacred Geometry ───────────────────────────────────────────────────────────
interface SacredGeometryEntry {
  name: string;
  description: string;
  symbolicMeaning: string;
  consciousnessAssociations: string[];
}

const SACRED_GEOMETRY: SacredGeometryEntry[] = [
  {
    name: "Flower of Life",
    description:
      "A geometric figure composed of 19 overlapping circles arranged symmetrically in a hexagonal pattern. Found in ancient temples worldwide — Abydos, Egypt; Ephesus, Turkey; and numerous other sacred sites — it appears to be a universal sacred symbol.",
    symbolicMeaning:
      "The Flower of Life represents the fundamental forms of space and time, the pattern underlying all living creation. It encodes within it every sacred geometric form — Metatron's Cube, the Platonic Solids, and the Seed of Life.",
    consciousnessAssociations: [
      "Unity consciousness",
      "Universal creation template",
      "Interconnectedness of all life",
      "Sacred pattern underlying reality",
    ],
  },
  {
    name: "Metatron's Cube",
    description:
      "A complex sacred geometric figure derived from the Fruit of Life (13 circles of the Flower of Life), connecting all 13 centers with straight lines. It contains all five Platonic Solids, the building blocks of physical creation according to ancient philosophy.",
    symbolicMeaning:
      "Metatron's Cube represents the complete architecture of reality — the field of divine intelligence that underlies all physical form. Working with it activates an understanding of the fundamental order and beauty encoded into existence.",
    consciousnessAssociations: [
      "Divine order",
      "Cosmic architecture",
      "Platonic form",
      "Sacred masculine structure",
    ],
  },
  {
    name: "Sri Yantra",
    description:
      "A complex Hindu sacred geometric figure consisting of nine interlocking triangles — four pointing upward (Shiva/masculine) and five pointing downward (Shakti/feminine) — surrounding a central point (bindu). It generates 43 smaller triangles within its structure.",
    symbolicMeaning:
      "The Sri Yantra is considered the most powerful of all yantras, representing the divine play of consciousness and energy (Shiva-Shakti). Meditating on it is said to lead consciousness back to its source — the bindu (central point) of pure awareness.",
    consciousnessAssociations: [
      "Divine feminine energy",
      "Union of opposites",
      "Manifestation matrix",
      "Path back to source",
    ],
  },
  {
    name: "Vesica Piscis",
    description:
      "The Vesica Piscis is formed by two circles of equal radius intersecting so that the center of each lies on the other's circumference. The almond-shaped intersection is the Vesica Piscis itself — one of the earliest sacred geometric forms.",
    symbolicMeaning:
      "The Vesica Piscis represents the meeting point between two realms — heaven and earth, spirit and matter, masculine and feminine. The intersection space is where creation occurs — the portal through which all manifested reality emerges.",
    consciousnessAssociations: [
      "Sacred intersection",
      "Creative portal",
      "Union of dualities",
      "Birth and emergence",
    ],
  },
  {
    name: "Fibonacci Spiral",
    description:
      "The Fibonacci Spiral grows from the Fibonacci sequence (0, 1, 1, 2, 3, 5, 8, 13...) — each number the sum of the two preceding it. When squares are drawn according to this sequence and an arc drawn through each, the resulting spiral appears throughout nature: shells, galaxies, flowers, DNA.",
    symbolicMeaning:
      "The Fibonacci Spiral represents the mathematical language of growth in nature — the pattern by which life organizes itself toward greater complexity and beauty. It encodes the relationship between the parts and the whole throughout all of nature.",
    consciousnessAssociations: [
      "Natural growth",
      "Golden ratio perfection",
      "Organic expansion",
      "Life's mathematical language",
    ],
  },
  {
    name: "Merkaba",
    description:
      "The Merkaba (Mer-Ka-Ba: light-spirit-body) is a three-dimensional Star of David — two interlocked tetrahedra rotating in opposite directions, one pointing up and one down, creating a counter-rotating field of light around the body.",
    symbolicMeaning:
      "The Merkaba is described in Kabbalistic and New Age traditions as the vehicle of light-consciousness, a crystalline field of sacred geometry that activates around the body when one achieves a certain state of conscious, heartful awareness. It represents the integration of all dimensional awareness within a single point.",
    consciousnessAssociations: [
      "Light body activation",
      "Multi-dimensional awareness",
      "Divine protection field",
      "Integration of masculine and feminine",
    ],
  },
  {
    name: "Platonic Solids",
    description:
      "The five Platonic Solids (Tetrahedron, Cube/Hexahedron, Octahedron, Icosahedron, Dodecahedron) are the only perfectly regular three-dimensional geometric forms — each face identical, each angle equal. Plato associated each with an element: Fire, Earth, Air, Water, and Aether.",
    symbolicMeaning:
      "The Platonic Solids represent the fundamental building blocks of three-dimensional reality. They are the geometric forms that appear most fundamentally in nature — from crystals and viruses to buckminsterfullerene. They encode the basic language of physical existence.",
    consciousnessAssociations: [
      "Elemental forces",
      "Fundamental structures of creation",
      "Mathematical perfection",
      "Physical reality template",
    ],
  },
];

// ── Numerology ────────────────────────────────────────────────────────────────
interface NumerologyEntry {
  number: string;
  meaning: string;
  lifePathAssociation: string;
  affirmationThemes: string[];
}

const NUMEROLOGY: NumerologyEntry[] = [
  {
    number: "1",
    meaning:
      "Leadership, independence, originality, new beginnings, initiative, self-reliance, ambition",
    lifePathAssociation:
      "The Pioneer — those with Life Path 1 are natural leaders called to forge their own path and initiate new ventures.",
    affirmationThemes: [
      "leadership",
      "independence",
      "new beginnings",
      "self-reliance",
    ],
  },
  {
    number: "2",
    meaning:
      "Partnership, diplomacy, balance, sensitivity, cooperation, patience, harmony, intuition",
    lifePathAssociation:
      "The Diplomat — Life Path 2 individuals excel at creating harmony, building relationships, and supporting collaborative endeavors.",
    affirmationThemes: ["harmony", "partnership", "balance", "intuition"],
  },
  {
    number: "3",
    meaning:
      "Creativity, self-expression, joy, communication, artistic gifts, social connection, optimism",
    lifePathAssociation:
      "The Creative — Life Path 3 carries gifts of expression, joy, and artistic brilliance, called to uplift others through creativity.",
    affirmationThemes: [
      "creativity",
      "self-expression",
      "joy",
      "communication",
    ],
  },
  {
    number: "4",
    meaning:
      "Stability, hard work, practicality, honesty, structure, foundation-building, reliability",
    lifePathAssociation:
      "The Builder — Life Path 4 creates lasting foundations through disciplined effort, practical wisdom, and reliable consistency.",
    affirmationThemes: ["stability", "hard work", "structure", "foundation"],
  },
  {
    number: "5",
    meaning:
      "Freedom, adventure, change, adaptability, sensory experience, curiosity, versatility",
    lifePathAssociation:
      "The Freedom Seeker — Life Path 5 thrives on change, variety, and new experiences, inspiring others to embrace life's adventures.",
    affirmationThemes: [
      "freedom",
      "adventure",
      "adaptability",
      "growth through change",
    ],
  },
  {
    number: "6",
    meaning:
      "Nurturing, responsibility, home, family, service, compassion, healing, community",
    lifePathAssociation:
      "The Nurturer — Life Path 6 is called to serve and care for others, creating harmonious homes and compassionate communities.",
    affirmationThemes: ["nurturing", "responsibility", "compassion", "service"],
  },
  {
    number: "7",
    meaning:
      "Wisdom, spirituality, introspection, analysis, truth-seeking, mysticism, inner knowing",
    lifePathAssociation:
      "The Seeker — Life Path 7 carries a deep drive to understand the hidden dimensions of reality through analysis, meditation, and spiritual inquiry.",
    affirmationThemes: ["wisdom", "spiritual depth", "inner knowing", "truth"],
  },
  {
    number: "8",
    meaning:
      "Power, abundance, material mastery, ambition, authority, manifestation, karma of success",
    lifePathAssociation:
      "The Achiever — Life Path 8 masters the material world through disciplined ambition, executive authority, and understanding of power and abundance.",
    affirmationThemes: ["abundance", "power", "mastery", "manifestation"],
  },
  {
    number: "9",
    meaning:
      "Completion, humanitarianism, compassion, wisdom, endings, universal love, global consciousness",
    lifePathAssociation:
      "The Humanitarian — Life Path 9 serves the greater good through compassion, wisdom, and a heart big enough to encompass all of humanity.",
    affirmationThemes: [
      "completion",
      "humanitarianism",
      "universal love",
      "wisdom",
    ],
  },
  {
    number: "11",
    meaning:
      "Master Intuitive — spiritual awakening, illumination, inspiration, psychic sensitivity, visionary leadership",
    lifePathAssociation:
      "Master Number 11 carries amplified 2 energy with spiritual visionary gifts — called to inspire others through heightened intuition and spiritual illumination.",
    affirmationThemes: [
      "spiritual illumination",
      "intuition",
      "vision",
      "inspiration",
    ],
  },
  {
    number: "22",
    meaning:
      "Master Builder — manifestation of dreams, large-scale creation, pragmatic visionary, material mastery at highest level",
    lifePathAssociation:
      "Master Number 22 is the most powerful number in numerology — the Master Builder who manifests visionary dreams into lasting physical reality on a grand scale.",
    affirmationThemes: [
      "master manifestation",
      "grand vision",
      "building legacy",
      "visionary creation",
    ],
  },
  {
    number: "33",
    meaning:
      "Master Teacher — unconditional love, healing, raising consciousness, spiritual perfection, blessing the world",
    lifePathAssociation:
      "Master Number 33 is the most evolved Master Number — the Master Teacher whose life embodies unconditional love and the conscious upliftment of human consciousness.",
    affirmationThemes: [
      "unconditional love",
      "teaching and healing",
      "highest service",
      "spiritual mastery",
    ],
  },
];

// ── Meditation Rituals ────────────────────────────────────────────────────────
interface MeditationRitual {
  name: string;
  technique: string;
  benefits: string[];
  affirmationThemes: string[];
}

const MEDITATION_RITUALS: MeditationRitual[] = [
  {
    name: "Mindfulness Meditation",
    technique:
      "Sit quietly and bring attention to the present moment through focused awareness of breath, body sensations, thoughts, and feelings — without judgment or attachment. When the mind wanders, gently return to the present.",
    benefits: [
      "Reduces anxiety and stress",
      "Improves emotional regulation",
      "Enhances presence and focus",
      "Develops non-reactive awareness",
    ],
    affirmationThemes: [
      "present moment awareness",
      "non-judgment",
      "inner peace",
      "clarity",
    ],
  },
  {
    name: "Transcendental Meditation",
    technique:
      "Practice involves the silent repetition of a specific personal mantra for 20 minutes twice daily. The mantra is used as a vehicle to allow the active, thinking mind to settle inward to a state of pure, restful awareness — the transcendent.",
    benefits: [
      "Deep rest and stress release",
      "Access to transcendent awareness",
      "Reduced anxiety and depression",
      "Enhanced creativity and intelligence",
    ],
    affirmationThemes: [
      "transcendence",
      "pure consciousness",
      "deep rest",
      "effortless being",
    ],
  },
  {
    name: "Vipassana",
    technique:
      "Vipassana ('insight') meditation observes the impermanence of sensations, thoughts, and emotions through systematic body scanning. Practitioners observe sensations arising and passing without reaction, gradually freeing the mind from habitual reactive patterns.",
    benefits: [
      "Liberation from unconscious reactivity",
      "Direct experience of impermanence",
      "Deep equanimity",
      "Profound mental purification",
    ],
    affirmationThemes: [
      "impermanence",
      "equanimity",
      "deep insight",
      "mental freedom",
    ],
  },
  {
    name: "Loving-Kindness (Metta)",
    technique:
      "Systematically cultivate loving-kindness by silently extending wishes of happiness, health, safety, and ease — first to yourself, then to loved ones, neutral people, difficult people, and finally all beings everywhere. 'May you be happy. May you be healthy. May you be safe. May you be at ease.'",
    benefits: [
      "Increases self-compassion and love",
      "Reduces hostility and resentment",
      "Expands heart capacity",
      "Improves social connection",
    ],
    affirmationThemes: [
      "unconditional love",
      "compassion",
      "goodwill",
      "heart opening",
    ],
  },
  {
    name: "Chakra Meditation",
    technique:
      "Focus attention sequentially through each of the seven chakras — from root to crown — visualizing each energy center as a spinning wheel of light in its corresponding color. Hold attention at each chakra with breath, intention, and sound (seed mantras: LAM, VAM, RAM, YAM, HAM, OM, AUM).",
    benefits: [
      "Energy center alignment and balance",
      "Integration of physical and spiritual",
      "Enhanced vitality and clarity",
      "Emotional and physical healing",
    ],
    affirmationThemes: [
      "energy alignment",
      "chakra activation",
      "whole-being balance",
      "inner light",
    ],
  },
  {
    name: "Visualization / Creative Visualization",
    technique:
      "In a relaxed meditative state, create vivid, detailed mental imagery of your desired outcomes or states — engaging all senses, feeling the emotions of the fulfilled desire, and inhabiting the reality as if it is already present. Practice for 10-20 minutes with complete sensory immersion.",
    benefits: [
      "Neurological programming toward goals",
      "Increased motivation and belief",
      "Activates the law of attraction",
      "Strengthens mind-reality connection",
    ],
    affirmationThemes: [
      "manifestation",
      "creative power",
      "desired reality",
      "vividly living your goals",
    ],
  },
  {
    name: "Sound Bath",
    technique:
      "Lie in a comfortable position (often savasana) while singing bowls, gongs, tuning forks, or other resonant instruments are played. Allow the sound waves to wash through your body, releasing tension, shifting brainwave states, and facilitating deep relaxation.",
    benefits: [
      "Deep nervous system relaxation",
      "Brainwave entrainment",
      "Stress and trauma release",
      "Altered states of consciousness",
    ],
    affirmationThemes: [
      "vibrational healing",
      "sound resonance",
      "deep relaxation",
      "frequency alignment",
    ],
  },
  {
    name: "Breathwork / Pranayama",
    technique:
      "Conscious control and modulation of the breath to shift physical, emotional, and mental states. Techniques include Alternate Nostril Breathing (Nadi Shodhana), Breath of Fire (Kapalabhati), Box Breathing, Holotropic Breathwork, and Wim Hof method — each activating different states.",
    benefits: [
      "Immediate stress and anxiety reduction",
      "Activation of parasympathetic response",
      "Access to non-ordinary states",
      "Energy activation and vitality",
    ],
    affirmationThemes: [
      "life force activation",
      "breath as power",
      "energetic transformation",
      "conscious vitality",
    ],
  },
  {
    name: "Walking Meditation",
    technique:
      "Transform the ordinary act of walking into a meditation by bringing full conscious awareness to each step — the lifting, moving, and placing of each foot; the breath; the sensations of the body; the environment. Walk slowly, deliberately, fully present with each movement.",
    benefits: [
      "Integrates meditation with daily life",
      "Grounds spiritual practice in the body",
      "Accessible alternative to seated practice",
      "Cultivates presence in motion",
    ],
    affirmationThemes: [
      "grounded presence",
      "mindful movement",
      "meditation in action",
      "embodied awareness",
    ],
  },
  {
    name: "Yoga Nidra (Yogic Sleep)",
    technique:
      "Lie in savasana and follow a guided rotation of consciousness through the body, systematically relaxing each part. Then navigate between waking, dreaming, and deep sleep states while maintaining a thread of conscious awareness. A single session provides rest equivalent to several hours of sleep.",
    benefits: [
      "Profound physical and mental restoration",
      "Access to hypnagogic consciousness",
      "Deep trauma healing and release",
      "Planting sankalpa (intention) in the unconscious",
    ],
    affirmationThemes: [
      "deep restoration",
      "conscious sleep",
      "sankalpa (deep intention)",
      "accessing the unconscious",
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
function UseButton({
  topic,
  onUse,
}: { topic: string; onUse: (t: string) => void }) {
  return (
    <Button
      size="sm"
      onClick={() => onUse(topic)}
      className="gap-1.5 text-xs"
      style={{
        background: "oklch(0.62 0.22 295 / 0.2)",
        border: "1px solid oklch(0.62 0.22 295 / 0.5)",
        color: "oklch(0.62 0.22 295)",
      }}
    >
      <Sparkles className="w-3 h-3" />
      Use for Subliminal
    </Button>
  );
}

function RitualConnectionChips({
  name,
  onNavigate,
}: {
  name: string;
  onNavigate?: (page: string) => void;
}) {
  const conn = RITUAL_CONNECTIONS[name];
  if (!conn || !onNavigate) return null;
  return (
    <div className="space-y-2 pt-2 border-t border-border/20">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        ◈ Connections
      </p>
      <div className="space-y-1.5">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "oklch(0.68 0.18 195 / 0.8)" }}
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
                background: "oklch(0.68 0.18 195 / 0.12)",
                color: "oklch(0.68 0.18 195)",
                border: "1px solid oklch(0.68 0.18 195 / 0.3)",
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
          style={{ color: "oklch(0.62 0.22 295 / 0.8)" }}
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
                background: "oklch(0.62 0.22 295 / 0.12)",
                color: "oklch(0.62 0.22 295)",
                border: "1px solid oklch(0.62 0.22 295 / 0.3)",
              }}
            >
              {spell}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function RitualsPage({
  onUseForSubliminal,
  onNavigate,
}: RitualsPageProps) {
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
            <Moon className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl font-bold gradient-text">
          Rituals & Sacred Systems
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          Moon phases, astrology, tarot, sacred geometry, numerology, and
          meditation — an encyclopedic reference to the symbolic and
          contemplative systems that map human consciousness.
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="moon" className="space-y-6">
        <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
          <TabsList className="flex h-auto gap-1 p-1 bg-secondary/30 rounded-xl w-max min-w-full">
            {[
              { value: "moon", label: "🌙 Moon" },
              { value: "astrology", label: "⭐ Astrology" },
              { value: "tarot", label: "🃏 Tarot" },
              { value: "geometry", label: "✦ Geometry" },
              { value: "numerology", label: "🔢 Numerology" },
              { value: "meditation", label: "🧘 Meditation" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs px-3 py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary rounded-lg whitespace-nowrap min-h-[40px]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Moon Phases Tab */}
        <TabsContent value="moon" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOON_PHASES.map((phase, idx) => (
              <motion.div
                key={phase.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl border border-border/40 bg-secondary/20 p-5 space-y-3"
                style={{ borderColor: "oklch(0.62 0.22 295 / 0.25)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{phase.emoji}</span>
                    <h3
                      className="font-heading font-bold text-base"
                      style={{ color: "oklch(0.72 0.18 295)" }}
                    >
                      {phase.name}
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {phase.symbolicMeaning}
                </p>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Intentions
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.intentions.map((i) => (
                      <Badge
                        key={i}
                        className="text-xs"
                        style={{
                          background: "oklch(0.62 0.22 295 / 0.15)",
                          color: "oklch(0.72 0.18 295)",
                          border: "1px solid oklch(0.62 0.22 295 / 0.3)",
                        }}
                      >
                        {i}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {phase.affirmationThemes.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-md"
                      style={{
                        background: "oklch(0.78 0.15 85 / 0.1)",
                        color: "oklch(0.78 0.15 85)",
                        border: "1px solid oklch(0.78 0.15 85 / 0.2)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <RitualConnectionChips
                  name={phase.name}
                  onNavigate={onNavigate}
                />
                <UseButton
                  topic={`${phase.name} energy and intention setting`}
                  onUse={onUseForSubliminal}
                />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Astrology Tab */}
        <TabsContent value="astrology" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ZODIAC_SIGNS.map((sign, idx) => {
              const color =
                ELEMENT_COLORS[sign.element] ?? "oklch(0.62 0.22 295)";
              return (
                <motion.div
                  key={sign.name}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="rounded-2xl border bg-secondary/20 p-4 space-y-3"
                  style={{ borderColor: `${color}30` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{sign.symbol}</span>
                      <div>
                        <h3
                          className="font-heading font-bold text-sm"
                          style={{ color }}
                        >
                          {sign.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {sign.dates}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className="text-xs"
                        style={{
                          background: `${color}20`,
                          color,
                          border: `1px solid ${color}40`,
                        }}
                      >
                        {sign.element}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-semibold">Ruler:</span> {sign.planet}
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Core Traits
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {sign.coreTraits.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ background: `${color}15`, color }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Shadow
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sign.shadowTraits.join(", ")}
                    </p>
                  </div>
                  <UseButton
                    topic={`${sign.name} zodiac energy and ${sign.affirmationKeywords.join(", ")}`}
                    onUse={onUseForSubliminal}
                  />
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Tarot Tab */}
        <TabsContent value="tarot" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MAJOR_ARCANA.map((card, idx) => (
              <motion.div
                key={card.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="rounded-2xl border border-border/40 bg-secondary/20 p-4 space-y-3"
                style={{ borderColor: "oklch(0.68 0.2 30 / 0.3)" }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="font-mono text-lg font-bold shrink-0"
                    style={{ color: "oklch(0.78 0.15 85)" }}
                  >
                    {card.number}
                  </span>
                  <div className="space-y-1 flex-1">
                    <h3
                      className="font-heading font-bold text-sm"
                      style={{ color: "oklch(0.68 0.2 30)" }}
                    >
                      {card.name}
                    </h3>
                    <p className="text-xs text-muted-foreground italic">
                      {card.uprightMeaning}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {card.psychologicalInterpretation}
                </p>
                <div
                  className="p-2.5 rounded-xl"
                  style={{
                    background: "oklch(0.68 0.2 30 / 0.1)",
                    borderLeft: "2px solid oklch(0.68 0.2 30 / 0.5)",
                  }}
                >
                  <p
                    className="text-xs italic"
                    style={{ color: "oklch(0.68 0.2 30)" }}
                  >
                    "{card.affirmationTheme}"
                  </p>
                </div>
                <UseButton
                  topic={`${card.name} tarot energy — ${card.affirmationTheme}`}
                  onUse={onUseForSubliminal}
                />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Sacred Geometry Tab */}
        <TabsContent value="geometry" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SACRED_GEOMETRY.map((entry, idx) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
                className="rounded-2xl border bg-secondary/20 p-5 space-y-3"
                style={{ borderColor: "oklch(0.72 0.15 200 / 0.35)" }}
              >
                <h3
                  className="font-heading font-bold text-base"
                  style={{ color: "oklch(0.72 0.15 200)" }}
                >
                  {entry.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {entry.description}
                </p>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    Symbolic Meaning
                  </h4>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {entry.symbolicMeaning}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {entry.consciousnessAssociations.map((a) => (
                    <Badge
                      key={a}
                      className="text-xs"
                      style={{
                        background: "oklch(0.72 0.15 200 / 0.15)",
                        color: "oklch(0.72 0.15 200)",
                        border: "1px solid oklch(0.72 0.15 200 / 0.3)",
                      }}
                    >
                      {a}
                    </Badge>
                  ))}
                </div>
                <UseButton
                  topic={`${entry.name} sacred geometry consciousness`}
                  onUse={onUseForSubliminal}
                />
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Numerology Tab */}
        <TabsContent value="numerology" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NUMEROLOGY.map((entry, idx) => {
              const isMaster = ["11", "22", "33"].includes(entry.number);
              const color = isMaster
                ? "oklch(0.78 0.15 85)"
                : "oklch(0.62 0.22 295)";
              return (
                <motion.div
                  key={entry.number}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="rounded-2xl border bg-secondary/20 p-4 space-y-3"
                  style={{ borderColor: `${color}30` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-heading font-black text-xl shrink-0"
                      style={{
                        background: `${color}20`,
                        color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {entry.number}
                    </div>
                    <div>
                      {isMaster && (
                        <Badge
                          className="text-xs mb-1"
                          style={{
                            background: `${color}20`,
                            color,
                            border: `1px solid ${color}40`,
                          }}
                        >
                          Master Number
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {entry.meaning}
                  </p>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                      Life Path
                    </h4>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      {entry.lifePathAssociation}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {entry.affirmationThemes.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ background: `${color}15`, color }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <UseButton
                    topic={`Number ${entry.number} numerology energy — ${entry.affirmationThemes.join(", ")}`}
                    onUse={onUseForSubliminal}
                  />
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* Meditation Tab */}
        <TabsContent value="meditation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MEDITATION_RITUALS.map((med, idx) => (
              <motion.div
                key={med.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl border bg-secondary/20 p-5 space-y-3"
                style={{ borderColor: "oklch(0.62 0.2 145 / 0.35)" }}
              >
                <h3
                  className="font-heading font-bold text-base"
                  style={{ color: "oklch(0.62 0.2 145)" }}
                >
                  {med.name}
                </h3>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                    Technique
                  </h4>
                  <p className="text-xs text-foreground/80 leading-relaxed">
                    {med.technique}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    Benefits
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {med.benefits.map((b) => (
                      <Badge
                        key={b}
                        className="text-xs"
                        style={{
                          background: "oklch(0.62 0.2 145 / 0.15)",
                          color: "oklch(0.62 0.2 145)",
                          border: "1px solid oklch(0.62 0.2 145 / 0.3)",
                        }}
                      >
                        {b}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {med.affirmationThemes.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: "oklch(0.62 0.22 295 / 0.1)",
                        color: "oklch(0.62 0.22 295)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <UseButton
                  topic={`${med.name} meditation practice and ${med.affirmationThemes.join(", ")}`}
                  onUse={onUseForSubliminal}
                />
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
