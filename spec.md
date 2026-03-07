# Synapse Studio

## Current State
A full-stack subliminal AI creation platform with: Studio generator, Energy Library, Kinesis Archive, Wiki Search, Chat Bots, Learning Bots, Religions, Entities, Spells, Sigils, Rituals, Healing Methods, Settings, YouTube page, and Video Editor. The app has an AI config system (Groq/Gemini/rule-based) stored in localStorage. The backend supports bot/memory management via `createBot`, `addMemory`, `getRelevantMemories`, etc.

## Requested Changes (Diff)

### Add
- **Synapses AI Assistant page** (`SynapsesAIPage.tsx`) — a dedicated, fully-featured AI assistant for Synapse Studio
  - Personalized assistant named "Synapses" with a distinct identity (not a generic chatbot)
  - Full-width chat interface with animated message bubbles, timestamps, copy-to-clipboard
  - Context-aware: knows about the user's current subliminal (topic, modes, affirmations), wiki search results, and all app pages
  - Quick action chips: "Help me create a subliminal", "Explain Booster mode", "Find a character", "Generate affirmations", "What frequencies do I need?", "Explain chakra alignment"
  - Synapses-branded system prompt that describes all available features in Synapse Studio
  - Uses the user's configured AI provider (Groq/Gemini) via the same `getAIConfig()` pattern as the rest of the app, with a fallback rule-based engine
  - Typing indicator (animated dots) while waiting for response
  - Suggested follow-up chips after each AI response
  - "Use in Generator" button on responses that contain affirmations or topic suggestions
  - Session memory: conversation stored in localStorage per session
  - Clear chat button
  - Visual identity: deep violet/indigo gradient, "SYNAPSES" branding with neural network icon pulse animation

- **Nav entry**: "Synapses AI" with a Bot/Cpu icon added to NavBar and App.tsx routing

### Modify
- `NavBar.tsx` — add "synapses" page item with `Bot` icon from lucide-react
- `App.tsx` — add `"synapses"` to the Page union type and render `<SynapsesAIPage>` with `subliminalCtx` and `onUseForSubliminal` props

### Remove
- Nothing removed

## Implementation Plan
1. Write `SynapsesAIPage.tsx` with:
   - Full chat UI with message history, typing indicator, quick action chips, copy buttons
   - Context-aware system prompt that includes the user's current subliminal state
   - AI API integration (Groq/Gemini fallback) using the same `getAIConfig()` helper pattern
   - Rule-based Synapses-branded fallback responses when no API key is set
   - Suggested follow-up responses after each AI message
   - `onUseForSubliminal` integration for sending topics to the generator
   - localStorage-based session chat history
2. Update `NavBar.tsx` to add "Synapses AI" nav item
3. Update `App.tsx` to add the page type and route
