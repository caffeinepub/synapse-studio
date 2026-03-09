# Synapse Studio

## Current State
The generator (GeneratorPage.tsx + affirmationUtils.ts) supports topic-based affirmation generation with Booster, Fantasy-to-Reality, Protection, and Chakra Alignment modes. Advanced functions include Deity Invocation, Spell Weaving, Soul Contract, Shadow Work, Reality Scripting, Frequency Attunement, and Sigil Activation. Wealth presets exist as a quick-fill button. There is no dedicated adult/mature themes category.

## Requested Changes (Diff)

### Add
- **Adult Themes panel** in Step 1 of GeneratorPage, positioned after Advanced Functions accordion
- Four theme categories with quick-select preset chips:
  1. **Confidence & Attractiveness** — Charisma, Magnetic Presence, Dating Success, Irresistible Aura, Social Dominance, Alpha Energy, Physical Attraction, Seductive Confidence
  2. **Wealth & Ambition** — Financial Dominance, Millionaire Identity, Power & Influence, Empire Building, Executive Presence, Fearless Ambition, Passive Income Mastery, Generational Wealth
  3. **Sensuality & Self-Image** — Body Confidence, Divine Feminine Energy, Divine Masculine Energy, Magnetic Allure, Inner Beauty Radiance, Sensual Presence, Physical Magnetism, Sacred Sexuality
  4. **Mature Spiritual Themes** — Shadow Alchemy, Dark Archetype Mastery, Void Work, Taboo Mythology, Death & Rebirth, The Underworld Path, Trickster Energy, Liminal Power
- Each chip click fills the topic field and optionally pre-selects the most relevant mode
- A distinctive visual style (deep red/rose accent) to differentiate from standard presets
- Affirmation engine additions in affirmationUtils.ts: new vocabulary set for mature/adult themes that produces richer, more direct, identity-level language for sensuality, ambition, dominance, and dark spirituality — woven into base generation when topic matches these themes

### Modify
- GeneratorPage.tsx: add an "Adult Themes" collapsible panel below the Advanced Functions section in Step 1
- affirmationUtils.ts: add a `MATURE_ENHANCERS` vocabulary set and `buildMatureAffirmation` helper used when the topic matches adult theme keywords, producing more direct and bold language

### Remove
- Nothing removed

## Implementation Plan
1. In affirmationUtils.ts, add MATURE_ENHANCERS and MATURE_STARTERS arrays with vocabulary appropriate for confident, bold, mature language (dominance, allure, power, shadow work)
2. Add a `detectMatureTheme()` helper that returns true when topic contains keywords from the adult theme categories
3. Modify `generateAffirmations()` to use mature vocabulary set when topic matches
4. In GeneratorPage.tsx, add an `adultThemesOpen` state and an Adult Themes collapsible panel with four category sections
5. Each preset chip sets the topic input and scrolls to the generator
6. Style with rose/crimson accent to distinguish from standard wealth presets
