import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Brain,
  ChevronDown,
  Eye,
  Flame,
  Heart,
  Sparkles,
  Star,
  Users,
  Wand2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type SignCategory = "physical" | "spiritual" | "mental";

interface ManifestationType {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  borderColor: string;
  bgColor: string;
  physical: string[];
  spiritual: string[];
  mental: string[];
}

const MANIFESTATION_TYPES: ManifestationType[] = [
  {
    id: "general",
    label: "General Manifestation",
    description:
      "Universal signs that your subliminal programming is taking hold",
    icon: Sparkles,
    color: "text-primary",
    borderColor: "border-primary/30",
    bgColor: "bg-primary/10",
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
  {
    id: "wealth",
    label: "Wealth & Abundance",
    description: "Signs your financial and abundance frequency is shifting",
    icon: Star,
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/10",
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
  {
    id: "love",
    label: "Love & Relationships",
    description: "Signs your heart field is opening and love is magnetizing",
    icon: Heart,
    color: "text-rose-400",
    borderColor: "border-rose-500/30",
    bgColor: "bg-rose-500/10",
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
  {
    id: "health",
    label: "Health & Healing",
    description:
      "Signs your cellular intelligence and healing frequency is activating",
    icon: Activity,
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    bgColor: "bg-emerald-500/10",
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
  {
    id: "character",
    label: "Character Manifestation",
    description: "Signs a fictional character is crossing into your reality",
    icon: Wand2,
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    bgColor: "bg-violet-500/10",
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
  {
    id: "item",
    label: "Item Manifestation",
    description:
      "Signs a fictional item is materializing in your physical reality",
    icon: Flame,
    color: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgColor: "bg-amber-500/10",
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
  {
    id: "symbiotic",
    label: "Symbiotic / Bio-Engineered Bond",
    description: "Signs a living entity is merging with your reality and form",
    icon: Zap,
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    bgColor: "bg-teal-500/10",
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
  {
    id: "chakra",
    label: "Chakra Activation",
    description: "Signs each chakra is clearing, activating, and aligning",
    icon: Sparkles,
    color: "text-purple-400",
    borderColor: "border-purple-500/30",
    bgColor: "bg-purple-500/10",
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
  {
    id: "kinesis",
    label: "Kinesis Development",
    description: "Signs kinesis abilities are awakening and strengthening",
    icon: Zap,
    color: "text-indigo-400",
    borderColor: "border-indigo-500/30",
    bgColor: "bg-indigo-500/10",
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
  {
    id: "deity",
    label: "Deity / Entity Invocation",
    description: "Signs a deity or spiritual entity has answered your call",
    icon: Star,
    color: "text-yellow-400",
    borderColor: "border-yellow-500/30",
    bgColor: "bg-yellow-500/10",
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
  {
    id: "sigil",
    label: "Sigil Activation",
    description: "Signs your sigil has charged and is actively working",
    icon: Star,
    color: "text-orange-400",
    borderColor: "border-orange-500/30",
    bgColor: "bg-orange-500/10",
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
  {
    id: "personal",
    label: "Personal Subliminal (For Others)",
    description: "Signs your subliminal for another person is working",
    icon: Users,
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    bgColor: "bg-cyan-500/10",
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
];

const CATEGORY_CONFIG: Record<
  SignCategory,
  { label: string; color: string; textColor: string; dot: string; bg: string }
> = {
  physical: {
    label: "Physical Signs",
    color: "border-amber-500/40 bg-amber-500/15 text-amber-300",
    textColor: "text-amber-300",
    dot: "bg-amber-400",
    bg: "bg-amber-500/8",
  },
  spiritual: {
    label: "Spiritual Signs",
    color: "border-violet-500/40 bg-violet-500/15 text-violet-300",
    textColor: "text-violet-300",
    dot: "bg-violet-400",
    bg: "bg-violet-500/8",
  },
  mental: {
    label: "Mental Signs",
    color: "border-cyan-500/40 bg-cyan-500/15 text-cyan-300",
    textColor: "text-cyan-300",
    dot: "bg-cyan-400",
    bg: "bg-cyan-500/8",
  },
};

function TypeAccordion({ type }: { type: ManifestationType }) {
  const [open, setOpen] = useState(false);
  const Icon = type.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border overflow-hidden ${type.borderColor}`}
      data-ocid="signs.type.panel"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
          open ? type.bgColor : "bg-secondary/10"
        }`}
        data-ocid="signs.type.toggle"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${type.bgColor} border ${type.borderColor}`}
          >
            <Icon className={`w-4 h-4 ${type.color}`} />
          </div>
          <div>
            <p className={`font-heading font-bold text-sm ${type.color}`}>
              {type.label}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {type.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400/70" />
            <span className="w-2 h-2 rounded-full bg-violet-400/70" />
            <span className="w-2 h-2 rounded-full bg-cyan-400/70" />
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(["physical", "spiritual", "mental"] as SignCategory[]).map(
                (cat) => {
                  const cfg = CATEGORY_CONFIG[cat];
                  return (
                    <div key={cat} className="space-y-2">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${cfg.color}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                        />
                        {cfg.label}
                      </div>
                      <ul className="space-y-1.5">
                        {type[cat].map((sign) => (
                          <li key={sign} className="flex items-start gap-2">
                            <span
                              className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${cfg.dot} opacity-70`}
                            />
                            <span className="text-xs text-foreground/75 leading-snug">
                              {sign}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                },
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ManifestationSignsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-start gap-4 mb-5">
          <div className="w-1 self-stretch rounded bg-gradient-to-b from-primary to-accent" />
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center glow-primary">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl gradient-text">
                Manifestation Signs
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Physical, spiritual &amp; mental signs your intentions are
                materializing
              </p>
            </div>
          </div>
        </div>

        {/* Category legend */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10">
            <Brain className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-amber-300 font-semibold">
              Physical Signs
            </span>
            <Badge className="text-[9px] h-4 px-1.5 bg-amber-500/20 text-amber-300 border-amber-500/30">
              Body & environment
            </Badge>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs text-violet-300 font-semibold">
              Spiritual Signs
            </span>
            <Badge className="text-[9px] h-4 px-1.5 bg-violet-500/20 text-violet-300 border-violet-500/30">
              Dreams & synchronicities
            </Badge>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10">
            <Brain className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-cyan-300 font-semibold">
              Mental Signs
            </span>
            <Badge className="text-[9px] h-4 px-1.5 bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
              Thoughts & beliefs
            </Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-2xl">
          These signs are your reality's confirmation signals — each one
          indicates your subconscious programming is taking hold and your
          frequency is shifting. Click any manifestation type below to expand
          its full Physical, Spiritual, and Mental sign library.
        </p>
      </motion.div>

      {/* All manifestation types */}
      <div className="space-y-3">
        {MANIFESTATION_TYPES.map((type, idx) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            data-ocid={`signs.type.item.${idx + 1}`}
          >
            <TypeAccordion type={type} />
          </motion.div>
        ))}
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 glass-card rounded-2xl p-6 border-primary/20 text-center"
      >
        <Eye className="w-8 h-8 text-primary/60 mx-auto mb-3" />
        <h3 className="font-heading font-bold text-base gradient-text mb-2">
          Trust the Process
        </h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Signs appear differently for everyone. Some manifest subtly over
          weeks; others arrive as sudden, unmistakable shifts. Keep a journal of
          your signs and revisit your sessions to track the pattern of your
          unique manifestation signature.
        </p>
      </motion.div>
    </div>
  );
}
