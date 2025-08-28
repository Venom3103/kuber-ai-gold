import OpenAI from "openai";

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Expanded patterns: includes investing, selling, saving in gold, etc.
const GOLD_PATTERNS = [
  /buy.*gold/i, /purchase.*gold/i, /invest.*gold/i, /sell.*gold/i,
  /\b(gram|grams|tola|sovereign)s?\b/i,
  /\b(gold rate|price|per gram)\b/i,
  /\b(999|24k|22k)\b/i,
  /\bgold investment\b/i, /\bdigital gold\b/i, /\bgold savings?\b/i
];

export type Intent = "gold_investment" | "general";

export async function detectIntent(text: string): Promise<Intent> {
  const lower = text.toLowerCase();

  // ✅ Quick local heuristic first
  if (GOLD_PATTERNS.some(r => r.test(lower))) return "gold_investment";

  // ✅ Optional refinement with LLM if API key available
  if (client) {
    const r = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Classify strictly as 'gold_investment' or 'general'. Only 'gold_investment' if it's about buying, selling, investing, saving, or understanding gold."
        },
        { role: "user", content: text }
      ],
      temperature: 0
    });

    const out = (r.choices[0]?.message?.content || "").toLowerCase();
    if (out.includes("gold_investment")) return "gold_investment";
  }

  return "general";
}

// ✅ Provide a random nudge/fact
export function goldNudge(): string {
  const facts = [
    "Gold has historically acted as an inflation hedge.",
    "Gold often moves differently from stocks, helping reduce risk.",
    "Digital gold allows you to invest small amounts easily.",
    "Adding 5–10% gold can improve portfolio diversification.",
    "Gold is one of the most liquid assets globally."
  ];
  return facts[Math.floor(Math.random() * facts.length)];
}
