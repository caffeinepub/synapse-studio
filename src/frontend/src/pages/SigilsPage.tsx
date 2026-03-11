import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

type SigilCategory =
  | "Protection"
  | "Manifestation"
  | "Wisdom"
  | "Love/Venus"
  | "Power"
  | "Planetary"
  | "Norse"
  | "Egyptian"
  | "Chaos/Left-Hand"
  | "Sacred Geometry"
  | "Celtic";

interface Sigil {
  name: string;
  symbol: string;
  category: SigilCategory;
  meaning: string;
  origin: string;
  connectedEntities: string[];
  connectedSpells: string[];
  subliminalUse: string;
}

const SIGILS: Sigil[] = [
  {
    name: "Seal of Solomon",
    symbol: "✡",
    category: "Protection",
    meaning:
      "The Seal of Solomon is a hexagram ring said to have been granted to King Solomon by God, giving him power over demons and spirits. It represents divine authority, balance of opposites, and the union of the spiritual and material. The interlocking triangles embody 'as above, so below.'",
    origin: "Jewish mysticism, Islamic tradition, later Western occultism",
    connectedEntities: ["Michael", "Metatron", "Raphael", "Gabriel", "Hermes"],
    connectedSpells: [
      "LBRP",
      "Protection Circle",
      "Invocation",
      "Talisman Creation",
    ],
    subliminalUse:
      "Use for subliminals focused on spiritual authority, divine protection, and commanding personal sovereignty.",
  },
  {
    name: "Eye of Providence",
    symbol: "👁",
    category: "Wisdom",
    meaning:
      "The Eye of Providence represents the all-seeing eye of a divine being watching over humanity. It symbolizes divine omniscience, spiritual illumination, and the awakening of the third eye. Associated with Freemasonry and the US Great Seal, it represents enlightened perception and inner knowing.",
    origin: "Christian art (16th c.), Freemasonry, US symbolism",
    connectedEntities: ["Uriel", "Metatron", "Gabriel"],
    connectedSpells: [
      "Planetary Seal",
      "Invocation",
      "Mirror Magic",
      "Air Invocation",
    ],
    subliminalUse:
      "Use for subliminals about intuition, spiritual sight, awakening consciousness, and accessing higher wisdom.",
  },
  {
    name: "Sigil of Lucifer",
    symbol: "⛧",
    category: "Chaos/Left-Hand",
    meaning:
      "The Sigil of Lucifer (also called the Seal of Satan) is a symbol from the Grimorium Verum associated with Lucifer as the light-bringer and adversarial force. It represents radical self-sovereignty, intellectual illumination, and the refusal of external authority. It is a symbol of liberation and the dawn star.",
    origin:
      "Grimorium Verum (18th c. grimoire), modern Satanic and LHP traditions",
    connectedEntities: ["Lucifer", "The Shadow"],
    connectedSpells: ["Sigil Charging", "Desire Sigil", "Chaos Magick Sigil"],
    subliminalUse:
      "Use for subliminals about radical self-authority, intellectual freedom, and breaking through limiting belief systems.",
  },
  {
    name: "Sigil of Baphomet",
    symbol: "⛤",
    category: "Chaos/Left-Hand",
    meaning:
      "The Sigil of Baphomet is the official symbol of the Church of Satan, featuring an inverted pentagram with a goat's head. It represents the integration of animal and divine nature, the inversion of conventional morality, and the power of carnal earthly existence. Baphomet symbolizes the union of opposites.",
    origin:
      "19th century occultism, Church of Satan (Anton LaVey), Western LHP",
    connectedEntities: ["Baphomet", "Lilith"],
    connectedSpells: ["LBRP", "Invocation", "Chaos Magick Sigil"],
    subliminalUse:
      "Use for subliminals about integrating shadow aspects, owning personal power, and transcending moral conditioning.",
  },
  {
    name: "Sigil of Azazel",
    symbol: "𖤐",
    category: "Chaos/Left-Hand",
    meaning:
      "The Sigil of Azazel is used to invoke the Watcher angel Azazel, associated with forbidden knowledge, metalworking, and desert power. It represents access to hidden knowledge, mastery of the forbidden arts, and the integration of the scapegoat archetype — reclaiming what has been cast out and projected.",
    origin: "Book of Enoch, Enochian tradition, modern goetic practice",
    connectedEntities: ["Azazel"],
    connectedSpells: [
      "Sigil Charging",
      "Talisman Creation",
      "Chaos Magick Sigil",
    ],
    subliminalUse:
      "Use for subliminals about recovering hidden power, accessing forbidden knowledge, and reclaiming projected shadow energy.",
  },
  {
    name: "Sigil of Asmodeus",
    symbol: "🜏",
    category: "Chaos/Left-Hand",
    meaning:
      "The Sigil of Asmodeus is a demonic seal from the Lesser Key of Solomon, associated with the demon of lust and passion. It represents the conscious channeling of desire, sexual power, and magnetic attraction. When integrated psychologically, Asmodeus energy becomes charisma, creative fire, and magnetic presence.",
    origin: "Lesser Key of Solomon (Ars Goetia), Jewish and Persian demonology",
    connectedEntities: ["Asmodeus"],
    connectedSpells: ["Glamour Spell", "Desire Sigil", "Jar Spell"],
    subliminalUse:
      "Use for subliminals about personal magnetism, desire manifestation, and awakening passionate life force.",
  },
  {
    name: "Pentagram (Pentacle)",
    symbol: "⛤",
    category: "Protection",
    meaning:
      "The pentagram is one of the oldest and most widely used magical symbols, representing the five elements (earth, water, fire, air, spirit) in their balanced relationship. The upright pentagram is associated with protection, elemental balance, and the human form. It is the primary symbol of Wicca and Paganism.",
    origin:
      "Ancient Mesopotamia, Pythagorean schools, Medieval European magic, Wicca",
    connectedEntities: [
      "Michael",
      "Hecate",
      "Baphomet",
      "Azazel",
      "The Dragon",
    ],
    connectedSpells: [
      "Protection Circle",
      "LBRP",
      "Aura Cleansing",
      "Energy Shield",
    ],
    subliminalUse:
      "Use for subliminals about elemental balance, protection, wholeness, and spiritual grounding.",
  },
  {
    name: "Hexagram (Star of David)",
    symbol: "✡",
    category: "Planetary",
    meaning:
      "The hexagram, also called the Star of David in Judaism, represents the union of heaven and earth, the divine masculine and feminine. It is the central symbol of the Seal of Solomon and planetary magic. Its six points correspond to the seven classical planets, with the center as the Sun.",
    origin:
      "Ancient Hindu and Middle Eastern symbolism, Jewish tradition, Western occultism",
    connectedEntities: ["Metatron", "Baphomet"],
    connectedSpells: [
      "Planetary Seal",
      "Invocation",
      "Abundance Ritual",
      "Jar Spell",
    ],
    subliminalUse:
      "Use for subliminals about divine balance, cosmic alignment, manifestation of divine will, and integration of polarities.",
  },
  {
    name: "Triquetra",
    symbol: "☘",
    category: "Celtic",
    meaning:
      "The Triquetra (or Trinity Knot) is a Celtic symbol representing the threefold nature of existence — mind, body, and spirit; past, present, and future; the triple goddess (maiden, mother, crone). Its continuous unbroken line represents eternity and the eternal cycle of life.",
    origin: "Ancient Celtic art, later adopted by Christianity as the Trinity",
    connectedEntities: ["The Morrigan", "Hecate", "Freya", "Lilith"],
    connectedSpells: [
      "Moon Spell",
      "Knot Magic",
      "Water Ritual",
      "Binding Spell",
    ],
    subliminalUse:
      "Use for subliminals about the triple nature of being, eternal cycles, and the integration of body-mind-spirit.",
  },
  {
    name: "Ankh",
    symbol: "☥",
    category: "Egyptian",
    meaning:
      "The Ankh is the Egyptian symbol of life, combining the tau cross (earthly life) with a loop (spiritual immortality). It represents the key to eternal life, the union of male and female principles, and divine life-force energy. It was carried by gods and pharaohs as a symbol of divine authority over life and death.",
    origin: "Ancient Egypt (dynastic period), later Coptic Christianity",
    connectedEntities: ["Ra", "Isis", "Anubis", "The Phoenix"],
    connectedSpells: [
      "Healing Transmission",
      "Cord Cutting",
      "Fire Spell",
      "Candle Magic",
    ],
    subliminalUse:
      "Use for subliminals about vitality, immortality consciousness, divine life force, and eternal renewal.",
  },
  {
    name: "Ouroboros",
    symbol: "🐍",
    category: "Sacred Geometry",
    meaning:
      "The Ouroboros depicts a serpent or dragon eating its own tail, forming an eternal circle. It represents cyclical time, eternal return, self-referential consciousness, and the paradox of creation and destruction being the same force. It is one of the oldest mystical symbols across Greek, Egyptian, and Norse traditions.",
    origin: "Ancient Egypt, Greek Gnosticism, Norse (Jörmungandr), Alchemy",
    connectedEntities: [
      "The Serpent",
      "The Dragon",
      "The Trickster",
      "The Phoenix",
    ],
    connectedSpells: ["Cord Cutting", "Chaos Magick Sigil", "Sigil Charging"],
    subliminalUse:
      "Use for subliminals about cycles, eternal becoming, self-completion, and continuous transformation.",
  },
  {
    name: "Metatron's Cube",
    symbol: "✦",
    category: "Sacred Geometry",
    meaning:
      "Metatron's Cube is a complex sacred geometric figure containing all five Platonic Solids within it, derived from the Fruit of Life. It represents the template of all creation, the divine ordering principle, and Metatron's role as the architect of cosmic structure. It encodes the fundamental patterns of the universe.",
    origin: "Jewish Kabbalah, sacred geometry tradition, New Age spirituality",
    connectedEntities: ["Metatron", "Uriel"],
    connectedSpells: ["Sigil Charging", "Planetary Seal", "Talisman Creation"],
    subliminalUse:
      "Use for subliminals about accessing divine order, sacred geometry consciousness, and the deep structure of reality.",
  },
  {
    name: "Flower of Life",
    symbol: "⊛",
    category: "Sacred Geometry",
    meaning:
      "The Flower of Life is a geometric pattern of overlapping circles found in sacred sites worldwide. It contains the Blueprint of Creation — all five Platonic Solids, the Tree of Life, and Metatron's Cube can be derived from it. It represents the fundamental form pattern underlying all physical reality.",
    origin:
      "Found globally: Egypt, Assyria, India, China. Associated with Metatron",
    connectedEntities: ["Metatron", "Ganesha"],
    connectedSpells: [
      "Sigil Charging",
      "Chakra Clearing",
      "Healing Transmission",
    ],
    subliminalUse:
      "Use for subliminals about divine creation energy, universal pattern recognition, and accessing the blueprint of your highest potential.",
  },
  {
    name: "Seed of Life",
    symbol: "⊚",
    category: "Sacred Geometry",
    meaning:
      "The Seed of Life consists of seven circles that form the core of the Flower of Life. It represents the seven days of creation in Genesis, the seven notes of the musical scale, and the seven chakras. It is the seed pattern from which all creation grows — pure potential in geometric form.",
    origin: "Sacred geometry tradition, derived from the Flower of Life",
    connectedEntities: ["Metatron"],
    connectedSpells: [
      "Chakra Clearing",
      "Healing Transmission",
      "Earth Grounding",
    ],
    subliminalUse:
      "Use for subliminals about new beginnings, seeding intentions, divine potential, and the perfect template of creation.",
  },
  {
    name: "Tree of Life (Kabbalah)",
    symbol: "⊕",
    category: "Wisdom",
    meaning:
      "The Kabbalistic Tree of Life is a diagram of ten Sephiroth (divine emanations) connected by twenty-two paths, mapping the structure of the universe and the human soul. It represents the stages of creation from pure divine light (Kether) to material manifestation (Malkuth), and the spiritual path of ascent.",
    origin:
      "Jewish Kabbalah (Medieval Spain), Hermetic Qabalah, Western occultism",
    connectedEntities: ["Metatron", "Michael", "Gabriel"],
    connectedSpells: ["LBRP", "Talisman Creation", "Sigil Charging"],
    subliminalUse:
      "Use for subliminals about spiritual ascent, divine structure, accessing higher consciousness levels, and Kabbalistic alignment.",
  },
  {
    name: "Valknut",
    symbol: "⟁",
    category: "Norse",
    meaning:
      "The Valknut (Knot of the Slain) is a Norse symbol of three interlocking triangles associated with Odin and the honored dead. It represents the transition between life and death, Odin's power over the battlefield, and the integration of the three realms — Asgard, Midgard, and Hel. It is a symbol of sacrifice for wisdom.",
    origin: "Norse/Viking Age (found on runestones), associated with Odin",
    connectedEntities: ["Odin", "Shango"],
    connectedSpells: [
      "Runic Bind Rune",
      "Talisman Creation",
      "Invocation",
      "Candle Magic",
    ],
    subliminalUse:
      "Use for subliminals about honorable sacrifice, embracing transitions, and accessing Odinic warrior wisdom.",
  },
  {
    name: "Vegvisir",
    symbol: "ᚠ",
    category: "Norse",
    meaning:
      "The Vegvisir (Icelandic compass) is a magical stave from the Huld Manuscript meaning 'That Which Shows the Way.' It guarantees the bearer will always find their way through storms and rough weather, never losing their path even when the way is unknown. It is a symbol of navigation through life's challenges.",
    origin:
      "Icelandic magical tradition (17th-18th c. manuscripts), Norse symbolism",
    connectedEntities: ["Odin", "Freya", "Loki"],
    connectedSpells: [
      "Runic Bind Rune",
      "Protection Circle",
      "Talisman Creation",
    ],
    subliminalUse:
      "Use for subliminals about finding your way, navigating uncertainty, always knowing your direction, and inner guidance.",
  },
  {
    name: "Algiz (Rune)",
    symbol: "ᛉ",
    category: "Norse",
    meaning:
      "Algiz is the rune of protection, sacred connection, and divine shielding. Its form resembles an upward-reaching figure or antler — the reaching of the human toward the divine. It represents the higher self as protector, divine grace, and the power of the elk as a spirit animal. It is the most protective rune.",
    origin: "Elder Futhark runic alphabet (ancient Germanic/Norse tradition)",
    connectedEntities: ["Michael", "Thor", "Odin"],
    connectedSpells: [
      "Protection Circle",
      "Runic Bind Rune",
      "Energy Shield",
      "LBRP",
    ],
    subliminalUse:
      "Use for subliminals about divine protection, connecting with higher self, shielding from harm, and sacred guardianship.",
  },
  {
    name: "Othala (Rune)",
    symbol: "ᛟ",
    category: "Norse",
    meaning:
      "Othala is the rune of ancestral inheritance, home, and sacred heritage. It represents the wealth and wisdom passed down through bloodlines, the sacred enclosure of family and tribe, and the claim to one's rightful inheritance — both material and spiritual. It connects the present to ancestral roots.",
    origin: "Elder Futhark runic alphabet (ancient Germanic/Norse tradition)",
    connectedEntities: ["Odin"],
    connectedSpells: ["Runic Bind Rune", "Earth Grounding", "Herb Pouch"],
    subliminalUse:
      "Use for subliminals about ancestral healing, reclaiming heritage, rooting into lineage strength, and home as sacred.",
  },
  {
    name: "Mjolnir (Thor's Hammer)",
    symbol: "🔨",
    category: "Norse",
    meaning:
      "Mjolnir is Thor's legendary hammer, symbol of divine strength, protection, and the sanctifying power of thunder. Worn as an amulet throughout the Viking Age, it protected against giants and chaos, blessed marriages and newborns, and consecrated sacred spaces. It represents power in service of protection.",
    origin: "Norse mythology, Viking Age (800-1100 CE)",
    connectedEntities: ["Thor"],
    connectedSpells: [
      "Protection Circle",
      "Fire Spell",
      "Knot Magic",
      "Runic Bind Rune",
    ],
    subliminalUse:
      "Use for subliminals about protective strength, holy power, consecrating your life, and embodying Thor's reliable vitality.",
  },
  {
    name: "Eye of Horus",
    symbol: "𓂀",
    category: "Egyptian",
    meaning:
      "The Eye of Horus (Wedjat) is an ancient Egyptian symbol of protection, royal power, and good health. After Horus's eye was gouged out in battle with Set and magically restored, it became the symbol of healing, wholeness, and divine sight. The Egyptians used mathematical fractions corresponding to its parts.",
    origin: "Ancient Egyptian mythology, associated with Horus and Ra",
    connectedEntities: ["Ra", "Isis", "Anubis"],
    connectedSpells: [
      "Fire Spell",
      "Healing Transmission",
      "Water Ritual",
      "Candle Magic",
    ],
    subliminalUse:
      "Use for subliminals about spiritual protection, healing, divine sight, and the restoration of wholeness after injury.",
  },
  {
    name: "Caduceus",
    symbol: "⚕",
    category: "Wisdom",
    meaning:
      "The Caduceus is the staff of Hermes/Mercury featuring two serpents coiling around a central rod topped with wings. It represents the healing of duality, the integration of opposing forces, Kundalini awakening, and the role of the messenger between worlds. The serpents represent the intertwining of wisdom and healing.",
    origin:
      "Ancient Greek mythology (Hermes), Roman mythology (Mercury), medical symbol",
    connectedEntities: ["Hermes", "Raphael", "The Serpent"],
    connectedSpells: ["Planetary Seal", "Talisman Creation", "Air Invocation"],
    subliminalUse:
      "Use for subliminals about Hermes energy, Mercury communication, healing duality, and Kundalini awakening.",
  },
  {
    name: "Hecate's Wheel",
    symbol: "☸",
    category: "Celtic",
    meaning:
      "Hecate's Wheel (or Strophalos of Hecate) is an ancient Greek symbol of the goddess of witchcraft. Its central spiral represents the serpent power and fire of transformation, while the labyrinthine outer ring represents the threefold nature of Hecate as maiden-mother-crone. It is used in modern Wicca and Hellenism.",
    origin:
      "Ancient Greek Chaldean Oracles, associated with Hecate (Greek goddess)",
    connectedEntities: ["Hecate"],
    connectedSpells: ["Moon Spell", "Protection Circle", "Mirror Magic"],
    subliminalUse:
      "Use for subliminals about Hecate energy, witchcraft power, liminal wisdom, and navigating life's crossroads.",
  },
  {
    name: "Leviathan Cross",
    symbol: "⛧",
    category: "Chaos/Left-Hand",
    meaning:
      "The Leviathan Cross (Sulfur symbol or Brimstone cross) is associated with the alchemical element of sulfur and adopted by the Church of Satan. It represents the infinity of the material world below and the cross of balance above — earthly existence as infinite and sacred. It symbolizes the self as center of the universe.",
    origin:
      "Medieval alchemy (sulfur symbol), Church of Satan (Anton LaVey, 1966)",
    connectedEntities: ["Lucifer", "The Shadow"],
    connectedSpells: ["Binding Spell", "Cord Cutting", "Desire Sigil"],
    subliminalUse:
      "Use for subliminals about radical self-focus, the infinite nature of earthly experience, and reclaiming personal power.",
  },
  {
    name: "Chaos Star",
    symbol: "⁂",
    category: "Chaos/Left-Hand",
    meaning:
      "The Chaos Star (or Symbol of Chaos) is an eight-pointed star representing the infinite possibilities of chaos magic. Created by Michael Moorcock and adopted by Peter Carroll's Chaos Magic, it represents the eight directions of possibility, the freedom from fixed belief systems, and magic as a purely pragmatic tool.",
    origin:
      "Michael Moorcock's Eternal Champion series (1965), Chaos Magic (Peter Carroll)",
    connectedEntities: ["Lucifer", "Loki", "Kali", "The Trickster"],
    connectedSpells: ["Chaos Magick Sigil", "Desire Sigil", "Sigil Charging"],
    subliminalUse:
      "Use for subliminals about infinite possibility, escaping limitation, belief flexibility, and radical creative freedom.",
  },
  {
    name: "Triskelion",
    symbol: "☯",
    category: "Celtic",
    meaning:
      "The Triskelion (or Triskele) is a motif of three interlocked spirals found prominently in Celtic art, especially at the Neolithic site of Newgrange, Ireland. It represents the three forces of motion, the three realms (land, sea, sky), and the cycles of life, death, and rebirth. It embodies dynamic forward movement.",
    origin:
      "Neolithic art (Newgrange, 3200 BCE), Celtic cultures, Greek coinage",
    connectedEntities: ["The Morrigan"],
    connectedSpells: ["Protection Circle", "Earth Grounding", "Herb Pouch"],
    subliminalUse:
      "Use for subliminals about dynamic momentum, threefold wisdom, Celtic ancestry, and the power of continuous forward motion.",
  },
  {
    name: "Solar Cross",
    symbol: "☀",
    category: "Planetary",
    meaning:
      "The Solar Cross (equal-armed cross within a circle) is one of the oldest symbols in human history, found across prehistoric Europe, the Americas, and Asia. It represents the cycle of the four seasons, the four cardinal directions, and the sun as the center of all life. It is the most ancient solar symbol.",
    origin:
      "Prehistoric (found globally), Hindu swastika origin, Nordic Bronze Age",
    connectedEntities: ["Ra", "Shango", "Oshun", "The Phoenix"],
    connectedSpells: ["Fire Spell", "Candle Magic", "Planetary Seal"],
    subliminalUse:
      "Use for subliminals about solar vitality, cosmic cycles, the four directions, and the life-giving power of the sun.",
  },
  {
    name: "Celtic Cross",
    symbol: "✚",
    category: "Celtic",
    meaning:
      "The Celtic Cross combines the Latin cross with a circle, representing the integration of the Christian cross with the earlier solar circle. Its four arms represent the four elements and four directions, while the circle represents the sun and eternity. It is a symbol of grounded spiritual authority.",
    origin:
      "Early Medieval Ireland (5th-6th c. CE), combining pre-Christian solar symbolism",
    connectedEntities: ["The Morrigan", "Cernunnos", "Brigid"],
    connectedSpells: ["Protection Circle", "Earth Grounding", "Knot Magic"],
    subliminalUse:
      "Use for subliminals about Celtic spiritual heritage, solar grounding, elemental balance, and sacred earthly authority.",
  },
  {
    name: "Hamsa",
    symbol: "🖐",
    category: "Protection",
    meaning:
      "The Hamsa (Hand of Fatima, Hand of Miriam) is a palm-shaped amulet used across the Middle East and North Africa for protection against the evil eye. Its five fingers represent the five senses and the five pillars of Islam. The central eye deflects negative energy and brings blessings, luck, and strength.",
    origin:
      "Ancient Middle East, Phoenicia; adopted by Islam (Hand of Fatima) and Judaism (Hand of Miriam)",
    connectedEntities: ["Oshun"],
    connectedSpells: [
      "Abundance Ritual",
      "Glamour Spell",
      "Jar Spell",
      "Energy Shield",
    ],
    subliminalUse:
      "Use for subliminals about protection from envy, attracting blessings, warding negative energy, and divine favor.",
  },
  {
    name: "Sigil of Maat",
    symbol: "𓃭",
    category: "Egyptian",
    meaning:
      "The Sigil of Maat represents Ma'at — the Egyptian goddess and principle of truth, justice, cosmic order, and balance. The ostrich feather of Ma'at was weighed against the heart of the deceased to determine worthiness for paradise. It symbolizes living in alignment with divine truth and cosmic harmony.",
    origin: "Ancient Egyptian cosmology, associated with the goddess Ma'at",
    connectedEntities: ["Isis", "Anubis", "Ra"],
    connectedSpells: ["Healing Transmission", "Cord Cutting", "Moon Spell"],
    subliminalUse:
      "Use for subliminals about living in truth, cosmic alignment, justice, and aligning your heart with divine balance.",
  },
  {
    name: "Sigil of Odin (Gungnir)",
    symbol: "ᚬ",
    category: "Norse",
    meaning:
      "Gungnir is Odin's magical spear crafted by the dwarves of Norse mythology. It always hits its mark and never misses, representing unerring intent, divine precision, and the focused will. It also symbolizes Odin's sacrifice — he hung from Yggdrasil for nine days, pierced by his own spear, to gain the wisdom of the runes.",
    origin: "Norse mythology, associated with Odin the Allfather",
    connectedEntities: ["Odin"],
    connectedSpells: ["Runic Bind Rune", "Talisman Creation", "Invocation"],
    subliminalUse:
      "Use for subliminals about unerring focus, Odin's wisdom, the power of sacrifice for growth, and precision of intent.",
  },
  {
    name: "Yin-Yang",
    symbol: "☯",
    category: "Wisdom",
    meaning:
      "The Yin-Yang (Taijitu) is the fundamental Taoist symbol of complementary opposites — dark and light, feminine and masculine, passive and active — each containing a seed of the other within itself. It represents the dynamic balance of all opposing forces, constant transformation, and the unity of duality.",
    origin: "Ancient Chinese Taoist philosophy (3rd century BCE and earlier)",
    connectedEntities: ["The Serpent"],
    connectedSpells: [
      "Healing Transmission",
      "Earth Grounding",
      "Sigil Charging",
    ],
    subliminalUse:
      "Use for subliminals about balance, integration of opposites, Taoist wisdom, and the dynamic harmony of all forces.",
  },
  {
    name: "Infinity Knot",
    symbol: "∞",
    category: "Sacred Geometry",
    meaning:
      "The Infinity symbol (lemniscate) represents boundlessness, eternal flow, and the endless cycle of energy. In mathematics it is the concept of infinity. In mysticism it represents the eternal flow of energy between polarities, the continuous loop of cause and effect, and limitless possibility and expansion.",
    origin:
      "Mathematical symbol (John Wallis, 1655), Celtic knotwork, Tibetan Buddhism",
    connectedEntities: ["The Serpent", "Metatron"],
    connectedSpells: ["Sigil Charging", "Moon Spell", "Abundance Ritual"],
    subliminalUse:
      "Use for subliminals about unlimited potential, infinite possibility, eternal flow, and transcending limitation.",
  },
  {
    name: "Sri Yantra",
    symbol: "⬡",
    category: "Sacred Geometry",
    meaning:
      "The Sri Yantra is the most revered and complex of all Hindu yantras, composed of nine interlocking triangles radiating from a central point (Bindu). It represents the totality of the cosmos, the union of Shiva and Shakti, and the journey from the manifest to the unmanifest divine. It is considered the geometric form of AUM.",
    origin:
      "Hindu Tantric tradition, Shaivism and Shaktism, ancient India (pre-1000 CE)",
    connectedEntities: ["Kali", "Ganesha", "Shiva"],
    connectedSpells: [
      "Chakra Clearing",
      "Abundance Ritual",
      "Earth Grounding",
      "Healing Transmission",
    ],
    subliminalUse:
      "Use for subliminals about cosmic alignment, the union of masculine and feminine divine, and accessing the geometric AUM of creation.",
  },
  {
    name: "Enochian Seal",
    symbol: "𝌌",
    category: "Planetary",
    meaning:
      "The Enochian system was revealed to John Dee and Edward Kelley in the 16th century through angelic communication. Enochian seals are complex geometric symbols assigned to specific angelic intelligences and aethyrs. They represent direct communication with the angelic hierarchy and access to the divine language of creation.",
    origin:
      "John Dee and Edward Kelley (16th c. England), Hermetic Order of the Golden Dawn",
    connectedEntities: ["Metatron", "Uriel", "Gabriel", "Michael", "Raphael"],
    connectedSpells: [
      "Invocation",
      "Sigil Charging",
      "Talisman Creation",
      "Planetary Seal",
    ],
    subliminalUse:
      "Use for subliminals about angelic communication, divine language, Enochian activation, and direct access to the angelic hierarchy.",
  },
  {
    name: "Bind Rune of Awakening",
    symbol: "ᚨ",
    category: "Wisdom",
    meaning:
      "A composite rune combining Ansuz (divine communication), Raidho (sacred journey), and Dagaz (breakthrough/dawn) — traditionally formed by overlapping the three runes into a single unified glyph. It represents the activation of spiritual awareness, the opening of channels to higher guidance, and the dawning of a new phase of consciousness.",
    origin: "Norse runic tradition, Elder Futhark",
    connectedEntities: ["Odin", "Freya", "The Sage"],
    connectedSpells: ["Sigil Charging", "Invocation", "Talisman Creation"],
    subliminalUse:
      "Use for subliminals about spiritual awakening, divine communication, and accessing higher states of consciousness and intuition.",
  },
  {
    name: "Sigil of Venus",
    symbol: "♀",
    category: "Love/Venus",
    meaning:
      "The planetary seal of Venus — circle atop a cross — is one of the most ancient and universally recognized symbols, appearing in biology (female sex symbol), planetary notation, and ceremonial magic as the seal of the sphere of love, beauty, and attraction. In Hermetic magic it governs all matters of the heart, art, and magnetic attraction.",
    origin: "Hermetic planetary tradition, Greco-Roman astrology",
    connectedEntities: ["Aphrodite / Venus", "Oshun", "Freya", "Lakshmi"],
    connectedSpells: ["Glamour Spell", "Candle Magic", "Desire Sigil"],
    subliminalUse:
      "Use for subliminals about love, attraction, beauty, artistic ability, and magnetic social presence.",
  },
  {
    name: "Sigil of Mars",
    symbol: "♂",
    category: "Power",
    meaning:
      "The planetary seal of Mars — circle with an arrow — governs will, action, courage, conflict, and physical vitality. In ceremonial magic it is the seal of the war sphere, but at a higher octave it represents disciplined will directed toward worthy goals. It empowers those who feel their action is blocked or their courage diminished.",
    origin: "Hermetic planetary tradition, Greco-Roman astrology",
    connectedEntities: ["Ares / Mars", "Thor", "Shango", "The Hero"],
    connectedSpells: ["Fire Spell", "Candle Magic", "Cord Binding Oath"],
    subliminalUse:
      "Use for subliminals about courage, willpower, physical strength, assertiveness, and the drive to take bold decisive action.",
  },
  {
    name: "Sigil of Saturn",
    symbol: "♄",
    category: "Chaos/Left-Hand",
    meaning:
      "Saturn's sigil governs time, limits, karma, discipline, and the hard-won wisdom of endurance. In ceremonial magic Saturn rules over binding, structure, and the long game — it rewards patience and punishes shortcuts. Used to establish lasting foundations, break karmic cycles, and build with permanence.",
    origin: "Hermetic planetary tradition, Greco-Roman astrology",
    connectedEntities: ["Chronos", "Odin", "Veles", "The Wise Old Man"],
    connectedSpells: ["Cord Binding Oath", "Talisman Creation", "Knot Magic"],
    subliminalUse:
      "Use for subliminals about discipline, patience, karmic resolution, building lasting foundations, and overcoming long-standing obstacles through persistent effort.",
  },
  {
    name: "Sigil of Jupiter",
    symbol: "♃",
    category: "Manifestation",
    meaning:
      "Jupiter's seal governs expansion, abundance, good fortune, and the sphere of higher ideals. It is the most traditionally benevolent of the planetary seals, associated with luck, wealth, and the ability to access opportunity. In Hermetic magic, Jupiter workings are done for growth, prosperity, and the expansion of potential in any area.",
    origin: "Hermetic planetary tradition, Greco-Roman astrology",
    connectedEntities: [
      "Zeus / Jupiter",
      "Thor",
      "Lakshmi",
      "The Ruler / Sovereign",
    ],
    connectedSpells: [
      "Abundance Ritual",
      "Candle Magic",
      "Solar Charging Ritual",
    ],
    subliminalUse:
      "Use for subliminals about financial abundance, luck, expansion, growth, and accessing opportunities that feel larger than your current circumstances.",
  },
  {
    name: "Trident of Poseidon",
    symbol: "⋔",
    category: "Egyptian",
    meaning:
      "The three-pronged trident represents the three aspects of water: surface (conscious), middle depths (subconscious), and the abyss (the unconscious). It is the symbol of dominion over the sea — the vast, boundless unconscious realm — and of authority over the emotional and intuitive dimensions of existence.",
    origin: "Greek mythology, Greco-Roman religion",
    connectedEntities: ["Poseidon / Neptune", "Shiva", "The Dragon"],
    connectedSpells: ["Water Ritual", "Lunar Drawing Down", "Void Meditation"],
    subliminalUse:
      "Use for subliminals about emotional mastery, depth of feeling, navigating the unconscious, and the authority that comes from having processed the full depth of your inner world.",
  },
  {
    name: "Kintsugi Symbol",
    symbol: "金",
    category: "Chaos/Left-Hand",
    meaning:
      "Derived from the Japanese art of repairing broken pottery with gold, the Kintsugi symbol represents the philosophy that breakage and repair are part of an object's history — not something to hide but to celebrate. As a sigil it represents the transformation of wounds into sources of beauty and strength.",
    origin: "Japanese wabi-sabi philosophy, Zen aesthetics",
    connectedEntities: [
      "The Phoenix",
      "The Shadow",
      "The Caregiver / Wounded Healer",
    ],
    connectedSpells: [
      "Cord Cutting",
      "Shadow Work Integration",
      "Healing Transmission",
    ],
    subliminalUse:
      "Use for subliminals about turning trauma into power, finding beauty in imperfection, and the transformation of wounds into the most luminous aspects of your identity.",
  },
  {
    name: "Sigil of the Abyss",
    symbol: "𝔄",
    category: "Wisdom",
    meaning:
      "The Abyss sigil draws from Kabbalistic and Thelemic traditions where the Abyss represents the gap between human consciousness and divine consciousness — a void that must be crossed for full spiritual adulthood. It is not a sign of darkness but of initiation — the willingness to release all familiar constructs of self.",
    origin: "Thelemic tradition, Aleister Crowley, Kabbalah (Daath)",
    connectedEntities: [
      "Azazel",
      "Lucifer",
      "The Shadow",
      "Choronzon (Thelema)",
    ],
    connectedSpells: [
      "Void Meditation",
      "Shadow Work Integration",
      "Cross-Roads Ritual",
    ],
    subliminalUse:
      "Use for subliminals about profound identity transformation, spiritual initiation, crossing major life thresholds, and the dissolution of limiting self-concepts.",
  },
  {
    name: "Sigil of Horus",
    symbol: "𓂀",
    category: "Power",
    meaning:
      "The Eye of Horus distinguished from the Eye of Ra in that Horus represents the active, living divine king — the principle of restored sovereignty after usurpation. The Horus sigil governs rightful power reclaimed, justice enacted, and the victory of the true will over those who would suppress it.",
    origin: "Ancient Egyptian mythology, Kemetic tradition",
    connectedEntities: ["Ra", "Isis", "The Ruler / Sovereign", "The Hero"],
    connectedSpells: ["Invocation", "Candle Magic", "Cord Binding Oath"],
    subliminalUse:
      "Use for subliminals about reclaiming your power, overcoming oppression, stepping into rightful leadership, and the restoration of justice in your personal circumstances.",
  },
  {
    name: "Black Sun (Sonnenrad)",
    symbol: "☀",
    category: "Power",
    meaning:
      "The Black Sun is a complex esoteric symbol representing the hidden or occult (literally hidden) sun — the spiritual sun behind the physical one, associated with the inner light of consciousness, shadow integration, and the alchemical nigredo (blackening) stage of transformation. In its highest interpretation it symbolizes enlightenment through darkness.",
    origin: "Alchemical tradition, European esoteric tradition",
    connectedEntities: [
      "Odin",
      "Tezcatlipoca",
      "The Shadow",
      "Lucifer (light-bearer aspect)",
    ],
    connectedSpells: [
      "Shadow Work Integration",
      "Void Meditation",
      "Sigil Charging",
    ],
    subliminalUse:
      "Use for subliminals about accessing your shadow, inner transformation through darkness, finding power in what was previously hidden or suppressed, and radical self-honesty.",
  },
  {
    name: "Eye of Ra",
    symbol: "☀",
    category: "Egyptian",
    meaning:
      "The Eye of Ra is a solar symbol representing the destructive power of the sun god Ra. It embodies divine protection, cosmic authority, and the fierce light that destroys obstacles. It is both a shield and a weapon of divine will.",
    origin: "Ancient Egyptian mythology",
    connectedEntities: ["Ra", "Horus", "Sekhmet"],
    connectedSpells: [
      "Solar Charging Ritual",
      "Candle Magic",
      "Protection Circle",
    ],
    subliminalUse:
      "Use for subliminals about solar empowerment, divine protection, obliterating obstacles, and channeling fierce life force.",
  },
  {
    name: "Helm of Awe (Aegishjalmur)",
    symbol: "ᚨ",
    category: "Norse",
    meaning:
      "The Helm of Awe is an ancient Norse symbol of protection and invincibility. Warriors would draw it on their foreheads before battle to invoke an aura of dread in their enemies. It represents the fearless warrior spirit and psychic armor.",
    origin: "Norse mythology, Elder Futhark runic tradition",
    connectedEntities: ["Odin", "Thor"],
    connectedSpells: ["Protection Circle", "Runic Bind Rune", "Energy Shield"],
    subliminalUse:
      "Use for subliminals about unshakeable confidence, psychic protection, overcoming fear, and projecting commanding presence.",
  },
  {
    name: "Vegvisir (Norse Compass)",
    symbol: "⊕",
    category: "Norse",
    meaning:
      "The Vegvisir is an Icelandic magical stave whose name means 'that which shows the way.' It is a symbol of finding one's path through storms and confusion, associated with Odin's wisdom and the power of divine navigation.",
    origin: "Icelandic grimoires, Norse tradition",
    connectedEntities: ["Odin"],
    connectedSpells: [
      "Cross-Roads Ritual",
      "Talisman Creation",
      "Runic Bind Rune",
    ],
    subliminalUse:
      "Use for subliminals about clarity of purpose, finding direction, navigating life's storms, and trusting your inner compass.",
  },
  {
    name: "Ouroboros",
    symbol: "🔄",
    category: "Sacred Geometry",
    meaning:
      "The Ouroboros depicts a serpent eating its own tail, symbolizing eternal cycles, infinite renewal, and the unity of beginning and end. It represents the self-contained infinite — the universe that feeds itself, the cycle of death and rebirth, and the eternal present.",
    origin:
      "Ancient Egyptian, Greek Hermetic, and Norse (Jormungandr) traditions",
    connectedEntities: ["Hermes Trismegistus", "Jormungandr", "The Serpent"],
    connectedSpells: ["Reality Scripting", "Sigil Charging", "Moon Spell"],
    subliminalUse:
      "Use for subliminals about breaking cycles, embracing transformation, eternal renewal, and completing karmic loops.",
  },
  {
    name: "Hamsa Hand",
    symbol: "🖐",
    category: "Protection",
    meaning:
      "The Hamsa Hand is a palm-shaped amulet found across the Middle East and North Africa. It represents the hand of God offering protection against the evil eye, luck, and divine blessing. The open hand symbolizes blessings flowing outward and shields flowing inward.",
    origin:
      "Middle Eastern, Jewish (Miriam's Hand), Islamic, and Hindu traditions",
    connectedEntities: ["Fatima", "Miriam", "Shiva"],
    connectedSpells: [
      "Protection Circle",
      "Energy Shield",
      "Talisman Creation",
    ],
    subliminalUse:
      "Use for subliminals about protection from negative energy, attracting divine blessing, and shielding your energy field.",
  },
  {
    name: "Flower of Life",
    symbol: "✿",
    category: "Sacred Geometry",
    meaning:
      "The Flower of Life is a sacred geometric pattern of 19 overlapping circles that contains the mathematical basis of all existence. Found across ancient temples worldwide, it represents the unity of all creation, the blueprint of the universe, and the template from which all life emerges.",
    origin: "Ancient Egypt, Assyria, India, China, worldwide — truly universal",
    connectedEntities: ["Metatron", "Thoth"],
    connectedSpells: ["Talisman Creation", "Sigil Charging", "Planetary Seal"],
    subliminalUse:
      "Use for subliminals about unity consciousness, creation, divine alignment, and connecting to the source blueprint of existence.",
  },
  {
    name: "Alchemy Fire Triangle",
    symbol: "△",
    category: "Power",
    meaning:
      "The upward-pointing triangle is the alchemical symbol for Fire — the masculine principle, will, transformation, and ascending energy. It represents the drive to evolve, to transmute base matter into gold, and the active force of spiritual will imposing itself on the world.",
    origin: "Hermetic alchemy, Western esoteric tradition",
    connectedEntities: ["Prometheus", "Hephaestus", "Ra"],
    connectedSpells: ["Solar Charging Ritual", "Fire Spell", "Candle Magic"],
    subliminalUse:
      "Use for subliminals about willpower, transformation, masculine energy, ambition, and alchemizing your circumstances.",
  },
  {
    name: "Triquetra",
    symbol: "☘",
    category: "Celtic",
    meaning:
      "The Triquetra (Celtic triple knot) is a symbol of the triple goddess — Maiden, Mother, and Crone — and the trinity of mind, body, and spirit. Its three interlocking arcs represent wholeness through three unified aspects, the endless cycle of life, and the power of sacred three.",
    origin: "Celtic tradition, Norse paganism, Wicca and modern neopaganism",
    connectedEntities: ["The Morrigan", "Hecate", "Brigid"],
    connectedSpells: ["Witch's Ladder", "Moon Spell", "Knot Magic"],
    subliminalUse:
      "Use for subliminals about the triple goddess, integration of mind/body/spirit, Wiccan practice, and sacred feminine power.",
  },
];

