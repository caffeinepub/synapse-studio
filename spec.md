# Synapse Studio

## Current State
Version 44 production app with: Generator (advanced functions: deity, spell, soul contract, shadow work, reality scripting, frequency attunement, sigil activation), Kinesis Archive (51 entries), Sigil Codex, Spiritual Entities (94 entries), Spells, Healing Methods, Religions, Wiki Search, Video Editor, YouTube Page, Journal, Vault.

Kinesis types are NOT yet selectable in the Generator — they only exist as a reference page.
Connection links between kinesis ↔ sigils/spells/entities are pending.

## Requested Changes (Diff)

### Add
- **Kinesis Power Integration** in Generator Advanced Functions: a new toggleable panel that lets users pick a kinesis type from the full archive to weave into affirmations (e.g. "Pyrokinesis" -> "I am a conduit of fire... my pyrokinetic power flows naturally")
- **Cross-connection links** on KinesisArchivePage: show related entities and sigils as clickable chips inside each expanded entry
- **More content** across all reference pages:
  - 10 more kinesis types (e.g. Vitakinesis, Metallokinesis, Photokinesis, Sonokinesis, Nanokinesis, Biokinesis, Plasmakinesis, Magnetokinesis, Chronokinesis, Spatiokinesis)
  - 8 more sigils with connected entities/spells
  - 10 more spiritual entities (gods, demons, angels, nature spirits)
  - 5 more healing methods
  - More wealth/manifestation affirmation presets in Generator

### Modify
- KinesisArchivePage: add entity/sigil connection chips inside each entry card
- GeneratorPage: add Kinesis Integration panel inside Advanced Functions section, with a kinesis type selector (searchable dropdown or pill grid) and toggle
- Affirmation engine: when kinesis is selected, weave kinesis-specific vocabulary into affirmation lines

### Remove
- Nothing removed

## Implementation Plan
1. Add 10 new kinesis entries to KinesisArchivePage with connection metadata
2. Add 8 new sigils to SigilsPage with connected entity/spell arrays
3. Add 10 new spiritual entities to SpiritualEntitiesPage
4. Add 5 new healing methods to HealingMethodsPage
5. Add kinesis connection chips (entities/sigils) to KinesisArchivePage expanded view
6. Add Kinesis Integration panel to GeneratorPage Advanced Functions section (state: kinesisEnabled, selectedKinesis)
7. Update affirmation generation logic to weave selected kinesis type into output lines
8. Add 6 more wealth/manifestation preset buttons in the GeneratorPage wealth presets area
