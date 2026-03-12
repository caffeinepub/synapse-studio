import { ChevronDown, ExternalLink, Eye } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export type SignsContext =
  | "general"
  | "wealth"
  | "love"
  | "health"
  | "character"
  | "item"
  | "symbiotic"
  | "chakra"
  | "kinesis"
  | "deity"
  | "sigil"
  | "personal";

type SignCategory = "physical" | "spiritual" | "mental";

interface SignsData {
  label: string;
  physical: string[];
  spiritual: string[];
  mental: string[];
}

const SIGNS_LIBRARY: Record<SignsContext, SignsData> = {
  general: {
    label: "General Manifestation",
    physical: [
      "Tingling sensations in the body",
      "Goosebumps without feeling cold",
      "Warmth in hands or chest",
      "Body feeling noticeably lighter",
      "Spontaneous deep breaths",
      "Yawning during or after sessions",
      "Heart racing unexpectedly",
      "Muscle twitches or spasms",
      "Unexplained surges of energy",
      "Sudden temperature shifts in the room",
    ],
    spiritual: [
      "Repeating numbers appearing (1111, 333, 444)",
      "Vivid and memorable dreams",
      "Increasing synchronicities in daily life",
      "Feeling watched or accompanied",
      "Sudden clarity or insight 'downloads'",
      "Finding feathers or meaningful objects",
      "Déjà vu experiences intensifying",
      "Symbols appearing in unexpected places",
      "Animals appearing as if messengers",
      "Electronic devices behaving oddly",
    ],
    mental: [
      "Sudden certainty or calm about your goal",
      "Intrusive doubts dissolving naturally",
      "Topic entering your thoughts unbidden",
      "Vivid daydreaming about the desired outcome",
      "Old limiting beliefs surfacing to be released",
      "Increased focus and mental clarity",
      "Creative inspiration flooding in",
      "A sense that it's already done",
      "Resistance to the topic disappearing",
      "Feeling deserving without effort",
    ],
  },
  wealth: {
    label: "Wealth & Abundance",
    physical: [
      "Finding coins or money unexpectedly",
      "Objects of value appearing in your life",
      "Unexpected gifts arriving",
      "Sense of physical expansion and openness",
      "Palms tingling or itching",
      "Sudden financial opportunities arriving (mail, calls)",
      "Hands feeling magnetic or electric",
      "Energy levels rising when thinking of wealth",
    ],
    spiritual: [
      "Seeing gold or green light in meditation",
      "Dreaming of treasure, open doors, or abundance",
      "Number 8 appearing repeatedly",
      "Gold or citrine objects catching your eye",
      "Lakshmi or abundance deity imagery appearing",
      "Feeling a sense of divine support around finances",
      "Green auras or lights in dreams",
    ],
    mental: [
      "Abundance mindset clicking naturally",
      "Scarcity thoughts feeling foreign or odd",
      "Income ideas appearing constantly",
      "Confidence around money surging",
      "Feeling deserving of wealth without effort",
      "Generosity impulses increasing",
      "Financial plans forming effortlessly",
      "Old money wounds losing their charge",
    ],
  },
  love: {
    label: "Love & Relationships",
    physical: [
      "Heart warmth or gentle pressure",
      "Skin flushing unexpectedly",
      "Butterflies in the stomach",
      "Tears of unexpected, beautiful emotion",
      "Suddenly smelling roses or familiar perfume",
      "Heart palpitations when thinking of the person",
      "Meeting someone in physical reality unexpectedly",
    ],
    spiritual: [
      "Pink or rose-gold light in meditation",
      "Rose quartz or heart-shaped objects calling to you",
      "Dreaming of the person clearly",
      "Seeing initials in unexpected places",
      "Doves, swans, or love symbols appearing",
      "Heart chakra activating with warmth",
      "Angel numbers 222, 555 appearing",
    ],
    mental: [
      "Feeling loved without external reason",
      "Compassion expanding naturally",
      "Old wounds around love surfacing briefly then releasing",
      "Sense of being chosen or wanted",
      "Romantic daydreams becoming vivid and believable",
      "Unconditional self-love emerging",
    ],
  },
  health: {
    label: "Health & Healing",
    physical: [
      "Warmth or vibration at an injured or ill area",
      "Spontaneous reduction in pain",
      "Energy returning unexpectedly",
      "Appetite normalizing",
      "Sleep quality improving noticeably",
      "Body odor or sweat changes as toxins shift",
      "Brief healing crisis (worsening before improvement)",
      "Bowel or digestion changes",
    ],
    spiritual: [
      "Sensing light or golden energy in the body",
      "Green or white healing light in meditation",
      "Feeling the hands of a healer on you",
      "Sacred geometry appearing in vision",
      "Inner physician 'speaking' with clarity",
      "Nature urging you toward healing plants or practices",
    ],
    mental: [
      "Worry about the condition dissolving",
      "Belief in healing solidifying naturally",
      "Old trauma surfacing briefly then releasing",
      "Sense of cellular intelligence at work",
      "Positive body image emerging naturally",
      "Gratitude for the body increasing",
    ],
  },
  character: {
    label: "Character Manifestation",
    physical: [
      "Sensing a new presence in the room",
      "Peripheral vision catching a figure",
      "Temperature dropping or rising as if someone entered",
      "Feeling a touch with no physical source",
      "Hearing a voice or name whispered",
      "Electronics flickering at meaningful moments",
      "Pets reacting to something unseen",
      "Objects associated with the character appearing",
    ],
    spiritual: [
      "The character appearing clearly in dreams",
      "Receiving their 'voice' in meditation",
      "Their symbol or insignia appearing in waking life",
      "Synchronicities themed around their world",
      "Their show, art, or music appearing randomly",
      "Their energy signature becoming familiar and detectable",
    ],
    mental: [
      "Feeling their personality blend into yours",
      "Understanding their perspective intuitively",
      "Their speech patterns appearing in your thoughts",
      "Feeling their emotional states",
      "A deep sense of companionship or not being alone",
      "Their name appearing in random text",
    ],
  },
  item: {
    label: "Item Manifestation",
    physical: [
      "Finding a real-world replica or lookalike of the item",
      "Feeling the item's weight or texture during visualization",
      "Smelling materials associated with the item",
      "Hands drawn to pick something up as if it's there",
      "Discovering the item for sale or gifted unexpectedly",
      "Stumbling upon the item's symbol or design",
    ],
    spiritual: [
      "The item appearing in dreams as tangible and real",
      "Light emanating from the item in meditation",
      "A symbol of the item appearing in waking life",
      "Feeling the item's 'purpose' activating in your energy field",
      "Strong intuition to be in a specific place where it appears",
    ],
    mental: [
      "Knowing exactly what the item feels like before touching it",
      "Creative impulses to build or create it",
      "A certainty that you already own it",
      "Finding detailed descriptions or replicas effortlessly",
      "Ideas for where to acquire it appearing constantly",
    ],
  },
  symbiotic: {
    label: "Symbiotic Bond",
    physical: [
      "Feeling a second skin or film over your own skin",
      "Warmth spreading across back, neck, and shoulders",
      "Feeling something moving in sync with your breath",
      "Skin tingling or prickling in a pattern",
      "Feeling stronger or more capable physically",
      "A second heartbeat sensation or synchronized pulse",
      "Increased body temperature at bond points",
    ],
    spiritual: [
      "The entity appearing as a connected presence in dreams",
      "Seeing dual forms merging in meditation",
      "Feeling a second mind's presence alongside yours",
      "Animal instincts awakening",
      "Sensing danger before it arrives",
      "Shared emotions with the entity",
    ],
    mental: [
      "Completing each other's thoughts",
      "Feeling protected and never truly alone",
      "Sudden knowledge you didn't have before",
      "Increased instincts and intuition",
      "The entity's personality complementing your own",
      "Feeling whole in a new, expansive way",
    ],
  },
  chakra: {
    label: "Chakra Activation",
    physical: [
      "Root: heaviness in tailbone or legs, deep grounding",
      "Sacral: warmth in lower abdomen, creativity surging",
      "Solar Plexus: gut flutters, confidence rising",
      "Heart: chest expansion and warmth spreading",
      "Throat: voice changes, urge to speak your truth",
      "Third Eye: pressure between brows, visual phenomena",
      "Crown: tingling on top of head, spaciousness",
    ],
    spiritual: [
      "Colorful light matching the chakra's color in meditation",
      "The chakra's deity or archetype appearing in visions",
      "Kundalini heat rising through the spine",
      "Hearing tones at the chakra's frequency",
      "Sacred geometry matching the chakra appearing",
      "Dreams featuring the chakra's symbolic color",
    ],
    mental: [
      "Old blocks in the chakra's domain releasing",
      "The chakra's gifts activating naturally",
      "Heart chakra: unconditional love expanding",
      "Throat chakra: authentic expression becoming easy",
      "Third Eye: psychic impressions becoming clearer",
      "Crown: connection to higher self strengthening",
      "Corresponding life areas improving effortlessly",
    ],
  },
  kinesis: {
    label: "Kinesis Development",
    physical: [
      "Tingling or heat in hands when thinking of the ability",
      "Spontaneous temperature changes (Pyro/Cryo)",
      "Small environmental movements happening unexpectedly",
      "Dizziness or pressure in the head during focus",
      "Electrical static on skin when concentrating",
      "Time perception shifting during practice",
      "Wind picking up or elements responding to emotion",
    ],
    spiritual: [
      "Elemental forces responding in nature around you",
      "Synchronicities themed around the element or ability",
      "Sensing the element's consciousness",
      "Dreams of using the ability successfully",
      "Spirit guides of the kinesis type appearing",
      "The element appearing as a messenger in waking life",
    ],
    mental: [
      "Knowing intuitively how to use the ability",
      "Visualizations becoming extremely vivid and physical-feeling",
      "Belief in the ability becoming completely natural",
      "Resistance to the ability dissolving",
      "The ability appearing in night dreams as fully real",
      "Mental focus sharpening around the kinesis topic",
    ],
  },
  deity: {
    label: "Deity / Entity Invocation",
    physical: [
      "Sudden temperature change in the room",
      "Candle flames flickering without any draft",
      "Incense smoke changing direction meaningfully",
      "Feeling of a presence sitting or standing nearby",
      "Goosebumps at meaningful moments",
      "Hearing a tone, hum, or whisper",
      "Electronics behaving oddly during invocation",
    ],
    spiritual: [
      "The deity's symbol or sacred animal appearing",
      "Their color appearing in dreams or meditation",
      "Their name appearing in waking life unexpectedly",
      "Feeling their specific energy signature",
      "Receiving clear guidance or messages",
      "Their sacred objects finding their way to you",
    ],
    mental: [
      "Their archetypal qualities awakening in you",
      "Feeling held, witnessed, and supported",
      "Receiving answers to questions you didn't ask aloud",
      "Sudden clarity in areas the deity governs",
      "Deep resonance when reading about them",
      "Their mythology feeling personally meaningful",
    ],
  },
  sigil: {
    label: "Sigil Activation",
    physical: [
      "Warmth or tingling at the sigil's location",
      "The sigil appearing in unexpected places",
      "Objects associated with the sigil's purpose appearing",
      "Feeling a pulse or hum from the sigil",
      "Heat radiating from paper or surface holding the sigil",
    ],
    spiritual: [
      "Seeing the sigil glow or pulsate in meditation",
      "Energy pulsing from the sigil during focus",
      "The sigil appearing in dreams as active and alive",
      "A sense of the sigil's 'spirit' awakening",
      "Geometric light patterns matching the sigil in vision",
    ],
    mental: [
      "Certainty that the sigil is working",
      "The sigil's purpose aligning with random daily thoughts",
      "Resistance to the sigil's goal dissolving",
      "Feeling compelled to look at the sigil at meaningful times",
      "Creative insights related to the sigil's intention",
    ],
  },
  personal: {
    label: "Personal Subliminal (For Others)",
    physical: [
      "The person contacting you unexpectedly",
      "Visible change in their behavior or body language",
      "Their situation improving in observable ways",
      "Gifts or unexpected acts of kindness from them",
      "Seeing their name in random places",
      "Running into them by 'coincidence'",
    ],
    spiritual: [
      "Dreaming of the person thriving and happy",
      "Energetic cords between you feeling lighter",
      "Their energy shifting in meditation",
      "Feeling their higher self responding",
      "Angelic or guide presence surrounding them in visions",
    ],
    mental: [
      "Feeling them thinking of you",
      "Sense of resolution or healing in the relationship",
      "Unconditional love for them increasing",
      "A calm certainty about their growth",
      "Empathy toward them deepening naturally",
      "Knowing their wellbeing is shifting for the better",
    ],
  },
};

