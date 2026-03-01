# Synapse Studio — Subliminal AI

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add

**Affirmation Engine**
- Input: topic/intent, mode flags (Booster, Fantasy-to-Reality, Protection), chakra alignment selection
- Output: list of affirmations (one per line, no numbering, no commentary)
- Booster mode: layered stacking, stronger identity phrasing, enhanced repetition density
- Fantasy-to-Reality mode: translates fictional powers into actual abilities or manifestations (e.g. telekinesis → mental discipline, focus, intention control).
- Protection mode: adds grounding/resilience affirmations, no fear-based language

**Subliminal Project Builder**
- Structured JSON output including: affirmations, booster settings, fantasy-to-reality mapping, protection mode flag, chakra alignment, voice config, audio config, visual config, render config
- TTS module config (voice type, speed, pitch, repetition count)
- Audio layering config (background music type, subliminal frequency layer, volume ratios, waveform overlay toggle)
- Image background config (theme/style descriptor)
- Render config (resolution, duration, frame rate)

**Booster Function**
- Layered affirmation stacking
- Faster micro-repetition cycle settings
- Stronger identity phrasing toggle
- Increased enhancer usage
- Optional whisper overlay duplication flag
- Subtle stereo movement toggle

**Fantasy-to-Reality Function**
- Input: fictional character, show/universe, or ability name
- Output: symbolic psychological mapping of that concept
- Internal mapping table for kinesis types and popular power archetypes

**Protection Function**
- Adds grounding affirmations to any generated set
- Themes: mental clarity, emotional boundaries, energy grounding, self-trust, calm authority
- Pre-set affirmations included: "My presence is grounded", "It is safe for me to exist fully", "My energy remains steady in all environments"

**Energy & Consciousness Library Page**
- Separate informational page, not part of the generator
- Chakra section: Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, Crown — each with overview, psychological interpretation, emotional themes, balanced-state traits, associated affirmations
- Energy & Belief Systems section: Manifestation philosophy, Subconscious programming, Archetypes, Meditation frameworks, Psychological visualization, Cognitive reinforcement
- All content framed as symbolic/philosophical, no medical or mystical guarantees

**Kinesis Archive Page**
- Encyclopedia-style informational page
- Entries: Telekinesis, Pyrokinesis, Electrokinesis, Chronokinesis, Aerokinesis, Hydrokinesis, Geokinesis, Biokinesis, Technokinesis, Cryokinesis, Photokinesis, Umbrakinesis, and more
- Each entry: fictional/mythological origins, media references, symbolic meaning, psychological metaphor
- Clearly positioned as fictional/mythological constructs, no literal claims

**Navigation**
- Main nav: Subliminal Generator | Energy Library | Kinesis Archive

### Modify
None (new project).

### Remove
None (new project).

## Implementation Plan

**Backend (Motoko)**
1. `AffirmationEngine` actor: generateAffirmations(topic, mode, chakra) → [Text]
2. `ProjectBuilder` actor: buildProject(config) → JSON Text (structured output)
3. Store: saved projects list (title, config, output JSON), CRUD
4. BoosterConfig, FantasyMapping, ProtectionConfig types
5. ChakraType variant, KinesisEntry type for library data
6. Pre-seeded chakra data and kinesis archive entries

**Frontend**
1. App shell with 3-tab nav: Generator, Energy Library, Kinesis Archive
2. Generator page: intent input, mode toggles (Booster / Fantasy-to-Reality / Protection), chakra selector, generate button, affirmation output display, JSON export panel
3. Fantasy-to-Reality sub-panel: character/ability input → symbolic mapping display
4. Energy Library page: chakra cards grid, belief systems accordion
5. Kinesis Archive page: searchable card grid with modal detail view
6. JSON output viewer with copy-to-clipboard
