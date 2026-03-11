import type {
  AdvancedFunctions,
  BoosterLevel,
  PersonalTarget,
} from "./affirmationUtils";

export interface AISettings {
  provider: "groq" | "gemini" | "none";
  model: string;
  apiKey: string;
}

export function getAISettings(): AISettings | null {
  try {
    const raw = localStorage.getItem("synapse_ai_settings");
    if (!raw) return null;
    const parsed: AISettings = JSON.parse(raw);
    if (parsed.provider === "none" || !parsed.apiKey?.trim()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function generateAffirmationsWithAI(
  topic: string,
  boosterEnabled: boolean,
  fantasyEnabled: boolean,
  protectionEnabled: boolean,
  chakraName: string,
  characterName?: string,
  characterSource?: string,
  itemName?: string,
  itemSource?: string,
  symbioticName?: string,
  symbioticSource?: string,
  symbioticBondType?: string,
  boosterLevel: BoosterLevel = "standard",
  boosterCustomPhrase?: string,
  characterLocation?: string,
  characterTimeFrame?: string,
  itemLocation?: string,
  itemTimeFrame?: string,
  symbioticLocation?: string,
  symbioticTimeFrame?: string,
  advanced: AdvancedFunctions = {},
  personalTargets?: PersonalTarget[],
  stackedTopics?: string[],
): Promise<string[] | null> {
  const settings = getAISettings();
  if (!settings) return null;

  // Build a tightly focused system prompt
  const modeLines: string[] = [];

  if (boosterEnabled) {
    let boosterInstruction: string;
    switch (boosterLevel) {
      case "minimal":
        boosterInstruction =
          "BOOSTER MODE — Minimal: Use gentle, open, beginning-to-shift language. Soft but present. Use phrases like 'I am gently becoming', 'I am beginning to', 'I am opening to'. No absolute phrasing. Affirmations should feel like a soft opening, not a command.";
        break;
      case "standard":
        boosterInstruction =
          "BOOSTER MODE is active: Every affirmation must use intense, identity-level language. Use phrases like 'I am powerfully', 'Every cell of my being', 'I am an unstoppable force of', 'My [topic] multiplies exponentially', 'My identity is permanently fused with'. The tone should feel like the deepest possible self-concept reinforcement.";
        break;
      case "custom":
        boosterInstruction = `BOOSTER MODE — Custom: Begin each boosted affirmation with: '${boosterCustomPhrase?.trim() || "Powerfully and completely"}'. Then complete the affirmation in present tense about the topic. Every intensity line should open with that phrase.`;
        break;
      case "extremely_powerful":
        boosterInstruction =
          "BOOSTER MODE — Extremely Powerful: Use MAXIMUM absolute certainty in every line. Every affirmation must feel like unbreakable law. Use 'WITHOUT QUESTION', 'UNSTOPPABLY', 'Reality itself bends to my', 'My entire being IS', 'It is absolute and done', 'I am an UNSTOPPABLE force of'. No soft language anywhere. Every line should feel like a declaration of permanent, physical fact.";
        break;
      case "evolving":
        boosterInstruction =
          "BOOSTER MODE — Evolving: Write the affirmations in escalating intensity across the full set. The FIRST third of all affirmations must be soft and opening (gentle, beginning-to-shift language). The MIDDLE third should use standard confident language. The FINAL third should reach MAXIMUM absolute power (UNSTOPPABLY, Reality bends, it is absolute and done). The listener should feel the intensity build from gentle opening to unbreakable law.";
        break;
      default:
        boosterInstruction =
          "BOOSTER MODE is active: Every affirmation must use intense, identity-level language.";
    }
    modeLines.push(boosterInstruction);
  }

  if (fantasyEnabled) {
    let fantasyInstruction =
      "FANTASY-TO-REALITY MODE is active: Generate 5–7 additional affirmations that frame the topic as something that has physically crossed into the listener's real world. The fabric of reality has opened and this ability, power, or thing is now physically present and real — not symbolic, not metaphorical. Use language like 'I possess [topic] — it is physically real', 'The fabric of reality has opened and [topic] is now part of my physical world', 'I have broken the boundary between fiction and reality', 'Reality itself has shifted to accommodate my [topic]', '[topic] exists in my physical reality right now'. These must feel like the listener genuinely has this in their physical reality.";

    if (characterName?.trim()) {
      const C = characterName.trim();
      const src = characterSource?.trim()
        ? ` from ${characterSource.trim()}`
        : "";
      let charExtra = `\n\nCHARACTER MANIFESTATION is active: Also generate 5–7 affirmations specifically about physically bringing the character "${C}"${src} into the listener's reality. The character has crossed from their world into the listener's physical reality. Use phrases like '${C} has been brought into my physical reality — they exist here now', 'I have opened reality for ${C} and they have crossed into this world', '${C} is physically here beside me — their presence is real', 'The barrier between ${C}'s world and mine has dissolved', 'I have manifested ${C} into my life and they are physically present'. These should feel like the character is genuinely, physically here in the listener's world.`;

      if (characterLocation?.trim()) {
        charExtra += ` The manifestation occurs specifically at/in ${characterLocation.trim()} — reference this location in the affirmations (e.g. '${C} is physically present in ${characterLocation.trim()}', 'I feel ${C}'s presence at ${characterLocation.trim()}').`;
      }
      if (characterTimeFrame?.trim()) {
        charExtra += ` The time frame is ${characterTimeFrame.trim()} — affirmations must reference this timing (e.g. 'By ${characterTimeFrame.trim()}, ${C} is here', '${characterTimeFrame.trim()} — ${C} has arrived in my reality').`;
      }

      fantasyInstruction += charExtra;
    }

    if (itemName?.trim()) {
      const I2 = itemName.trim();
      const isrc = itemSource?.trim() ? ` from ${itemSource.trim()}` : "";
      let itemExtra = `\n\nITEM MANIFESTATION is active: Also generate 5–7 affirmations specifically about physically possessing or manifesting the item "${I2}"${isrc} in the listener's real world. The item has physically crossed into their reality. Use phrases like '${I2} is physically in my reality — I hold it, I use it, it is real', 'I have opened the fabric of reality and pulled ${I2} through into my physical world', '${I2} exists as a physical object in my life right now', 'The reality-barrier for ${I2} no longer exists — it is here with me', 'I physically possess ${I2}${isrc} — it has manifested into my world'. These should feel like the item is genuinely, physically present.`;

      if (itemLocation?.trim()) {
        itemExtra += ` The item manifests specifically at/in ${itemLocation.trim()} — reference this in the affirmations (e.g. '${I2} is sitting at ${itemLocation.trim()}', 'I find ${I2} at ${itemLocation.trim()}').`;
      }
      if (itemTimeFrame?.trim()) {
        itemExtra += ` The time frame is ${itemTimeFrame.trim()} — reference this timing in the affirmations (e.g. 'By ${itemTimeFrame.trim()}, ${I2} is in my possession', '${itemTimeFrame.trim()} — ${I2} is physically here').`;
      }

      fantasyInstruction += itemExtra;
    }

    if (symbioticName?.trim()) {
      const S = symbioticName.trim();
      const ssrc = symbioticSource?.trim()
        ? ` from ${symbioticSource.trim()}`
        : "";
      const bond = symbioticBondType?.trim() || "symbiotic bond";
      let symbExtra = `\n\nSYMBIOTIC / BIO-ENGINEERED MANIFESTATION is active: Generate 8–12 affirmations specifically about the listener forming a real, physical ${bond} with the entity "${S}"${ssrc}. This entity is BOTH a living being AND a physical extension of the user simultaneously — it is bio-engineered, alive, and exists in a merged state with its host. Use language that captures: the entity arriving in physical reality, the ${bond} forming and sealing, the merged/bonded state, and the dual nature of the entity as both living consciousness and physical extension. Example phrases: '${S}${ssrc} has crossed into my physical reality and chosen me as its host — our ${bond} is real and unbreakable', 'I feel ${S} merging with my reality — they are a living being and a physical extension of who I am', 'The ${bond} between me and ${S} is fully formed — we are one entity, complete and inseparable', '${S} and I share the same reality now — their consciousness and power are woven into mine', '${S} is both a living presence and a physical extension of my body and soul — the bond is done'. These should feel like a genuine, physical, living symbiosis has occurred.`;

      if (symbioticLocation?.trim()) {
        symbExtra += ` The bond forms specifically at/in ${symbioticLocation.trim()} — reference this location in the affirmations.`;
      }
      if (symbioticTimeFrame?.trim()) {
        symbExtra += ` The time frame is ${symbioticTimeFrame.trim()} — reference this timing in the affirmations (e.g. 'By ${symbioticTimeFrame.trim()}, ${S} and I are bonded').`;
      }

      fantasyInstruction += symbExtra;
    }

    modeLines.push(fantasyInstruction);
  }

  if (protectionEnabled) {
    modeLines.push(
      "PROTECTION MODE is active: Include 4–6 affirmations that ground and protect the listener's relationship with this specific topic. Use themes of: stability, safety, inner clarity, unshakeable confidence, energy protection, self-trust. Tie these directly to the topic — do not write generic protection affirmations. No fear-based wording.",
    );
  }

  if (chakraName) {
    const chakraList = chakraName.includes(", ") ? chakraName : chakraName;
    modeLines.push(
      `CHAKRA ALIGNMENT MODE is active: Include 2–3 affirmations per chakra for these chakras: ${chakraList}. Reference each chakra by name and tie it directly to the topic using enhancer vocabulary (e.g. "at a cellular level", "right now", "it is done").`,
    );
  }

  // ── Advanced Functions ──────────────────────────────────────────────────
  if (advanced.deityEnabled && advanced.deityName?.trim()) {
    const D = advanced.deityName.trim();
    const pan = advanced.deityPantheon?.trim()
      ? ` of ${advanced.deityPantheon.trim()}`
      : "";
    modeLines.push(
      `DEITY/ENTITY INVOCATION is active: Generate 6–8 affirmations that invoke the deity or entity "${D}"${pan} as a co-creator and empowering presence for the listener's ${topic}. Use language like "I invoke ${D} — their power flows through my [topic] now", "${D} stands beside me as I embody [topic]", "I am blessed by ${D} in my pursuit of [topic]", "${D}'s energy merges with mine and anchors [topic] into reality". The presence should feel real, powerful, and divinely confirming the listener's subliminal intention.`,
    );
  }

  if (advanced.spellEnabled) {
    const archetype =
      advanced.spellCustom?.trim() ||
      advanced.spellArchetype?.trim() ||
      "Attraction";
    modeLines.push(
      `SPELL WEAVING is active: Generate 5 affirmations that weave the energetic operation of a "${archetype}" spell directly into the listener's ${topic}. The spell should feel like a real energetic working — not metaphorical. Use present-tense language that declares the spell is cast, active, and producing results. For example: "I cast a living ${archetype} spell on my [topic] — it is active and working right now", "The ${archetype} spell is woven through my [topic] — every affirmation carries this intent". These should feel like genuine magical declarations.`,
    );
  }

  if (advanced.soulContractEnabled) {
    const entity = advanced.soulContractEntity?.trim() || "the Universe";
    modeLines.push(
      `SOUL CONTRACT is active: Generate 6–8 affirmations framed as sacred agreements between the listener and ${entity}. The soul contract declares the listener's ${topic} as a divine, pre-agreed reality that cannot be undone. Use language like "I have a soul contract with ${entity} for [topic] — this agreement is ancient and sealed", "My soul agreed to [topic] before this lifetime — the contract is in effect now", "${entity} and I have sealed this — [topic] is written into my soul's blueprint". These should feel like the most binding declaration possible.`,
    );
  }

  if (advanced.shadowWorkEnabled) {
    const block = advanced.shadowWorkBlock?.trim() || `blocks around ${topic}`;
    modeLines.push(
      `SHADOW WORK INTEGRATION is active: Generate 6–9 affirmations that first name/release the shadow resistance around the listener's ${topic} (the ${block}), then transition into claiming the topic with full power. The arc should go: see the shadow → release it with love → reclaim power → step fully into [topic]. Use language like "I lovingly release the shadow keeping me from [topic]", "Every fear around [topic] is seen, held, and dissolved", "I have integrated the [block] and I now step fully into [topic]", "The shadow work is complete — [topic] is mine". These are both healing and empowering.`,
    );
  }

  if (advanced.realityScriptEnabled) {
    const ago = advanced.realityScriptTimeAgo?.trim() || "months ago";
    modeLines.push(
      `REALITY SCRIPTING is active: Generate 6–8 affirmations written in "already happened" past-tense / story-style that describe the listener's ${topic} as something that already changed their life ${ago}. These should read like entries from a future diary or memory. Use language like "My life already changed ${ago} — [topic] has been my reality ever since", "I remember when [topic] wasn't yet mine — that feels so distant now", "${ago} something shifted and [topic] arrived and never left", "I look back with gratitude on who I was before [topic]". These complement the present-tense affirmations by making the reality feel already-lived-in.`,
    );
  }

  if (
    advanced.frequencyAttunementEnabled &&
    advanced.frequencyAttunementHz?.trim()
  ) {
    const hz = advanced.frequencyAttunementHz.trim();
    modeLines.push(
      `FREQUENCY ATTUNEMENT is active: Generate 5–6 affirmations that specifically tie the ${hz}Hz frequency to the listener's ${topic}. Reference the Hz value directly and describe it as actively programming or encoding the topic into the listener's body, mind, and subconscious. Use language like "I am attuned to ${hz}Hz — it programs my [topic] at a cellular level", "${hz}Hz runs through every cell — my [topic] is encoded at this frequency", "I resonate at ${hz}Hz and it activates my [topic] right now". These should feel like the frequency is a real carrier wave for the subliminal intention.`,
    );
  }

  if (advanced.sigilActivationEnabled && advanced.sigilName?.trim()) {
    const SIG = advanced.sigilName.trim();
    modeLines.push(
      `SIGIL ACTIVATION is active: Generate 5–7 affirmations that declare the sigil "${SIG}" is fully charged and actively working on the listener's ${topic}. The sigil should be treated as a living energetic tool that bridges intention and reality. Use language like "The sigil of ${SIG} is active and charged — it is working on my [topic] right now", "I activate the ${SIG} sigil and direct its energy toward [topic] — the intention is sealed", "The ${SIG} sigil anchors [topic] into reality effortlessly", "Every time I focus on the ${SIG} sigil, [topic] is reinforced — it is done". These should feel like a declaration of an active magical tool.`,
    );
  }

  if (advanced.kinesisEnabled && advanced.selectedKinesis?.trim()) {
    const KIN = advanced.selectedKinesis.trim();
    modeLines.push(
      `KINESIS INTEGRATION is active: The listener is awakening their ${KIN} ability. Generate 5–7 affirmations that treat ${KIN} as a real, awakening power within the listener, woven together with their core topic of ${topic}. Use language like "I am awakening my ${KIN} ability at a cellular level", "My ${KIN} power flows naturally and effortlessly", "I have complete mastery of ${KIN}". These should feel powerful, embodied, and identity-level.`,
    );
  }

  // ── Personal Subliminal ──────────────────────────────────────────────────
  const validTargets = personalTargets?.filter((p) => p.name.trim()) ?? [];
  if (validTargets.length > 0) {
    const targetList = validTargets
      .map(
        (p) =>
          `Name: ${p.name.trim()}, Relationship: ${p.relationship.trim() || "unspecified"}`,
      )
      .join("\n");
    modeLines.push(
      `PERSONAL SUBLIMINAL MODE is active: This subliminal is being created FOR specific people. After generating the standard first-person affirmations, also generate 5–7 affirmations per person using their name. For each person, use language like "[Name] is", "[Name] has", "[Name] attracts", "[Name] embodies", "My [relationship] [Name] is", "[Name]'s life is transforming — right now". These affirmations are about helping [Name] ([relationship]) receive the benefits of this subliminal. Include their relationship in some affirmations (e.g. "My sister Sarah is..."). All active modes apply to the personal affirmations too.\n\nPeople to dedicate this subliminal to:\n${targetList}`,
    );
  }

  // ── Multi-Topic Stack ────────────────────────────────────────────────────
  if (stackedTopics && stackedTopics.length > 0) {
    modeLines.push(
      `MULTI-TOPIC STACK is active: In addition to the primary topic, also generate affirmations for these additional topics: ${stackedTopics.join(", ")}. Distribute affirmations across all topics. No headers or labels — just generate them all interleaved or in groups. Each topic should receive meaningful coverage.`,
    );
  }

  const modeInstructions =
    modeLines.length > 0
      ? `\n\nACTIVE MODES — apply all of these to shape the ENTIRE output:\n${modeLines.join("\n\n")}`
      : "";

  const systemPrompt = `You are an expert subliminal affirmation writer for a professional subliminal audio creation tool called Synapse Studio.

Your job: Generate 15–25 powerful, creative, first-person present-tense affirmations based ENTIRELY on the user's topic.

STARTER VOCABULARY — rotate through these freely, never repeat the same starter twice in a row:
I's: I am / You are / I have / I attract / I choose / I allow / I deserve / I embody / I radiate / I feel
Power absolutes: It is safe for me to [verb] / Everything always [verb] / Why am I so naturally [adj]?
My's: My mind / My body / My energy / My presence / My voice / My aura / My actions / My existence

ENHANCER VOCABULARY — append one to the end of most affirmations to add depth:
naturally / effortlessly / because I was made for this / every day / every moment / from now on / right now / starting today / at a subconscious level / at a cellular level / at my core / deep within me / in every part of me / it is inevitable / it is done / it is already

CORE RULES:
- Every affirmation must be directly and specifically about the user's topic — never generic filler
- One affirmation per line, no numbering, no bullets, no dashes, no headers
- No commentary, explanations, or extra text — ONLY the affirmations
- Rotate starters heavily — do NOT start multiple lines with the same opener
- End many affirmations with an enhancer from the list above (not all, but most)
- Affirmations must feel alive, personal, and subconsciously potent — not copy-paste templates
- Do not echo the user's exact words robotically — transform intent into layered affirmation language
- Combine starters + topic + enhancers in creative, unexpected ways${modeInstructions}

Return ONLY the affirmations, one per line. Nothing else.`;

  try {
    if (settings.provider === "groq") {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${settings.apiKey}`,
          },
          body: JSON.stringify({
            model: settings.model,
            messages: [
              { role: "system", content: systemPrompt },
              {
                role: "user",
                content: `Generate affirmations for this topic: ${topic}`,
              },
            ],
            max_tokens: 1500,
            temperature: 0.85,
          }),
        },
      );

      if (!response.ok) return null;
      const data = await response.json();
      const text: string = data?.choices?.[0]?.message?.content ?? "";
      return parseAffirmations(text);
    }

    if (settings.provider === "gemini") {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${settings.model}:generateContent?key=${settings.apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [
            {
              parts: [
                {
                  text: `Generate affirmations for this topic: ${topic}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.85,
            maxOutputTokens: 1500,
          },
        }),
      });

      if (!response.ok) return null;
      const data = await response.json();
      const text: string =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      return parseAffirmations(text);
    }

    return null;
  } catch {
    return null;
  }
}

function parseAffirmations(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      // Filter lines that start with numbers, dashes, bullets, asterisks
      if (/^[\d\-\*\•\·]/.test(line)) return false;
      // Filter lines that look like headers or commentary
      if (line.length < 10) return false;
      // Filter lines that are clearly meta-commentary
      if (
        /^(here are|these are|the following|affirmations for|note:|tip:)/i.test(
          line,
        )
      )
        return false;
      return true;
    });
}