const CATEGORY_COLORS: Record<SigilCategory, string> = {
  Protection: "oklch(0.62 0.22 295)",
  Manifestation: "oklch(0.72 0.2 70)",
  Wisdom: "oklch(0.72 0.15 200)",
  "Love/Venus": "oklch(0.65 0.22 350)",
  Power: "oklch(0.65 0.22 30)",
  Planetary: "oklch(0.78 0.15 85)",
  Norse: "oklch(0.6 0.18 220)",
  Egyptian: "oklch(0.72 0.18 50)",
  "Chaos/Left-Hand": "oklch(0.5 0.18 300)",
  "Sacred Geometry": "oklch(0.68 0.18 195)",
  Celtic: "oklch(0.62 0.2 145)",
};

const CATEGORIES: Array<"All" | SigilCategory> = [
  "All",
  "Protection",
  "Manifestation",
  "Wisdom",
  "Love/Venus",
  "Power",
  "Planetary",
  "Norse",
  "Egyptian",
  "Chaos/Left-Hand",
  "Sacred Geometry",
  "Celtic",
];

interface SigilsPageProps {
  onUseForSubliminal: (topic: string) => void;
  onNavigate: (page: string) => void;
}

function ConnectionChips({
  label,
  items,
  chipColor,
  onClick,
}: {
  label: string;
  items: string[];
  chipColor: string;
  onClick: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <p
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: `${chipColor}bb` }}
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={onClick}
            className="text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all duration-150 hover:scale-105"
            style={{
              background: `${chipColor}15`,
              color: chipColor,
              border: `1px solid ${chipColor}35`,
            }}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SigilsPage({
  onUseForSubliminal,
  onNavigate,
}: SigilsPageProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | SigilCategory>(
    "All",
  );
  const [selectedSigil, setSelectedSigil] = useState<Sigil | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    return SIGILS.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch =
        search === "" ||
        s.name.toLowerCase().includes(q) ||
        s.meaning.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q) ||
        s.connectedEntities.some((e) => e.toLowerCase().includes(q)) ||
        s.connectedSpells.some((sp) => sp.toLowerCase().includes(q));
      const matchesCat =
        activeCategory === "All" || s.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [search, activeCategory]);

  const handleOpen = (sigil: Sigil) => {
    setSelectedSigil(sigil);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setTimeout(() => setSelectedSigil(null), 300);
  };

  const selectedColor = selectedSigil
    ? CATEGORY_COLORS[selectedSigil.category]
    : "oklch(0.62 0.22 295)";

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
            <Star className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl font-bold gradient-text">
          Sigil Codex
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          A complete catalog of magical seals, sacred symbols, and sigils from
          across traditions — each connected to specific entities, spells, and
          subliminal applications. Click any sigil to explore its full meaning
          and connections.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {CATEGORIES.slice(1).map((cat) => {
            const color = CATEGORY_COLORS[cat];
            const count = SIGILS.filter((s) => s.category === cat).length;
            if (count === 0) return null;
            return (
              <Badge
                key={cat}
                className="text-xs font-mono"
                style={{
                  background: `${color}20`,
                  color,
                  border: `1px solid ${color}40`,
                }}
              >
                {count} {cat}
              </Badge>
            );
          })}
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
            data-ocid="sigils.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sigils, meanings, entities, spells..."
            className="pl-10 pr-10 bg-secondary/30 border-border/50 focus:border-primary/50"
          />
          {search && (
            <button
              type="button"
              data-ocid="sigils.search.close_button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2" data-ocid="sigils.filter.tab">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const color =
              cat === "All" ? "oklch(0.62 0.22 295)" : CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                type="button"
                data-ocid={`sigils.${cat.toLowerCase().replace(/[^a-z0-9]/g, "_")}.tab`}
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

      {(search || activeCategory !== "All") && (
        <p className="text-muted-foreground text-sm">
          Showing {filtered.length} of {SIGILS.length} sigils
        </p>
      )}

      {/* Sigil Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <AnimatePresence>
          {filtered.map((sigil, idx) => {
            const color = CATEGORY_COLORS[sigil.category];
            return (
              <motion.button
                key={sigil.name}
                type="button"
                data-ocid={`sigils.item.${idx + 1}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                whileHover={{ y: -3, scale: 1.02 }}
                onClick={() => handleOpen(sigil)}
                className="rounded-2xl border bg-secondary/20 p-4 space-y-3 text-left hover:bg-secondary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                style={{ borderColor: `${color}30` }}
              >
                {/* Symbol */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-3xl select-none"
                  style={{
                    background: `radial-gradient(circle, ${color}25, ${color}08)`,
                    border: `1px solid ${color}40`,
                    boxShadow: `0 0 16px ${color}15`,
                  }}
                >
                  {sigil.symbol}
                </div>

                {/* Name & Category */}
                <div className="text-center space-y-1">
                  <h3
                    className="font-heading font-bold text-xs sm:text-sm leading-tight"
                    style={{ color }}
                  >
                    {sigil.name}
                  </h3>
                  <Badge
                    className="text-xs mx-auto"
                    style={{
                      background: `${color}15`,
                      color,
                      border: `1px solid ${color}30`,
                    }}
                  >
                    {sigil.category}
                  </Badge>
                </div>

                {/* Short meaning */}
                <p className="text-xs text-muted-foreground line-clamp-2 text-center leading-relaxed">
                  {sigil.meaning.split(".")[0]}.
                </p>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 space-y-3"
          data-ocid="sigils.empty_state"
        >
          <Star className="w-12 h-12 text-muted-foreground/40 mx-auto" />
          <p className="text-muted-foreground">
            No sigils found for &quot;{search}&quot;
          </p>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="sigils.clear.button"
            onClick={() => {
              setSearch("");
              setActiveCategory("All");
            }}
          >
            Clear filters
          </Button>
        </motion.div>
      )}

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent
          data-ocid="sigils.dialog"
          className="max-w-2xl max-h-[88vh] overflow-y-auto"
          style={{
            background: "oklch(0.1 0.02 275)",
            borderColor: `${selectedColor}40`,
          }}
        >
          {selectedSigil && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-4xl select-none"
                    style={{
                      background: `radial-gradient(circle, ${selectedColor}30, ${selectedColor}08)`,
                      border: `1px solid ${selectedColor}50`,
                      boxShadow: `0 0 24px ${selectedColor}20`,
                    }}
                  >
                    {selectedSigil.symbol}
                  </div>
                  <div className="space-y-1 pt-1">
                    <DialogTitle
                      className="font-heading text-xl sm:text-2xl font-bold leading-tight"
                      style={{ color: selectedColor }}
                    >
                      {selectedSigil.name}
                    </DialogTitle>
                    <Badge
                      className="text-xs"
                      style={{
                        background: `${selectedColor}20`,
                        color: selectedColor,
                        border: `1px solid ${selectedColor}40`,
                      }}
                    >
                      {selectedSigil.category}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {selectedSigil.origin}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5 mt-2">
                {/* Full Meaning */}
                <div className="space-y-2">
                  <h4
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: `${selectedColor}cc` }}
                  >
                    Meaning & Symbolism
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {selectedSigil.meaning}
                  </p>
                </div>

                {/* Subliminal Use */}
                <div
                  className="p-3 rounded-xl space-y-1"
                  style={{
                    background: `${selectedColor}10`,
                    border: `1px solid ${selectedColor}30`,
                  }}
                >
                  <h4
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: selectedColor }}
                  >
                    ✦ Subliminal Application
                  </h4>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: `${selectedColor}cc` }}
                  >
                    {selectedSigil.subliminalUse}
                  </p>
                </div>

                {/* Connections */}
                <div className="space-y-3">
                  <h4
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: `${selectedColor}cc` }}
                  >
                    ◈ Connections
                  </h4>

                  <ConnectionChips
                    label="👁 Connected Entities"
                    items={selectedSigil.connectedEntities}
                    chipColor="oklch(0.68 0.18 195)"
                    onClick={() => {
                      onNavigate("entities");
                      handleClose();
                    }}
                  />

                  <ConnectionChips
                    label="⚔ Connected Spells"
                    items={selectedSigil.connectedSpells}
                    chipColor="oklch(0.62 0.22 295)"
                    onClick={() => {
                      onNavigate("spells");
                      handleClose();
                    }}
                  />
                </div>

                {/* Actions */}
                <Button
                  size="sm"
                  data-ocid="sigils.use.button"
                  onClick={() => {
                    onUseForSubliminal(
                      `${selectedSigil.name} sigil activation and manifestation`,
                    );
                    handleClose();
                  }}
                  className="w-full gap-2 text-xs"
                  style={{
                    background: `${selectedColor}20`,
                    border: `1px solid ${selectedColor}50`,
                    color: selectedColor,
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  Use for Subliminal
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
