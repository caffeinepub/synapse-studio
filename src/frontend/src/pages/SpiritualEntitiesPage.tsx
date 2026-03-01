import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ghost, Search, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

type EntityType = "Angel" | "Demon" | "Deity" | "Spirit" | "Archetype";

interface SpiritualEntity {
  name: string;
  type: EntityType;
  origin: string;
  domain: string;
  context: string;
  psychologicalMeaning: string;
  archetypalNote?: string;
}

const ENTITIES: SpiritualEntity[] = [
  // Angels
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
  // Demons (archetypal/mythological)
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
  // Deities
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
  // Spirits
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
  // Archetypes
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
    name: "The Anima/Animus",
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
      "The Self in Jungian psychology is the archetype of wholeness and the organizing center of the psyche — encompassing both the conscious ego and the vast unconscious. The process of individuation is the lifelong journey of aligning with the Self. It often appears in dreams as a divine figure, mandala, or luminous being.",
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
];

const TYPE_COLORS: Record<EntityType, string> = {
  Angel: "oklch(0.78 0.15 85)",
  Demon: "oklch(0.58 0.22 15)",
  Deity: "oklch(0.68 0.2 30)",
  Spirit: "oklch(0.62 0.22 295)",
  Archetype: "oklch(0.65 0.2 220)",
};

const ENTITY_TYPES: Array<"All" | EntityType> = [
  "All",
  "Angel",
  "Demon",
  "Deity",
  "Spirit",
  "Archetype",
];

interface SpiritualEntitiesPageProps {
  onUseForSubliminal: (topic: string) => void;
}

export default function SpiritualEntitiesPage({
  onUseForSubliminal,
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
        e.context.toLowerCase().includes(search.toLowerCase());
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
          An encyclopedic reference to angels, deities, archetypal spirits, and
          mythological beings. Channel any entity's essence and symbolic energy
          into your subliminal practice.
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
            placeholder="Search entities, domains, origins..."
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
          {ENTITY_TYPES.map((type) => {
            const isActive = activeType === type;
            const color =
              type === "All" ? "oklch(0.62 0.22 295)" : TYPE_COLORS[type];
            return (
              <button
                key={type}
                type="button"
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

      {search && (
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
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                className="rounded-2xl border bg-secondary/20 overflow-hidden"
                style={{ borderColor: `${color}30` }}
              >
                <button
                  type="button"
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

                        <Button
                          size="sm"
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
        >
          <Ghost className="w-12 h-12 text-muted-foreground/40 mx-auto" />
          <p className="text-muted-foreground">
            No entities found for &quot;{search}&quot;
          </p>
          <Button
            variant="ghost"
            size="sm"
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
