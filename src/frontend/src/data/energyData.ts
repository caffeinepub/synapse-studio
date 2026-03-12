import type {
  BeliefSystem,
  ChakraEntry,
  KinesisEntry,
} from "../hooks/useQueries";

export const CHAKRA_DATA: ChakraEntry[] = [
  {
    name: "Root",
    symbol: "⬛",
    color: "oklch(0.58 0.22 25)",
    location: "Base of spine",
    overview:
      "The Root chakra is the foundation of your entire energy system. It governs your sense of safety, stability, and belonging in the physical world.",
    psychologicalInterpretation:
      "Associated with the primal need for security. A balanced root chakra reflects a stable identity, financial groundedness, and freedom from existential fear. Psychological themes include trust, survival instincts, and embodiment.",
    emotionalThemes: ["Safety", "Grounding", "Belonging", "Trust", "Stability"],
    balancedTraits: [
      "Feeling safe and secure in your body",
      "Financial stability and practical wisdom",
      "Strong sense of identity and belonging",
      "Physical vitality and endurance",
      "Calm, grounded presence in daily life",
    ],
    affirmations: [
      "I am safe, secure, and deeply grounded.",
      "The earth supports me fully.",
      "I trust the process of life.",
      "I belong here and I am exactly where I need to be.",
      "My foundation is strong and unshakeable.",
    ],
  },
  {
    name: "Sacral",
    symbol: "🔶",
    color: "oklch(0.65 0.2 48)",
    location: "Lower abdomen, just below the navel",
    overview:
      "The Sacral chakra governs creativity, pleasure, emotional fluidity, and the capacity for joy. It is the seat of your creative life force and sensory experience.",
    psychologicalInterpretation:
      "Connected to emotional intelligence, creative expression, and the ability to experience pleasure without guilt. Psychological themes include intimacy, desire, adaptability, and the freedom to create.",
    emotionalThemes: [
      "Creativity",
      "Pleasure",
      "Passion",
      "Emotional Flow",
      "Joy",
    ],
    balancedTraits: [
      "Rich creative expression and imagination",
      "Healthy enjoyment of life's pleasures",
      "Emotional fluidity and resilience",
      "Passionate engagement with work and relationships",
      "Openness to change and new experiences",
    ],
    affirmations: [
      "I embrace pleasure and creativity as my birthright.",
      "My emotions flow freely and I honor them.",
      "I am a creative being and I express myself fully.",
      "I deserve joy and abundance.",
      "My life is rich with passion and beauty.",
    ],
  },
  {
    name: "Solar Plexus",
    symbol: "🔆",
    color: "oklch(0.78 0.18 90)",
    location: "Upper abdomen, stomach area",
    overview:
      "The Solar Plexus chakra is the power center of the self. It governs personal will, confidence, self-discipline, and the ability to act decisively in the world.",
    psychologicalInterpretation:
      "Linked to ego strength, personal agency, and self-esteem. A balanced solar plexus reflects healthy confidence — neither aggression nor passivity. Psychological themes include autonomy, motivation, boundaries, and personal identity.",
    emotionalThemes: [
      "Confidence",
      "Power",
      "Self-worth",
      "Discipline",
      "Willpower",
    ],
    balancedTraits: [
      "Healthy self-esteem and inner authority",
      "Ability to set and maintain boundaries",
      "Strong personal motivation and drive",
      "Clear decision-making and follow-through",
      "Responsibility for one's own life direction",
    ],
    affirmations: [
      "I am confident, powerful, and capable.",
      "I trust my own judgment and inner guidance.",
      "I am worthy of respect and I give it freely.",
      "My will is strong and my actions are purposeful.",
      "I stand in my power with ease and grace.",
    ],
  },
  {
    name: "Heart",
    symbol: "💚",
    color: "oklch(0.62 0.2 145)",
    location: "Center of the chest",
    overview:
      "The Heart chakra is the bridge between the lower physical chakras and the upper spiritual ones. It governs love, compassion, forgiveness, and connection to others.",
    psychologicalInterpretation:
      "Associated with empathy, attachment, and the capacity to give and receive love. A balanced heart chakra enables healthy relationships, self-compassion, and the ability to grieve and heal. Psychological themes include acceptance, forgiveness, and relational trust.",
    emotionalThemes: [
      "Love",
      "Compassion",
      "Forgiveness",
      "Gratitude",
      "Connection",
    ],
    balancedTraits: [
      "Deep, healthy relationships built on trust",
      "Ability to forgive yourself and others",
      "Genuine compassion for all living beings",
      "Self-love and emotional wholeness",
      "Gratitude as a natural state of being",
    ],
    affirmations: [
      "I am love and I am loved unconditionally.",
      "My heart is open, healed, and free.",
      "I forgive the past and embrace the present with love.",
      "Compassion flows through me naturally.",
      "I give and receive love in perfect balance.",
    ],
  },
  {
    name: "Throat",
    symbol: "🔵",
    color: "oklch(0.58 0.2 220)",
    location: "Throat, neck region",
    overview:
      "The Throat chakra governs authentic expression, communication, truth-telling, and the ability to be heard and understood. It is the center of your voice in the world.",
    psychologicalInterpretation:
      "Linked to self-expression, assertiveness, and integrity. A balanced throat chakra allows honest communication without fear of judgment. Psychological themes include authenticity, listening, creative voice, and the courage to speak one's truth.",
    emotionalThemes: [
      "Expression",
      "Truth",
      "Authenticity",
      "Communication",
      "Clarity",
    ],
    balancedTraits: [
      "Honest, clear, and compassionate communication",
      "Confidence in expressing your true thoughts",
      "Active and empathic listening",
      "Creative expression in speaking, writing, or art",
      "Alignment between inner truth and outer words",
    ],
    affirmations: [
      "I speak my truth with clarity and confidence.",
      "My voice matters and I am heard.",
      "I express myself authentically and with ease.",
      "I listen deeply and communicate with wisdom.",
      "My words carry power and I use them with intention.",
    ],
  },
  {
    name: "Third Eye",
    symbol: "🔮",
    color: "oklch(0.5 0.22 270)",
    location: "Center of the forehead, between the eyebrows",
    overview:
      "The Third Eye chakra is the seat of intuition, insight, perception, and inner wisdom. It governs your ability to see beyond the surface of reality and access deeper understanding.",
    psychologicalInterpretation:
      "Associated with metacognition, pattern recognition, and intuitive intelligence. A balanced third eye enables critical thinking alongside inner knowing. Psychological themes include insight, mental clarity, imagination, and the integration of logic and intuition.",
    emotionalThemes: ["Intuition", "Clarity", "Insight", "Vision", "Wisdom"],
    balancedTraits: [
      "Strong intuitive intelligence and inner knowing",
      "Clear perception and pattern recognition",
      "Vivid imagination and creative visualization",
      "Ability to see the bigger picture",
      "Trust in your own insight and discernment",
    ],
    affirmations: [
      "I trust my intuition — it always guides me true.",
      "My inner vision is clear and powerful.",
      "I perceive the deeper truth in all situations.",
      "My mind is open to wisdom from all directions.",
      "I see clearly with both my eyes and my inner eye.",
    ],
  },
  {
    name: "Crown",
    symbol: "💜",
    color: "oklch(0.55 0.22 310)",
    location: "Top of the head",
    overview:
      "The Crown chakra represents the highest state of consciousness, spiritual connection, and the sense of unity with all that exists. It governs your relationship to meaning, purpose, and transcendence.",
    psychologicalInterpretation:
      "Connected to existential meaning-making, transpersonal awareness, and the experience of awe. A balanced crown chakra enables a sense of purpose, spiritual openness, and the ability to hold paradox. Psychological themes include surrender, unity, and transcendence.",
    emotionalThemes: ["Unity", "Purpose", "Transcendence", "Awe", "Serenity"],
    balancedTraits: [
      "Deep sense of meaning and life purpose",
      "Openness to experiences beyond the ego",
      "Feeling connected to something greater than yourself",
      "Profound inner peace and equanimity",
      "Wisdom that flows from lived and spiritual experience",
    ],
    affirmations: [
      "I am connected to the infinite intelligence of the universe.",
      "My life is filled with purpose and meaning.",
      "I surrender to the flow of life with trust and peace.",
      "I am one with all that is.",
      "The universe supports and guides me always.",
    ],
  },
];