const CATEGORY_CONFIG: Record<
  SignCategory,
  { label: string; color: string; dot: string }
> = {
  physical: {
    label: "Physical",
    color:
      "bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25",
    dot: "bg-amber-400",
  },
  spiritual: {
    label: "Spiritual",
    color:
      "bg-violet-500/15 text-violet-300 border-violet-500/30 hover:bg-violet-500/25",
    dot: "bg-violet-400",
  },
  mental: {
    label: "Mental",
    color:
      "bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/25",
    dot: "bg-cyan-400",
  },
};

interface SignsPanelProps {
  context: SignsContext;
  title?: string;
  compact?: boolean;
  onNavigateToSigns?: () => void;
}

export default function SignsPanel({
  context,
  title,
  compact = true,
  onNavigateToSigns,
}: SignsPanelProps) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState<SignCategory>("physical");

  const data = SIGNS_LIBRARY[context];
  const signs = data[activeCategory];
  const catConfig = CATEGORY_CONFIG[activeCategory];

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        open
          ? "border-primary/30 bg-primary/5"
          : "border-border/30 bg-secondary/10 hover:border-border/50"
      } ${compact ? "" : ""}`}
    >
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl"
        data-ocid="signs.panel.toggle"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Eye className="w-3 h-3 text-primary" />
          </div>
          <span className="text-xs font-semibold text-foreground/80">
            {title || "Signs to Watch For"}
          </span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 opacity-70" />
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 opacity-70" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 opacity-70" />
          </div>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 shrink-0 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2.5">
              {/* Category tabs */}
              <div className="flex gap-1.5 flex-wrap">
                {(["physical", "spiritual", "mental"] as SignCategory[]).map(
                  (cat) => {
                    const cfg = CATEGORY_CONFIG[cat];
                    const isActive = activeCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                          isActive
                            ? cfg.color
                            : "bg-secondary/30 text-muted-foreground border-border/30 hover:border-border/50"
                        }`}
                        data-ocid="signs.category.tab"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${isActive ? cfg.dot : "bg-muted-foreground/40"}`}
                        />
                        {cfg.label}
                      </button>
                    );
                  },
                )}
              </div>

              {/* Signs list */}
              <AnimatePresence mode="wait">
                <motion.ul
                  key={activeCategory}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-1"
                >
                  {signs.map((sign) => (
                    <li key={sign} className="flex items-start gap-2">
                      <span
                        className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${catConfig.dot}`}
                      />
                      <span className="text-[11px] text-foreground/70 leading-snug">
                        {sign}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>

              {/* View all link */}
              {onNavigateToSigns && (
                <button
                  type="button"
                  onClick={onNavigateToSigns}
                  className="flex items-center gap-1 text-[11px] text-primary/70 hover:text-primary transition-colors mt-1"
                  data-ocid="signs.view_all.link"
                >
                  <ExternalLink className="w-3 h-3" />
                  View all manifestation signs
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
