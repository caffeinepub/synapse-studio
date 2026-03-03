# Synapse Studio

## Current State
- Generator has a single Booster mode toggle (on/off)
- Fantasy-to-Reality has sub-panels: Character Manifestation, Item Manifestation, Symbiotic Bond
- No "where" (location) or "when" (time frame) fields for manifestation
- Wealth/abundance is just a free-text topic input — no dedicated wealth presets
- Booster mode is binary (enabled or not)

## Requested Changes (Diff)

### Add
- **Booster Intensity Levels**: Replace the Booster binary toggle with a 5-tier intensity selector:
  - Minimal — gentle reinforcement, soft language
  - Standard (default) — current behavior
  - Custom — user-defined intensity phrase/prefix
  - Extremely Powerful — maximum identity-level, absolute language
  - Evolving — auto-escalates intensity across the affirmation set (starts soft → ends extremely powerful within the batch)
- **Manifestation Location field**: Inside all three Fantasy-to-Reality sub-panels (Character, Item, Symbiotic Bond), add an optional "Where will this manifest?" text input (e.g. "in my bedroom", "at my front door", "in my life generally"). Affirmations must reference this location.
- **Manifestation Time Frame field**: Inside all three Fantasy-to-Reality sub-panels, add an optional "When?" selector with presets: Now / Today / Within 3 Days / This Week / This Month / Custom (free text). Affirmations must include the time frame.
- **Wealth Subliminal Presets**: In Step 1, below the topic textarea, add a collapsible "Wealth Presets" quick-fill section with at least 12 distinct wealth/abundance sub-topics the user can tap to auto-fill the topic field:
  - Financial abundance
  - Passive income streams
  - Business success and growth
  - Debt-free living
  - Millionaire mindset
  - Luxury lifestyle manifestation
  - Career promotion and salary increase
  - Investment and wealth multiplication
  - Generational wealth
  - Unexpected money flowing to me
  - Abundance in all areas of life
  - Money comes to me easily and frequently

### Modify
- **Booster in affirmationUtils.ts**: Update `generateAffirmations` to accept a `boosterLevel: "minimal" | "standard" | "custom" | "extremely_powerful" | "evolving"` parameter and `boosterCustomPhrase?: string`. Each level changes the intensity of language in the base + booster affirmations.
- **Booster in aiGenerate.ts**: Update the AI system prompt to reflect the active booster level, not just on/off.
- **Fantasy sub-panels**: Each panel (Character, Item, Symbiotic) gets two new optional fields: `location` and `timeFrame`. These feed into both the rule-based engine and the AI prompt.
- **GeneratorPage.tsx**: Replace `modes.booster` boolean with `boosterLevel` string state + `boosterCustomPhrase` state. Update the Booster mode card to show the 5-tier selector when active. Pass new params to generate functions.
- **Build JSON**: Include `booster_level`, `booster_custom_phrase`, and `manifestation` (location + time_frame) in the payload.

### Remove
- Nothing removed

## Implementation Plan
1. Update `affirmationUtils.ts`:
   - Add `boosterLevel` and `boosterCustomPhrase` params
   - Add `location` and `timeFrame` params for character/item/symbiotic
   - Implement per-level language logic (minimal: soft, standard: current, custom: phrase-prefixed, extremely_powerful: absolute max language, evolving: gradient across the batch)
   - Weave location + time frame into fantasy affirmation lines

2. Update `aiGenerate.ts`:
   - Add booster level to system prompt instructions per tier
   - Add location + time frame to character/item/symbiotic instructions

3. Update `GeneratorPage.tsx`:
   - Replace booster boolean with `boosterLevel` state (default "standard")
   - Add `boosterCustomPhrase` state
   - Update Booster mode card: when active, show 5-tier pill selector + optional custom phrase input
   - Add `location` + `timeFrame` states for each of the 3 fantasy sub-panels (6 new fields total)
   - Add time frame presets: Now, Today, Within 3 Days, This Week, This Month, Custom
   - Add Wealth Presets collapsible section below topic textarea with 12 quick-fill chips
   - Pass all new params to `generateAffirmations` and `generateAffirmationsWithAI`
   - Update handleBuild JSON payload to include new fields
