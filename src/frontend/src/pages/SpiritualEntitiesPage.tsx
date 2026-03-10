import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ghost, Search, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

type EntityType =
  | "Angel"
  | "Demon"
  | "Deity"
  | "Spirit"
  | "Archetype"
  | "Egregore";

interface SpiritualEntity {
  name: string;
  type: EntityType;
  subCategory?: string;
  origin: string;
  domain: string;
  context: string;
  psychologicalMeaning: string;
  archetypalNote?: string;
  relatedSpells?: string[];
  relatedSigils?: string[];
}

const ENTITY_CONNECTIONS: Record<
  string,
  { relatedSpells: string[]; relatedSigils: string[] }
> = {
  Michael: {
    relatedSpells: ["Protection Circle", "LBRP", "Energy Shield"],
    relatedSigils: ["Seal of Solomon", "Pentagram (Pentacle)", "Algiz (Rune)"],
  },
  Gabriel: {
    relatedSpells: ["Moon Spell", "Air Invocation", "Invocation"],
    relatedSigils: ["Seal of Solomon", "Eye of Providence"],
  },
  Raphael: {
    relatedSpells: ["Healing Transmission", "Chakra Clearing", "Water Ritual"],
    relatedSigils: ["Caduceus", "Seal of Solomon"],
  },
  Uriel: {
    relatedSpells: ["Fire Spell", "Talisman Creation", "Planetary Seal"],
    relatedSigils: ["Eye of Providence", "Metatron's Cube"],
  },
  Metatron: {
    relatedSpells: ["Sigil Charging", "Planetary Seal", "Talisman Creation"],
    relatedSigils: [
      "Metatron's Cube",
      "Flower of Life",
      "Tree of Life (Kabbalah)",
    ],
  },
  Lucifer: {
    relatedSpells: ["Sigil Charging", "Desire Sigil", "Chaos Magick Sigil"],
    relatedSigils: ["Sigil of Lucifer", "Leviathan Cross", "Chaos Star"],
  },
  Lilith: {
    relatedSpells: ["Binding Spell", "Cord Cutting", "Mirror Magic"],
    relatedSigils: ["Sigil of Baphomet", "Triquetra"],
  },
  Azazel: {
    relatedSpells: [
      "Sigil Charging",
      "Talisman Creation",
      "Chaos Magick Sigil",
    ],
    relatedSigils: ["Sigil of Azazel", "Pentagram (Pentacle)"],
  },
  Baphomet: {
    relatedSpells: ["LBRP", "Invocation", "Chaos Magick Sigil"],
    relatedSigils: [
      "Sigil of Baphomet",
      "Hexagram (Star of David)",
      "Chaos Star",
    ],
  },
  Asmodeus: {
    relatedSpells: ["Glamour Spell", "Desire Sigil", "Jar Spell"],
    relatedSigils: ["Sigil of Asmodeus"],
  },
  Odin: {
    relatedSpells: ["Runic Bind Rune", "Talisman Creation", "Invocation"],
    relatedSigils: ["Valknut", "Vegvisir", "Algiz (Rune)", "Othala (Rune)"],
  },
  Thor: {
    relatedSpells: ["Protection Circle", "Fire Spell", "Knot Magic"],
    relatedSigils: ["Mjolnir (Thor's Hammer)", "Algiz (Rune)"],
  },
  Freya: {
    relatedSpells: ["Glamour Spell", "Moon Spell", "Abundance Ritual"],
    relatedSigils: ["Triquetra", "Vegvisir"],
  },
  Ra: {
    relatedSpells: ["Fire Spell", "Candle Magic", "Planetary Seal"],
    relatedSigils: ["Ankh", "Solar Cross", "Eye of Horus"],
  },
  Anubis: {
    relatedSpells: ["Cord Cutting", "Sigil Charging", "Herb Pouch"],
    relatedSigils: ["Ankh", "Eye of Horus"],
  },
  Isis: {
    relatedSpells: ["Healing Transmission", "Moon Spell", "Invocation"],
    relatedSigils: ["Ankh", "Eye of Horus", "Sigil of Maat"],
  },
  Hecate: {
    relatedSpells: ["Moon Spell", "Protection Circle", "Mirror Magic"],
    relatedSigils: ["Hecate's Wheel", "Triquetra", "Pentagram (Pentacle)"],
  },
  Hermes: {
    relatedSpells: ["Planetary Seal", "Talisman Creation", "Air Invocation"],
    relatedSigils: ["Caduceus", "Seal of Solomon"],
  },
  Kali: {
    relatedSpells: ["Fire Spell", "Binding Spell", "Cord Cutting"],
    relatedSigils: ["Sri Yantra", "Chaos Star"],
  },
  Ganesha: {
    relatedSpells: ["Abundance Ritual", "Earth Grounding", "Talisman Creation"],
    relatedSigils: ["Sri Yantra", "Flower of Life"],
  },
  Loki: {
    relatedSpells: ["Chaos Magick Sigil", "Desire Sigil", "Glamour Spell"],
    relatedSigils: ["Vegvisir", "Chaos Star"],
  },
  "The Morrigan": {
    relatedSpells: ["Protection Circle", "Binding Spell", "Fire Spell"],
    relatedSigils: ["Triquetra", "Celtic Cross", "Triskelion"],
  },
  Oshun: {
    relatedSpells: ["Abundance Ritual", "Glamour Spell", "Water Ritual"],
    relatedSigils: ["Hamsa", "Solar Cross"],
  },
  Shango: {
    relatedSpells: ["Fire Spell", "Candle Magic", "Invocation"],
    relatedSigils: ["Valknut", "Solar Cross"],
  },
  "The Shadow": {
    relatedSpells: ["Mirror Magic", "Cord Cutting", "Chaos Magick Sigil"],
    relatedSigils: ["Leviathan Cross", "Sigil of Lucifer"],
  },
  "The Trickster": {
    relatedSpells: ["Chaos Magick Sigil", "Desire Sigil", "Glamour Spell"],
    relatedSigils: ["Chaos Star", "Ouroboros"],
  },
  "The Phoenix": {
    relatedSpells: ["Fire Spell", "Cord Cutting", "Candle Magic"],
    relatedSigils: ["Ankh", "Solar Cross", "Ouroboros"],
  },
  "The Dragon": {
    relatedSpells: ["Invocation", "Fire Spell", "Talisman Creation"],
    relatedSigils: ["Pentagram (Pentacle)", "Ouroboros"],
  },
  "The Serpent": {
    relatedSpells: [
      "Healing Transmission",
      "Earth Grounding",
      "Sigil Charging",
    ],
    relatedSigils: ["Caduceus", "Ouroboros", "Yin-Yang"],
  },
};

