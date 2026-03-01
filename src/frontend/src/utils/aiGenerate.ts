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
): Promise<string[] | null> {
  const settings = getAISettings();
  if (!settings) return null;

  // Build a tightly focused system prompt
  const modeLines: string[] = [];

  if (boosterEnabled) {
    modeLines.push(
      "BOOSTER MODE is active: Every affirmation must use intense, identity-level language. Use phrases like 'I am powerfully', 'Every cell of my being', 'I am an unstoppable force of', 'My [topic] multiplies exponentially', 'My identity is permanently fused with'. The tone should feel like the deepest possible self-concept reinforcement.",
    );
  }

  if (fantasyEnabled) {
    modeLines.push(
      "FANTASY-TO-REALITY MODE is active: Generate 5–7 additional affirmations that frame the topic as a real, active, tangible ability or manifestation the listener possesses or is actively developing. Use language like 'I possess the ability to...', 'This is real, present, and undeniable', 'Reality reshapes itself around my...', 'I carry within me the essence of...'. Make them feel genuinely powerful and real — not symbolic disclaimers.",
    );
  }

  if (protectionEnabled) {
    modeLines.push(
      "PROTECTION MODE is active: Include 4–6 affirmations that ground and protect the listener's relationship with this specific topic. Use themes of: stability, safety, inner clarity, unshakeable confidence, energy protection, self-trust. Tie these directly to the topic — do not write generic protection affirmations. No fear-based wording.",
    );
  }

  if (chakraName) {
    modeLines.push(
      `CHAKRA MODE is active: Include 2–3 affirmations that align the topic with the ${chakraName} chakra energy. Reference the chakra by name and connect it specifically to the topic.`,
    );
  }

  const modeInstructions =
    modeLines.length > 0
      ? `\n\nACTIVE MODES — apply all of these to shape the ENTIRE output:\n${modeLines.join("\n\n")}`
      : "";

  const systemPrompt = `You are an expert subliminal affirmation writer for a professional subliminal audio creation tool.

Your job: Generate 15–25 powerful, first-person present-tense affirmations based ENTIRELY on the user's topic.

CORE RULES:
- Every single affirmation must be directly about the user's topic — never generic
- One affirmation per line, no numbering, no bullets, no dashes, no headers
- No commentary, explanations, or extra text — only the affirmations
- Each affirmation starts with "I", "My", "I am", "I have", or similar first-person phrasing
- Affirmations are emotionally resonant, specific, and written at a deep subconscious level
- Do not echo the user's exact words — transform the intent into affirmation language
- Vary sentence structure: avoid starting every line with "I am"${modeInstructions}

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
