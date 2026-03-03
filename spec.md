# Synapse Studio

## Current State
The app has pages: Generator, Energy Library, Kinesis Archive, Wiki Search, Religions, Entities, Spells, Rituals, Settings, YouTube, Video Editor. Nav is responsive with a hamburger drawer on mobile.

## Requested Changes (Diff)

### Add
- New **Healing Methods** page (`HealingMethodsPage.tsx`) covering:
  - Inner Child Healing (what it is, process, themes, affirmations)
  - Divine Feminine (archetypes, healing themes, affirmations)
  - Divine Masculine (archetypes, healing themes, affirmations)
  - Chakra Healing (overview linking all 7 chakras to healing practices)
  - Reiki Healing (history, principles, levels/degrees, hand positions)
  - Shadow Work (Jungian concept, process, integration)
  - Sound Healing (frequencies, singing bowls, binaural beats, solfeggio)
  - Breathwork (pranayama, holotropic, box breathing, Wim Hof)
  - Somatic Healing (body-centered, trauma release, somatic exercises)
  - Ancestral Healing (lineage clearing, collective trauma, rituals)
  - Crystal Healing (chakra-stone mapping, common stones, uses)
  - Akashic Records (what they are, how to access, healing via records)
  - Each entry: title, category badge, description, key themes, associated affirmations, and a "Use in Generator" button
- New nav item "Healing" with a Heart icon
- `"healing"` added to the Page type in App.tsx and NavBar.tsx

### Modify
- App.tsx: add `healing` to Page type, import HealingMethodsPage, render it
- NavBar.tsx: add `healing` nav item with Heart icon

### Remove
- Nothing removed

## Implementation Plan
1. Create `HealingMethodsPage.tsx` with all healing modalities as expandable cards
2. Add `onUseForSubliminal` prop to pass healing topics to generator
3. Update App.tsx: Page type, import, route render
4. Update NavBar.tsx: Page type, navItems entry
