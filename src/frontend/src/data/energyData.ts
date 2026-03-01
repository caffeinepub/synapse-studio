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
];
