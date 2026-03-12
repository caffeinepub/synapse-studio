import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Wand2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

type SpellTradition =
  | "Wicca"
  | "Ceremonial"
  | "Folk Magic"
  | "Sigil Work"
  | "Elemental"
  | "Energy Work";

interface Spell {
  name: string;
  tradition: SpellTradition;
  purpose: string;
  components: string[];
  symbolicMeaning: string;
  affirmationConversion: string;
}

const SPELL_CONNECTIONS: Record<
  string,
  { relatedEntities: string[]; relatedSigils: string[] }
> = {
  "Candle Magic": {
    relatedEntities: ["Ra", "Brigid", "Oshun"],
    relatedSigils: ["Solar Cross", "Ankh"],
  },
  "Moon Spell": {
    relatedEntities: ["Hecate", "Isis", "The Moon"],
    relatedSigils: ["Eye of Providence", "Triquetra"],
  },
  "Protection Circle": {
    relatedEntities: ["Michael", "Thor", "The Morrigan"],
    relatedSigils: ["Pentagram (Pentacle)", "Algiz (Rune)", "Seal of Solomon"],
  },
  "Abundance Ritual": {
    relatedEntities: ["Lakshmi", "Oshun", "Ganesha"],
    relatedSigils: ["Hamsa", "Flower of Life", "Hexagram (Star of David)"],
  },
  "Binding Spell": {
    relatedEntities: ["Lilith", "Kali", "The Morrigan"],
    relatedSigils: ["Leviathan Cross", "Algiz (Rune)"],
  },
  "Glamour Spell": {
    relatedEntities: ["Freya", "Oshun", "Asmodeus"],
    relatedSigils: ["Hamsa", "Hecate's Wheel"],
  },
  "Lesser Banishing Ritual of the Pentagram (LBRP)": {
    relatedEntities: ["Michael", "Raphael", "Gabriel", "Uriel"],
    relatedSigils: [
      "Seal of Solomon",
      "Pentagram (Pentacle)",
      "Tree of Life (Kabbalah)",
    ],
  },
  Invocation: {
    relatedEntities: ["Hermes", "Isis", "Odin"],
    relatedSigils: [
      "Seal of Solomon",
      "Eye of Providence",
      "Hexagram (Star of David)",
    ],
  },
  "Sigil Charging": {
    relatedEntities: ["Metatron", "Azazel", "Lucifer"],
    relatedSigils: ["Metatron's Cube", "Chaos Star", "Flower of Life"],
  },
  "Talisman Creation": {
    relatedEntities: ["Hermes", "Metatron", "Odin"],
    relatedSigils: ["Seal of Solomon", "Valknut"],
  },
  "Jar Spell": {
    relatedEntities: ["Oshun", "Asmodeus", "Eshu / Elegba"],
    relatedSigils: ["Hamsa", "Hexagram (Star of David)"],
  },
  "Knot Magic": {
    relatedEntities: ["The Morrigan", "Thor", "Freya"],
    relatedSigils: ["Triquetra", "Celtic Cross"],
  },
  "Herb Pouch (Mojo Bag)": {
    relatedEntities: ["Hecate", "Anubis", "Cernunnos"],
    relatedSigils: ["Triskelion", "Celtic Cross"],
  },
  "Mirror Magic": {
    relatedEntities: ["Lilith", "Hecate", "The Shadow"],
    relatedSigils: ["Eye of Providence", "Hecate's Wheel"],
  },
  "Cord Cutting": {
    relatedEntities: ["Anubis", "Kali", "Lilith"],
    relatedSigils: ["Leviathan Cross", "Ouroboros"],
  },
  "Desire Sigil": {
    relatedEntities: ["Lucifer", "Loki", "Asmodeus"],
    relatedSigils: ["Chaos Star", "Sigil of Lucifer"],
  },
  "Chaos Magick Sigil": {
    relatedEntities: ["Loki", "The Trickster", "Baphomet"],
    relatedSigils: ["Chaos Star", "Leviathan Cross"],
  },
  "Planetary Seal": {
    relatedEntities: ["Hermes", "Ra", "Uriel"],
    relatedSigils: [
      "Hexagram (Star of David)",
      "Seal of Solomon",
      "Eye of Providence",
    ],
  },
  "Runic Bind Rune": {
    relatedEntities: ["Odin", "Thor", "Freya"],
    relatedSigils: ["Valknut", "Algiz (Rune)", "Othala (Rune)", "Vegvisir"],
  },
  "Fire Spell": {
    relatedEntities: ["Ra", "Shango", "Kali", "Brigid"],
    relatedSigils: ["Solar Cross", "Mjolnir (Thor's Hammer)"],
  },
  "Water Ritual": {
    relatedEntities: ["Isis", "Oshun", "Poseidon / Neptune"],
    relatedSigils: ["Triquetra", "Eye of Horus"],
  },
  "Earth Grounding": {
    relatedEntities: ["Cernunnos", "Ganesha", "The Serpent"],
    relatedSigils: ["Celtic Cross", "Tree of Life (Kabbalah)"],
  },
  "Air Invocation": {
    relatedEntities: ["Hermes", "Gabriel", "Susanoo"],
    relatedSigils: ["Eye of Providence", "Caduceus"],
  },
  "Chakra Clearing": {
    relatedEntities: ["Shiva", "Ganesha", "Metatron"],
    relatedSigils: ["Sri Yantra", "Flower of Life", "Seed of Life"],
  },
  "Aura Cleansing": {
    relatedEntities: ["Raphael", "Michael", "Isis"],
    relatedSigils: ["Seal of Solomon", "Pentagram (Pentacle)"],
  },
  "Energy Shield": {
    relatedEntities: ["Michael", "Thor", "Uriel"],
    relatedSigils: ["Algiz (Rune)", "Hamsa", "Pentagram (Pentacle)"],
  },
  "Healing Transmission": {
    relatedEntities: ["Raphael", "Isis", "The Serpent"],
    relatedSigils: ["Caduceus", "Ankh", "Seed of Life"],
  },
  "Astral Gate Opening": {
    relatedEntities: ["Hermes", "Hecate"],
    relatedSigils: ["Sigil of the Abyss"],
  },
  "Shadow Integration Ritual": {
    relatedEntities: ["Lilith", "The Morrigan"],
    relatedSigils: ["Black Sun"],
  },
  "Silver Thread Manifestation": {
    relatedEntities: ["Ariadne", "Fate"],
    relatedSigils: ["Vegvisir"],
  },
  "Storm Calling": {
    relatedEntities: ["Thor", "Raijin", "Zeus"],
    relatedSigils: ["Helm of Awe"],
  },
  "Eye of Truth Ritual": {
    relatedEntities: ["Thoth", "Ma'at", "Athena"],
    relatedSigils: ["Eye of Horus", "Sigil of Horus"],
  },
  "Sacred Union Ceremony": {
    relatedEntities: ["Isis", "Osiris"],
    relatedSigils: ["Ouroboros"],
  },
  "Void Dissolution": {
    relatedEntities: ["Nyx", "Kali"],
    relatedSigils: ["Sigil of the Abyss"],
  },
  "Phoenix Rising Ritual": {
    relatedEntities: ["Ra", "Sekhmet"],
    relatedSigils: ["Fire Triangle"],
  },
};