export const BELIEF_SYSTEMS_DATA: BeliefSystem[] = [
  {
    name: "Manifestation Philosophy",
    category: "Consciousness & Intention",
    summary:
      "Manifestation is the philosophical practice of deliberately directing thought, emotion, and attention toward desired outcomes. Rooted in the idea that consciousness participates in the shaping of experience, it draws from Hermetic philosophy, New Thought movements of the 19th and 20th centuries, and contemporary positive psychology.",
    keyPrinciples: [
      "What you consistently focus on, you tend to attract and create more of in your life.",
      "Emotion amplifies intention — feeling as if something is already true accelerates its emergence.",
      "The subconscious mind does not distinguish between vividly imagined and real experience.",
      "Gratitude for what already exists opens the channel for more abundance.",
      "Belief systems act as filters — what you believe possible shapes what you allow yourself to receive.",
    ],
  },
  {
    name: "Subconscious Programming",
    category: "Psychology & Mind",
    summary:
      "The subconscious mind processes the vast majority of our mental activity below the threshold of conscious awareness. Subconscious programming refers to the practice of deliberately installing new belief patterns, emotional responses, and behavioral tendencies through repetition, visualization, and altered states of awareness.",
    keyPrinciples: [
      "Repetition is the primary mechanism by which new neural pathways are formed and strengthened.",
      "The critical faculty of the conscious mind is bypassed during deep relaxation, hypnosis, and sleep.",
      "Affirmations work most effectively when combined with strong positive emotion and vivid imagery.",
      "Early childhood experiences create deep subconscious programs that shape adult behavior.",
      "Consistent exposure to empowering messages gradually overwrites limiting beliefs.",
    ],
  },
  {
    name: "Archetypes",
    category: "Depth Psychology",
    summary:
      "Archetypes are universal symbolic patterns first systematized by psychologist Carl Jung. They represent recurring characters, themes, and motifs found across all human cultures, myths, dreams, and stories — suggesting a shared layer of the human psyche he called the collective unconscious.",
    keyPrinciples: [
      "The Hero archetype represents the journey of transformation through challenge and growth.",
      "The Shadow contains the aspects of ourselves we deny or suppress — integrating it creates wholeness.",
      "The Self archetype represents the totality of the psyche and the goal of individuation.",
      "Identifying with powerful archetypes can catalyze psychological growth and expanded self-concept.",
      "Myths and stories are the language through which the unconscious communicates timeless wisdom.",
    ],
  },
  {
    name: "Meditation Frameworks",
    category: "Contemplative Practice",
    summary:
      "Meditation encompasses a diverse range of practices aimed at training attention, cultivating awareness, and achieving altered states of consciousness. Modern research consistently demonstrates its benefits for stress reduction, emotional regulation, cognitive performance, and subjective well-being.",
    keyPrinciples: [
      "Mindfulness meditation trains present-moment awareness and non-reactive observation of experience.",
      "Transcendental Meditation uses mantras to settle the mind into its quietest state of awareness.",
      "Visualization practices harness the brain's inability to fully distinguish between imagined and real events.",
      "Loving-kindness (Metta) meditation systematically cultivates compassion for self and others.",
      "Regular practice restructures the brain through neuroplasticity, producing lasting changes in perception.",
    ],
  },
  {
    name: "Psychological Visualization",
    category: "Applied Psychology",
    summary:
      "Visualization — or mental imagery — is a well-documented psychological technique used by elite athletes, performers, therapists, and coaches. By mentally rehearsing desired outcomes in vivid detail, the brain activates many of the same neural circuits it would use during the actual experience.",
    keyPrinciples: [
      "The brain's motor cortex fires similarly whether an action is performed or merely vividly imagined.",
      "Mental rehearsal improves performance by pre-building the neural pathways required for execution.",
      "Detailed, sensory-rich visualization is significantly more effective than abstract conceptualization.",
      "Regular visualization of a desired identity gradually shifts self-concept and subsequent behavior.",
      "Combining visualization with deep relaxation maximizes absorption into the subconscious mind.",
    ],
  },
  {
    name: "Cognitive Reinforcement",
    category: "Behavioral Psychology",
    summary:
      "Cognitive reinforcement refers to the systematic practice of strengthening desired thought patterns, beliefs, and mental frameworks through repetition, positive feedback, and deliberate attention management. It is the psychological backbone of affirmation practice, coaching, and cognitive behavioral therapy.",
    keyPrinciples: [
      "Every thought you entertain strengthens the corresponding neural connection in the brain.",
      "Selective attention shapes reality perception — you find what you are primed to look for.",
      "Positive self-talk directly influences mood, confidence, and behavioral outcomes.",
      "Interrupting negative thought loops and consciously replacing them rewires habitual patterns.",
      "The identity you repeatedly affirm to yourself gradually becomes your operating self-concept.",
    ],
  },
];

