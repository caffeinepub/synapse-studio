# Synapse Studio

## Current State
The Protection panel has a rich UI (14 protection types, strength, entity, sacred geometry, auric layers, duration, boost toggle) but none of these sub-panel values are passed to the affirmation engine. The `generateAffirmations` function only receives `protectionEnabled: boolean` and generates 8 generic lines. The PersonalSubliminal, MultiStack, Advanced Functions, Wiki, and reference library pages have solid content but can be expanded further.

## Requested Changes (Diff)

### Add
- Protection sub-panel params to `generateAffirmations` signature: `protectionConfig?: ProtectionConfig` object containing types[], strength, entity, geometry[], duration, boost
- Per-type affirmation generation logic: each selected protection type (Energetic Shield, Auric Seal, Psychic Protection, Cord Cutting, etc.) gets 2-3 unique lines
- Strength modifier: Minimal/Moderate/Strong/Absolute/Divine multiplies intensity language
- Entity invocation line when protectionEntity is set
- Sacred geometry lines when geometry chips are selected
- Duration language woven into lines (Permanent / Until Released / Renewable)
- More content to Personal Subliminal panel: 3 additional affirmation style options, 3 new advanced toggles (Soul Retrieval, DNA Reprogramming, Inner Child Protection)
- More items to Wiki Search page: additional fandom wikis across anime/gaming
- More items to Spells, Kinesis, Sigils, Healing Methods pages

### Modify
- `affirmationUtils.ts`: extend `generateAffirmations` to accept and use `ProtectionConfig`
- `GeneratorPage.tsx`: pass protection sub-panel state to both local and AI affirmation calls
- `aiGenerate.ts`: include protection config in AI prompt

### Remove
- Nothing removed

## Implementation Plan
1. Define `ProtectionConfig` interface in `affirmationUtils.ts`
2. Add per-type protection affirmation maps (14 types × 3 lines each)
3. Extend `generateAffirmations` to accept `protectionConfig` as last param and generate enriched protection lines
4. Update both call sites in `GeneratorPage.tsx` to pass protection state
5. Update `aiGenerate.ts` prompt builder to include protection config context
6. Add Soul Retrieval, DNA Reprogramming, Inner Child Protection toggles to Personal Subliminal panel in GeneratorPage
7. Expand Spells page with 8 more entries, Kinesis with 10 more types, Healing Methods with 5 more, Sigils with 5 more
8. Add 15+ more fandom wikis to WikiSearchPage
