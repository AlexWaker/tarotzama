import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AnalyzeRequestBody = {
  question: string;
  spreadType: number;
  readingId?: string;
  cards: Array<{
    index: number;
    id: number;
    name: string;
    suit: string;
    reversed: boolean;
    keywords: string[];
    description: string;
  }>;
};

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing env "OPENAI_API_KEY". Create `packages/nextjs/.env.local` and set OPENAI_API_KEY=...' },
      { status: 500 },
    );
  }

  let body: AnalyzeRequestBody;
  try {
    body = (await req.json()) as AnalyzeRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const question = (body.question ?? "").trim();
  const cards = Array.isArray(body.cards) ? body.cards : [];

  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }
  if (!cards.length) {
    return NextResponse.json({ error: "cards is required" }, { status: 400 });
  }

  const promptCards = cards
    .slice(0, 10)
    .map(
      c =>
        `${c.index + 1}. ${c.name} (${c.suit}, ${c.reversed ? "Reversed" : "Upright"})\n- Keywords: ${(c.keywords ?? [])
          .slice(0, 8)
          .join(", ")}\n- Description: ${c.description}`,
    )
    .join("\n\n");

  const sys = [
    "You are a professional, grounded tarot reader with restraint (leaning toward psychology and practical action).",
    "Based on the user's question and the drawn cards, provide a structured interpretation with:",
    "1) A short overall takeaway (2–4 sentences).",
    "2) One key point per card (more detail is fine for 5-card spreads), explicitly tying upright/reversed meaning back to the question.",
    "3) Actionable next steps (3–5 bullets).",
    "4) Risks / blind spots (1–2 bullets).",
    "Do not claim certainty about the future, and do not mention any limitations like “I cannot access on-chain data.” Reply in the same language as the user's question.",
  ].join("\n");

  const user = [
    `User question: ${question}`,
    `Spread type: ${body.spreadType} (hint: 0=single, 1=three, 2=five)`,
    body.readingId ? `readingId: ${body.readingId}` : "",
    "",
    "Drawn cards:",
    promptCards,
  ]
    .filter(Boolean)
    .join("\n");

  const controller = new AbortController();
  const timeoutMs = 25_000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let resp: Response;
  try {
    resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 900,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
      }),
      signal: controller.signal,
    });
  } catch (e: any) {
    const isAbort = e?.name === "AbortError";
    return NextResponse.json(
      {
        error: isAbort ? "OpenAI request timed out" : "OpenAI request failed to fetch",
        details: e instanceof Error ? e.message : String(e),
      },
      { status: isAbort ? 504 : 500 },
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    return NextResponse.json(
      { error: "OpenAI request failed", status: resp.status, details: text.slice(0, 1000) },
      { status: 500 },
    );
  }

  const data = (await resp.json()) as any;
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    return NextResponse.json({ error: "OpenAI response is missing content" }, { status: 500 });
  }

  return NextResponse.json(
    { analysis: content },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}