const SPELLS: Spell[] = [
  // Wicca
  {
    name: "Candle Magic",
    tradition: "Wicca",
    purpose:
      "Candle magic uses the element of fire to focus intention and manifest desired outcomes. Each candle color corresponds to a specific intention — red for passion, green for abundance, white for purification, purple for spiritual power. The candle's burning represents the transformation of intention into reality.",
    components: [
      "Colored candles",
      "Essential oils for anointing",
      "Herbs corresponding to intention",
      "Carving tools for symbols",
      "Fireproof holder",
    ],
    symbolicMeaning:
      "Fire represents transformation, purification, and the will. Lighting a candle is an act of conscious creation — you are bringing light into darkness, literally and metaphorically igniting your intention in the physical world.",
    affirmationConversion:
      "The candle's purpose becomes your inner fire: 'My intention burns bright and steady. I am a focused force of creation. What I give my attention and energy to manifests in my life.'",
  },
  {
    name: "Moon Spell",
    tradition: "Wicca",
    purpose:
      "Moon spells align magical intention with the lunar cycle to amplify manifestation or release. New Moon spells plant seeds of new intention; Full Moon spells charge and manifest; Waning Moon spells release and banish what no longer serves.",
    components: [
      "Moonwater (water charged under moonlight)",
      "Silver or white objects",
      "Lunar correspondence herbs (jasmine, mugwort, moonwort)",
      "Journal for intention setting",
      "Crystals: moonstone, selenite, clear quartz",
    ],
    symbolicMeaning:
      "The Moon governs cycles, intuition, emotions, and the unconscious mind. Lunar spellwork aligns your personal intentions with the vast rhythmic intelligence of natural cycles, surrendering to cosmic timing rather than forcing outcomes.",
    affirmationConversion:
      "Lunar alignment becomes: 'I move with the rhythm of perfect timing. My intuition guides me like moonlight through darkness. I release what has served its purpose and open to new abundance.'",
  },
  {
    name: "Protection Circle",
    tradition: "Wicca",
    purpose:
      "The protection circle (or magic circle) is a ritual space cast to create sacred, protected energetic boundaries. It separates the practitioner from unwanted influences, creates a container for magical work, and establishes a threshold between the ordinary world and sacred space.",
    components: [
      "Salt (purification, earth element)",
      "Water (cleansing)",
      "Incense smoke (air, purification)",
      "Candles (fire, cardinal directions)",
      "Athame or wand for casting",
    ],
    symbolicMeaning:
      "The circle has no beginning and no end — it represents wholeness, eternity, and perfect protection. Casting a circle is an act of claiming sacred space within the world, declaring: 'Here I am sovereign. Here I am protected.'",
    affirmationConversion:
      "Circle casting becomes inner boundary work: 'I exist within sacred, protected space. My energy field is clear, strong, and permeable only to what serves my highest good. I am the guardian of my own inner world.'",
  },
  {
    name: "Abundance Ritual",
    tradition: "Wicca",
    purpose:
      "Abundance rituals align the practitioner's energy with the frequency of prosperity, growth, and gratitude. They work by shifting internal states from lack to sufficiency, planting energetic seeds for material and spiritual flourishing.",
    components: [
      "Green or gold candles",
      "Cinnamon, basil, or patchouli herbs",
      "Coins or currency as symbolic anchors",
      "Bay leaves for writing intentions",
      "Citrine or pyrite crystals",
    ],
    symbolicMeaning:
      "Abundance magic works on the premise that the outer world reflects the inner world. By shifting your relationship to prosperity — from lack to gratitude, from wanting to having — you become resonant with abundance rather than resistant to it.",
    affirmationConversion:
      "Abundance becomes a state of being: 'Prosperity flows to me naturally. I am aligned with abundance in all its forms. I receive with gratitude and give with joy. Wealth, health, and opportunity are my natural state.'",
  },
  {
    name: "Binding Spell",
    tradition: "Wicca",
    purpose:
      "A binding spell creates an energetic constraint around a situation, habit, or pattern. In Wiccan practice, bindings are most ethically used to bind oneself from harmful patterns or to prevent harm from continuing. The binding does not destroy but contains.",
    components: [
      "Black or white cord or thread",
      "Poppet or symbolic object representing what is bound",
      "Black candle (for protective binding)",
      "Salt and iron (traditional binding agents)",
      "Clear statement of binding intention",
    ],
    symbolicMeaning:
      "Binding represents the power of conscious constraint — the ability to say 'no further' to patterns, energies, or behaviors that have grown beyond their proper limits. A binding is not a punishment but a firm, loving container.",
    affirmationConversion:
      "Binding becomes self-mastery: 'I have the power to stop what no longer serves me. I bind myself to my highest values. I am the author of my habits and the master of my patterns.'",
  },
  {
    name: "Glamour Spell",
    tradition: "Wicca",
    purpose:
      "Glamour magic enhances personal magnetism, beauty, and the impression one makes in the world. It works through symbolic amplification of the practitioner's inner qualities — confidence, grace, and presence — making them more visible and felt by others.",
    components: [
      "Mirror for self-visualization",
      "Rose water or perfume as anointing",
      "Rose quartz or copper (Venusian energy)",
      "Red or pink candles",
      "Honey, lavender, or jasmine",
    ],
    symbolicMeaning:
      "The glamour is not deception but amplification — bringing forward your most radiant aspects so the world can perceive what is already true. Every person has magnetic beauty; glamour magic turns up its signal.",
    affirmationConversion:
      "Glamour becomes radiance: 'I am magnetic and captivating. My presence lights up every space I enter. People are drawn to my energy, warmth, and confidence. I radiate authentic beauty from the inside out.'",
  },
  // Ceremonial
  {
    name: "Lesser Banishing Ritual of the Pentagram (LBRP)",
    tradition: "Ceremonial",
    purpose:
      "The LBRP is the foundational banishing ritual of the Western ceremonial magic tradition, developed within the Golden Dawn. It clears the aura and magical space of unwanted energies, invokes the four archangels as protective guardians, and aligns the practitioner with cosmic forces.",
    components: [
      "Ritual dagger (athame)",
      "Qabalistic cross positions",
      "Pentagram traced in all four directions",
      "Divine names (YHVH, ADNI, AHIH, AGLA)",
      "Archangel invocations (Raphael, Gabriel, Michael, Auriel)",
    ],
    symbolicMeaning:
      "The LBRP is a complete cosmological act — the practitioner places themselves at the center of the universe, banishes all that is not of the light, and claims their space as sacred and protected by divine forces. It is a daily affirmation of spiritual sovereignty.",
    affirmationConversion:
      "The LBRP becomes centeredness: 'I stand at the center of my world, grounded and sovereign. I clear all unwanted energies from my field and am surrounded by divine protection. I am aligned with the highest forces of light.'",
  },
  {
    name: "Invocation",
    tradition: "Ceremonial",
    purpose:
      "An invocation calls a divine being, deity, or archetypal force into the practitioner's sphere of consciousness — not to summon it externally, but to awaken its qualities within. The invocant identifies with the invoked force, temporarily embodying its attributes.",
    components: [
      "Formal declaration or prayer of invocation",
      "Incense corresponding to the invoked being",
      "Color and symbolic correspondences",
      "Sacred space prepared with appropriate symbols",
      "Clear statement of purpose for the invocation",
    ],
    symbolicMeaning:
      "Invocation is based on the Hermetic principle 'as above, so below' — by deeply identifying with a divine force or archetype, the practitioner temporarily activates those qualities within themselves. You do not become the god; you recognize the god within you.",
    affirmationConversion:
      "Invocation becomes identity activation: 'I call forth [quality/attribute] as a living reality within me. I embody strength/wisdom/love. These divine qualities are awakened and active in my life right now.'",
  },
  {
    name: "Sigil Charging",
    tradition: "Ceremonial",
    purpose:
      "Sigil charging is the process of activating a created sigil — a simplified symbol encoding a specific intention — through focused consciousness and energy. Methods include meditation focus, physical gnosis, fire, water, or ritual charging under specific astrological conditions.",
    components: [
      "Prepared sigil on paper or parchment",
      "Candle (color corresponding to intention)",
      "Incense (frankincense, myrrh, or intention-specific)",
      "State of focused gnosis or meditation",
      "Method of release (burning, burying, releasing to water)",
    ],
    symbolicMeaning:
      "The sigil represents the compression of complex intention into a single symbolic seed. Charging it is the act of planting that seed in the fertile soil of the unconscious mind, bypassing the skeptical conscious mind and directly imprinting the intention into deeper mental processes.",
    affirmationConversion:
      "Sigil work becomes focused intention: 'My intentions are clear, precise, and powerful. I plant my desires as seeds in the field of infinite possibility. What I intend with clarity and conviction manifests in my life.'",
  },
  {
    name: "Talisman Creation",
    tradition: "Ceremonial",
    purpose:
      "A talisman is a physical object charged with specific magical intention to attract or manifest a particular quality, protection, or outcome. Unlike amulets (which repel), talismans attract. The creation process involves selecting materials, symbols, and timing according to astrological and symbolic correspondences.",
    components: [
      "Base material (metal, wood, stone, parchment)",
      "Planetary or elemental symbols",
      "Correspondingly timed creation (astrological election)",
      "Ritual charging with intention",
      "Appropriate symbol systems (Hebrew letters, runes, planetary seals)",
    ],
    symbolicMeaning:
      "The talisman externalizes intention, creating a physical anchor for an internal state. Having a charged object serves as a constant reminder of your intention, reinforcing it through repeated attention and association.",
    affirmationConversion:
      "Talisman creation becomes physical anchoring: 'I anchor my intentions in the physical world. My desires take form and substance. I carry within me a magnet for [quality] and attract it naturally and consistently.'",
  },
  // Folk Magic
  {
    name: "Jar Spell",
    tradition: "Folk Magic",
    purpose:
      "Jar spells (also called bottle spells or honey jars) are a staple of Hoodoo, rootwork, and folk magic traditions. Items with symbolic correspondences to an intention are placed in a jar with a liquid base (honey for sweetening, vinegar for souring), sealed, and worked through regular ritual attention.",
    components: [
      "Glass jar with lid",
      "Honey, syrup, vinegar, or water base",
      "Herbs corresponding to intention",
      "Personal items (hair, photo, written petition)",
      "Candle burned on top",
    ],
    symbolicMeaning:
      "The jar creates a contained, physical representation of your intention — literally trapping and holding the energy of your desire in the physical world. The 'sweetening' process works on the symbolic level of attraction and harmonious connection.",
    affirmationConversion:
      "Jar spells become attraction work: 'Sweet, positive energy flows toward me continuously. I attract harmony, love, and abundance. Every day my life grows richer, warmer, and more aligned with my deepest desires.'",
  },
  {
    name: "Knot Magic",
    tradition: "Folk Magic",
    purpose:
      "Knot magic, or cord magic, is one of the oldest forms of folk magic, found in ancient Egypt, Mesopotamia, Greece, and throughout Europe. Intentions are tied into knots in a cord as each knot is created, physically binding the intention into matter.",
    components: [
      "Natural fiber cord (cotton, hemp, silk)",
      "Nine or thirteen length segments traditionally",
      "Clear intention for each knot",
      "Timing with lunar or seasonal cycles",
      "Storage or release method",
    ],
    symbolicMeaning:
      "Tying a knot is the act of making something concrete and fixed — bringing an intention from the fluid, possibility-space of the mind into the structured, physical world. Each knot is a point of commitment and crystallized will.",
    affirmationConversion:
      "Knot work becomes commitment: 'I tie myself to my highest intentions. I am committed and consistent in my path. Each action I take ties me more firmly to the life I am creating. My will is strong and my follow-through is complete.'",
  },
  {
    name: "Herb Pouch (Mojo Bag)",
    tradition: "Folk Magic",
    purpose:
      "The mojo bag (also called gris-gris, medicine bag, or charm bag) is a cloth bag filled with herbs, roots, minerals, and personal items charged with a specific intention. It is carried on the body to maintain continuous energetic alignment with the stated intention.",
    components: [
      "Natural cloth bag (flannel traditionally)",
      "Herbs and roots (correspondences to intention)",
      "Minerals or crystals",
      "Personal items (hair, nail clippings, photo)",
      "Anointing oil and spoken prayer/petition",
    ],
    symbolicMeaning:
      "The mojo bag is a living object — it breathes with you, moves with you, and serves as a constant physical reminder and energetic anchor for your intention. It bridges the invisible world of intention with the visible world of matter.",
    affirmationConversion:
      "The mojo bag becomes embodied intention: 'I carry my power with me at all times. I am in continuous alignment with my deepest intentions. My energy and my goals move together as one. I am magnetic, purposeful, and grounded.'",
  },
  {
    name: "Mirror Magic",
    tradition: "Folk Magic",
    purpose:
      "Mirror magic uses reflective surfaces for a variety of intentions: self-reflection and shadow work, deflecting negative energy back to its source, scrying (divination), amplifying intentions through reflection, and working with one's own image and self-perception.",
    components: [
      "Mirror (black, silver, or regular glass)",
      "Candles placed to reflect in the mirror",
      "Anointing oils for the mirror frame",
      "Written intentions or sigils",
      "Black cloth for covering when not in use",
    ],
    symbolicMeaning:
      "Mirrors represent the threshold between worlds — they show us what is real but reversed, the outer as inner, the inner as outer. Working with mirrors is inherently liminal: you stand between the world and its reflection, integrating what you see.",
    affirmationConversion:
      "Mirror work becomes self-truth: 'I see myself clearly and with love. The world reflects back to me the beauty and power I carry within. I am at peace with all aspects of myself. What I am becomes what I experience.'",
  },
  {
    name: "Cord Cutting",
    tradition: "Folk Magic",
    purpose:
      "Cord cutting is a ritual for consciously releasing attachments, energetic cords, or unhealthy bonds with people, situations, or beliefs. It works symbolically by visualizing the energetic cord connecting you to what must be released and ritually cutting it.",
    components: [
      "Two candles representing self and what is being released",
      "Cord or string connecting the candles",
      "Blade or scissors for cutting",
      "Smoke (incense) for cleansing after",
      "Burial or release of the severed cord",
    ],
    symbolicMeaning:
      "Energetic cords represent ongoing psychic investment — attention, emotion, and life force continuing to flow toward something after the physical connection has ended. Cord cutting is an act of reclaiming energy and redirecting it toward your own growth.",
    affirmationConversion:
      "Cord cutting becomes freedom: 'I release all attachments that drain my life force. I am free from all that no longer serves my evolution. My energy is fully mine, flowing powerfully toward my highest path and greatest joy.'",
  },
  // Sigil Work
  {
    name: "Desire Sigil",
    tradition: "Sigil Work",
    purpose:
      "A desire sigil encodes a specific intention into a unique symbol that is then charged and forgotten — allowing it to work on the unconscious level. The 'forgetting' is essential: it prevents the doubting conscious mind from interfering with the planted intention.",
    components: [
      "Written statement of desire in positive present tense",
      "Letter reduction method (remove vowels and repeating consonants)",
      "Artistic design combining remaining letters",
      "Charging method (gnosis/focus)",
      "Release and forgetting",
    ],
    symbolicMeaning:
      "The desire sigil works by bypassing the conscious mind's tendency to counter-program intentions with doubt. By encoding the desire in an abstract symbol and forgetting its meaning, you plant the intention directly in the unconscious, where it can grow without interference.",
    affirmationConversion:
      "Sigil magic becomes deep programming: 'My desires are planted as seeds in the fertile soil of my unconscious mind. What I intend manifests without struggle. My deepest self works continuously toward my highest intentions, even when I am not consciously thinking about them.'",
  },
  {
    name: "Chaos Magick Sigil",
    tradition: "Sigil Work",
    purpose:
      "Chaos Magick, developed in the late 20th century by Peter Carroll and others, embraces a pragmatic, experimental approach to magic. The chaos sigil uses the same creation process but within a belief-optional framework — treating magical belief itself as a temporary tool rather than literal truth.",
    components: [
      "Statement of intent",
      "Sigil creation (any method that resonates)",
      "Gnosis state for charging (laughter, pain, meditation, exhaustion)",
      "Release through fire, water, or simple dismissal",
      "Deliberate forgetting",
    ],
    symbolicMeaning:
      "Chaos Magick operates on the principle that belief itself is a programmable variable. By temporarily 'believing' fully in a sigil's power during charging, then completely dismissing it, you exploit the gap between the rational and intuitive minds.",
    affirmationConversion:
      "Chaos magick becomes belief flexibility: 'I can adopt any belief that serves me and release it when it no longer does. My mind is infinitely adaptable. I use thought and intention as tools, fully in command of my own psychological programming.'",
  },
  {
    name: "Planetary Seal",
    tradition: "Sigil Work",
    purpose:
      "Planetary seals are traditional magical symbols corresponding to the seven classical planets — each governing specific areas of life. Working with planetary seals during their astrological hours or days amplifies the energetic correspondences of the planet with your intention.",
    components: [
      "Traditional planetary seals from Agrippa or grimoires",
      "Planetary metal or color correspondences",
      "Appropriate day and hour (Saturn=Saturday, Sol=Sunday, etc.)",
      "Incense and candles of planetary correspondence",
      "Planetary names and invocations",
    ],
    symbolicMeaning:
      "Planetary magic operates on the principle of correspondence — the idea that the planetary archetypes (Saturn=time/structure, Jupiter=expansion, Mars=force, Sol=vitality, Venus=love, Mercury=communication, Luna=intuition) reflect real patterns of cosmic and psychological energy.",
    affirmationConversion:
      "Planetary work becomes archetypal alignment: 'I align with [planetary quality — structure, expansion, vitality, love, communication, intuition] as a natural force in my life. The cosmic and the personal move in harmony. I am tuned to the frequency of [planet].'",
  },
  {
    name: "Runic Bind Rune",
    tradition: "Sigil Work",
    purpose:
      "A bind rune combines two or more Norse runes into a single sigil to concentrate their combined energies toward a specific intention. Each rune carries a distinct meaning (Fehu=abundance, Uruz=strength, Thurisaz=force, etc.) and bind runes allow for precise energetic composition.",
    components: [
      "Selected runes from Elder Futhark (24 runes)",
      "Paper or natural material for inscription",
      "Method of charging (blood, fire, earth burial traditionally)",
      "Bind rune design that aesthetically unifies chosen runes",
      "Activation vocalization (galdr — runic chanting)",
    ],
    symbolicMeaning:
      "Runes are not merely letters but living cosmic forces — each a doorway to a distinct aspect of universal energy. A bind rune is a personalized key built from multiple forces combined to unlock a specific state or quality. It is one of humanity's oldest symbolic programming systems.",
    affirmationConversion:
      "Runic work becomes ancestral power: 'I call upon the primal forces encoded in ancient wisdom. The strength, clarity, and vitality I seek are alive within me. I am connected to the deep well of ancestral power and universal cosmic forces.'",
  },
  // Elemental
  {
    name: "Fire Spell",
    tradition: "Elemental",
    purpose:
      "Fire spells harness the transformative, purifying power of the fire element to transmute old patterns, ignite new intentions, and catalyze rapid change. Fire consumes what is fed to it, representing the ultimate transformation — destruction leading to regeneration.",
    components: [
      "Candles, bonfire, or fireplace",
      "Paper inscribed with what is being released or desired",
      "Correspondences: red, orange, gold",
      "Herbs: cinnamon, dragon's blood, cayenne, rosemary",
      "Solar timing amplifies fire work",
    ],
    symbolicMeaning:
      "Fire represents the will — the focused, directed force of conscious intention that transforms reality. Working with fire is working with your own creative and destructive power, the capacity to burn away limitation and forge something new in its place.",
    affirmationConversion:
      "Fire magic becomes will and transformation: 'I am powered by an unquenchable inner fire. I transform every challenge into fuel. What no longer serves me burns away, leaving only what is pure and true. I am the fire of my own becoming.'",
  },
  {
    name: "Water Ritual",
    tradition: "Elemental",
    purpose:
      "Water rituals work with the element of water for emotional healing, purification, intuitive enhancement, and the flow of abundance. Water represents the realm of feeling, the unconscious, and the receptive, nurturing aspect of manifestation.",
    components: [
      "Natural water source, bath, or bowl",
      "Sea salt or spring water for purification",
      "Crystals: moonstone, aquamarine, blue lace agate",
      "Herbs: jasmine, rose, lavender, ylang ylang",
      "Full or new moon timing amplifies water work",
    ],
    symbolicMeaning:
      "Water is the most adaptive element — it takes the shape of whatever contains it, yet it wears away stone over time through patient persistence. Working with water cultivates emotional fluidity, the ability to feel deeply without being overwhelmed, and the power of gentle, consistent flow.",
    affirmationConversion:
      "Water magic becomes emotional intelligence: 'I flow gracefully through all of life's changes. My emotions are wisdom, not weakness. I am fluid, adaptable, and deeply intuitive. Healing and renewal flow through me continuously.'",
  },
  {
    name: "Earth Grounding",
    tradition: "Elemental",
    purpose:
      "Earth grounding rituals use the stabilizing, nurturing power of the earth element to anchor spiritual energy into the physical body, release energetic overwhelm into the earth, and strengthen the connection between intention and material manifestation.",
    components: [
      "Direct contact with soil, grass, rock, or sand (barefoot preferably)",
      "Stones: hematite, black tourmaline, obsidian, smoky quartz",
      "Herbs: vetiver, patchouli, cedar, oakmoss",
      "Green or brown candles",
      "Burial of intentions in the earth",
    ],
    symbolicMeaning:
      "The earth is the element of manifestation — where intentions finally take physical form. Grounding is the act of bringing energy from the spiritual or mental realm all the way down through the body and into physical reality. Without grounding, intention remains unmanifested potential.",
    affirmationConversion:
      "Earth magic becomes manifestation: 'I am grounded, stable, and rooted. My intentions fully manifest in the physical world. I am present in my body, connected to the earth, and anchored in the now. My dreams take solid, lasting form.'",
  },
  {
    name: "Air Invocation",
    tradition: "Elemental",
    purpose:
      "Air invocations call upon the element of air — the breath of life, the mind, communication, and the swift messenger energy — to inspire creative thought, enhance clarity, facilitate communication, and invoke the power of spoken words and sacred breath.",
    components: [
      "Incense smoke (frankincense, sage, lavender, air blends)",
      "Feathers as sacred air tools",
      "Bell, singing bowl, or wind chime",
      "East-facing orientation (air's cardinal direction)",
      "Spoken prayers, chants, or affirmations",
    ],
    symbolicMeaning:
      "Air governs the realm of thought, word, and intention in its most immediate form. The breath is the most direct channel of life force — and working consciously with breath is one of the most direct ways to shift consciousness, intention, and energetic state.",
    affirmationConversion:
      "Air magic becomes mental clarity: 'My mind is sharp, clear, and brilliant. My words carry power and intention. Every breath I take fills me with life, clarity, and inspired thought. I speak my truth with confidence and create my reality with my words.'",
  },
  // Energy Work
  {
    name: "Chakra Clearing",
    tradition: "Energy Work",
    purpose:
      "Chakra clearing removes stagnant or blocked energy from the seven major energy centers of the body, restoring natural flow, vitality, and alignment. Each chakra governs specific physical, emotional, and spiritual functions, and blockages manifest as physical or psychological imbalances.",
    components: [
      "Colored light visualization corresponding to each chakra",
      "Crystals: garnet (root), carnelian (sacral), citrine (solar), rose quartz (heart), sodalite (throat), amethyst (third eye), clear quartz (crown)",
      "Sound: specific Hz tones for each chakra",
      "Breath work for activation",
    ],
    symbolicMeaning:
      "The chakra system maps the human energy body as a vertical column of consciousness, from the most primal physical survival (root) to the most transcendent spiritual connection (crown). Clearing is the restoration of a natural circulation — like removing blockages from a stream so water can flow freely.",
    affirmationConversion:
      "Chakra work becomes energetic wholeness: 'My energy flows freely and powerfully through my entire being. I am balanced from root to crown. Every aspect of my life — physical, emotional, mental, and spiritual — is in harmonious alignment.'",
  },
  {
    name: "Aura Cleansing",
    tradition: "Energy Work",
    purpose:
      "Aura cleansing removes accumulated energetic debris from the human energy field (aura) — the luminous body of energy surrounding the physical form. Regular cleansing prevents the buildup of others' emotional energy, environmental stressors, and psychic residue.",
    components: [
      "Sage, palo santo, or frankincense smoke (smudging)",
      "Sound: singing bowl, bells, or tuning fork swept around the body",
      "Visualization of white or golden light",
      "Salt baths for physical-energetic cleansing",
      "Breath sweeping (visualization during exhale)",
    ],
    symbolicMeaning:
      "The aura represents your personal energetic atmosphere — the invisible field of consciousness and feeling that precedes your physical presence into every room. A clean aura radiates clarity, vitality, and coherence rather than the accumulated noise of daily life.",
    affirmationConversion:
      "Aura cleansing becomes energetic sovereignty: 'My energy field is clean, clear, and radiant. I release all energies that are not my own. My aura shines with natural vitality and magnetism. I walk into every situation energetically clear and fully present.'",
  },
  {
    name: "Energy Shield",
    tradition: "Energy Work",
    purpose:
      "An energy shield creates a psychic or energetic boundary around the practitioner, maintaining energetic integrity in challenging environments, with draining individuals, or during periods of intense vulnerability. Unlike walls (which block all energy), shields are semi-permeable — allowing positive energy in while reflecting negative energy out.",
    components: [
      "Visualization of protective light boundary",
      "Grounding before shielding",
      "Specific colors: white (general), blue (calm), gold (divine protection)",
      "Crystal anchor: black tourmaline, obsidian, labradorite",
      "Regular charging and maintenance",
    ],
    symbolicMeaning:
      "The energy shield embodies the principle that boundaries are acts of love — both self-love (protecting your own energetic integrity) and other-love (preventing unconscious energy exchange that may harm both parties). A shield is not fear-based but sovereignty-based.",
    affirmationConversion:
      "Shielding becomes energetic boundaries: 'I maintain clear, firm boundaries in all areas of my life. My energy is protected and sovereign. I am affected only by what I consciously choose to allow into my field. My inner world remains stable and clear regardless of external circumstances.'",
  },
  {
    name: "Healing Transmission",
    tradition: "Energy Work",
    purpose:
      "Healing transmission involves directing concentrated, focused healing energy toward the self or another with clear intention. Practices include Reiki, Quantum Healing, Pranic Healing, and spiritual laying on of hands. The healer acts as a conduit for universal life force energy.",
    components: [
      "Relaxed, receptive state",
      "Visualization of healing light or energy",
      "Hand placement (on body or hovering)",
      "Clear intention of healing",
      "Gratitude completion and energy hygiene after",
    ],
    symbolicMeaning:
      "Healing transmission is based on the premise that consciousness and intention can directly influence biological and energetic states. The healer does not generate the healing energy but opens as a channel for its flow — simultaneously healing and being healed through the act of transmitting.",
    affirmationConversion:
      "Healing work becomes self-regeneration: 'I am a channel of healing and restoration. My body knows how to heal itself perfectly and completely. Every cell of my being vibrates with life, health, and vitality. I am continuously renewed, regenerated, and restored to wholeness.'",
  },
  {
    name: "Cord Binding Oath",
    tradition: "Ceremonial",
    purpose:
      "A formal energetic agreement or sacred vow made with the self, the universe, or a spiritual witness. The cord represents a binding commitment — not constriction but covenant. Used to seal intentions, mark initiations, and formalize inner commitments with external symbolic power.",
    components: [
      "A cord in a meaningful color",
      "Clear statement of the oath or commitment",
      "Three knots (beginning, middle, completion)",
      "Candle witness in white or silver",
      "Declaration at dawn, noon, or midnight",
    ],
    symbolicMeaning:
      "Binding oaths exist across every tradition — from the Norse blót to Arthurian knighthood vows to Masonic oaths. The act of binding symbolizes the transformation of intention into covenant, which carries the weight of symbolic law.",
    affirmationConversion:
      "Sacred commitment becomes identity: 'I am fully committed to my highest path. My intentions are sealed and certain. I follow through on every sacred promise I make to myself. My word is law within my reality.'",
  },
  {
    name: "Ancestor Altar Ritual",
    tradition: "Wicca",
    purpose:
      "A ritual practice of consciously connecting with ancestral lineages — blood ancestors, spiritual ancestors, and archetypal forebears — to receive their wisdom, healing, and support. The altar creates a liminal space between the living and the lineage.",
    components: [
      "Photos or objects representing ancestors",
      "Candle in white or black",
      "Water offering",
      "Favorite food or drink of ancestors",
      "Verbal call and invitation",
    ],
    symbolicMeaning:
      "Ancestor reverence is one of the most universal spiritual practices on earth, present across African, Asian, European, and Indigenous traditions. The altar represents the acknowledgment that individual identity emerges from a vast web of those who came before.",
    affirmationConversion:
      "Ancestral connection becomes inherited power: 'I carry the strength and wisdom of all who came before me. My ancestors guide and protect me. I heal the patterns of my lineage and transmit only love and power forward. I stand on the shoulders of giants.'",
  },
  {
    name: "Witch's Ladder",
    tradition: "Wicca",
    purpose:
      "A knotted cord, string, or rope with beads or feathers tied at intervals, used as a physical focus for repetitive spell work or counting meditation. Each knot or bead holds a programmed intention that is activated with each pass of the fingers.",
    components: [
      "Cord or rope (natural fiber preferred)",
      "Nine knots or a chosen sacred number",
      "Beads, feathers, or shells at intervals",
      "Spoken or sung intention per knot",
      "Storage on altar or worn on body",
    ],
    symbolicMeaning:
      "Knotwork magic draws from Norse völva traditions, Voodoo cord magic, and the rosary. The ladder represents a structured escalation — each knot both records and deepens the intention, building cumulative energetic charge.",
    affirmationConversion:
      "Repetitive knotwork becomes neurological patterning: 'With every repetition, my affirmations go deeper. My subconscious mind receives and accepts all that I declare. Each cycle strengthens the certainty of my manifestation.'",
  },
  {
    name: "Cross-Roads Ritual",
    tradition: "Ceremonial",
    purpose:
      "A ritual performed at symbolic or literal crossroads — a point of decision, transition, and liminal power. The crossroads is the domain of trickster figures, guides of the dead, and deities of transition. It is used to release old paths and open new ones.",
    components: [
      "A crossroads (real or symbolic — chalk on floor)",
      "An offering for the crossroads deity",
      "Something to release (written, then buried or burned)",
      "A declaration of new direction",
      "Departure without looking back",
    ],
    symbolicMeaning:
      "Crossroads appear in African diaspora traditions (Eshu/Elegba), European devil-deal mythology, Norse path-lore, and Greek Hecate worship. The crossroads is the space where all possible futures exist simultaneously — before one path is chosen.",
    affirmationConversion:
      "The crossroads becomes decision clarity: 'I release all paths that no longer serve me. I stand at the crossroads with complete clarity and choose my highest path. My new direction is open, clear, and fully supported.'",
  },
  {
    name: "Glamour Weaving",
    tradition: "Sigil Work",
    purpose:
      "An advanced image-shaping practice — not merely cosmetic, but a full energetic projection of how one wishes to be perceived. Drawing from fae glamour mythology and theatrical magic, this spell shapes the psychic impression you make before words are even spoken.",
    components: [
      "Mirror work and intentional self-gaze",
      "Aura visualization in a chosen color",
      "Spoken projection statement",
      "Optional: perfume or oil worn with intention",
      "Movement or walk practice with the projected energy",
    ],
    symbolicMeaning:
      "Glamour magic draws from Irish/Scottish faerie lore where the fae could alter perception at will. In Chaos Magic it represents mastery of the signal you broadcast — the energetic presentation that precedes and shapes all interaction.",
    affirmationConversion:
      "Glamour projection becomes magnetic presence: 'I project exactly the energy I choose. My presence is captivating, memorable, and powerful. People experience me as I intend them to. My energy enters the room before I do.'",
  },
  {
    name: "Solar Charging Ritual",
    tradition: "Elemental",
    purpose:
      "A sun-based energy work practice that uses direct solar exposure, visualization, and intention to charge the body, objects, or sigils with solar vitality. Used for boosting confidence, courage, health, and active manifestation.",
    components: [
      "Direct sunlight exposure (dawn or noon preferred)",
      "Arms open, palms up, facing the sun",
      "Deep breathing synchronized with light visualization",
      "Objects or crystals placed in direct sun",
      "Spoken declaration of charge",
    ],
    symbolicMeaning:
      "Solar rituals appear in Egyptian, Aztec, Vedic, and Germanic traditions. The sun represents active, outward, creative, and masculine-principle energy. Solar charging is filling yourself with the drive to create and act.",
    affirmationConversion:
      "Solar charging becomes vitality activation: 'I am filled with the power of the sun. My energy is limitless, radiant, and inexhaustible. I act with confidence, clarity, and solar certainty. My will is as relentless as the sun's light.'",
  },
  {
    name: "Lunar Drawing Down",
    tradition: "Wicca",
    purpose:
      "A Wiccan and neo-pagan ritual in which the practitioner consciously draws the energy and presence of the moon into themselves — particularly popular at the full moon. The practitioner becomes a vessel for lunar consciousness, receiving intuition, healing, and revelation.",
    components: [
      "Full moon or new moon (for different purposes)",
      "Arms raised toward the moon",
      "Spoken invocation of the lunar deity",
      "Receptive, relaxed body and mind",
      "Journaling or oracle work immediately after",
    ],
    symbolicMeaning:
      "Drawing Down the Moon is a central Wiccan rite associated with the Great Goddess. The moon represents the unconscious, the cyclic, the emotional, and the intuitive dimensions of the self.",
    affirmationConversion:
      "Lunar drawing becomes intuition activation: 'I am aligned with the cycles of the moon and my own deeper nature. My intuition flows freely and accurately. I trust the wisdom that arises from within. My inner knowing is always right on time.'",
  },
  {
    name: "Spirit House Construction",
    tradition: "Ceremonial",
    purpose:
      "The intentional construction or designation of a physical object or space as a dwelling for a spirit, egregore, servitor, or deity. Common in Southeast Asian and African Traditional Religion contexts, this practice externalizes spiritual relationships into a tangible, maintained relationship.",
    components: [
      "A box, statue, or natural object",
      "Consecration and naming ceremony",
      "Offerings on a regular schedule",
      "Clear purpose and agreement with the spirit",
      "Respectful treatment and gratitude protocol",
    ],
    symbolicMeaning:
      "Spirit houses appear globally: the Thai spirit house (San Phra Phum), Yoruba Orisha shrines, Shinto kamidana, and European house blessing traditions. They represent the formal acknowledgment of a reciprocal relationship between the practitioner and the spiritual intelligence.",
    affirmationConversion:
      "Spirit house work becomes intentional relationship: 'I cultivate powerful relationships with the forces that support my highest evolution. I give and receive in sacred reciprocity. My spiritual allies are active partners in my life and growth.'",
  },
  {
    name: "Void Meditation",
    tradition: "Sigil Work",
    purpose:
      "A practice of deliberately entering a state of emptiness — the absence of thought, image, and sensation — as both a magical act and a state from which new creation can emerge. The void is the canvas before creation, the silence before the word.",
    components: [
      "Dark, silent space",
      "Extended breathwork to quiet the mind",
      "Active release of all thoughts as they arise",
      "Extended silent resting in emptiness",
      "Gentle emergence with one seed intention",
    ],
    symbolicMeaning:
      "The void appears in creation mythology worldwide: the Ain Soph of Kabbalah, the Tao that cannot be named, the Buddhist sunyata (emptiness), and the Chaos before cosmos. The void is not absence but infinite potential.",
    affirmationConversion:
      "Void meditation becomes creation space: 'I am empty and full simultaneously. From my stillness, new creation arises. The silence within me is charged with possibility. I create from a deep well of peace, not urgency.'",
  },
  {
    name: "Red Thread Ritual",
    tradition: "Ceremonial",
    purpose:
      "A practice drawing from Kabbalah, Chinese fate-thread mythology (the red thread of destiny), and protection magic traditions. The red thread represents connected fates, protective boundaries, and the visible marking of sacred relationships or warded spaces.",
    components: [
      "Red thread or cord",
      "Intention declaration for each tying",
      "Optional: seven knots (Kabbalah tradition)",
      "Worn on left wrist (receiving side)",
      "Regular renewal with fresh intention",
    ],
    symbolicMeaning:
      "The red thread appears in Kabbalah as a protective talisman against the evil eye, in Chinese mythology as the invisible thread connecting destined soulmates, and across Eurasian traditions as a protective boundary marker.",
    affirmationConversion:
      "The red thread becomes connection and protection: 'I am connected to every destined soul and experience meant for me. I am protected from all forces that do not serve my highest good. My sacred bonds are strong, lasting, and meaningful.'",
  },
  {
    name: "Astral Gate Opening",
    tradition: "Ceremonial",
    purpose:
      "Open an astral portal for travel, lucid dreaming, or communication with entities and guides across dimensional boundaries. This ritual creates a stable threshold between the physical and astral planes, allowing safe passage of consciousness and intentional contact with higher realms.",
    components: [
      "Clear quartz or obsidian as gateway stone",
      "Incense for dimensional thinning (sandalwood, frankincense)",
      "Sigil of the Abyss drawn on paper or carved in wax",
      "Darkened space with a reflective surface",
      "Written intention for the gate's purpose",
    ],
    symbolicMeaning:
      "The gate is one of humanity's oldest symbols — the threshold between worlds appears in every culture from Egyptian pylons to Greek underworld crossings. Opening a gate is an act of conscious bridge-building between realities.",
    affirmationConversion:
      "The gate becomes your inner bridge: 'I travel freely between dimensions of consciousness. My awareness transcends physical boundaries. Every door I open leads me deeper into truth and wisdom.'",
  },
  {
    name: "Shadow Integration Ritual",
    tradition: "Sigil Work",
    purpose:
      "Lovingly reclaim and integrate shadow aspects of the self into conscious wholeness. Rather than banishing darkness, this ritual invites all rejected, suppressed, and shamed parts of the self into the light of acceptance, transforming their energy into strength.",
    components: [
      "Black Sun or Dark Moon sigil",
      "Journal for shadow dialogue writing",
      "Mirror for confrontation work",
      "Dark-colored candle (black or deep purple)",
      "Willingness to witness without judgment",
    ],
    symbolicMeaning:
      "The shadow, as defined by Jung, is the sum of all we disown in ourselves. Integration does not mean becoming darkness — it means reclaiming the power stored within it. Lilith and The Morrigan embody this sovereign dark-feminine integration.",
    affirmationConversion:
      "Shadow work becomes reclamation: 'I welcome all parts of myself home. My darkness contains my greatest power. I integrate, I accept, I am whole.'",
  },
  {
    name: "Silver Thread Manifestation",
    tradition: "Folk Magic",
    purpose:
      "Weave the silver thread of intention into the fabric of physical reality using visualization, breath, and symbolic knotting. This practice draws from fate-weaving mythology, connecting your desire to the already-woven tapestry of destiny.",
    components: [
      "Silver thread or cord",
      "Vegvisir sigil for navigation toward the outcome",
      "Clear visualization of the desired outcome as already real",
      "Seven breath cycles woven into the cord",
      "Moon phase timing (Full or New)",
    ],
    symbolicMeaning:
      "The silver thread connects to Ariadne's thread of fate and the Norns who weave destiny in Norse mythology. To hold the silver thread is to participate consciously in the weaving of your own reality.",
    affirmationConversion:
      "Thread-weaving becomes destiny alignment: 'My intentions are woven into the fabric of reality. What I visualize clearly, the universe delivers completely. I am a co-creator weaving my destiny with precision.'",
  },
  {
    name: "Storm Calling",
    tradition: "Elemental",
    purpose:
      "Invoke the raw, clearing power of storms for energetic purification, massive change, and the dissolution of stagnant or blocked energy. This ritual calls upon the unified force of thunder, lightning, and wind to break through what conventional energetic work cannot move.",
    components: [
      "Helm of Awe sigil for protection and storm power",
      "Drum or percussion for storm rhythm",
      "Outdoor setting or open window during stormy weather",
      "Declaration to the storm entities (Thor, Raijin, Zeus)",
      "Grounding practice after the calling",
    ],
    symbolicMeaning:
      "Across cultures, the storm deity represents sovereign power over transformation — Thor's hammer, Zeus's thunderbolts, and Raijin's drums all embody the divine right to shatter what must fall so new life can rise. The storm is not destruction; it is dramatic renewal.",
    affirmationConversion:
      "Storm power becomes inner force: 'I am the eye of every storm in my life. I am an unstoppable force of change. Old structures crumble before my will and new realities rise in their place.'",
  },
  {
    name: "Eye of Truth Ritual",
    tradition: "Ceremonial",
    purpose:
      "Activate the inner eye of truth to pierce illusions, reveal hidden information, expose deception, and align with what is real versus what only appears to be. This ritual calls upon wisdom deities to open the faculty of discernment.",
    components: [
      "Eye of Horus or Sigil of Horus drawn or printed",
      "Lapis lazuli or labradorite crystal for truth-sight",
      "Blue or indigo candle",
      "Invocation to Thoth, Ma'at, or Athena",
      "Written question you seek the truth about",
    ],
    symbolicMeaning:
      "The Eye of Horus is one of the oldest symbols of divine perception — the eye that sees beyond the veil, that cannot be deceived. Ma'at's feather weighs the heart against truth. To perform this ritual is to align yourself with the cosmic principle of clarity.",
    affirmationConversion:
      "Truth-seeing becomes clarity: 'I see clearly what is real. My intuition is a precision instrument. I am aligned with truth at every level — no illusion can deceive me.'",
  },
  {
    name: "Sacred Union Ceremony",
    tradition: "Ceremonial",
    purpose:
      "Merge twin energies, invoke hieros gamos (sacred marriage), or integrate divine masculine and feminine principles within oneself. This ceremony creates the sacred inner marriage that precedes outer union and unlocks creative power through integrated polarity.",
    components: [
      "Ouroboros sigil for cyclical unity",
      "Dual-colored candles (gold and silver, or red and white)",
      "Invocation to Isis and Osiris or Shiva and Shakti",
      "Mirror work for self-union",
      "Sacred vow of integration spoken aloud",
    ],
    symbolicMeaning:
      "The hieros gamos — sacred marriage — is the alchemical unification of opposite principles. In Hermeticism, the marriage of sulfur and mercury creates the philosopher's stone. In Tantra, the union of Shiva and Shakti creates all creation. The ceremony is both inner and cosmic.",
    affirmationConversion:
      "Sacred union becomes integration: 'I have united all parts of myself. My inner masculine and feminine are in perfect sacred union. I am whole, complete, and overflowing with creative power.'",
  },
  {
    name: "Void Dissolution",
    tradition: "Sigil Work",
    purpose:
      "Enter the void — the formless state before creation — and dissolve blocks, limiting beliefs, and accumulated energy that resists release. The void is the ultimate solvent: in its nothingness, all crystallized limitation dissolves completely.",
    components: [
      "Sigil of the Abyss as a focus point",
      "Complete darkness and silence",
      "Deep breathwork to enter the theta state",
      "Clear naming of what is to be dissolved",
      "Intentional emergence from the void as the new self",
    ],
    symbolicMeaning:
      "The void is pre-creation potential — the Ain Soph of Kabbalah, the Buddhist sunyata, the Chaos before cosmos. Nyx and Kali both embody the transformative power of void-entering: to dissolve is to prepare for rebirth at the highest level.",
    affirmationConversion:
      "Void dissolution becomes rebirth: 'I release all that does not serve my highest expression. In the void, I am free. I emerge renewed, light, and open to what is next.'",
  },
  {
    name: "Phoenix Rising Ritual",
    tradition: "Elemental",
    purpose:
      "Invoke a full death-and-rebirth transformation — the complete dissolution of the old self and the emergence of an entirely new identity, life chapter, or level of being. This is the most complete transformation ritual: nothing is preserved from the old; everything rises anew.",
    components: [
      "Fire Triangle sigil for transformation fire",
      "Burning of written lists of what is dying",
      "Invocation of Ra, Sekhmet, or the Phoenix",
      "Red and orange candles for the rising flame",
      "New declaration of who rises from the ash",
    ],
    symbolicMeaning:
      "The phoenix mythology appears across Egyptian, Greek, Arabic, and Chinese traditions as the ultimate symbol of cyclical transformation. Ra's daily death and rebirth in the solar barque, Sekhmet's destructive-healing fire, and the classic phoenix all teach: complete destruction is the prerequisite for complete renewal.",
    affirmationConversion:
      "Phoenix rising becomes transformation: 'I rise from every ending more powerful than before. My rebirth is complete. I am the phoenix — I cannot be permanently diminished. Every fire I walk through reveals more of who I truly am.'",
  },
];