const ENTITIES: SpiritualEntity[] = [
  // ── Angels ─────────────────────────────────────────────────────────────────
  {
    name: "Michael",
    type: "Angel",
    origin: "Abrahamic (Jewish, Christian, Islamic)",
    domain: "Protection, justice, spiritual warfare, courage",
    context:
      "Archangel Michael is the foremost warrior angel in Abrahamic traditions, often depicted with a sword and armor. He is the leader of God's celestial army and the protector of humanity against spiritual adversity.",
    psychologicalMeaning:
      "Michael represents the archetype of the inner protector — the part of yourself that stands firm against fear, enforces boundaries, and champions what is right.",
  },
  {
    name: "Gabriel",
    type: "Angel",
    origin: "Abrahamic (Jewish, Christian, Islamic)",
    domain: "Divine messages, communication, revelation, creativity",
    context:
      "Archangel Gabriel is the divine messenger who announced the births of John the Baptist and Jesus. In Islam, Gabriel (Jibril) delivered the Quran to Muhammad. Gabriel represents the bridge between heaven and earth through sacred communication.",
    psychologicalMeaning:
      "Gabriel embodies the archetype of inner voice and authentic expression — the ability to receive higher guidance and translate it into clear, inspired communication.",
  },
  {
    name: "Raphael",
    type: "Angel",
    origin: "Abrahamic (Jewish, Christian)",
    domain: "Healing, restoration, travel, knowledge",
    context:
      "Archangel Raphael is the great healer of the Abrahamic tradition, his name meaning 'God heals.' He appears in the Book of Tobit as a guide and healer. Raphael is associated with medicine, restoration of health, and safe journeys.",
    psychologicalMeaning:
      "Raphael represents the body's innate healing intelligence and the mind's capacity for restoration — the integrative force that returns you to wholeness.",
  },
  {
    name: "Uriel",
    type: "Angel",
    origin: "Jewish and early Christian tradition",
    domain: "Wisdom, illumination, prophetic vision, earth energies",
    context:
      "Archangel Uriel is associated with divine wisdom and the sacred fire of illumination. His name means 'Light of God' or 'Fire of God.' Uriel guards the gates of Eden and is sometimes called the Archangel of prophecy and earth.",
    psychologicalMeaning:
      "Uriel embodies intellectual and intuitive illumination — the flash of insight, the sudden knowing, the mind lit from within by clarity and understanding.",
  },
  {
    name: "Metatron",
    type: "Angel",
    origin: "Jewish mysticism (Kabbalah)",
    domain:
      "Sacred geometry, divine record-keeping, transformation, cosmic order",
    context:
      "Metatron is one of the most exalted angels in Kabbalistic tradition, said to have been the prophet Enoch transformed into an angelic being. He governs the Akashic records and is associated with Metatron's Cube, a sacred geometric figure encoding the Platonic solids.",
    psychologicalMeaning:
      "Metatron represents the highest organizing principle of consciousness — the aspect of mind that perceives divine order, pattern, and the deep structure underlying reality.",
  },
  {
    name: "Azrael",
    type: "Angel",
    origin: "Islamic and Jewish tradition",
    domain: "Transition, endings, release, comfort in grief",
    context:
      "Azrael is the Angel of Death in Islamic and some Jewish traditions. Far from being fearsome, Azrael is often portrayed as deeply compassionate, present at every transition and ending, gently guiding souls between states of being.",
    psychologicalMeaning:
      "Azrael represents the power of conscious release and transformation — the ability to let go of what has served its purpose, making space for renewal and rebirth.",
  },
  {
    name: "Jophiel",
    type: "Angel",
    origin: "Jewish tradition and New Age spirituality",
    domain: "Beauty, wisdom, creativity, illumination, joy",
    context:
      "Archangel Jophiel, whose name means 'Beauty of God,' is the angel of beauty and wisdom in angelology. She is associated with creativity, positive thinking, and helping souls recognize the beauty and divine order in their lives.",
    psychologicalMeaning:
      "Jophiel embodies aesthetic intelligence and the capacity to perceive beauty as a spiritual practice — transforming perception so that life itself becomes art.",
  },
  {
    name: "Chamuel",
    type: "Angel",
    origin: "Jewish and New Age traditions",
    domain: "Love, compassion, self-love, finding what is lost",
    context:
      "Archangel Chamuel (Camael) is associated with unconditional love, peaceful relationships, and self-compassion. His name means 'He who sees God' or 'He who seeks God.' Chamuel helps in finding lost objects, relationships, and inner peace.",
    psychologicalMeaning:
      "Chamuel represents the heart's capacity for unconditional acceptance — both of others and of oneself — and the power of love as a navigational force in life.",
  },
  // ── Demons (archetypal / mythological) ─────────────────────────────────────
  {
    name: "Lucifer",
    type: "Demon",
    origin: "Roman mythology, Christian tradition",
    domain: "Light, illumination, pride, ambition, self-sovereignty",
    context:
      "The name Lucifer means 'Light-Bringer' or 'Morning Star' in Latin, originally referring to the planet Venus at dawn. In the Christian tradition, Lucifer became associated with the fallen angel of pride. In esoteric and philosophical traditions, Lucifer is interpreted as the archetype of enlightenment and the courage to question authority.",
    psychologicalMeaning:
      "As an archetypal construct, Lucifer represents the drive toward intellectual illumination, radical self-authority, and the refusal to accept limitation. He embodies the part of the psyche that dares to question, to rise, and to seek light at any cost.",
    archetypalNote:
      "Archetypal/esoteric interpretation — this is a symbolic and philosophical construct, not a literal being.",
  },
  {
    name: "Lilith",
    type: "Demon",
    origin: "Ancient Mesopotamian and Jewish mythology",
    domain:
      "Sovereignty, fierce independence, primal feminine power, shadow integration",
    context:
      "Lilith appears in ancient Sumerian mythology as a wind demon and in Jewish legend as Adam's first wife who refused subservience. She fled the Garden of Eden, choosing exile over submission. In modern esoteric thought, Lilith represents reclaimed feminine power and authentic self-expression.",
    psychologicalMeaning:
      "Lilith as archetype represents radical self-sovereignty, boundary-setting, and the integration of the shadow self. She is the voice that refuses to diminish itself for the comfort of others.",
    archetypalNote:
      "Archetypal/esoteric interpretation — Lilith is a mythological/symbolic construct representing aspects of the feminine psyche and self-sovereignty.",
  },
  {
    name: "Azazel",
    type: "Demon",
    origin: "Jewish Enochian and biblical tradition",
    domain:
      "Knowledge of hidden arts, scapegoating dynamics, transformation through the wilderness",
    context:
      "Azazel appears in the Book of Enoch as a Watcher who taught humans forbidden knowledge — metalworking, cosmetics, and magic. In the Day of Atonement ritual, the 'scapegoat' was sent into the wilderness for Azazel, symbolizing the projection of communal shadow.",
    psychologicalMeaning:
      "Azazel represents the archetype of forbidden knowledge and the psychological mechanism of projection — the wisdom gained by reclaiming what we have cast out and integrating what we have denied.",
    archetypalNote:
      "Archetypal/esoteric interpretation — Azazel is a mythological and symbolic figure from ancient texts.",
  },
  {
    name: "Baphomet",
    type: "Demon",
    origin: "Medieval European esoteric tradition, Knights Templar mythology",
    domain: "Duality, balance, hidden wisdom, union of opposites",
    context:
      "Baphomet is an esoteric figure depicted as a winged, androgynous being with the head of a goat, pointing one hand up and one down — embodying the Hermetic principle 'as above, so below.' The symbol was created by Eliphas Lévi in the 19th century to represent the integration of all polarities.",
    psychologicalMeaning:
      "Baphomet as an esoteric symbol represents the integration of opposites within the psyche — masculine and feminine, light and dark, conscious and unconscious — achieving wholeness through the union of all aspects of self.",
    archetypalNote:
      "Esoteric symbol — Baphomet is an occult symbolic construct representing philosophical duality, not a literal being.",
  },
  {
    name: "Mephistopheles",
    type: "Demon",
    origin: "German folklore and Faust legend (literary archetype)",
    domain: "Deals and bargains, intellect, temptation, shadow desires",
    context:
      "Mephistopheles is the demonic tempter in the German Faust legend, most famously in Goethe's Faust. He makes deals, offering knowledge and pleasure in exchange for the soul. As a literary and philosophical figure, he represents the seductive voice of immediate gratification versus long-term growth.",
    psychologicalMeaning:
      "Mephistopheles symbolizes the part of the psyche that offers shortcuts — the inner voice that tempts you away from your higher path. Integrating this energy means acknowledging desire while redirecting it toward authentic fulfillment.",
    archetypalNote:
      "Literary/archetypal construct — Mephistopheles is a fictional and philosophical character from mythology and literature.",
  },
  {
    name: "Belial",
    type: "Demon",
    origin: "Hebrew Bible and Judeo-Christian tradition",
    domain:
      "Lawlessness, self-interest, earthly power, the shadow of authority",
    context:
      "Belial appears in the Hebrew Bible as a word meaning 'worthlessness' or 'wickedness,' personified as an adversarial force opposed to divine order. In esoteric traditions, Belial represents the principle of radical self-law — existence without external authority.",
    psychologicalMeaning:
      "Belial archetypally represents the shadow of autonomy — the need to examine which rules and authorities you have internalized and whether they serve your authentic development or limit it.",
    archetypalNote:
      "Archetypal/esoteric interpretation — Belial is a mythological and textual symbolic construct.",
  },
  {
    name: "Asmodeus",
    type: "Demon",
    origin: "Jewish and Persian mythology",
    domain: "Passion, desire, lust, the shadow of pleasure",
    context:
      "Asmodeus appears in the Book of Tobit and later demonology as a demon of lust and passion. In Persian mythology, he may derive from Aeshma Daeva, the demon of wrath. In esoteric thought, Asmodeus represents the shadow energy of unintegrated passion and the power of desire when consciously channeled.",
    psychologicalMeaning:
      "Asmodeus represents the archetype of passionate desire — neither evil nor good in itself, but a powerful force that can either control you or, when consciously integrated, fuel extraordinary creative and vital energy.",
    archetypalNote:
      "Archetypal/esoteric interpretation — Asmodeus is a mythological symbolic construct representing aspects of desire and passion in the human psyche.",
  },
  // ── Deities ─────────────────────────────────────────────────────────────────
  {
    name: "Odin",
    type: "Deity",
    origin: "Norse mythology",
    domain: "Wisdom, knowledge, poetry, war, death, magic, runes",
    context:
      "Odin is the Allfather of the Norse pantheon, the god of wisdom, war, poetry, and death. He sacrificed his eye to drink from Mimir's well of wisdom and hung himself from Yggdrasil for nine days to gain knowledge of the runes. Odin represents the relentless pursuit of wisdom at any cost.",
    psychologicalMeaning:
      "Odin embodies the archetype of the Seeker — the one who sacrifices comfort and certainty in the pursuit of deeper truth, mastery, and the ability to navigate between worlds.",
  },
  {
    name: "Thor",
    type: "Deity",
    origin: "Norse mythology",
    domain: "Thunder, strength, protection of humanity, storms, vitality",
    context:
      "Thor is the Norse god of thunder, wielding his legendary hammer Mjölnir. He is the protector of Asgard and humanity against giants and chaos. Thor represents raw vitality, loyalty, and the unshakeable force that defends what is sacred.",
    psychologicalMeaning:
      "Thor embodies the archetype of reliable strength — the part of you that shows up consistently, weathers storms, and uses power in service of protection rather than domination.",
  },
  {
    name: "Freya",
    type: "Deity",
    origin: "Norse mythology",
    domain: "Love, beauty, fertility, war, magic (seidr), wisdom, gold",
    context:
      "Freya is the Norse goddess of love, beauty, fertility, and magic. She is a master of seidr, a form of Norse sorcery, and claims half of those who fall in battle. Freya embodies the integration of beauty and power, love and fierce sovereignty.",
    psychologicalMeaning:
      "Freya represents the archetype of sacred feminine power — the integration of receptive, nurturing love with fierce, uncompromising warrior energy and magical intuition.",
  },
  {
    name: "Ra",
    type: "Deity",
    origin: "Ancient Egyptian mythology",
    domain: "Sun, creation, kingship, life, cosmic order",
    context:
      "Ra is the Egyptian sun god, creator of all things, and the supreme deity of the Egyptian pantheon. He travels through the sky each day in his solar barque, bringing light and life, and battles the chaos serpent Apep each night in the underworld, ensuring the sun rises again.",
    psychologicalMeaning:
      "Ra represents the archetype of life-giving illumination — the central organizing principle of consciousness, the part of you that brings clarity, direction, and vitality to each new day.",
  },
  {
    name: "Anubis",
    type: "Deity",
    origin: "Ancient Egyptian mythology",
    domain:
      "Death, embalming, transition, weighing of the heart, protection of the dead",
    context:
      "Anubis is the jackal-headed god of death and embalming in Egyptian mythology. He guides souls through the Duat (underworld) and oversees the Weighing of the Heart ceremony, where the deceased's heart is weighed against the feather of Ma'at (truth).",
    psychologicalMeaning:
      "Anubis embodies the archetype of conscious transition — the guide through threshold moments, losses, and endings, ensuring that what is truly weighty in life is recognized and honored.",
  },
  {
    name: "Isis",
    type: "Deity",
    origin: "Ancient Egyptian mythology",
    domain: "Magic, healing, motherhood, protection, resurrection, wisdom",
    context:
      "Isis is one of the most powerful and beloved deities of ancient Egypt. She reassembled and resurrected her husband Osiris after his murder, conceived Horus through divine magic, and is the archetypal great mother and master magician. Her cult spread throughout the Greco-Roman world.",
    psychologicalMeaning:
      "Isis represents the archetype of divine feminine wisdom — the integrative power that heals fragmentation, the nurturing force that resurrects what has been broken, and the magical intelligence of unconditional love.",
  },
  {
    name: "Hecate",
    type: "Deity",
    origin: "Ancient Greek mythology",
    domain:
      "Magic, witchcraft, crossroads, the moon, necromancy, wisdom of liminal spaces",
    context:
      "Hecate is the goddess of magic, witchcraft, and crossroads in Greek mythology. She is a liminal deity — powerful at thresholds, transitions, and the spaces between worlds. She holds torches and guides souls, and is a patroness of witches and those who work with the unseen.",
    psychologicalMeaning:
      "Hecate embodies the archetype of liminal wisdom — the intelligence that emerges at crossroads and choice points, the capacity to navigate uncertainty, and the power that comes from embracing the unknown.",
  },
  {
    name: "Hermes",
    type: "Deity",
    origin: "Ancient Greek mythology",
    domain:
      "Communication, travel, merchants, trickery, boundaries, psychopomp",
    context:
      "Hermes is the swift messenger of the gods in Greek mythology, patron of travelers, thieves, and merchants. As a psychopomp, he guides souls to the underworld. His Roman equivalent Mercury governs communication, intelligence, and commerce. Hermes Trismegistus is the divine source of Hermetic philosophy.",
    psychologicalMeaning:
      "Hermes represents the archetype of quicksilver intelligence — the mind that moves between realms, connects disparate ideas, and bridges the conscious and unconscious with wit and ease.",
  },
  {
    name: "Kali",
    type: "Deity",
    origin: "Hindu mythology",
    domain:
      "Time, transformation, destruction of the ego, fierce liberation, death and rebirth",
    context:
      "Kali is the fierce Hindu goddess of time, change, and liberation. She is depicted with dark skin, multiple arms, wearing a garland of skulls, and standing upon Shiva. Though fearsome in appearance, Kali is a liberating force — she destroys the ego and illusion to reveal the eternal truth beneath.",
    psychologicalMeaning:
      "Kali represents the archetype of fierce transformation — the liberating power that destroys what is false, outdated, or limiting so that authentic life can emerge. She is the shadow mother who loves you too much to let you remain small.",
  },
  {
    name: "Shiva",
    type: "Deity",
    origin: "Hindu mythology",
    domain:
      "Destruction and creation, yoga, asceticism, meditation, cosmic dance",
    context:
      "Shiva is one of the principal deities of Hinduism, the destroyer and transformer within the Trimurti. As Nataraja, he performs the cosmic dance (Tandava) that both destroys and recreates the universe. Shiva is also the supreme yogi, representing consciousness in its purest, most concentrated form.",
    psychologicalMeaning:
      "Shiva embodies the archetype of pure consciousness — the unwavering witness behind all experience, the stillness at the center of transformation, the power of focused awareness that can both dissolve what is old and reveal what is eternal.",
  },
  {
    name: "Lakshmi",
    type: "Deity",
    origin: "Hindu mythology",
    domain: "Wealth, prosperity, grace, beauty, spiritual abundance",
    context:
      "Lakshmi is the Hindu goddess of wealth, fortune, beauty, and prosperity. She is the consort of Vishnu and emerges from the churning of the cosmic ocean. Lakshmi represents both material and spiritual abundance — the grace that flows to those who are aligned, generous, and virtuous.",
    psychologicalMeaning:
      "Lakshmi embodies the archetype of graceful abundance — the understanding that prosperity is a spiritual state of alignment, generosity, and receptivity rather than merely an accumulation of resources.",
  },
  {
    name: "Ganesha",
    type: "Deity",
    origin: "Hindu mythology",
    domain: "New beginnings, removing obstacles, wisdom, arts, intellect",
    context:
      "Ganesha, the elephant-headed son of Shiva and Parvati, is the lord of beginnings and remover of obstacles. He is invoked at the start of any endeavor in Hindu tradition. Ganesha governs wisdom, intelligence, arts, and sciences — he is the patron deity of writers and thinkers.",
    psychologicalMeaning:
      "Ganesha represents the archetype of intelligent initiation — the wisdom to recognize obstacles as teachers, the playful intelligence that finds solutions where others see only walls, and the courage to begin.",
  },
  {
    name: "Quetzalcoatl",
    type: "Deity",
    origin: "Aztec/Mesoamerican mythology",
    domain: "Wind, wisdom, arts, creation, Venus, feathered serpent",
    context:
      "Quetzalcoatl, the Feathered Serpent, is one of the most important deities of Mesoamerican cultures. He is a creator god who shaped humanity, patron of arts and learning, and associated with the planet Venus. His name combines the quetzal bird (sky/spirit) with coatl (serpent/earth) — uniting heaven and earth.",
    psychologicalMeaning:
      "Quetzalcoatl embodies the archetype of the bridge between worlds — the integration of earthly intelligence (serpent) with spiritual aspiration (feathered bird), the creative force that lifts human potential toward its highest expression.",
  },
  {
    name: "Loki",
    type: "Deity",
    origin: "Norse mythology",
    domain:
      "Trickery, shape-shifting, mischief, chaos, transformation, cleverness",
    context:
      "Loki is the Norse trickster god, a shape-shifter who exists in the liminal space between friend and enemy, creator and destroyer. He engineers both solutions and catastrophes for the gods. Loki represents the chaotic force that disrupts stagnation and forces evolution through unexpected change.",
    psychologicalMeaning:
      "Loki embodies the archetype of the divine Trickster — the part of the psyche that disrupts comfortable illusions, forces creative thinking through constraint, and uses humor and chaos as catalysts for genuine transformation.",
  },
  // Mesopotamian deities
  {
    name: "Enlil",
    type: "Deity",
    origin: "Sumerian mythology",
    domain: "Cosmic authority, wind, air, storms, breath of life, civilization",
    context:
      "Enlil is one of the most important Sumerian deities, lord of the air and cosmic authority who decreed fate. He breathed the breath of life into creation and stood second only to An in the Sumerian pantheon. Enlil shaped the destiny of humanity and the cosmos through his word and his wind.",
    psychologicalMeaning:
      "Enlil embodies the archetype of commanding presence — the power of the voice that shapes the world, the authority whose words carry the weight of cosmic law.",
  },
  {
    name: "Inanna / Ishtar",
    type: "Deity",
    origin: "Sumerian/Babylonian mythology",
    domain:
      "Love, desire, war, fertility, the morning star, descent and return",
    context:
      "Inanna descended into the underworld to face death and returned transformed — the central myth of death and rebirth in Mesopotamian religion. As Ishtar in Babylonian tradition, she is the queen of heaven and goddess of both love and war, the embodiment of the paradox of desire.",
    psychologicalMeaning:
      "Inanna represents the archetype of radical descent and return — the willingness to face the underworld of one's own psyche and emerge transformed, having surrendered all defenses to meet one's deepest truth.",
  },
  {
    name: "Marduk",
    type: "Deity",
    origin: "Babylonian mythology",
    domain: "Creation, order, magic, judgment, water, storm",
    context:
      "Marduk slew the chaos dragon Tiamat and formed the world from her body — the archetypal creation myth of overcoming chaos to establish order. He became the supreme deity of the Babylonian pantheon, associated with magic, judgment, and the ordering of civilized life.",
    psychologicalMeaning:
      "Marduk embodies creative authority — the power to face the dragon of chaos and transform raw, undifferentiated potential into structured reality.",
  },
  // Celtic deities
  {
    name: "The Morrigan",
    type: "Deity",
    origin: "Irish/Celtic mythology",
    domain: "Fate, death, war, prophecy, shape-shifting, ravens, sovereignty",
    context:
      "The Morrigan is the triple goddess of Irish mythology — Badb (crow), Macha (sovereignty), and Nemain (frenzy). She appears on battlefields as an omen and tests warriors. She is the embodiment of sovereign fate and the fierce feminine force of transformation.",
    psychologicalMeaning:
      "The Morrigan embodies the archetype of sovereign fate — the fierce feminine force that demands authenticity and rewards only those who stand fully in their power.",
  },
  {
    name: "Cernunnos",
    type: "Deity",
    origin: "Celtic mythology",
    domain:
      "Wild nature, animals, fertility, wealth, the underworld, primal forces",
    context:
      "Cernunnos is the antlered lord depicted in the Gundestrup Cauldron, surrounded by wild animals. He represents the primal masculine force of nature — untamed, generative, cyclical. He rules the liminal space between the wild and the human, the seasonal turning of the year.",
    psychologicalMeaning:
      "Cernunnos represents the archetype of wild embodiment — the primal masculine energy that is rooted in nature, cycles with the seasons, and needs no civilization to validate it.",
  },
  {
    name: "Brigid",
    type: "Deity",
    origin: "Celtic mythology",
    domain: "Healing, poetry, smithcraft, fire, inspiration, dawn",
    context:
      "Brigid is the beloved goddess of the Celts, associated with the sacred flame at Kildare, healing wells, creative inspiration, and the crafts of transformation. Her triple nature encompasses the healer, the poet, and the smith — all workers with fire.",
    psychologicalMeaning:
      "Brigid embodies the archetype of inspired creation — the sacred fire that simultaneously heals, creates, and illuminates, the transformative force of craft wielded with heart.",
  },
  // Japanese deities
  {
    name: "Amaterasu",
    type: "Deity",
    origin: "Japanese Shinto mythology",
    domain: "The sun, light, creation, weaving, divine rulership",
    context:
      "Amaterasu is the supreme deity of the Shinto pantheon, from whom the imperial family descends. When she hid in a cave from her brother's violence, the world went dark until divine trickery lured her back. She is the source of all light and the guarantor of life.",
    psychologicalMeaning:
      "Amaterasu represents the archetype of radiant presence — the light that the world depends on, and the courage to return to shining after darkness and withdrawal.",
  },
  {
    name: "Susanoo",
    type: "Deity",
    origin: "Japanese Shinto mythology",
    domain: "Storms, seas, heroism, poetry, honor, serpents",
    context:
      "Susanoo is the storm god who was banished from heaven, killed the eight-headed serpent Yamata no Orochi, and found the sacred sword Kusanagi. Complex, mercurial, but ultimately heroic — he demonstrates honor through deed rather than birth.",
    psychologicalMeaning:
      "Susanoo embodies the archetype of the exiled hero — the one who must face their own destructive power, be banished, and prove themselves through honorable deeds.",
  },
  {
    name: "Inari",
    type: "Deity",
    origin: "Japanese Shinto mythology",
    domain:
      "Foxes (kitsune), rice, fertility, industry, worldly success, swordsmanship",
    context:
      "Inari is one of the most widely worshipped Shinto kami, appearing as male, female, or androgynous, served by fox messengers. Inari's shrines outnumber all other Shinto shrines in Japan. This deity embodies the fluid adaptability of abundance itself.",
    psychologicalMeaning:
      "Inari represents the archetype of adaptive abundance — the capacity to shift form as needed while remaining fundamentally aligned with prosperity and flourishing.",
  },
  // African/Diaspora deities
  {
    name: "Oshun",
    type: "Deity",
    origin: "Yoruba / Afro-Caribbean (Candomblé, Santería)",
    domain: "Fresh water, love, fertility, beauty, sensuality, art, diplomacy",
    context:
      "Oshun is one of the most beloved orishas in Yoruba and Afro-Caribbean traditions, associated with honey, gold, and the sweetness of life. She is the goddess of the river — ever-flowing, nourishing, beautiful, and powerful. Her colors are gold and amber.",
    psychologicalMeaning:
      "Oshun embodies the archetype of sacred pleasure — the understanding that beauty, sensuality, and delight are divine, and that joy is a spiritual power that opens the soul.",
  },
  {
    name: "Shango",
    type: "Deity",
    origin: "Yoruba / Afro-Caribbean (Candomblé, Santería)",
    domain: "Thunder, lightning, fire, justice, war, masculine vitality",
    context:
      "Shango is the powerful orisha of thunder and lightning, associated with royal power and masculine strength. He is fierce, just, and vital — his colors are red and white, and his symbol is the double-headed axe of justice.",
    psychologicalMeaning:
      "Shango represents the archetype of divine authority — the just use of power, the force that strikes down injustice with thunder, the king who rules through vitality and righteousness.",
  },
  {
    name: "Eshu / Elegba",
    type: "Deity",
    origin: "Yoruba / Afro-Caribbean (Candomblé, Santería)",
    domain:
      "Crossroads, beginnings, communication, trickery, fate, the divine messenger",
    context:
      "Eshu (Elegba, Exu) is the first orisha consulted in any ceremony — without his blessing, communication between humans and the divine is impossible. He stands at every crossroads, controls all beginnings, and must be honored before any spiritual work can proceed.",
    psychologicalMeaning:
      "Eshu embodies the archetype of the divine gatekeeper — the one who controls access between worlds and must be honored before any spiritual work can begin.",
  },
  // Slavic deities
  {
    name: "Perun",
    type: "Deity",
    origin: "Slavic mythology",
    domain: "Thunder, lightning, storms, law, justice, war, sky",
    context:
      "Perun is the supreme Slavic deity, god of sky, thunder, and war — cognate with Thor and Zeus. He battles the underworld serpent Veles in the eternal Slavic thunderstorm myth, maintaining cosmic balance between the heavens and the depths.",
    psychologicalMeaning:
      "Perun embodies the archetype of celestial law — the divine force that establishes order, battles chaos, and ensures the cycles of nature are maintained.",
  },
  {
    name: "Veles",
    type: "Deity",
    origin: "Slavic mythology",
    domain: "The underworld, cattle, magic, arts, wealth, the dead",
    context:
      "Veles is the Slavic chthonic deity of the underworld, associated with magic, trickery, and earthly wealth. He is Perun's eternal opponent — their battle generates the storms. Veles rules the deep places of earth and the mysteries of death and fortune.",
    psychologicalMeaning:
      "Veles represents the archetype of chthonic wisdom — the knowledge that comes from the depths, the underworld intelligence that accumulates wealth and mystery in the dark places of the world.",
  },
  // Aztec / Mesoamerican deities
  {
    name: "Tezcatlipoca",
    type: "Deity",
    origin: "Aztec mythology",
    domain:
      "Darkness, night sky, sorcery, conflict, change, shadow work, the smoking mirror",
    context:
      "Tezcatlipoca means 'Smoking Mirror' — he holds a black obsidian mirror in which he sees all truths, all shadows, all hidden things. He is the adversary and shadow complement of Quetzalcoatl, representing the dark half of creation's duality.",
    psychologicalMeaning:
      "Tezcatlipoca embodies the archetype of the shadow mirror — the relentless truth-teller who confronts you with exactly what you are hiding, forcing integration through conflict.",
  },
  {
    name: "Tlaloc",
    type: "Deity",
    origin: "Aztec/Mesoamerican mythology",
    domain: "Rain, fertility, water, lightning, caves, vital sustenance",
    context:
      "Tlaloc is the ancient Mesoamerican rain deity, one of the oldest and most universally worshipped in the region. He governs rain and water, and his paradise Tlalocan receives those who die by water or lightning.",
    psychologicalMeaning:
      "Tlaloc represents the archetype of vital sustenance — the understanding that growth requires both the nourishing rain and the willingness to receive abundance from above.",
  },
  // Greek/Roman extras
  {
    name: "Dionysus / Bacchus",
    type: "Deity",
    origin: "Greek/Roman mythology",
    domain: "Wine, ecstasy, theater, rebirth, divine madness, liberation",
    context:
      "Dionysus is the god of transformation through dissolution — wine loosens the ego's grip, ecstasy opens the soul, theater reveals hidden truth. He embodies the sacred chaos that precedes renewal and was one of the most widely worshipped gods in the ancient world.",
    psychologicalMeaning:
      "Dionysus represents the archetype of ecstatic liberation — the sacred dissolution of the rigid ego that opens the soul to transcendence, creativity, and rebirth.",
  },
  {
    name: "Athena / Minerva",
    type: "Deity",
    origin: "Greek/Roman mythology",
    domain: "Wisdom, strategy, crafts, civilization, justice, divine reason",
    context:
      "Athena was born fully armored from Zeus's head — the divine feminine wisdom that emerges from the highest intellect. She is strategic rather than impulsive, craft-mastery rather than raw force. She is the patron of Athens and the civilizing principle.",
    psychologicalMeaning:
      "Athena embodies the archetype of strategic wisdom — the integration of intelligence and practical capability, the mind that sees clearly and acts with precision.",
  },
  {
    name: "Poseidon / Neptune",
    type: "Deity",
    origin: "Greek/Roman mythology",
    domain: "Seas, earthquakes, horses, primal emotion, the unconscious depths",
    context:
      "Poseidon rules the depths of the ocean and the depths of the unconscious — volatile, vast, and capable of both tremendous destruction and tremendous life. His trident can split mountains. He is the lord of all things beneath the surface.",
    psychologicalMeaning:
      "Poseidon represents the archetype of the vast emotional unconscious — the primal depths beneath the surface of awareness, powerful and unpredictable, demanding respect and integration.",
  },
  {
    name: "Apollo",
    type: "Deity",
    origin: "Greek/Roman mythology",
    domain: "Sun, music, poetry, prophecy, truth, healing, rational light",
    context:
      "Apollo embodies the principle of rational illumination — the clear light of reason, artistic mastery, and the gift of prophecy through inspired clarity. His oracle at Delphi proclaimed: 'Know thyself.' He is the divine patron of all arts that require mastery of form.",
    psychologicalMeaning:
      "Apollo represents the archetype of luminous reason — the disciplined creative mind, the prophet who speaks truth, the artist who masters form in service of transcendent beauty.",
  },
  // ── Spirits ──────────────────────────────────────────────────────────────────
  {
    name: "The Phoenix",
    type: "Spirit",
    origin: "Greek, Egyptian (Bennu), Arabian, Chinese (Fenghuang) mythology",
    domain: "Rebirth, resurrection, transformation, renewal, immortality",
    context:
      "The Phoenix is a mythical firebird found across multiple world cultures that cyclically burns itself to ash and rises renewed from the flames. In Egyptian mythology, the Bennu bird is its precursor. The Phoenix represents the indestructible nature of the soul and the transformative power of destruction followed by rebirth.",
    psychologicalMeaning:
      "The Phoenix embodies the archetype of radical renewal — the understanding that true transformation often requires the complete dissolution of old identity before something greater can emerge. You cannot fear the fire if you know you will rise.",
  },
  {
    name: "The Dragon",
    type: "Spirit",
    origin: "Universal (appears in virtually every world mythology)",
    domain: "Power, wisdom, elemental forces, guardianship, primal energy",
    context:
      "Dragons appear in virtually every world mythology — Western dragons as fierce guardians of treasure and power, Eastern dragons as benevolent bringers of rain and wisdom. As a spirit archetype, the Dragon represents the primal forces of nature and the depths of power available to those who have earned mastery.",
    psychologicalMeaning:
      "The Dragon represents the archetype of primal personal power — the vast reservoir of energy, potential, and force that lies within, which must be cultivated rather than suppressed. The inner dragon is not a threat to tame but a power to befriend.",
  },
  {
    name: "The Serpent",
    type: "Spirit",
    origin:
      "Universal (Egyptian, Hindu, Greek, Mesoamerican, Biblical traditions)",
    domain: "Kundalini energy, wisdom, medicine, duality, transformation",
    context:
      "The serpent appears across virtually every world culture as a symbol of paradox — healing and poison, wisdom and deception, death and rebirth. The caduceus, the Rod of Asclepius, the Kundalini serpent, and the Ouroboros all use serpent imagery to represent healing, cyclical renewal, and the rising of consciousness.",
    psychologicalMeaning:
      "The Serpent embodies the archetype of Kundalini awakening — the primal life force that, when activated, rises through the spine to illuminate consciousness. Serpent energy is the power of embodied wisdom.",
  },
  {
    name: "The Owl",
    type: "Spirit",
    origin: "Greek (Athena), Native American, Celtic, many world cultures",
    domain: "Wisdom, intuition, seeing in darkness, hidden truth, transition",
    context:
      "The Owl is a universal symbol of wisdom and the ability to see what others cannot — especially in darkness. As Athena's sacred animal, it represents the wisdom that comes from clear perception. In many indigenous traditions, the owl is a messenger from the spirit world and a guide between realms.",
    psychologicalMeaning:
      "The Owl embodies the archetype of intuitive intelligence — the capacity to perceive hidden truths, navigate uncertainty, and trust the knowing that comes not from logic alone but from the deeper sight of the soul.",
  },
  {
    name: "The Wolf",
    type: "Spirit",
    origin: "Norse, Native American, Celtic, Roman mythology",
    domain:
      "Instinct, loyalty, pack wisdom, wildness, pathfinding, guardianship",
    context:
      "The Wolf is one of humanity's most powerful animal archetypes, representing both the wildness of the natural world and the deep loyalty of the pack. In Norse mythology, Odin's wolves Geri and Freki are his companions. Native American traditions honor Wolf as a teacher and pathfinder.",
    psychologicalMeaning:
      "The Wolf embodies the archetype of wild belonging — the intelligence that trusts instinct, the strength found in authentic community, and the courage to howl your truth even when others would prefer silence.",
  },
  {
    name: "The Unicorn",
    type: "Spirit",
    origin: "European heraldry, Middle Eastern accounts, Greek natural history",
    domain: "Purity, magic, untameable grace, healing, divine feminine power",
    context:
      "The unicorn appears in European medieval heraldry and Renaissance art as a symbol of purity and magical power that could only be approached by the pure of heart. In Jungian terms, the unicorn represents the unattainable ideal made accessible through inner purification.",
    psychologicalMeaning:
      "The Unicorn embodies the archetype of sacred aspiration — the pure ideal that cannot be seized by force but comes freely to those who have cultivated genuine inner refinement.",
  },
  {
    name: "The Raven",
    type: "Spirit",
    origin:
      "Norse (Huginn/Muninn), Native American (Pacific Northwest), Celtic",
    domain:
      "Intelligence, prophecy, transformation, death, magic, cosmic memory",
    context:
      "Odin's ravens Huginn (thought) and Muninn (memory) circle the world daily and report all they see. Raven is the Creator trickster in Pacific Northwest mythology — the one who stole fire and light for humanity. Raven bridges worlds with intelligence and cunning.",
    psychologicalMeaning:
      "The Raven embodies the archetype of cosmic intelligence — the all-seeing mind that moves between worlds, collects information from every corner of existence, and understands the relationship between thought and memory.",
  },
  {
    name: "The White Stag",
    type: "Spirit",
    origin: "Celtic, Arthurian legend, European mythology",
    domain:
      "Otherworldly quest, spiritual direction, the divine call, sacred pursuit",
    context:
      "The White Stag appears in Celtic and Arthurian legend as an otherworldly creature that leads seekers on quests toward spiritual transformation. It can never be caught by force — only encountered when you are ready.",
    psychologicalMeaning:
      "The White Stag embodies the archetype of the sacred call — the vision of highest potential that always remains just ahead, drawing you forward into growth and transformation.",
  },
  {
    name: "The Kitsune",
    type: "Spirit",
    origin: "Japanese Shinto mythology",
    domain:
      "Intelligence, magic, shape-shifting, wisdom, illusion, divine messenger",
    context:
      "The kitsune is the divine fox messenger of Inari in Shinto tradition. With each century of wisdom gained, a kitsune grows an additional tail, reaching nine tails at full enlightenment. They can shape-shift and see through all illusions.",
    psychologicalMeaning:
      "The Kitsune embodies the archetype of cunning wisdom — the intelligence that uses shape-shifting and illusion not for deception but to reveal hidden truths and adapt to any environment with grace.",
  },
  {
    name: "The Thunderbird",
    type: "Spirit",
    origin: "Native American (Ojibwe, Lakota, Pacific Northwest)",
    domain: "Storms, power, transformation, sacred forces, cosmic balance",
    context:
      "The Thunderbird is one of the most widespread and powerful spirit beings in Native American traditions — a vast eagle-like being whose wings cause thunder and whose eyes flash lightning. It battles the underwater serpent in the eternal balance of sky and water.",
    psychologicalMeaning:
      "The Thunderbird embodies the archetype of sky power — the vast, commanding force of the upper world that maintains cosmic balance through its eternal battle with the depths.",
  },
  {
    name: "The Wendigo",
    type: "Spirit",
    origin: "Algonquian Native American tradition",
    domain: "The shadow of excess, consumption, winter, loss of humanity",
    context:
      "The Wendigo is an Algonquian spirit representing the danger of excess — particularly the horrifying spiritual transformation that results from cannibalism or extreme selfishness. It represents what humans become when they consume endlessly without regard for others.",
    psychologicalMeaning:
      "The Wendigo represents the archetype of the consuming shadow — the warning about what happens when appetite becomes total, when the individual loses their humanity through radical selfishness and excess. A map of what to avoid.",
  },
  {
    name: "Pele",
    type: "Spirit",
    origin: "Hawaiian mythology",
    domain:
      "Volcanoes, fire, creation and destruction, the sacred flame, transformation",
    context:
      "Pele is the Hawaiian goddess of volcanoes who created the Hawaiian Islands through her eruptions. She is both destroyer and creator — her lava flows destroy everything in their path while simultaneously creating new land.",
    psychologicalMeaning:
      "Pele embodies the archetype of creative destruction — the understanding that some creation requires the complete dissolution of what existed before, that the fiercest transformation is also the most generative.",
  },
  {
    name: "The Banshee",
    type: "Spirit",
    origin: "Irish/Celtic mythology",
    domain: "Death omens, ancestral connection, grief, the veil between worlds",
    context:
      "The banshee (bean sídhe, 'woman of the fairy mound') wails to warn Irish families of an impending death. Far from malevolent, she mourns with the family — her scream is an act of love and warning, bridging the worlds of the living and the dead.",
    psychologicalMeaning:
      "The Banshee embodies the archetype of prophetic grief — the sensitivity that perceives coming transitions, the willingness to face and honor endings rather than pretending change isn't coming.",
  },
  {
    name: "The Selkie",
    type: "Spirit",
    origin: "Scottish and Irish mythology",
    domain:
      "Transformation, grief, the call of wildness, the sea, duality of nature",
    context:
      "Selkies are seal-people of Celtic mythology who shed their seal skins to walk on land. If their skin is hidden from them, they cannot return to the sea, and they grieve endlessly for their true nature.",
    psychologicalMeaning:
      "The Selkie embodies the archetype of the captured wild self — the soul's longing for its authentic nature when forced to live in a form or environment that is not truly its own. Liberation requires returning what was taken.",
  },
  {
    name: "The Naga",
    type: "Spirit",
    origin: "Hindu, Buddhist, and Southeast Asian mythology",
    domain:
      "Serpent wisdom, water, cosmic knowledge, guardians of sacred sites",
    context:
      "Nagas are divine serpent beings in Hindu and Buddhist mythology — neither simply good nor evil, but powerful guardians of sacred sites, bodies of water, and spiritual knowledge. The Naga king Vasuki was used to churn the cosmic ocean.",
    psychologicalMeaning:
      "The Naga embodies the archetype of guardian wisdom — the serpentine intelligence that protects sacred knowledge, demanding genuine respect and spiritual maturity before granting access to deeper truths.",
  },
  // ── Archetypes ───────────────────────────────────────────────────────────────
  {
    name: "The Shadow",
    type: "Archetype",
    origin: "Jungian analytical psychology (Carl Jung)",
    domain:
      "Unconscious impulses, rejected aspects of self, hidden power, integration",
    context:
      "The Shadow is one of Carl Jung's most important archetypes — representing all the aspects of the self that the conscious ego denies, represses, or fails to acknowledge. The Shadow contains both darkness and extraordinary potential, both wounds and gifts that were deemed unacceptable.",
    psychologicalMeaning:
      "Working with the Shadow means reclaiming rejected aspects of yourself — not to act on every impulse, but to integrate and transform repressed energy into authentic wholeness. The deepest personal power often lies in the Shadow.",
  },
  {
    name: "The Anima / Animus",
    type: "Archetype",
    origin: "Jungian analytical psychology (Carl Jung)",
    domain:
      "Contrasexual aspects of the psyche, inner feminine/masculine, soul-image",
    context:
      "The Anima (feminine soul in men) and Animus (masculine spirit in women) are Jungian archetypes representing the contrasexual aspect of the psyche. They serve as bridges to the unconscious and project onto romantic partners. Integrating them means developing the full range of human qualities within oneself.",
    psychologicalMeaning:
      "The Anima/Animus represents the integration of complementary energies within — receptivity and assertion, feeling and thinking, being and doing — achieving inner wholeness that transcends gender polarities.",
  },
  {
    name: "The Self",
    type: "Archetype",
    origin: "Jungian analytical psychology (Carl Jung)",
    domain:
      "Wholeness, integration, the totality of psyche, individuation, center",
    context:
      "The Self in Jungian psychology is the archetype of wholeness and the organizing center of the psyche — encompassing both the conscious ego and the vast unconscious. The process of individuation is the lifelong journey of aligning with the Self.",
    psychologicalMeaning:
      "The Self embodies the archetype of psychological wholeness — the destination of the inner journey, the state in which all aspects of oneself are recognized, accepted, and integrated into a unified, purposeful whole.",
  },
  {
    name: "The Trickster",
    type: "Archetype",
    origin: "Universal (Coyote, Loki, Anansi, Hermes, Raven)",
    domain:
      "Disruption, humor, creative chaos, exposing hidden truth, transformation through paradox",
    context:
      "The Trickster is a universal archetype found in virtually every world mythology — Coyote in Native American tradition, Loki in Norse, Anansi in West African, Hermes in Greek, Raven in Pacific Northwest. The Trickster disrupts established order, often inadvertently creating the conditions for transformation and growth.",
    psychologicalMeaning:
      "The Trickster represents the psyche's natural resistance to stagnation — the humor, irreverence, and creative chaos that breaks through rigid thinking and opens new possibilities by refusing to take anything, including itself, too seriously.",
  },
  {
    name: "The Sage",
    type: "Archetype",
    origin: "Universal (Merlin, Yoda, Gandalf, Tiresias, Thoth)",
    domain: "Wisdom, clarity, guidance, objectivity, truth-seeking, mentorship",
    context:
      "The Sage archetype appears across cultures as the wise elder, oracle, and teacher — Merlin, Gandalf, Yoda, Tiresias, Solomon, Thoth. The Sage has gained wisdom through experience and reflection and offers guidance from a place of detachment and clarity that transcends personal interest.",
    psychologicalMeaning:
      "The Sage embodies the developed capacity for objective wisdom — the ability to see clearly without the distortion of ego needs, to recognize patterns, offer discernment, and illuminate the deeper meaning within experience.",
  },
  {
    name: "The Hero",
    type: "Archetype",
    origin: "Universal (Joseph Campbell's Hero's Journey)",
    domain:
      "Courage, growth through trials, transformation, answering the call, becoming",
    context:
      "The Hero is perhaps the most universal of all archetypes, described by Joseph Campbell in his Monomyth or Hero's Journey — a fundamental pattern found in virtually every world mythology and story. The Hero leaves the familiar world, faces trials, descends into darkness, and returns transformed with a gift for the community.",
    psychologicalMeaning:
      "The Hero represents the archetype of self-transformation through conscious challenge — the willingness to leave comfort, face the unknown, integrate shadow, and return as a fuller, more capable version of oneself in service to others.",
  },
  {
    name: "The Great Mother",
    type: "Archetype",
    origin: "Carl Jung, Universal mythology",
    domain:
      "Unconditional love, fertility, nourishment, protection, devouring shadow",
    context:
      "The Great Mother is one of the most fundamental archetypes — appearing as Earth goddesses, nature deities, and the nurturing principle in virtually every world culture. She has two faces: the nourishing, life-giving mother and the devouring, possessive shadow mother.",
    psychologicalMeaning:
      "The Great Mother embodies the archetype of unconditional nourishment — the love that asks nothing in return, and its shadow: the possessiveness that cannot release its children to become themselves.",
  },
  {
    name: "The Wise Old Man",
    type: "Archetype",
    origin: "Carl Jung",
    domain:
      "Wisdom accumulated through suffering, guidance, hidden knowledge, the mentor",
    context:
      "The Wise Old Man appears in dreams and mythology as the wizard, the hermit, the guide — Gandalf, Merlin, the Greek Tiresias, the Taoist sage. He appears when the seeker has exhausted ordinary resources and needs wisdom beyond what the ego can provide.",
    psychologicalMeaning:
      "The Wise Old Man embodies the organizing principle of transcendent wisdom — knowledge that comes not from books but from genuine engagement with life's deepest experiences, offered in service to the next generation.",
  },
  {
    name: "The Divine Child / Puer Aeternus",
    type: "Archetype",
    origin: "Carl Jung",
    domain:
      "Innocence, new beginnings, potential, magical thinking, eternal youth",
    context:
      "The Divine Child archetype appears as baby Horus, the Christ child, infant Krishna — representing the newly born self, the seed of the transcendent function, pure potential before it has been shaped by the world. Its shadow, the Puer Aeternus, refuses to grow up.",
    psychologicalMeaning:
      "The Divine Child represents the archetype of pure potential — the miraculous capacity for new beginnings, the refusal to be limited by what has been, and the innocence that perceives reality without the distortion of accumulated wounds.",
  },
  {
    name: "The Magician",
    type: "Archetype",
    origin: "Universal / Carl Jung",
    domain:
      "Transformation, mastery of forces, knowledge as power, alchemy, the mediator",
    context:
      "The Magician is the archetype of transformation through mastery — the alchemist who knows the hidden laws and can work with them to transform base matter (or experience) into gold. Merlin, Thoth, Gandalf, the Tarot's Magician — all embody this principle.",
    psychologicalMeaning:
      "The Magician embodies the archetype of conscious transformation — the understanding that reality can be shaped through the mastery of attention, intention, and knowledge of how forces work.",
  },
  {
    name: "The Outlaw / Rebel",
    type: "Archetype",
    origin: "Universal cultural mythology",
    domain:
      "Freedom, rule-breaking, revolution, authenticity, the refusal of limitation",
    context:
      "The Outlaw archetype appears as Robin Hood, Prometheus, Loki — the one who breaks unjust rules to restore a deeper truth. Not random chaos but principled rebellion against what is false or oppressive.",
    psychologicalMeaning:
      "The Outlaw represents the archetype of principled transgression — the courageous refusal to comply with systems, rules, or beliefs that violate authentic truth, in service of a more genuine reality.",
  },
  {
    name: "The Lover",
    type: "Archetype",
    origin: "Carl Jung, Universal",
    domain: "Passion, connection, beauty, embodiment, the sacred union",
    context:
      "The Lover archetype is not merely romantic — it is the capacity for deep, passionate engagement with life itself. It is present in the mystic's union with the divine, the artist's love of their craft, and the lover's total presence with another person.",
    psychologicalMeaning:
      "The Lover embodies the archetype of total engagement — the willingness to be fully present, fully feeling, fully connected to whatever is in front of you, experiencing life at its most vivid and alive.",
  },
  {
    name: "The Caregiver / Wounded Healer",
    type: "Archetype",
    origin: "Universal (Chiron, Greek mythology)",
    domain:
      "Compassion, service, nurturing others, the wounded healer, self-sacrifice",
    context:
      "The Caregiver appears as doctors, healers, nurses, mothers, and teachers — those who place the wellbeing of others at the center of their existence. The Wounded Healer (Chiron in Greek myth) is its deepest expression — the one who heals others through the wisdom of their own wounds.",
    psychologicalMeaning:
      "The Caregiver embodies the archetype of compassionate service — the capacity to find meaning through alleviating suffering, and the wisdom to recognize that the most powerful healing comes from the healer's own integrated wounds.",
  },
  {
    name: "The Ruler / Sovereign",
    type: "Archetype",
    origin: "Universal",
    domain:
      "Order, responsibility, leadership, sovereignty, the creation of structure",
    context:
      "The Ruler archetype appears in every culture as the divine monarch who creates and maintains order. The highest expression is the Philosopher King — power in complete service to the flourishing of all. Its shadow is the tyrant.",
    psychologicalMeaning:
      "The Ruler embodies the archetype of sovereign responsibility — the understanding that true power serves rather than dominates, and that genuine authority comes not from force but from the trust of those who are governed.",
  },
  // ── Egregores ────────────────────────────────────────────────────────────────
  {
    name: "The Nation-State Egregore",
    type: "Egregore",
    subCategory: "Collective Egregore",
    origin: "Collective consciousness theory, political philosophy",
    domain:
      "Collective identity, patriotism, shared mythologies, mass belief, cultural momentum",
    context:
      "When millions of people pour belief, loyalty, emotion, and intention into a nation-state, an egregore forms — a living psychic entity that begins to influence the very people who created it. It shapes culture, language, war, and art. The egregores of 'America,' 'Rome,' and 'Empire' have each generated distinct fields of collective meaning that outlive individual participants.",
    psychologicalMeaning:
      "The nation-state egregore represents the power of shared narrative — how collective stories and symbols create a felt reality that transcends individual experience.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "The Corporate Egregore",
    type: "Egregore",
    subCategory: "Collective Egregore",
    origin: "Business esoteric theory, Chaos Magic",
    domain:
      "Brand consciousness, corporate culture, economic power, mass loyalty, collective identity",
    context:
      "Large corporations like Apple, Coca-Cola, or Nike develop egregoric fields — felt atmospheres of brand identity that influence employee behavior, customer emotion, and cultural meaning far beyond their products. The corporate egregore feeds on collective attention, loyalty, and belief.",
    psychologicalMeaning:
      "The corporate egregore represents the shadow of collective productivity — how shared purpose can become a self-perpetuating entity that serves itself as much as the people who created it.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "The Religious Egregore",
    type: "Egregore",
    subCategory: "Collective Egregore",
    origin: "Theosophical Society, Dion Fortune",
    domain:
      "Collective prayer, ritual power, shared faith, communion, spiritual amplification",
    context:
      "Every religious denomination generates an egregore through collective prayer, ritual, and belief. The Catholic Mass egregore, the Islamic Ummah egregore, or the Buddhist Sangha egregore are energetic fields created by millions of devotees aligning their intention across centuries.",
    psychologicalMeaning:
      "The religious egregore embodies the amplifying power of shared spiritual practice — how collective intention creates something greater than the sum of its parts.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "Egregore of the Hero",
    type: "Egregore",
    subCategory: "Cultural Egregore",
    origin: "Cultural mythology, collective unconscious",
    domain:
      "Idealized human potential, hero worship, mass inspiration, collective aspiration",
    context:
      "Superman, Batman, and similar cultural heroes have become genuine egregores — fed by decades of collective belief, storytelling, and emotional investment. Their archetypal energy functions as a living thoughtform accessible through the collective unconscious.",
    psychologicalMeaning:
      "The Hero egregore embodies collective aspiration — humanity's shared dream of its own highest potential made manifest as a psychic force.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "The Revolution Egregore",
    type: "Egregore",
    subCategory: "Collective Egregore",
    origin: "Political philosophy, collective consciousness",
    domain:
      "Liberation, upheaval, collective will, radical change, transformative momentum",
    context:
      "Revolutions — French, American, Marxist — generate powerful egregores through the intense emotional investment of masses in a transformative cause. These egregores can outlive their originating events, continuing to influence political imagination centuries later.",
    psychologicalMeaning:
      "The Revolution egregore represents the collective shadow of oppressive power — the explosive emergence of suppressed will seeking freedom and self-determination.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "The Zeitgeist",
    type: "Egregore",
    subCategory: "Cultural Egregore",
    origin: "German Idealist philosophy (Hegel), Western cultural theory",
    domain:
      "Cultural momentum, collective mood, era-defining consciousness, invisible social water",
    context:
      "The Zeitgeist is the defining spirit of an era — the collective mood, values, anxieties, and aspirations that characterize a generation or age. The 1960s Zeitgeist, the Renaissance Zeitgeist, the AI Age Zeitgeist each function as egregoric fields shaping individual experience without people's conscious awareness.",
    psychologicalMeaning:
      "The Zeitgeist represents the invisible water everyone swims in — the collective unconscious mood that shapes individual thought while remaining largely unexamined.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "The Sports Team Egregore",
    type: "Egregore",
    subCategory: "Tribal Egregore",
    origin: "Sports psychology, group energy dynamics",
    domain:
      "Tribal loyalty, competitive spirit, collective energy, shared identity, ceremonial contest",
    context:
      "Sports teams with passionate fan bases develop genuine egregores — the '12th man' phenomenon in sports is a real egregoric effect where collective belief and emotional energy materially influences game outcomes. Stadium rituals, chants, and colors all feed the egregore.",
    psychologicalMeaning:
      "The sports egregore represents the primal need for tribal belonging and collective experience — channeling competitive instinct into shared identity and ceremonial contest.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "The Meme Egregore",
    type: "Egregore",
    subCategory: "Digital Egregore",
    origin: "Chaos Magic, digital culture theory, memetics",
    domain:
      "Viral consciousness, digital mythology, collective attention, meme magic, internet thoughtforms",
    context:
      "In the digital age, powerful memes and online communities generate egregores at unprecedented speed. Kek/Pepe the Frog became a genuine egregore through concentrated collective attention and ritual-like repetition by millions. The internet creates conditions for rapid egregore formation through shared symbols, humor, and collective emotional investment.",
    psychologicalMeaning:
      "The meme egregore represents the democratization of collective thought-form creation — how concentrated group attention can materialize new cultural entities with surprising speed.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "The Artistic Movement Egregore",
    type: "Egregore",
    subCategory: "Cultural Egregore",
    origin: "Cultural history, consciousness studies",
    domain:
      "Creative inspiration, aesthetic revolution, cultural evolution, collective creativity",
    context:
      "The Surrealist egregore, the Jazz egregore, the Renaissance egregore — artistic movements generate collective fields of inspiration that individual artists tap into. Many artists describe feeling 'possessed' by a larger creative force when producing their most powerful work.",
    psychologicalMeaning:
      "The artistic movement egregore represents the collective creative soul of humanity — how shared aesthetic vision creates a living field of inspiration that individual creators both contribute to and draw from.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "The Ancient Order Egregore",
    type: "Egregore",
    subCategory: "Order Egregore",
    origin: "Hermeticism, Freemasonry, Rosicrucianism",
    domain:
      "Esoteric knowledge, initiatory power, collective magical will, lineage consciousness",
    context:
      "Organizations like the Freemasons, Rosicrucians, Hermetic Order of the Golden Dawn, and OTO have consciously cultivated egregores over centuries. These organizational thoughtforms carry accumulated magical intention, symbolic meaning, and initiatory power. New members are initiated into the egregore's field.",
    psychologicalMeaning:
      "The order egregore represents the living transmission of accumulated wisdom and practice — how lineages of knowledge preserve and amplify their essence across generations.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "The Chaos Egregore (Eris)",
    type: "Egregore",
    subCategory: "Cultivated Egregore",
    origin: "Discordianism, Chaos Magic",
    domain:
      "Creative disorder, randomness as generative force, breaking of fixed patterns, innovation",
    context:
      "Discordians consciously work with Eris/Chaos as an egregoric force — the intentional cultivation of creative disorder that shatters stagnant structures and opens new possibility spaces. The Chaos egregore has been actively cultivated in modern Chaos Magic traditions.",
    psychologicalMeaning:
      "The Chaos egregore represents the generative void — the uncomfortable but necessary dissolution of fixed structures that creates the conditions for genuine innovation and emergence.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "The Tulpa",
    type: "Egregore",
    subCategory: "Personal Construct",
    origin:
      "Tibetan Buddhism (Tulku), Western Occultism (Alexandra David-Néel)",
    domain:
      "Intentional creation of conscious entities, focused will, autonomous mental companions",
    context:
      "A tulpa is a thoughtform created through sustained focused intention, most associated with Tibetan mystical practice. Alexandra David-Néel described creating a tulpa in her 1929 account. Modern practitioners describe tulpas as independently thinking mental companions with their own personalities.",
    psychologicalMeaning:
      "The tulpa represents the capacity of focused intention and creative visualization to generate persistent, autonomous-feeling sub-personalities — a demonstration of the mind's extraordinary creative power.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "The Group Mind",
    type: "Egregore",
    subCategory: "Collective Egregore",
    origin: "Theosophy, collective consciousness research",
    domain:
      "Shared consciousness, synchronized intention, collective intelligence, emergent awareness",
    context:
      "When groups align deeply in meditation, ritual, or focused intention, a group mind or hive consciousness can emerge — a shared field of awareness that transcends individual minds. Mystery schools, meditation groups, and ritual circles cultivate this state deliberately.",
    psychologicalMeaning:
      "The group mind represents the emergent property of deeply synchronized consciousness — how collective focused awareness can create states of knowing and capability that exceed what any individual could access alone.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "The Servitor",
    type: "Egregore",
    subCategory: "Personal Construct",
    origin: "Modern Chaos Magic (Phil Hine, Peter Carroll)",
    domain:
      "Intentional magical assistance, focused task-completion, directed will, spiritual automation",
    context:
      "A servitor is a self-created egregore designed for a specific purpose by a magical practitioner — a 'spiritual robot' built from focused intention, symbol, and will to perform a designated function. Unlike a tulpa, a servitor has a specific mission and limited autonomy.",
    psychologicalMeaning:
      "The servitor represents the practice of conscious intention programming — the deliberate creation of focused mental constructs that automate specific desired outcomes through the power of concentrated will.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "The Ancestral Egregore",
    type: "Egregore",
    subCategory: "Bloodline Egregore",
    origin:
      "Shamanic traditions, Ancestor Veneration, Family Constellation therapy",
    domain:
      "Ancestral patterns, inherited beliefs, bloodline power, karmic inheritance, generational healing",
    context:
      "Every family bloodline carries an egregoric field — accumulated patterns of belief, emotional response, trauma, and strength passed through generations both genetically and energetically. Ancestor veneration practices in African, Asian, and indigenous traditions consciously engage with these ancestral egregores.",
    psychologicalMeaning:
      "The ancestral egregore represents the inheritance of collective experience — both the wounds and the gifts carried in bloodline memory, available to be consciously engaged, healed, and transcended.",
    archetypalNote:
      "Egregores are collective thoughtform constructs — symbolic models from esoteric and philosophical traditions.",
  },
  {
    name: "Artemis / Diana",
    type: "Deity",
    origin: "Greek / Roman mythology",
    domain:
      "Moon, hunt, wilderness, independence, feminine sovereignty, childbirth protection",
    context:
      "Artemis is the twin sister of Apollo and one of the twelve Olympians — the goddess of the hunt, the moon, and untamed nature. As Diana in Roman tradition, she was equally revered as protector of the forest and guardian of women's independence. She represents the archetype of the sovereign woman who answers to no one.",
    psychologicalMeaning:
      "Artemis embodies fierce self-sufficiency, the refusal to be domesticated by others' expectations, and the power of solitude as a creative and regenerative force. She represents the part of us that runs free.",
    relatedSpells: ["Lunar Drawing Down", "Protection Circle", "Candle Magic"],
    relatedSigils: ["Triple Moon", "Triquetra"],
  },
  {
    name: "Hades / Pluto",
    type: "Deity",
    origin: "Greek / Roman mythology",
    domain:
      "Underworld, hidden wealth, death cycles, sovereignty over the unseen, transformation",
    context:
      "Hades rules the underworld in Greek mythology — not as a figure of evil but as the impartial sovereign of all that is hidden, including the enormous mineral wealth beneath the earth. As Pluto in Roman tradition, his name literally means 'wealth.' He represents the riches that exist in depth, shadow, and invisible dimensions.",
    psychologicalMeaning:
      "Hades represents the treasure buried in what we avoid — the wealth locked inside our deepest fears, suppressed memories, and shadow aspects. His domain is also completion: the full cycle of transformation that includes the necessary descent.",
    relatedSpells: [
      "Shadow Work Integration",
      "Cord Cutting",
      "Void Meditation",
    ],
    relatedSigils: ["Sigil of the Abyss", "Black Sun (Sonnenrad)"],
  },
  {
    name: "Hermes Trismegistus",
    type: "Deity",
    subCategory: "Hermetic Archetype",
    origin: "Hermetic tradition, Greco-Egyptian synthesis",
    domain:
      "Alchemy, divine wisdom, the Emerald Tablet, all knowledge, the messenger between worlds",
    context:
      "Hermes Trismegistus — Thrice-Greatest Hermes — is the legendary author of the Hermetic Corpus, including the Emerald Tablet ('As above, so below'). He represents the synthesis of Greek Hermes and Egyptian Thoth into a single supremely wise figure who holds the keys to alchemy, astrology, and theurgy.",
    psychologicalMeaning:
      "Hermes Trismegistus embodies the archetype of the Master Knower — the one who has unified all systems of knowledge into a single coherent understanding of how reality works. He represents the mind that sees the pattern beneath all patterns.",
    relatedSpells: ["Invocation", "Talisman Creation", "Sigil Charging"],
    relatedSigils: ["Caduceus", "Enochian Seal", "Hexagram (Star of David)"],
  },
  {
    name: "Yemoja / Yemaya",
    type: "Deity",
    origin: "Yoruba / African diaspora (Candomblé, Santería, Vodou)",
    domain:
      "Ocean, motherhood, fertility, healing, the unconscious, emotional depth",
    context:
      "Yemoja (Yoruba) or Yemaya (African diaspora) is the Orisha of the ocean and the mother of all living things. She is the great mother archetype of African traditional religion — nurturing, powerful, and capable of tremendous destructive force when disrespected. She is syncretized with the Virgin Mary in many diaspora traditions.",
    psychologicalMeaning:
      "Yemoja represents the boundless depth of the unconscious and the unconditional love of the archetypal mother. She embodies the capacity for profound emotional healing that comes from finally feeling held, seen, and loved without condition.",
    relatedSpells: [
      "Healing Transmission",
      "Lunar Drawing Down",
      "Ancestor Altar Ritual",
    ],
    relatedSigils: ["Triple Moon", "Trident of Poseidon"],
  },
  {
    name: "Coyote",
    type: "Archetype",
    subCategory: "Trickster / Shapeshifter",
    origin:
      "Native American traditions (various nations, especially Plains and Southwest)",
    domain:
      "Trickery, humor, shapeshifting, boundary-crossing, wisdom through mistakes, laughter as medicine",
    context:
      "Coyote is one of the most significant figures in Native American mythology — a trickster deity who both creates and destroys, teaches through chaos, and breaks the rules that prevent growth. Unlike purely malevolent tricksters, Coyote's tricks often reveal deeper truths and serve the larger community even when they cause temporary disruption.",
    psychologicalMeaning:
      "Coyote represents the part of us that refuses to be serious when seriousness has become a prison — the capacity to laugh at our own attachments, break our own rules, and find the unexpected path through impossible situations.",
    relatedSpells: [
      "Chaos Magick Sigil",
      "Cross-Roads Ritual",
      "Glamour Weaving",
    ],
    relatedSigils: ["Chaos Star", "Sigil of the Abyss"],
  },
  {
    name: "Sekhmet",
    type: "Deity",
    origin: "Ancient Egyptian mythology, Kemetic tradition",
    domain:
      "Fierce healing, war, disease and its cure, righteous anger, lioness power, solar force",
    context:
      "Sekhmet is the lioness-headed goddess of Egypt — both the bringer of plagues and their cure, the warrior of Ra and the great healer. Her name means 'she who is powerful.' She embodies the paradox that the same force capable of destruction is also the force capable of the most profound healing when properly directed.",
    psychologicalMeaning:
      "Sekhmet represents the healing power of righteous anger — the energy that says 'enough' and acts with absolute conviction. She is the archetype of the healer who does not flinch from the severity of what must be done to restore true health.",
    relatedSpells: [
      "Protection Circle",
      "Candle Magic",
      "Healing Transmission",
    ],
    relatedSigils: ["Eye of Ra", "Sigil of Horus"],
  },
  {
    name: "Baba Yaga",
    type: "Archetype",
    subCategory: "Dark Feminine / Initiatory Guide",
    origin: "Slavic mythology (Russia, Ukraine, Poland)",
    domain:
      "Initiation through ordeal, forest wisdom, transformation, death and rebirth, the tests of readiness",
    context:
      "Baba Yaga is the wild witch of Slavic mythology who lives in a hut on chicken legs in the deep forest. She is neither good nor evil — she tests those who come to her with tasks that separate the worthy from the unready. Those who meet her tests receive her wisdom and magical gifts; those who fail are consumed.",
    psychologicalMeaning:
      "Baba Yaga embodies the initiatory experience — the ordeal that strips away pretense and tests whether you are truly ready for the next level. She is the archetype of wisdom that cannot be inherited but must be earned through the willingness to be fully tested.",
    relatedSpells: [
      "Shadow Work Integration",
      "Cross-Roads Ritual",
      "Ancestor Altar Ritual",
    ],
    relatedSigils: ["Sigil of the Abyss", "Black Sun (Sonnenrad)"],
  },
  {
    name: "Cerridwen",
    type: "Deity",
    origin: "Celtic mythology (Welsh tradition)",
    domain:
      "Cauldron of transformation, dark goddess, wisdom, bardic inspiration, death and rebirth cycles",
    context:
      "Cerridwen is the Welsh witch-goddess who brews the cauldron of Awen — divine inspiration — for a year and a day. Her myth involves her servant Gwion Bach accidentally tasting three drops of the brew, initiating a shapeshifting chase that ends in death and rebirth as the bard Taliesin. She embodies the transformative process itself.",
    psychologicalMeaning:
      "Cerridwen represents the deep alchemical transformation that cannot be rushed — the year-long brewing of wisdom, the way that true inspiration comes not as a gift but as the product of sustained effort and the willingness to be unmade and remade.",
    relatedSpells: [
      "Cauldron Spell",
      "Shadow Work Integration",
      "Ancestor Altar Ritual",
    ],
    relatedSigils: ["Triquetra", "Cauldron Sigil", "Triple Moon"],
  },
  {
    name: "Raijin",
    type: "Deity",
    origin: "Japanese mythology, Shinto tradition",
    domain:
      "Thunder, lightning, storms, drums, the percussion of creation, purification through sound",
    context:
      "Raijin is the Japanese god of thunder and lightning, often depicted as a fearsome figure surrounded by drums that he beats to create the sound of thunder. He is typically paired with Fujin (wind god). In Shinto belief, Raijin's thunder drives away evil and purifies the air — the storm is not a punishment but a cosmic cleansing.",
    psychologicalMeaning:
      "Raijin represents the purifying power of explosive release — the emotional thunderstorm that clears accumulated tension and restores fresh air to the inner landscape. He is the archetype of cathartic expression.",
    relatedSpells: ["Fire Spell", "Protection Circle", "Cord Binding Oath"],
    relatedSigils: ["Tempest Rune", "Algiz (Rune)"],
  },
  {
    name: "Saraqael",
    type: "Angel",
    origin: "Jewish apocalyptic tradition (Book of Enoch), Hermetic angelology",
    domain:
      "Visions, secrets, hidden knowledge, the revelation of what is concealed, the mysteries of the deep",
    context:
      "Saraqael (also Sariel or Suriel) is one of the seven archangels named in the Book of Enoch, associated with the revelation of hidden things and the unlocking of divine secrets. He is the angel of visions — the messenger who reveals what is concealed, illuminates the unseen dimensions of reality, and delivers prophetic sight.",
    psychologicalMeaning:
      "Saraqael represents the part of consciousness that already knows what is hidden — the intuitive faculty that pierces through appearances to the underlying truth. He embodies the courage to see clearly even when what is revealed is challenging.",
    relatedSpells: ["Invocation", "Sigil Charging", "Talisman Creation"],
    relatedSigils: ["Enochian Seal", "Bind Rune of Awakening"],
  },
  {
    name: "The Outsider",
    type: "Archetype",
    subCategory: "Liminal / Threshold Archetype",
    origin:
      "Jungian psychology, existentialist philosophy, cross-cultural mythology",
    domain:
      "Liminality, the threshold, non-belonging as power, the observer position, radical perspective",
    context:
      "The Outsider is the universal archetype of the one who stands at the boundary — neither fully inside nor outside any system. The Outsider exists in every tradition: the stranger who arrives in the village, the fool who speaks truth to kings, the exile who sees the homeland more clearly from a distance.",
    psychologicalMeaning:
      "The Outsider represents the power that comes from not being fully captured by any single system's rules or stories. The outsider position grants the freedom to see what insiders cannot — and the capacity to change what they cannot imagine changing.",
    relatedSpells: [
      "Cross-Roads Ritual",
      "Chaos Magick Sigil",
      "Void Meditation",
    ],
    relatedSigils: ["Chaos Star", "Sigil of the Abyss"],
  },
  {
    name: "The Eternal Child",
    type: "Archetype",
    subCategory: "Puer Aeternus (Renewal Variant)",
    origin:
      "Jungian psychology, mythology of divine children across traditions",
    domain:
      "Perpetual renewal, beginner's mind, wonder, the power of fresh starts, innocence as a spiritual force",
    context:
      "The Eternal Child (Puer Aeternus in its regenerative aspect) represents the archetype of perpetual beginning — the capacity to meet every moment fresh, to find wonder in what is ordinary, and to begin again without the weight of past failures. Unlike the avoidant puer who refuses to grow, this variant embodies the spiritual gift of perennial renewal.",
    psychologicalMeaning:
      "The Eternal Child represents the beginner's mind that Zen masters describe — the openness that allows learning to continue indefinitely. It is the gift of finding everything interesting, the refusal to let familiarity collapse into boredom.",
    relatedSpells: ["Glamour Weaving", "Candle Magic", "Solar Charging Ritual"],
    relatedSigils: ["Flower of Life", "Bind Rune of Awakening"],
  },
];

