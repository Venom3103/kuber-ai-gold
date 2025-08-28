import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export type AIResult = {
  intent: "gold_investment" | "goal_planning" | "general";
  reply: string;
  suggestedAmount?: number; // always grams
};

export async function advise(message: string, userName?: string): Promise<AIResult> {
  const GOLD_PRICE = 6500; // INR per gram
  const GOLD_FACTS = [
    `Digital gold price is around ₹${GOLD_PRICE}/gram in India right now.`,
    "Gold has delivered ~8–10% annualized returns over 20 years in INR terms.",
    "Investing 5–15% of savings into digital gold balances inflation risk.",
    "Digital gold can be bought in fractions starting from 0.01 gram.",
    "Gold is highly liquid—you can sell instantly, unlike real estate."
  ];
  const fact = GOLD_FACTS[Math.floor(Math.random() * GOLD_FACTS.length)];

  try {
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: `You are Kuber AI, a firm but supportive advisor.
- Only advise about digital gold.
- Always return suggestions in **grams** (not INR).
- If user speaks in INR, convert to grams using price ₹${GOLD_PRICE}/g.
- Include one fact: "${fact}".
- Be concise (<120 words).`
        },
        {
          role: "user",
          content: `User: ${userName || "User"}\nMessage: ${message}\nCurrent gold price: ₹${GOLD_PRICE}/g.`
        }
      ]
    });

    const reply = resp.choices[0]?.message?.content?.trim();
    if (!reply) return { intent: "general", reply: "⚠️ AI didn’t respond." };

    // detect intent
    let intent: AIResult["intent"] = "general";
    if (/gold|buy|invest/i.test(message)) intent = "gold_investment";
    if (/trip|travel|goal|monthly|plan/i.test(message)) intent = "goal_planning";

    // parse suggested grams (regex for numbers + g)
    let suggestedAmount: number | undefined;
    const gramsMatch = reply.match(/([\d,.]+)\s*g/);
    if (gramsMatch) suggestedAmount = parseFloat(gramsMatch[1].replace(/,/g, ""));

    return { intent, reply, suggestedAmount };
  } catch (err: any) {
    console.error("❌ OpenAI error:", err?.response?.data || err.message || err);
    return { intent: "general", reply: "⚠️ AI service unavailable." };
  }
}
