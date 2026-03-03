import type { BoosterLevel } from "./affirmationUtils";

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