const TYPE_COLORS: Record<EntityType, string> = {
  Angel: "oklch(0.78 0.15 85)",
  Demon: "oklch(0.58 0.22 15)",
  Deity: "oklch(0.68 0.2 30)",
  Spirit: "oklch(0.62 0.22 295)",
  Archetype: "oklch(0.65 0.2 220)",
  Egregore: "oklch(0.65 0.22 150)",
};

const ENTITY_TYPES: Array<"All" | EntityType> = [
  "All",
  "Angel",
  "Demon",
  "Deity",
  "Spirit",
  "Archetype",
  "Egregore",
];

interface SpiritualEntitiesPageProps {
  onUseForSubliminal: (topic: string) => void;
  onNavigate: (page: string) => void;
}

export default function SpiritualEntitiesPage({
  onUseForSubliminal,
  onNavigate,
}: SpiritualEntitiesPageProps) {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<"All" | EntityType>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return ENTITIES.filter((e) => {
      const matchesSearch =
        search === "" ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.domain.toLowerCase().includes(search.toLowerCase()) ||
        e.origin.toLowerCase().includes(search.toLowerCase()) ||
        e.context.toLowerCase().includes(search.toLowerCase()) ||
        (e.subCategory?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesType = activeType === "All" || e.type === activeType;
      return matchesSearch && matchesType;
    });
  }, [search, activeType]);

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
            <Ghost className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl font-bold gradient-text">
          Spiritual Entities
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          An encyclopedic reference to angels, deities, spirits, egregores,
          archetypes, and mythological beings. Channel any entity's essence and
          symbolic energy into your subliminal practice.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <Badge
            className="text-xs font-mono"
            style={{
              background: "oklch(0.78 0.15 85 / 0.2)",
              color: "oklch(0.78 0.15 85)",
              border: "1px solid oklch(0.78 0.15 85 / 0.4)",
            }}
          >
            {ENTITIES.filter((e) => e.type === "Angel").length} Angels
          </Badge>
          <Badge
            className="text-xs font-mono"
            style={{
              background: "oklch(0.58 0.22 15 / 0.2)",
              color: "oklch(0.58 0.22 15)",
              border: "1px solid oklch(0.58 0.22 15 / 0.4)",
            }}
          >
            {ENTITIES.filter((e) => e.type === "Demon").length} Archetypal
            Demons
          </Badge>
          <Badge
            className="text-xs font-mono"
            style={{
              background: "oklch(0.68 0.2 30 / 0.2)",
              color: "oklch(0.68 0.2 30)",
              border: "1px solid oklch(0.68 0.2 30 / 0.4)",
            }}
          >
            {ENTITIES.filter((e) => e.type === "Deity").length} Deities
          </Badge>
          <Badge
            className="text-xs font-mono"
            style={{
              background: "oklch(0.62 0.22 295 / 0.2)",
              color: "oklch(0.62 0.22 295)",
              border: "1px solid oklch(0.62 0.22 295 / 0.4)",
            }}
          >
            {ENTITIES.filter((e) => e.type === "Spirit").length} Spirits
          </Badge>
          <Badge
            className="text-xs font-mono"
            style={{
              background: "oklch(0.65 0.2 220 / 0.2)",
              color: "oklch(0.65 0.2 220)",
              border: "1px solid oklch(0.65 0.2 220 / 0.4)",
            }}
          >
            {ENTITIES.filter((e) => e.type === "Archetype").length} Archetypes
          </Badge>
          <Badge
            className="text-xs font-mono"
            style={{
              background: "oklch(0.65 0.22 150 / 0.2)",
              color: "oklch(0.65 0.22 150)",
              border: "1px solid oklch(0.65 0.22 150 / 0.4)",
            }}
          >
            {ENTITIES.filter((e) => e.type === "Egregore").length} Egregores
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
            data-ocid="entities.search_input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entities, domains, origins, subcategories..."
            className="pl-10 pr-10 bg-secondary/30 border-border/50 focus:border-primary/50"
          />
          {search && (
            <button
              type="button"
              data-ocid="entities.search.close_button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2" data-ocid="entities.filter.tab">
          {ENTITY_TYPES.map((type) => {
            const isActive = activeType === type;
            const color =
              type === "All" ? "oklch(0.62 0.22 295)" : TYPE_COLORS[type];
            return (
              <button
                key={type}
                type="button"
                data-ocid={`entities.${type.toLowerCase()}.tab`}
                onClick={() => setActiveType(type)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border"
                style={{
                  background: isActive ? `${color}25` : "transparent",
                  borderColor: isActive
                    ? `${color}60`
                    : "oklch(0.3 0.02 260 / 0.5)",
                  color: isActive ? color : "oklch(0.6 0.02 260)",
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </motion.div>

      {(search || activeType !== "All") && (
        <p className="text-muted-foreground text-sm">
          Showing {filtered.length} of {ENTITIES.length} entities
        </p>
      )}

      {/* Entity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <AnimatePresence>
          {filtered.map((entity, idx) => {
            const color = TYPE_COLORS[entity.type];
            const isExpanded = expandedId === entity.name;
            return (
              <motion.div
                key={entity.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.015 }}
                className="rounded-2xl border bg-secondary/20 overflow-hidden"
                style={{ borderColor: `${color}30` }}
                data-ocid={`entities.item.${idx + 1}`}
              >
                <button
                  type="button"
                  data-ocid={`entities.card.${idx + 1}`}
                  onClick={() => setExpandedId(isExpanded ? null : entity.name)}
                  className="w-full text-left p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-heading text-base font-bold"
                          style={{ color }}
                        >
                          {entity.name}
                        </span>
                        <Badge
                          className="text-xs shrink-0"
                          style={{
                            background: `${color}20`,
                            color,
                            border: `1px solid ${color}40`,
                          }}
                        >
                          {entity.type}
                        </Badge>
                        {entity.subCategory && (
                          <Badge
                            className="text-xs shrink-0 font-normal"
                            style={{
                              background: `${color}10`,
                              color: `${color}bb`,
                              border: `1px solid ${color}25`,
                            }}
                          >
                            {entity.subCategory}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {entity.origin}
                      </p>
                      <p className="text-xs text-foreground/70 line-clamp-1">
                        {entity.domain}
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-muted-foreground shrink-0 mt-1"
                    >
                      ▼
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-3 space-y-3 border-t border-border/30">
                        {entity.archetypalNote && (
                          <div
                            className="text-xs px-3 py-2 rounded-lg italic"
                            style={{
                              background: `${color}10`,
                              color: `${color}`,
                              borderLeft: `2px solid ${color}`,
                            }}
                          >
                            ⚠ {entity.archetypalNote}
                          </div>
                        )}

                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                            Domain & Attributes
                          </h4>
                          <p className="text-xs text-foreground/80">
                            {entity.domain}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                            Mythological Context
                          </h4>
                          <p className="text-xs text-foreground/80 leading-relaxed">
                            {entity.context}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                            Psychological / Archetypal Meaning
                          </h4>
                          <p className="text-xs text-foreground/80 leading-relaxed">
                            {entity.psychologicalMeaning}
                          </p>
                        </div>

                        {/* Connections */}
                        {(() => {
                          const conn = ENTITY_CONNECTIONS[entity.name] ?? {
                            relatedSpells: ["Invocation", "Sigil Charging"],
                            relatedSigils: ["Seal of Solomon"],
                          };
                          return (
                            <div className="space-y-2 pt-1 border-t border-border/20">
                              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                ◈ Connections
                              </h4>
                              {/* Spells */}
                              <div className="space-y-1">
                                <p
                                  className="text-xs font-semibold uppercase tracking-widest"
                                  style={{
                                    color: "oklch(0.62 0.22 295 / 0.8)",
                                  }}
                                >
                                  ⚔ Spells
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {conn.relatedSpells.map((spell) => (
                                    <button
                                      key={spell}
                                      type="button"
                                      onClick={() => onNavigate("spells")}
                                      className="text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all duration-150 hover:scale-105"
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
                              {/* Sigils */}
                              <div className="space-y-1">
                                <p
                                  className="text-xs font-semibold uppercase tracking-widest"
                                  style={{ color: "oklch(0.72 0.2 70 / 0.8)" }}
                                >
                                  ◈ Sigils
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {conn.relatedSigils.map((sigil) => (
                                    <button
                                      key={sigil}
                                      type="button"
                                      onClick={() => onNavigate("sigils")}
                                      className="text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all duration-150 hover:scale-105"
                                      style={{
                                        background: "oklch(0.72 0.2 70 / 0.12)",
                                        color: "oklch(0.72 0.2 70)",
                                        border:
                                          "1px solid oklch(0.72 0.2 70 / 0.3)",
                                      }}
                                    >
                                      {sigil}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        <Button
                          size="sm"
                          data-ocid="entities.use.button"
                          onClick={() =>
                            onUseForSubliminal(
                              `${entity.name} energy and essence`,
                            )
                          }
                          className="w-full gap-2 text-xs mt-1"
                          style={{
                            background: `${color}20`,
                            border: `1px solid ${color}50`,
                            color: color,
                          }}
                        >
                          <Sparkles className="w-3 h-3" />
                          Use for Subliminal
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 space-y-3"
          data-ocid="entities.empty_state"
        >
          <Ghost className="w-12 h-12 text-muted-foreground/40 mx-auto" />
          <p className="text-muted-foreground">
            No entities found for &quot;{search}&quot;
          </p>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="entities.clear.button"
            onClick={() => {
              setSearch("");
              setActiveType("All");
            }}
          >
            Clear filters
          </Button>
        </motion.div>
      )}
    </div>
  );
}