const TRADITION_COLORS: Record<SpellTradition, string> = {
  Wicca: "oklch(0.62 0.22 295)",
  Ceremonial: "oklch(0.68 0.18 270)",
  "Folk Magic": "oklch(0.62 0.2 145)",
  "Sigil Work": "oklch(0.65 0.2 220)",
  Elemental: "oklch(0.68 0.2 30)",
  "Energy Work": "oklch(0.72 0.15 200)",
};

const TRADITIONS: Array<"All" | SpellTradition> = [
  "All",
  "Wicca",
  "Ceremonial",
  "Folk Magic",
  "Sigil Work",
  "Elemental",
  "Energy Work",
];

interface SpellsPageProps {
  onUseForSubliminal: (topic: string) => void;
  onNavigate: (page: string) => void;
}

export default function SpellsPage({
  onUseForSubliminal,
  onNavigate,
}: SpellsPageProps) {
  const [search, setSearch] = useState("");
  const [activeTradition, setActiveTradition] = useState<
    "All" | SpellTradition
  >("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return SPELLS.filter((s) => {
      const matchesSearch =
        search === "" ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.purpose.toLowerCase().includes(search.toLowerCase()) ||
        s.symbolicMeaning.toLowerCase().includes(search.toLowerCase());
      const matchesTradition =
        activeTradition === "All" || s.tradition === activeTradition;
      return matchesSearch && matchesTradition;
    });
  }, [search, activeTradition]);

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
            <Wand2 className="w-6 h-6 text-primary" />
          </div>
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl font-bold gradient-text">
          Spells & Magic
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
          An encyclopedic reference to spell types, magical traditions, and
          intention-based practices. Each entry bridges symbolic magic with
          psychological affirmation work.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {Object.entries(TRADITION_COLORS).map(([tradition, color]) => (
            <Badge
              key={tradition}
              className="text-xs font-mono"
              style={{
                background: `${color}20`,
                color,
                border: `1px solid ${color}40`,
              }}
            >
              {SPELLS.filter((s) => s.tradition === tradition).length}{" "}
              {tradition}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground max-w-lg mx-auto italic">
          All spells presented as symbolic, intention-based practices with
          psychological parallels. Framed as philosophical and creative tools
          for self-development.
        </p>
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
            placeholder="Search spells, purposes, traditions..."
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
          {TRADITIONS.map((tradition) => {
            const isActive = activeTradition === tradition;
            const color =
              tradition === "All"
                ? "oklch(0.62 0.22 295)"
                : TRADITION_COLORS[tradition];
            return (
              <button
                key={tradition}
                type="button"
                onClick={() => setActiveTradition(tradition)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border"
                style={{
                  background: isActive ? `${color}25` : "transparent",
                  borderColor: isActive
                    ? `${color}60`
                    : "oklch(0.3 0.02 260 / 0.5)",
                  color: isActive ? color : "oklch(0.6 0.02 260)",
                }}
              >
                {tradition}
              </button>
            );
          })}
        </div>
      </motion.div>

      {search && (
        <p className="text-muted-foreground text-sm">
          Showing {filtered.length} of {SPELLS.length} spells
        </p>
      )}

      {/* Spells Accordion */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((spell, idx) => {
            const color = TRADITION_COLORS[spell.tradition];
            const isExpanded = expandedId === spell.name;
            return (
              <motion.div
                key={spell.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: idx * 0.02 }}
                className="rounded-2xl border bg-secondary/20 overflow-hidden"
                style={{ borderColor: `${color}30` }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : spell.name)}
                  className="w-full text-left p-4 flex items-start justify-between gap-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Wand2
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color }}
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="font-heading font-bold text-sm"
                          style={{ color }}
                        >
                          {spell.name}
                        </span>
                        <Badge
                          className="text-xs shrink-0"
                          style={{
                            background: `${color}20`,
                            color,
                            border: `1px solid ${color}40`,
                          }}
                        >
                          {spell.tradition}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {spell.purpose.split(".")[0]}.
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground shrink-0 mt-1"
                  >
                    ▼
                  </motion.div>
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
                      <div className="px-4 pb-4 pt-3 space-y-4 border-t border-border/30">
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                            Purpose & Intent
                          </h4>
                          <p className="text-xs text-foreground/80 leading-relaxed">
                            {spell.purpose}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                            Traditional Components
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {spell.components.map((c) => (
                              <span
                                key={c}
                                className="text-xs px-2 py-0.5 rounded-md"
                                style={{
                                  background: `${color}15`,
                                  color: `${color}cc`,
                                  border: `1px solid ${color}25`,
                                }}
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                            Symbolic Meaning
                          </h4>
                          <p className="text-xs text-foreground/80 leading-relaxed">
                            {spell.symbolicMeaning}
                          </p>
                        </div>

                        <div
                          className="p-3 rounded-xl"
                          style={{
                            background: `${color}10`,
                            borderLeft: `2px solid ${color}60`,
                          }}
                        >
                          <h4
                            className="text-xs font-semibold uppercase tracking-widest mb-1"
                            style={{ color }}
                          >
                            ✦ Affirmation Conversion
                          </h4>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: `${color}cc` }}
                          >
                            {spell.affirmationConversion}
                          </p>
                        </div>

                        {/* Connections */}
                        {(() => {
                          const conn = SPELL_CONNECTIONS[spell.name] ?? {
                            relatedEntities: ["Metatron", "The Shadow"],
                            relatedSigils: ["Seal of Solomon"],
                          };
                          return (
                            <div className="space-y-2 pt-1 border-t border-border/20">
                              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                ◈ Connections
                              </h4>
                              {/* Entities */}
                              <div className="space-y-1">
                                <p
                                  className="text-xs font-semibold uppercase tracking-widest"
                                  style={{
                                    color: "oklch(0.68 0.18 195 / 0.8)",
                                  }}
                                >
                                  👁 Entities
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {conn.relatedEntities.map((ent) => (
                                    <button
                                      key={ent}
                                      type="button"
                                      onClick={() => onNavigate("entities")}
                                      className="text-xs px-2 py-0.5 rounded-full cursor-pointer transition-all duration-150 hover:scale-105"
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
                          onClick={() =>
                            onUseForSubliminal(
                              `${spell.name} intention and manifestation`,
                            )
                          }
                          className="w-full gap-2 text-xs"
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

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 space-y-3"
          >
            <Wand2 className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">
              No spells found for &quot;{search}&quot;
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setActiveTradition("All");
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
