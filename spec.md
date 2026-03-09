# Synapse Studio

## Current State
The Subliminal Generator (GeneratorPage.tsx) has Step 1 with modes (Fantasy, Protection, Chakra Alignment, Booster), advanced functions, wealth presets, adult themes, and fantasy sub-panels (Character, Item, Symbiotic manifestation). Affirmation generation passes all these parameters into the affirmation engine (rule-based + AI).

There is currently NO way to dedicate a subliminal to another person or multiple persons. The generator is always self-focused ("I am", "my"). There is also no multi-subliminal stack — you can only work on one topic at a time.

## Requested Changes (Diff)

### Add
- **Personal Subliminal Function** — a new collapsible panel in Step 1 (below the mode toggles, above Advanced Functions). When enabled:
  - A list of "person entries", each with:
    - Name field (text input)
    - Relationship field (text input, e.g. "best friend", "sister", "partner", "client")
  - An "Add Another Person" button to add more entries (up to ~10)
  - A remove button per entry
  - When active, affirmation language shifts from self ("I am") to the dedicated person ("Sarah is", "My sister is", "[Name] has", etc.) or uses a "for [Name]" wrapper
  - Works with all existing modes: Fantasy-to-Reality (character/item/symbiotic), Financial/Wealth presets, Protection, Booster, etc.
  - Multiple people: affirmations are generated for/about all listed persons (either interleaved or grouped)
- **Multi-Subliminal Stack** — a new collapsible panel in Step 1 that lets the creator select more than one subliminal topic/preset at once. Each selected topic is added to a stack list. When generating, all stacked topics are combined into one affirmation batch. Includes:
  - A search/add field to add any custom topic to the stack
  - Quick-add buttons for common presets (wealth, confidence, healing, etc.)
  - A list showing all stacked topics with a remove button per item
  - Total affirmation count distributed across topics

### Modify
- `affirmationUtils.ts` — add support for `personalTargets` (array of {name, relationship}) and `stackedTopics` (array of strings) parameters. When personalTargets exist, affirmation starters include the person's name/relationship. When stackedTopics exist, generate across all topics.
- `aiGenerate.ts` — pass personalTargets and stackedTopics into the AI prompt so AI-powered generation also respects these settings.
- `handleGenerate` in GeneratorPage — pass new params to both rule-based and AI generators.
- `handleBuild` — include `personal_targets` and `stacked_topics` in the JSON payload.

### Remove
- Nothing removed.

## Implementation Plan
1. Add state for `personalTargets` (array of {id, name, relationship}) and `stackedTopics` (array of strings) in GeneratorPage
2. Build the Personal Subliminal Panel UI component inline in GeneratorPage — collapsible with add/remove person rows
3. Build the Multi-Subliminal Stack UI panel — collapsible with search/add field and quick presets
4. Update `affirmationUtils.ts` to accept and use `personalTargets` and `stackedTopics`
5. Update `aiGenerate.ts` AI prompt to incorporate personalTargets and stackedTopics
6. Wire new state into `handleGenerate` and `handleBuild`