export const KINESIS_DATA: KinesisEntry[] = [
  {
    name: "Telekinesis",
    suffix: "kinesis",
    element: "Mind",
    fictionalOrigins:
      "One of the oldest concepts in speculative fiction and paranormal literature, telekinesis — the ability to move objects with the mind — appears in ancient myths, psychic research of the 19th and 20th centuries, and countless science fiction and fantasy narratives.",
    mediaReferences: [
      "Carrie (Stephen King)",
      "X-Men (Marvel)",
      "Eleven — Stranger Things",
      "Jean Grey — X-Men",
      "The Force — Star Wars",
    ],
    symbolicMeaning:
      "The power to move things without physical contact symbolizes the reach of intention. It represents the idea that focused thought, will, and attention can influence outcomes in the world.",
    psychologicalMetaphor:
      "Mental discipline, intentional focus, and the ability to influence your environment through clarity of mind. Developing mastery over attention and the direction of mental energy.",
  },
  {
    name: "Pyrokinesis",
    suffix: "kinesis",
    element: "Fire",
    fictionalOrigins:
      "Pyrokinesis — the manipulation of fire — appears in folklore, mythology (Prometheus, Agni), and modern fiction. Fire has always symbolized transformation, destruction, and renewal across cultures.",
    mediaReferences: [
      "Firestarter (Stephen King)",
      "Human Torch — Marvel",
      "Roy Mustang — Fullmetal Alchemist",
      "Natsu Dragneel — Fairy Tail",
      "Pyro — X-Men",
    ],
    symbolicMeaning:
      "Fire represents passion, transformation, and the burning away of what no longer serves. Pyrokinesis symbolizes the power to ignite and to consume — to create through destruction.",
    psychologicalMetaphor:
      "Inner fire — passion, drive, motivation, and the transformative power of intense emotional energy. The ability to burn through fear and resistance.",
  },
  {
    name: "Electrokinesis",
    suffix: "kinesis",
    element: "Lightning",
    fictionalOrigins:
      "The manipulation of electricity and lightning draws from mythologies of sky gods (Zeus, Thor, Raijin) and was popularized in science fiction as bioelectric powers of the human nervous system.",
    mediaReferences: [
      "Emperor Palpatine — Star Wars",
      "Raiden — Mortal Kombat",
      "Cole MacGrath — inFamous",
      "Thor — Marvel",
      "Killua Zoldyck — Hunter x Hunter",
    ],
    symbolicMeaning:
      "Lightning represents sudden illumination, speed, and power. Electrokinesis symbolizes the spark of ideas, the speed of thought, and the raw energy of the nervous system.",
    psychologicalMetaphor:
      "Mental brilliance, the spark of insight, and the capacity for rapid, high-voltage thinking. Electric charisma and the ability to energize those around you.",
  },
  {
    name: "Chronokinesis",
    suffix: "kinesis",
    element: "Time",
    fictionalOrigins:
      "The manipulation of time is one of the most explored concepts in science fiction — from H.G. Wells' The Time Machine to countless philosophical thought experiments about the nature of time itself.",
    mediaReferences: [
      "Hiro Nakamura — Heroes",
      "Doctor Strange — Marvel",
      "The Flash — DC",
      "Homura Akemi — Madoka Magica",
      "Dio Brando — JoJo's Bizarre Adventure",
    ],
    symbolicMeaning:
      "Time manipulation represents the desire to control fate, correct mistakes, and exist outside the ordinary flow of consequence. It symbolizes mastery over present, past, and future.",
    psychologicalMetaphor:
      "Present-moment awareness, the mastery of time management, and the ability to exist in the flow state where time seems to expand. Perfect timing and situational awareness.",
  },
  {
    name: "Aerokinesis",
    suffix: "kinesis",
    element: "Air",
    fictionalOrigins:
      "Wind and air control appears in the mythologies of virtually every culture — Aeolus in Greek myth, Fujin in Japanese tradition, and the four-element systems of classical philosophy.",
    mediaReferences: [
      "Aang — Avatar: The Last Airbender",
      "Storm — X-Men",
      "Windrider — Marvel",
      "Venti — Genshin Impact",
      "Sasuke Uchiha — Naruto",
    ],
    symbolicMeaning:
      "Air represents freedom, intelligence, communication, and the invisible forces that shape the world. Aerokinesis symbolizes the power of the unseen — thought, breath, and intention.",
    psychologicalMetaphor:
      "Fluid adaptability, mental freedom, and the ability to move through life without resistance. The gift of perspective — rising above situations to see clearly.",
  },
  {
    name: "Hydrokinesis",
    suffix: "kinesis",
    element: "Water",
    fictionalOrigins:
      "Water manipulation draws from sea deities (Poseidon, Njord), rain-calling shamans across cultures, and modern superhero fiction. Water's shapelessness and force make it a powerful mythological symbol.",
    mediaReferences: [
      "Katara — Avatar: The Last Airbender",
      "Aquaman — DC",
      "Juvia Lockser — Fairy Tail",
      "Kisame Hoshigaki — Naruto",
      "Percy Jackson — Rick Riordan",
    ],
    symbolicMeaning:
      "Water represents the unconscious mind, emotional depth, and the power of persistent force. Hydrokinesis symbolizes emotional mastery and the ability to flow around any obstacle.",
    psychologicalMetaphor:
      "Emotional intelligence, depth of feeling, and the capacity to move through challenges with fluid grace rather than rigid resistance.",
  },
  {
    name: "Geokinesis",
    suffix: "kinesis",
    element: "Earth",
    fictionalOrigins:
      "Earth manipulation is rooted in earth-deity worship, geomancy practices, and myths of giants and titans who shaped the land. It represents the most physically grounded of elemental powers.",
    mediaReferences: [
      "Toph Beifong — Avatar: The Last Airbender",
      "Terra — DC/Teen Titans",
      "Gaara — Naruto",
      "Magneto (indirectly) — Marvel",
      "Various earth spirits in world mythology",
    ],
    symbolicMeaning:
      "Earth represents stability, endurance, patience, and primal physical power. Geokinesis symbolizes the ability to stand immovable in the face of all forces.",
    psychologicalMetaphor:
      "Unshakeable groundedness, physical discipline, and the slow, powerful strength of someone who cannot be moved from their values and purpose.",
  },
  {
    name: "Biokinesis",
    suffix: "kinesis",
    element: "Life",
    fictionalOrigins:
      "The concept of influencing living organisms with the mind draws from healing traditions, faith-based medicine, and science fiction explorations of cellular and genetic manipulation.",
    mediaReferences: [
      "Tsunade — Naruto",
      "Poison Ivy — DC",
      "Sage Mode users — Naruto",
      "Various healers in fantasy literature",
      "Biological manipulators in X-Men",
    ],
    symbolicMeaning:
      "Biokinesis represents the power of life itself — the ability to shape, heal, and transform living systems. It symbolizes the intimate relationship between mind and body.",
    psychologicalMetaphor:
      "Mind-body mastery, somatic awareness, and the real influence that mental state has on physical health and vitality. The practice of intentional wellness.",
  },
  {
    name: "Technokinesis",
    suffix: "kinesis",
    element: "Technology",
    fictionalOrigins:
      "The idea of mentally interfacing with machines emerged with the digital age — cyberpunk fiction, AI narratives, and neurotechnology speculation created a rich landscape of human-machine merger.",
    mediaReferences: [
      "Cyborg — DC",
      "Ghost in the Shell",
      "The Matrix",
      "Iron Man's neural interface",
      "Ghost Rider — Marvel",
    ],
    symbolicMeaning:
      "Technokinesis represents humanity's symbiosis with its tools. It symbolizes the seamless integration of intelligence and systems — the ability to master complex environments.",
    psychologicalMetaphor:
      "Systems thinking, rapid skill acquisition, and the ability to adapt to and master new technological and complex environments with ease.",
  },
  {
    name: "Cryokinesis",
    suffix: "kinesis",
    element: "Ice",
    fictionalOrigins:
      "Ice and cold have long represented preservation, distance, and deathlike stillness in mythology. From the Norse Niflheim to modern cryogenic science, cold symbolizes both danger and power.",
    mediaReferences: [
      "Elsa — Frozen",
      "Iceman — X-Men",
      "Gray Fullbuster — Fairy Tail",
      "Sub-Zero — Mortal Kombat",
      "Aokiji — One Piece",
    ],
    symbolicMeaning:
      "Ice represents the power of stillness, the preservation of what matters, and the ability to bring absolute calm to chaos. It symbolizes the sovereign cool of one who cannot be rattled.",
    psychologicalMetaphor:
      "Calm authority, emotional regulation, and the serene power of someone who remains unaffected by chaos. Inner stillness as the ultimate form of strength.",
  },
  {
    name: "Photokinesis",
    suffix: "kinesis",
    element: "Light",
    fictionalOrigins:
      "Light as a supernatural force appears in virtually every spiritual tradition — divine light, halos, auras, and radiance symbolize the presence of sacred or extraordinary power across all cultures.",
    mediaReferences: [
      "Light-wielders in Final Fantasy",
      "Galadriel — Lord of the Rings",
      "Various angelic figures",
      "Sailor Moon",
      "Light-based heroes across Marvel and DC",
    ],
    symbolicMeaning:
      "Light represents truth, revelation, and the dispelling of ignorance. Photokinesis symbolizes the power to illuminate — to make the invisible visible and the unclear clear.",
    psychologicalMetaphor:
      "Radiant presence, positive magnetism, and the gift of bringing clarity and warmth to any room. The natural leader who uplifts and illuminates others.",
  },
  {
    name: "Umbrakinesis",
    suffix: "kinesis",
    element: "Shadow",
    fictionalOrigins:
      "Shadow manipulation draws from Jungian psychology's concept of the Shadow self, dark deities across pantheons, and the rich tradition of shadow-wielding antiheroes and villains in fiction.",
    mediaReferences: [
      "Raven — DC/Teen Titans",
      "Darkrai — Pokémon",
      "Shadow the Hedgehog — Sonic",
      "Noct — various",
      "Shadow manipulators across Dark Fantasy",
    ],
    symbolicMeaning:
      "Shadow represents what is hidden, suppressed, or denied. Umbrakinesis symbolizes the power that comes from integrating darkness — from knowing and accepting every part of yourself.",
    psychologicalMetaphor:
      "Shadow integration, psychological wholeness, and the immense personal power that comes from accepting rather than fighting the darker or hidden aspects of oneself.",
  },
  {
    name: "Gravitokinesis",
    suffix: "kinesis",
    element: "Gravity",
    fictionalOrigins:
      "Gravity manipulation emerges from physics speculation and science fiction — the dream of defying the fundamental force that binds us to the earth. It appears in superhero lore, anime, and theoretical physics narratives.",
    mediaReferences: [
      "Gravity Falls — Disney",
      "Gravity Man — Mega Man",
      "Graviton — Marvel",
      "Ganishka — Berserk",
      "Nagato (Deva Path) — Naruto",
    ],
    symbolicMeaning:
      "Gravity represents the forces that pull us down, bind us, and keep us grounded. Gravitokinesis symbolizes the mastery over weight — both literal and metaphorical burdens.",
    psychologicalMetaphor:
      "Freedom from limiting beliefs, the ability to rise above heavy emotions, and the power to attract or repel circumstances. Mastery over what holds you down.",
  },
  {
    name: "Vitakinesis",
    suffix: "kinesis",
    element: "Vitality",
    fictionalOrigins:
      "The concept of manipulating life force energy appears in healing traditions worldwide — from chi in Chinese medicine to prana in Ayurveda, and manifests in fiction as the power to heal or drain life energy.",
    mediaReferences: [
      "Tsunade — Naruto (advanced healing)",
      "Recovery Girl — My Hero Academia",
      "Jean Grey (healing) — X-Men",
      "Various healers in Final Fantasy",
      "Life-force manipulation in Dragon Ball",
    ],
    symbolicMeaning:
      "Vitakinesis represents the raw power of living energy — the force that animates and sustains all life. It symbolizes the capacity to restore, replenish, and revitalize.",
    psychologicalMetaphor:
      "Emotional and physical restoration, the power of nurturing and healing others, and the internal capacity to regenerate after setbacks.",
  },
  {
    name: "Sonokinesis",
    suffix: "kinesis",
    element: "Sound",
    fictionalOrigins:
      "Sound as a supernatural weapon or tool appears in myths of sacred vibration (Nada Brahma), the biblical walls of Jericho, and modern fiction featuring sonic heroes and villains.",
    mediaReferences: [
      "Black Canary — DC",
      "Banshee — X-Men",
      "Dosu Kinuta — Naruto",
      "Ravel — Fairy Tail",
      "Soundwave — Transformers",
    ],
    symbolicMeaning:
      "Sound represents vibration, resonance, and the invisible waves that carry meaning. Sonokinesis symbolizes the power of voice, frequency, and the ability to shake the world with words.",
    psychologicalMetaphor:
      "The power of voice, authentic self-expression, the ability to resonate with others, and the courage to make yourself heard in a world full of noise.",
  },
  {
    name: "Magnetokinesis",
    suffix: "kinesis",
    element: "Magnetism",
    fictionalOrigins:
      "Magnetic manipulation appears prominently in comic book fiction as one of the most visually spectacular and physically versatile powers, drawing from electromagnetism in physics.",
    mediaReferences: [
      "Magneto — X-Men",
      "Polaris — X-Men",
      "Envy (indirectly) — Fullmetal Alchemist",
      "Magnetic Man — Marvel",
      "Tetsuo — Akira",
    ],
    symbolicMeaning:
      "Magnetism represents attraction and repulsion — the invisible forces of alignment and opposition. Magnetokinesis symbolizes the power to draw what you need and deflect what you don't.",
    psychologicalMetaphor:
      "Personal magnetism, the law of attraction in action, charisma that naturally pulls people and opportunities, and the strength to repel toxic influences.",
  },
  {
    name: "Thermokinesis",
    suffix: "kinesis",
    element: "Heat",
    fictionalOrigins:
      "Thermal manipulation — control over temperature itself (separate from fire or ice) — appears in physics-based superhero narratives and science fiction stories about human body temperature control.",
    mediaReferences: [
      "Endeavor — My Hero Academia",
      "Portgas D. Ace — One Piece (Mera Mera)",
      "Tempest — various",
      "Various fire/ice hybrid characters",
      "Thermal-based superhumans in Marvel/DC",
    ],
    symbolicMeaning:
      "Temperature represents the spectrum between extremes — hot and cold, passion and calm, action and stillness. Thermokinesis symbolizes mastery of the full spectrum of intensity.",
    psychologicalMetaphor:
      "Emotional range and regulation — the ability to bring full heat to passion and full cool to conflict, choosing your emotional temperature in every situation.",
  },
  {
    name: "Plasmakinesis",
    suffix: "kinesis",
    element: "Plasma",
    fictionalOrigins:
      "Plasma — the fourth state of matter, superheated ionized gas — appears in science fiction and superhero narratives as one of the most powerful and rare elemental abilities, often associated with cosmic-level beings.",
    mediaReferences: [
      "Nova — Marvel",
      "Various cosmic entities — Marvel/DC",
      "Plasma-based abilities in Destiny",
      "Energy benders in science fiction",
      "Star-level beings across space opera fiction",
    ],
    symbolicMeaning:
      "Plasma represents the raw, uncontained energy of stars — primal creation force at its most intense. It symbolizes the transformative power that exists beyond ordinary boundaries.",
    psychologicalMetaphor:
      "Access to your deepest creative force, the energy that exists when all limitations burn away. The state of peak flow — pure, radiant expression of your highest potential.",
  },
  {
    name: "Lunakinesis",
    suffix: "kinesis",
    element: "Moon",
    fictionalOrigins:
      "Lunar energy manipulation is rooted in moon goddess traditions worldwide — Selene, Artemis, Luna, Chang'e — and appears in Sailor Moon, lunar magic systems in fantasy, and esoteric traditions linking the moon to cycles and intuition.",
    mediaReferences: [
      "Sailor Moon",
      "Tsukuyomi — Naruto",
      "Moon Knight — Marvel",
      "Luna Lovegood — Harry Potter (symbolically)",
      "Lunar-themed heroes in JRPG tradition",
    ],
    symbolicMeaning:
      "The moon represents cycles, intuition, the subconscious, and the pull of tides. Lunakinesis symbolizes mastery over cycles — knowing when to act and when to rest.",
    psychologicalMetaphor:
      "Deep intuition, cyclical awareness, emotional depth, and the ability to navigate the rhythms of life — understanding that all things wax and wane.",
  },
  {
    name: "Heliokinesis",
    suffix: "kinesis",
    element: "Sun",
    fictionalOrigins:
      "Solar energy manipulation draws from sun god traditions across every culture — Ra, Apollo, Amaterasu, Sol Invictus — and appears in superhero fiction as the source of the most primal life-giving power.",
    mediaReferences: [
      "Superman (solar power) — DC",
      "Amaterasu — various mythology",
      "Sol — Guilty Gear",
      "Soleil — various",
      "Solar-powered heroes across Marvel and DC",
    ],
    symbolicMeaning:
      "The sun represents the source of all life, radiant authority, and the center around which everything orbits. Heliokinesis symbolizes the power of being a source — a light that others gather around.",
    psychologicalMetaphor:
      "Radiant leadership, the capacity to be someone's source of warmth and energy, and the solar confidence of someone who shines without needing permission.",
  },
  {
    name: "Dendrokinesis",
    suffix: "kinesis",
    element: "Nature",
    fictionalOrigins:
      "Plant and nature manipulation appears in druidic traditions, nature spirits in folklore worldwide, and fiction featuring characters who can command roots, vines, flowers, and forests.",
    mediaReferences: [
      "Poison Ivy — DC",
      "Yamato — Naruto (Wood Style)",
      "Swamp Thing — DC",
      "Hashirama Senju — Naruto",
      "Various druids and nature spirits in fantasy",
    ],
    symbolicMeaning:
      "Plants and nature represent patient growth, deep roots, and the unstoppable persistence of life. Dendrokinesis symbolizes the quiet power of growth — slow, inevitable, and enduring.",
    psychologicalMetaphor:
      "Patient cultivation of goals, deep-rootedness in values, the ability to grow toward the light no matter the obstacle, and the perseverance of all living things.",
  },
  {
    name: "Atmokinesis",
    suffix: "kinesis",
    element: "Weather",
    fictionalOrigins:
      "Weather control is one of the most powerful elemental abilities in mythology — Thor, Zeus, Raijin, and weather-working shamans represent humanity's ancient relationship with atmospheric forces.",
    mediaReferences: [
      "Storm — X-Men",
      "Thor — Marvel",
      "Fujin — various mythology",
      "Weather Report — JoJo's Bizarre Adventure",
      "Zeus — Greek mythology",
    ],
    symbolicMeaning:
      "Weather represents the vast, shifting forces of the world — unpredictable, powerful, and beyond individual control. Atmokinesis symbolizes becoming a force of nature rather than a victim of it.",
    psychologicalMetaphor:
      "The ability to command the atmosphere of any environment — emotional intelligence so developed that you change the mood of every room you enter.",
  },
  {
    name: "Necrokinesis",
    suffix: "kinesis",
    element: "Death",
    fictionalOrigins:
      "Necromancy and death manipulation appear in every ancient tradition — from Egyptian death rites to Greek underworld mythology — as the most taboo and powerful form of supernatural ability.",
    mediaReferences: [
      "Nagato (Outer Path) — Naruto",
      "Death Eaters — Harry Potter",
      "Necromancers — Diablo series",
      "Thanos (indirectly) — Marvel",
      "Various undead-commanding characters in fantasy",
    ],
    symbolicMeaning:
      "Death represents transition, ending, and the threshold between states. Necrokinesis symbolizes the power to transmute — to work with endings and transform them into new beginnings.",
    psychologicalMetaphor:
      "The psychological capacity for radical transformation — letting old versions of yourself die so new ones can emerge. Comfort with endings as the gateway to rebirth.",
  },
  {
    name: "Ergokinesis",
    suffix: "kinesis",
    element: "Energy",
    fictionalOrigins:
      "Raw energy manipulation — pure force beyond elemental classification — appears in anime and comic fiction as the most versatile and potent of all supernatural abilities.",
    mediaReferences: [
      "Dragon Ball Z — Ki manipulation",
      "Naruto — Chakra energy",
      "Bleach — Reiatsu/spiritual pressure",
      "One Punch Man — Saitama's raw energy",
      "Green Lantern — Willpower energy",
    ],
    symbolicMeaning:
      "Raw energy represents the undifferentiated power of the universe before it takes form. Ergokinesis symbolizes access to the primal creative force — will made manifest.",
    psychologicalMetaphor:
      "Peak personal energy — the cultivation of life force through discipline, focus, and alignment of body, mind, and spirit. Unlimited potential expressed through concentrated effort.",
  },
  {
    name: "Dimensiokinesis",
    suffix: "kinesis",
    element: "Space",
    fictionalOrigins:
      "Spatial and dimensional manipulation appears in physics-inspired science fiction, multiverse theory narratives, and fantasy featuring portals, pocket dimensions, and reality-warping abilities.",
    mediaReferences: [
      "Doctor Strange — Marvel",
      "Obito Uchiha (Kamui) — Naruto",
      "Kuzan — One Piece",
      "Beerus — Dragon Ball Super",
      "Portal — video game series",
    ],
    symbolicMeaning:
      "Dimensional manipulation represents the power to transcend the ordinary limitations of space. It symbolizes the ability to operate outside conventional boundaries and access possibilities others cannot perceive.",
    psychologicalMetaphor:
      "Expansive thinking, the ability to perceive multiple dimensions of reality simultaneously, and the skill of stepping outside conventional thinking into creative breakthrough.",
  },
  {
    name: "Pathokinesis",
    suffix: "kinesis",
    element: "Emotion",
    fictionalOrigins:
      "Emotional manipulation — the ability to feel, sense, or alter the emotions of others — appears in empathic traditions, shamanic healing practices, and fiction featuring empaths and emotional manipulators.",
    mediaReferences: [
      "Jasper Hale — Twilight",
      "Raven — DC/Teen Titans (emotion absorption)",
      "Mantis — Marvel",
      "Troi — Star Trek (empath)",
      "Various empaths in fantasy fiction",
    ],
    symbolicMeaning:
      "Emotion represents the invisible current that moves through all human interaction. Pathokinesis symbolizes profound empathic capacity — the ability to read, understand, and harmonize emotional fields.",
    psychologicalMetaphor:
      "Deep emotional intelligence, the capacity to understand and influence emotional environments, and the rare skill of truly reading others and creating resonance.",
  },
  {
    name: "Mnemokinesis",
    suffix: "kinesis",
    element: "Memory",
    fictionalOrigins:
      "Memory manipulation draws from psychological horror, neuroscience fiction, and myths of gods who could erase or alter the minds of mortals — appearing in films like Eternal Sunshine and series like Dark.",
    mediaReferences: [
      "Professor X — X-Men",
      "Ino Yamanaka — Naruto",
      "Dark — Netflix series",
      "Eternal Sunshine of the Spotless Mind",
      "Memory-altering entities in SCP Foundation",
    ],
    symbolicMeaning:
      "Memory represents the architecture of identity — who we believe we are and where we came from. Mnemokinesis symbolizes the power to reshape identity by rewriting what we carry from the past.",
    psychologicalMetaphor:
      "Cognitive reframing, the ability to revisit and reinterpret memories to create a new personal narrative, and the therapeutic power of choosing what we hold onto.",
  },
  {
    name: "Onirokinesis",
    suffix: "kinesis",
    element: "Dreams",
    fictionalOrigins:
      "Dream manipulation appears in myths of Morpheus and Hypnos, Sandman mythology, Jungian dreamwork traditions, and modern fiction like Inception and A Nightmare on Elm Street.",
    mediaReferences: [
      "Freddy Krueger — A Nightmare on Elm Street",
      "Morpheus — The Sandman",
      "Inception — Christopher Nolan",
      "Cobb — Naruto (Tsukuyomi, dream-adjacent)",
      "Dream manipulation in various JRPG narratives",
    ],
    symbolicMeaning:
      "Dreams represent the unguarded territory of the subconscious — where true desires, fears, and archetypes emerge. Onirokinesis symbolizes the ability to consciously navigate and shape the inner world.",
    psychologicalMetaphor:
      "Lucid awareness of your own subconscious, the ability to work intentionally with dreams and imagination, and mastery of the inner landscape of the mind.",
  },
  {
    name: "Chlorokinesis",
    suffix: "kinesis",
    element: "Plants",
    fictionalOrigins:
      "Plant control is rooted in fertility goddesses, agricultural deities, and the magical traditions of herbalism and druidry. In fiction it appears as one of the most versatile and underestimated elemental powers.",
    mediaReferences: [
      "Poison Ivy — DC",
      "Flora — Winx Club",
      "Kurama (Wood Release) — Naruto",
      "Groot — Marvel",
      "Nature-based witches in fantasy fiction",
    ],
    symbolicMeaning:
      "Plants represent the quiet persistence of life — the ability to crack concrete, reach light from the deepest darkness, and adapt to any soil. Chlorokinesis symbolizes the unstoppable nature of growth.",
    psychologicalMetaphor:
      "Tenacity, the capacity to grow in any conditions, patience with the natural rhythm of progress, and the understanding that roots must go deep before branches can spread wide.",
  },
  {
    name: "Ferrokinesis",
    suffix: "kinesis",
    element: "Metal",
    fictionalOrigins:
      "Metal manipulation draws from blacksmithing deities (Hephaestus, Vulcan), alchemical traditions of metal transmutation, and comic fiction featuring iron and steel as symbols of industrial human power.",
    mediaReferences: [
      "Magneto (metal focus) — X-Men",
      "Alex Armstrong — Fullmetal Alchemist",
      "Colossus — X-Men",
      "Metal Lee — Naruto",
      "Iron Man (technology as metal mastery)",
    ],
    symbolicMeaning:
      "Metal represents the refined — raw material shaped by fire and force into something stronger. Ferrokinesis symbolizes the transformation of raw potential into tempered, purposeful strength.",
    psychologicalMetaphor:
      "The refinement of character through hardship — like metal forged in heat, the most resilient version of yourself emerges through pressure and persistence.",
  },
  {
    name: "Haemokinesis",
    suffix: "kinesis",
    element: "Blood",
    fictionalOrigins:
      "Blood manipulation appears in vampire mythology, shamanic bloodwork traditions, and horror fiction — the most visceral and intimate of all elemental manipulations, representing life force at its most primal.",
    mediaReferences: [
      "Karin — Naruto",
      "Alucard — Hellsing",
      "Medusa — Soul Eater",
      "Bloody Mary — folklore",
      "Blood benders — Avatar: The Legend of Korra",
    ],
    symbolicMeaning:
      "Blood represents the sacred life force — lineage, vitality, sacrifice, and the irreducible essence of being alive. Haemokinesis symbolizes intimate relationship with one's own vital energy.",
    psychologicalMetaphor:
      "Connection to your deepest vitality, ancestral strength, and the primal life force that carries your lineage and history. Ownership of your own life energy.",
  },
  {
    name: "Psionics",
    suffix: "kinesis",
    element: "Psi",
    fictionalOrigins:
      "Psionic abilities — the umbrella of all mental supernatural powers including telepathy, psychokinesis, and precognition — appear in science fiction as the evolutionary next step of human consciousness.",
    mediaReferences: [
      "Professor X — X-Men",
      "Psylocke — X-Men",
      "Mob — Mob Psycho 100",
      "Espers in A Certain Scientific Railgun",
      "Psionics — Warhammer 40k",
    ],
    symbolicMeaning:
      "Psionics represents the total awakening of mental potential — the fullest expression of what the human mind can become. It symbolizes transcendence of physical limitation through pure consciousness.",
    psychologicalMetaphor:
      "The integration of all cognitive abilities — perception, intuition, memory, focus, and social intelligence — into a unified field of extraordinary mental mastery.",
  },
  {
    name: "Geomagnetokinesis",
    suffix: "kinesis",
    element: "Geomagnetism",
    fictionalOrigins:
      "The manipulation of the Earth's magnetic field draws from geomancy, compass-lore, and science fiction featuring characters who can sense and bend the planet's invisible lines of force.",
    mediaReferences: [
      "Magneto (planetary scale) — X-Men",
      "Various earth-shapers in dark fantasy",
      "Lodestone — Marvel",
      "Magnetic field manipulators in SF novels",
      "Geomancers in fantasy RPG settings",
    ],
    symbolicMeaning:
      "The Earth's magnetic field represents invisible guidance — the force that orients compasses and navigators. Geomagnetokinesis symbolizes the ability to sense true north even in complete darkness.",
    psychologicalMetaphor:
      "Unwavering internal compass, the rare ability to always know your direction and purpose even when the environment is disorienting or chaotic.",
  },
  {
    name: "Quantumkinesis",
    suffix: "kinesis",
    element: "Quantum",
    fictionalOrigins:
      "Quantum manipulation draws from theoretical physics — superposition, entanglement, probability collapse — and appears in hard science fiction as the ultimate form of reality manipulation at the subatomic level.",
    mediaReferences: [
      "Scarlet Witch — Marvel (probability manipulation)",
      "Ant-Man (Quantum Realm) — Marvel",
      "Trafalgar Law (surgical precision) — One Piece",
      "Quantum entities in hard SF",
      "Q — Star Trek (implied quantum mastery)",
    ],
    symbolicMeaning:
      "Quantum mechanics reveals that reality is fundamentally probabilistic — outcomes are not fixed until observed. Quantumkinesis symbolizes the ability to collapse probability in your favor.",
    psychologicalMetaphor:
      "Radical openness to multiple possibilities, the practice of holding uncertainty without anxiety, and the ability to choose the most favorable outcome from the infinite field of potential.",
  },
  {
    name: "Cosmokinesis",
    suffix: "kinesis",
    element: "Cosmos",
    fictionalOrigins:
      "Cosmic power manipulation appears as the highest tier of supernatural ability in comic fiction — the Silver Surfer, Galactus, the Phoenix Force — representing power on a universal rather than personal scale.",
    mediaReferences: [
      "Silver Surfer — Marvel",
      "Phoenix Force — X-Men",
      "Galactus — Marvel",
      "Zen-Oh — Dragon Ball Super",
      "Celestials — Marvel cosmology",
    ],
    symbolicMeaning:
      "Cosmic energy represents the incomprehensible vastness of the universe itself — power that operates at the scale of galaxies and eternities. Cosmokinesis symbolizes alignment with the largest possible forces.",
    psychologicalMetaphor:
      "The sense of being held by something larger than yourself — cosmic perspective that dissolves petty concerns and aligns your actions with what truly matters at the deepest level.",
  },
  {
    name: "Nosokinesis",
    suffix: "kinesis",
    element: "Illness",
    fictionalOrigins:
      "Disease and illness manipulation appears in dark fantasy, viral horror, and mythology of plague deities (Pestilence, Nurgle, Ereshkigal) as the feared power to harm or, inversely, to cure all afflictions.",
    mediaReferences: [
      "Pestilence — Good Omens / biblical",
      "Nurgle — Warhammer 40k",
      "Plague doctors in dark fantasy",
      "Viral manipulators in Marvel",
      "Disease-themed abilities in horror RPGs",
    ],
    symbolicMeaning:
      "Illness represents imbalance, hidden weakness, and the body's communication of deeper truths. Nosokinesis symbolizes understanding the language of the body and the ability to restore systemic balance.",
    psychologicalMetaphor:
      "Deep somatic intelligence — the capacity to recognize where imbalance lives before it manifests fully, and the power to restore equilibrium in body, mind, and environment.",
  },
  {
    name: "Teleportation",
    suffix: "kinesis",
    element: "Space-Fold",
    fictionalOrigins:
      "Teleportation — instantaneous movement through space — appears across mythology as divine traversal (Hermes, angels), in physics thought experiments, and countless science fiction and fantasy narratives.",
    mediaReferences: [
      "Nightcrawler — X-Men",
      "Minato Namikaze (Flying Thunder God) — Naruto",
      "Goku (Instant Transmission) — Dragon Ball",
      "Blink — X-Men",
      "Kuzan — One Piece",
    ],
    symbolicMeaning:
      "Teleportation represents freedom from the tyranny of physical distance — the ability to be exactly where you are needed, exactly when you are needed. It symbolizes perfect presence.",
    psychologicalMetaphor:
      "The ability to be fully present — mentally, emotionally, and energetically — without the drag of distraction or the distance of dissociation.",
  },
  {
    name: "Intangibility",
    suffix: "kinesis",
    element: "Phase",
    fictionalOrigins:
      "The ability to pass through solid matter appears in ghost mythology worldwide, phasing mutants in comic fiction, and quantum tunneling in physics — the dream of moving unimpeded through the physical world.",
    mediaReferences: [
      "Kitty Pryde — X-Men",
      "Martian Manhunter — DC",
      "Ghost — various fictional ghosts",
      "Vision — Marvel",
      "Ghosts and spirits across all mythologies",
    ],
    symbolicMeaning:
      "Intangibility represents the ability to be undisturbed by what would stop others — to pass through obstacles without resistance or impact. It symbolizes invulnerability through non-attachment.",
    psychologicalMetaphor:
      "The Taoist principle of Wu Wei — flowing through resistance rather than colliding with it. Emotional resilience that allows criticism and conflict to pass through without taking root.",
  },
  {
    name: "Invisibility",
    suffix: "kinesis",
    element: "Concealment",
    fictionalOrigins:
      "Invisibility appears in mythology as the gift of gods (Ring of Gyges, Hades' helm), in folk tales of cloaks and rings, and across science fiction and fantasy as one of the most universally desired abilities.",
    mediaReferences: [
      "Susan Storm — Fantastic Four",
      "Harry Potter (Invisibility Cloak)",
      "Predator — film series",
      "Claude — Fire Emblem",
      "Invisible Woman — Marvel",
    ],
    symbolicMeaning:
      "Invisibility represents the power of the unnoticed — the ability to observe without being seen, to move without drawing attention. It symbolizes strategic presence and selective visibility.",
    psychologicalMetaphor:
      "The discipline of observation without ego — the rare ability to listen, watch, and understand deeply without the need to be seen or validated.",
  },
  {
    name: "Psammokinesis",
    suffix: "kinesis",
    element: "Sand",
    fictionalOrigins:
      "Sand manipulation draws from desert mythology (Egyptian sand gods, desert spirits), and is most famously represented in anime and manga as a nuanced and devastating elemental ability.",
    mediaReferences: [
      "Gaara — Naruto",
      "Crocodile — One Piece",
      "Sandman — Marvel",
      "Sandy Marko — Spider-Man",
      "Desert entities in Arabian mythology",
    ],
    symbolicMeaning:
      "Sand represents both fragility and inevitability — individual grains are nothing, but together they form deserts that reshape civilizations. Psammokinesis symbolizes collective, patient overwhelming force.",
    psychologicalMetaphor:
      "The power of accumulation — small daily actions compounding over time into an unstoppable force. Patience as the most devastating power of all.",
  },
  {
    name: "Terrakinesis",
    suffix: "kinesis",
    element: "Terrain",
    fictionalOrigins:
      "Broad terrain manipulation — shifting landscapes, raising mountains, opening chasms — appears in creation myths worldwide and in the abilities of legendary titans and world-shapers in fiction.",
    mediaReferences: [
      "Toph Beifong (seismic sense) — Avatar",
      "Terra — Teen Titans",
      "Hashirama Senju — Naruto",
      "Atlas — Greek mythology",
      "World-shapers in epic fantasy",
    ],
    symbolicMeaning:
      "Terrain manipulation represents the power to literally reshape the landscape of reality — to alter the ground others stand on and create entirely new topographies of possibility.",
    psychologicalMetaphor:
      "The transformational leader who changes the entire playing field — someone whose presence shifts the fundamental conditions of any situation they enter.",
  },
  {
    name: "Nucleokinesis",
    suffix: "kinesis",
    element: "Nuclear",
    fictionalOrigins:
      "Nuclear and atomic manipulation draws from the atomic age, Cold War-era science fiction, and superhero narratives built around radiation and fission as both catastrophic threat and superhuman source.",
    mediaReferences: [
      "Captain Atom — DC",
      "Doctor Manhattan — Watchmen",
      "Firestorm — DC",
      "Radioactive Man — Marvel",
      "Nuclear-powered beings in hard SF",
    ],
    symbolicMeaning:
      "Nuclear power represents energy so concentrated it can either destroy or power civilization. Nucleokinesis symbolizes the responsibility of holding enormous power — and the wisdom required to wield it.",
    psychologicalMetaphor:
      "The awareness that you hold tremendous potential — and the maturity to direct it constructively rather than destructively. Power paired with profound responsibility.",
  },
  {
    name: "Typhokinesis",
    suffix: "kinesis",
    element: "Smoke",
    fictionalOrigins:
      "Smoke manipulation appears in stealth traditions, ninja mythology, and various fictional characters who use concealment and obscuration as their primary tool.",
    mediaReferences: [
      "Smoke — Mortal Kombat",
      "Various ninjas in fiction",
      "Zabuza Momochi — Naruto",
      "Smoke-based illusionists in fantasy",
      "Ghost Rider (smoke/exhaust imagery)",
    ],
    symbolicMeaning:
      "Smoke represents mystery, concealment, and the space between the seen and unseen. Typhokinesis symbolizes the power of ambiguity — the ability to remain unreadable and undefined.",
    psychologicalMetaphor:
      "Strategic mystery — the power of not revealing all your cards, maintaining intrigue, and operating effectively in the space between clarity and concealment.",
  },
  {
    name: "Aciukinesis",
    suffix: "kinesis",
    element: "Sharpness",
    fictionalOrigins:
      "The supernatural sharpening of edges, blades, and cutting force appears in samurai mythology, divine weapons of the gods (Durandal, Excalibur's edge), and anime featuring characters who refine cutting to an impossible art.",
    mediaReferences: [
      "Zoro — One Piece",
      "Sword-saints across samurai fiction",
      "Excalibur mythology",
      "Various blade-users in fantasy",
      "Blade sharpening rituals in Japanese swordsmanship",
    ],
    symbolicMeaning:
      "Sharpness represents precision, refinement, and the power to cut through what is unnecessary. Aciukinesis symbolizes the mastery of discernment — cutting to the truth.",
    psychologicalMetaphor:
      "Razor-sharp discernment, the ability to cut through confusion and noise to the essential truth, and the discipline of refining your mind until it is an instrument of absolute clarity.",
  },
  {
    name: "Litokinesis",
    suffix: "kinesis",
    element: "Stone",
    fictionalOrigins:
      "Stone manipulation draws from the legends of stonecutters blessed by earth deities, titans who could crumble mountains, and the ancient mythological image of a hero pulling a sword from stone as an act of sovereign will.",
    mediaReferences: [
      "Stoneman — various comics",
      "Rock Lee (earth affinity metaphor) — Naruto",
      "Tremor — Mortal Kombat",
      "Stone Golems across fantasy traditions",
      "Medusa's petrification — Greek mythology",
    ],
    symbolicMeaning:
      "Stone is permanence, endurance, and memory encoded in matter. Litokinesis symbolizes the ability to make things permanent — to lock intentions into the fabric of the physical world.",
    psychologicalMetaphor:
      "Unshakeable resolve and the power of follow-through. The ability to make a decision and hold it without wavering — carving your intentions in stone.",
  },
  {
    name: "Photosynthetikinesis",
    suffix: "kinesis",
    element: "Growth",
    fictionalOrigins:
      "The ability to accelerate and control biological growth through light and energy appears in science fiction as a hybridization of biokinesis and photokinesis, associated with nature spirits, druids, and cosmic gardeners.",
    mediaReferences: [
      "Poison Ivy — DC Comics",
      "Sage — various fantasy",
      "Nature spirits across mythology",
      "Green Lantern (life constructs)",
      "Chloromancer — game fiction",
    ],
    symbolicMeaning:
      "Growth represents potential moving toward its fullest expression. Photosynthetikinesis embodies the capacity to nourish, accelerate, and consciously direct the conditions for flourishing.",
    psychologicalMetaphor:
      "The power to cultivate growth in yourself and others — providing the right conditions, light, and nourishment for any dream or ability to develop rapidly.",
  },
  {
    name: "Kinetomimicry",
    suffix: "kinesis",
    element: "Mimicry",
    fictionalOrigins:
      "The ability to observe, absorb, and replicate any physical or energetic ability appears across superhero fiction, anime, and video game systems as one of the most coveted and narrative-rich powers — the ultimate adaptive ability.",
    mediaReferences: [
      "Kirby — Nintendo",
      "Rogue — X-Men",
      "Orochimaru — Naruto",
      "Absorbing Man — Marvel",
      "Sylar — Heroes (TV series)",
    ],
    symbolicMeaning:
      "Mimicry represents infinite adaptability and the dissolution of limits. Kinetomimicry embodies the principle that exposure to greatness contains within it the seed of becoming great.",
    psychologicalMetaphor:
      "Accelerated learning through deep observation — the ability to watch a master perform and internalize the underlying pattern instantly, transcending years of practice.",
  },
  {
    name: "Astrakinesis",
    suffix: "kinesis",
    element: "Astral",
    fictionalOrigins:
      "Control over the astral plane — the non-physical realm of consciousness, dreams, and disembodied travel — appears in occult tradition, shamanic journeying, and modern fiction as the most intimate intersection of mind and cosmos.",
    mediaReferences: [
      "Doctor Strange — Marvel",
      "Akira — anime",
      "The Matrix (Neo's awareness)",
      "Astral projection traditions",
      "Remote viewing programs (factual/fictional)",
    ],
    symbolicMeaning:
      "The astral plane represents all that exists beyond the physical — thought-forms, possibility fields, the realm where intention exists before manifestation. Astrakinesis symbolizes conscious navigation of the space between thought and reality.",
    psychologicalMetaphor:
      "Mastery of imagination as a creative force — the ability to build vivid internal worlds so compelling they inevitably shape external reality.",
  },
  {
    name: "Pyschometrokinesis",
    suffix: "kinesis",
    element: "Probability",
    fictionalOrigins:
      "Manipulation of probability and luck itself — bending fate, stacking chance, and controlling statistical outcomes — appears as one of the most philosophically interesting powers in superhero fiction, described as the ultimate meta-power that affects all others.",
    mediaReferences: [
      "Scarlet Witch — Marvel",
      "Domino — Marvel",
      "Jinx — DC",
      "Black Cat — Marvel",
      "Lucky characters across genre fiction",
    ],
    symbolicMeaning:
      "Probability represents the fabric of what is possible. Controlling it means reshaping the boundary between the likely and the unlikely — making the improbable inevitable.",
    psychologicalMetaphor:
      "Radical confidence and expectation management — the deeply held belief that circumstances arrange themselves in your favor, transforming how you perceive and respond to events.",
  },
  {
    name: "Chronoportation",
    suffix: "kinesis",
    element: "Temporal",
    fictionalOrigins:
      "Beyond merely slowing or speeding time, temporal transport — moving oneself or objects to different moments in time — represents the most narrative-rich application of time manipulation across science fiction, myth, and fantasy.",
    mediaReferences: [
      "TARDIS — Doctor Who",
      "Back to the Future",
      "Flash (time runs) — DC",
      "Hiro Nakamura — Heroes",
      "Homura Akemi — Madoka Magica",
    ],
    symbolicMeaning:
      "Temporal transport represents sovereignty over linear experience — the dissolution of the idea that you are permanently fixed to a single point in the unfolding of events.",
    psychologicalMetaphor:
      "The ability to mentally revisit and reframe past experiences with new understanding, or to project forward into future states with such clarity they become guiding blueprints.",
  },
  {
    name: "Lexikinesis",
    suffix: "kinesis",
    element: "Language",
    fictionalOrigins:
      "The manipulation of language, words, and written text as a form of reality alteration is one of the oldest magical frameworks — from Egyptian heka (spoken creation), to Kabbalistic letter mysticism, to modern chaos magic's obsession with glyphs and sigils.",
    mediaReferences: [
      "Grimmoire magic — various RPGs",
      "Wordmaster — various manga",
      "Rune magic across Norse tradition",
      "Kabbalistic letter magic (Sefer Yetzirah)",
      "Logos concept in Gnosticism",
    ],
    symbolicMeaning:
      "Language is the technology through which reality is structured and shared. Lexikinesis symbolizes the power of naming — the act of defining something creates the conditions for it to exist.",
    psychologicalMetaphor:
      "The mastery of affirmation, storytelling, and self-narration — understanding that the stories you tell yourself and others sculpt the reality both parties inhabit.",
  },
  {
    name: "Morphokinesis",
    suffix: "kinesis",
    element: "Form",
    fictionalOrigins:
      "Shape-shifting and form alteration beyond biology — the ability to reshape physical structure, appearance, and even substance — draws from mythological shapeshifters (Loki, Proteus, Anansi) and modern superhero shapeshifting traditions.",
    mediaReferences: [
      "Mystique — X-Men",
      "Metamorpho — DC",
      "Envy — Fullmetal Alchemist",
      "All For One (quirk alteration) — MHA",
      "Proteus — Greek mythology",
    ],
    symbolicMeaning:
      "Form is identity made visible. The ability to alter form represents mastery of identity itself — the refusal to be permanently defined by any single presentation.",
    psychologicalMetaphor:
      "Radical adaptability and identity fluidity — the capacity to occupy different social, professional, and internal roles with complete authenticity, never limited by a fixed self-concept.",
  },
  {
    name: "Hyalokinesis",
    suffix: "kinesis",
    element: "Glass",
    fictionalOrigins:
      "Control of glass and crystallized silica appears in comic book fiction, particularly associated with fragile-appearing yet devastatingly powerful characters. The juxtaposition of beauty and danger is central to glass manipulation mythology.",
    mediaReferences: [
      "Mister Glass — Unbreakable (M. Night Shyamalan)",
      "Crystal characters across comics",
      "Mirror magic in folklore",
      "Ice Queen archetypes (glass-adjacent)",
      "Glass sword — The Glass Sword series",
    ],
    symbolicMeaning:
      "Glass represents clarity, reflection, and hidden danger. Hyalokinesis embodies the paradox of something both beautiful and capable of cutting — extreme precision with a lethal edge.",
    psychologicalMetaphor:
      "Crystal clear mental clarity combined with the power to cut through illusion — the precision of thought that sees through deception and communicates truth with sharp, undeniable clarity.",
  },
  {
    name: "Audiognosia",
    suffix: "kinesis",
    element: "Resonance",
    fictionalOrigins:
      "The ability to hear, feel, and manipulate the resonant frequency of all things — organic and inorganic — draws from ancient cymatics traditions, musical mysticism, the Hindu concept of Nada Brahma (the universe as sound), and science fiction's use of sonic weaponry.",
    mediaReferences: [
      "Daredevil's echolocation — Marvel",
      "Banshee — X-Men",
      "Black Canary — DC",
      "Echo — Marvel",
      "Nada Brahma traditions",
    ],
    symbolicMeaning:
      "Everything vibrates at a fundamental resonant frequency. Audiognosia represents the ability to hear the true nature of things below surface appearance and to alter reality by shifting the frequency at which something resonates.",
    psychologicalMetaphor:
      "Deep listening and empathic resonance — the ability to sense the underlying emotional frequency of any person or situation and respond in a way that transforms it.",
  },
  {
    name: "Omnikinesis",
    suffix: "kinesis",
    element: "All",
    fictionalOrigins:
      "The theoretical apex of all kinetic abilities — control over all forms of matter, energy, and force simultaneously — appears as the pinnacle power state in superhero fiction, typically reserved for cosmic-level beings or characters at their absolute maximum.",
    mediaReferences: [
      "Cosmic-level Superman — DC",
      "One Above All — Marvel",
      "Kami Tenchi — Tenchi Muyo",
      "Presence — DC Vertigo",
      "Chuck (God) — Supernatural",
    ],
    symbolicMeaning:
      "Omnikinesis represents the ultimate integration — the dissolution of all separation between self and the forces of existence. It symbolizes complete unity with the creative principle of the universe.",
    psychologicalMetaphor:
      "Radical wholeness and integration — accessing all of your capacities simultaneously, with no internal resistance or compartmentalization. The state of full self-actualization.",
  },
  {
    name: "Heliokinesis (Solar Flare Variant)",
    suffix: "kinesis",
    element: "Solar Plasma",
    fictionalOrigins:
      "Beyond simple light or heat control, the direct manipulation of solar plasma, flares, and star-matter represents a power associated with god-tier beings — wielders who draw from the star itself rather than merely its light.",
    mediaReferences: [
      "Solar — DC",
      "Captain Atom (solar absorption) — DC",
      "Photon / Monica Rambeau — Marvel",
      "Sun Wukong's solar endurance",
      "Ra's solar chariot — Egyptian mythology",
    ],
    symbolicMeaning:
      "Solar plasma is the most primary expression of energy in our system — the source from which all light, warmth, and life flow. Its control represents access to the original creative force.",
    psychologicalMetaphor:
      "Radiant leadership and the power to energize others simply through presence — the rare quality of individuals who light up rooms and catalyze growth in everyone around them.",
  },
  {
    name: "Caelestikinesis",
    suffix: "kinesis",
    element: "Celestial",
    fictionalOrigins:
      "The manipulation of celestial bodies — stars, planets, moons, and their movements — is the ultimate astronomical superpower, appearing in cosmic comic fiction and the divine powers of sky gods across mythology.",
    mediaReferences: [
      "Luna — various mythologies",
      "Sailor Moon characters",
      "Star-Lord (Celestial lineage) — Marvel",
      "Cosmic entity characters across DC/Marvel",
      "Astral deities across polytheism",
    ],
    symbolicMeaning:
      "Celestial manipulation represents the alignment of personal will with cosmic cycles — the ability to move in harmony with forces incomprehensibly larger than any individual.",
    psychologicalMetaphor:
      "Long-range vision and patience that operates on cosmic timescales — the ability to plan and act with such scope that immediate setbacks become irrelevant to the eventual trajectory.",
  },
  {
    name: "Venokinesis",
    suffix: "kinesis",
    element: "Venom",
    fictionalOrigins:
      "Control over toxins, venoms, poisons, and chemical compounds appears in villain and anti-hero archetypes, drawing from the mythology of serpent deities, poison gods, and the alchemical tradition's dark side of transmutation.",
    mediaReferences: [
      "Venom — Marvel",
      "Poison Ivy (toxin variant) — DC",
      "Medusa (petrifying venom) — mythology",
      "Scorpion — Mortal Kombat",
      "Sasori (poison master) — Naruto",
    ],
    symbolicMeaning:
      "Venom represents the transformative power of dangerous substances — the same compound that poisons can also heal in different concentrations. It symbolizes the alchemical truth that shadow contains medicine.",
    psychologicalMetaphor:
      "The ability to metabolize difficulty — to take in challenging experiences, shadow material, or toxic environments and process them into fuel, wisdom, and protection.",
  },
  {
    name: "Tempestokinesis",
    suffix: "kinesis",
    element: "Storm",
    fictionalOrigins:
      "The specific control of storm systems — thunder, lightning, wind, rain, and pressure all unified — is distinct from Atmokinesis in that it focuses on the combined fury of the tempest rather than individual atmospheric elements. It appears in the mythology of storm deities worldwide.",
    mediaReferences: [
      "Storm — X-Men",
      "Thor — Marvel",
      "Zeus — Greek mythology",
      "Raijin — Japanese mythology",
      "Indra — Hindu mythology",
    ],
    symbolicMeaning:
      "The storm is transformation at its most dramatic — the clearing of old atmospheric conditions to make way for renewed air. Tempestokinesis represents the power to bring necessary, powerful change.",
    psychologicalMetaphor:
      "The capacity to hold space for intense emotional or situational storms — to be the eye of chaos, fully present and unshaken while transformation happens all around you.",
  },
  {
    name: "Neokinesis",
    suffix: "kinesis",
    element: "Energy",
    fictionalOrigins:
      "Neokinesis represents control over new and emerging matter — the ability to shape nascent possibilities and ideas before they crystallize into fixed form. It appears in theories of quantum consciousness and creative-field manipulation.",
    mediaReferences: [
      "Reality Warpers — various comics",
      "Creation deities — mythology",
    ],
    symbolicMeaning:
      "To control what is new is to stand at the edge of creation itself. Neokinesis is the power of pure potential — nothing yet decided, everything still possible.",
    psychologicalMetaphor:
      "The capacity to engage with novel situations without forcing them into familiar patterns — to remain in creative openness rather than defaulting to old reactions.",
  },
  {
    name: "Myokinesis",
    suffix: "kinesis",
    element: "Bio",
    fictionalOrigins:
      "Myokinesis is the psychic control of muscle tissue — the ability to enhance, direct, or manipulate muscular function in oneself or others. It connects to stories of superhuman physical feats, berserker legends, and martial arts energy cultivation.",
    mediaReferences: [
      "Captain America — Marvel",
      "Might Guy — Naruto",
      "Berserkers — Norse mythology",
    ],
    symbolicMeaning:
      "Muscle is will made physical. Myokinesis represents the mastery of effort itself — the alignment of intention with the body's raw capacity for action and endurance.",
    psychologicalMetaphor:
      "The ability to override physical limitations through sheer focused intention — the mind's sovereignty over the body's perceived constraints.",
  },
  {
    name: "Seismokinesis",
    suffix: "kinesis",
    element: "Earth",
    fictionalOrigins:
      "Control of seismic energy and earthquakes — the ability to generate, direct, or absorb the primal shaking force of tectonic movement. It appears in earth-shaker mythologies and geological-superpower characters.",
    mediaReferences: [
      "Toph — Avatar: The Last Airbender",
      "Terra — DC Comics",
      "Geb — Egyptian mythology",
      "Poseidon (Earth-Shaker) — Greek mythology",
    ],
    symbolicMeaning:
      "Earthquakes are the earth's way of releasing accumulated tension and reshaping itself. Seismokinesis represents the power of fundamental structural change — the ability to shake things to their core.",
    psychologicalMetaphor:
      "The willingness to allow deep structural changes in your life and psychology — to let old foundations crack so that more stable ground can emerge.",
  },
  {
    name: "Vitakinesis",
    suffix: "kinesis",
    element: "Life",
    fictionalOrigins:
      "Vitakinesis is the control of life force and vitality — healing, regeneration, and the direct manipulation of the vital energy that distinguishes living from non-living matter. It is distinct from biokinesis in its focus on vitality and restoration rather than biological structure.",
    mediaReferences: [
      "Tsunade — Naruto",
      "The White Witch — Chronicles of Narnia",
      "Isis — Egyptian mythology",
    ],
    symbolicMeaning:
      "Life force is the animating spark — that which makes matter alive rather than merely material. To control vitality is to work with the most fundamental power in nature.",
    psychologicalMetaphor:
      "The capacity to direct and amplify your own energy reserves — to choose consciously where your life force flows rather than allowing it to drain through unconscious patterns.",
  },
  {
    name: "Psyllokinesis",
    suffix: "kinesis",
    element: "Psi",
    fictionalOrigins:
      "The transmission of thoughts and intentions across distance without physical medium — advanced telepathic projection that can imprint ideas, feelings, or commands into another mind without direct communication. It goes beyond reading to active thought-sending.",
    mediaReferences: [
      "Professor X — X-Men",
      "The Caster — Beautiful Creatures",
      "Mentalists — various fiction",
    ],
    symbolicMeaning:
      "Thought transmission represents the ultimate recognition that minds are not isolated islands — consciousness is a field, and intention travels through it. To send thought deliberately is to work with reality's mental substrate.",
    psychologicalMetaphor:
      "The impact of focused, clear intention on others — the way a truly aligned person changes the mental atmosphere of a room simply by being in it.",
  },
  {
    name: "Spectrokinesis",
    suffix: "kinesis",
    element: "Light",
    fictionalOrigins:
      "Manipulation of the full light spectrum — bending, splitting, and generating specific wavelengths of visible and invisible light. It includes control of infrared, ultraviolet, and all colors of visible light, enabling invisibility, laser-like beams, and dazzling light effects.",
    mediaReferences: [
      "Prism — various comics",
      "Rainbow Raider — DC",
      "Light users — various anime",
    ],
    symbolicMeaning:
      "Light contains all colors within its apparent unity — to split light is to reveal the hidden spectrum within apparent simplicity. Spectrokinesis is the power of revealing what lies within the whole.",
    psychologicalMetaphor:
      "The ability to perceive the full spectrum of possibility within any situation — to see the full range of options rather than just the obvious path forward.",
  },
  {
    name: "Keratinokinesis",
    suffix: "kinesis",
    element: "Bio",
    fictionalOrigins:
      "Control of keratin — the protein that forms skin, hair, nails, horns, and feathers. Keratinokinesis enables manipulation of these structures for defense, expression, or transformation. It appears in characters who can grow armor-like skin or weaponized nails and hair.",
    mediaReferences: [
      "Wolverine (claws related) — Marvel",
      "Medusa — Inhumans",
      "Various transformation characters",
    ],
    symbolicMeaning:
      "Keratin is the body's outer expression — the interface between inner vitality and outer world. To control it is to master the boundary between self and environment.",
    psychologicalMetaphor:
      "The conscious management of your outer presentation — understanding that how you present yourself to the world is a form of self-expression and protection.",
  },
  {
    name: "Metallokinesis",
    suffix: "kinesis",
    element: "Metal",
    fictionalOrigins:
      "The psychic control of metals and metallic compounds — attracting, repelling, reshaping, and transmuting metallic matter. It connects to alchemy, the mastery of iron and steel in magical traditions, and the control of conductive substances.",
    mediaReferences: [
      "Magneto — X-Men (magnetic metals)",
      "Metal Benders — Avatar",
      "Colossus — X-Men",
    ],
    symbolicMeaning:
      "Metal represents permanence, endurance, and forged strength. In Chinese philosophy, Metal is the element of precision, cutting clarity, and refined judgment. To control metal is to master the hardest, most enduring aspects of physical reality.",
    psychologicalMetaphor:
      "The ability to hold firm in values and decisions — the refined capacity to cut through confusion to the essential truth, and to endure pressure without bending.",
  },
  {
    name: "Chromokinesis",
    suffix: "kinesis",
    element: "Light",
    fictionalOrigins:
      "The direct manipulation of color in objects and environments — changing hues, saturating or bleaching, and projecting colors without light sources. Chromokinesis goes beyond spectrokinesis in targeting the color property of matter itself rather than light waves.",
    mediaReferences: [
      "Color manipulation characters — various comics",
      "Chroma — original concept",
      "Color-magic traditions — folklore",
    ],
    symbolicMeaning:
      "Color carries meaning across every culture and psychological system. To control color is to control the emotional and symbolic field of any environment — shaping how reality is perceived and felt.",
    psychologicalMetaphor:
      "The awareness of how you color your perception of reality — the ability to shift the emotional tone through which you interpret events.",
  },
  {
    name: "Sonokinesis",
    suffix: "kinesis",
    element: "Sound",
    fictionalOrigins:
      "Precise manipulation of sound waves and frequencies — beyond simple sound generation to the fine control of resonance, harmonics, and frequency as a tool for healing, destruction, communication, and reality-shaping. It connects to cymatics, sacred sound traditions, and acoustic physics.",
    mediaReferences: [
      "Black Canary — DC Comics",
      "Banshee — Marvel",
      "Diva Plavalaguna — The Fifth Element",
      "Mantis — Guardians of the Galaxy",
    ],
    symbolicMeaning:
      "Sound is vibration made audible — and all matter vibrates at specific frequencies. To master sonokinesis is to work with reality at its most fundamental resonant level, recognizing that form follows frequency.",
    psychologicalMetaphor:
      "The ability to tune your inner state to frequencies that are coherent and powerful — to use voice, breath, and sound intentionally as tools for inner and outer transformation.",
  },
];
