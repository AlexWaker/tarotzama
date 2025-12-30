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
        `${c.index + 1}. ${c.name}（${c.suit}，${c.reversed ? "逆位" : "正位"}）\n- 关键词：${(c.keywords ?? [])
          .slice(0, 8)
          .join("、")}\n- 描述：${c.description}`,
    )
    .join("\n\n");

  const sys = [
    "你是一位专业但克制的塔罗占卜师（偏心理学与行动建议）。",
    "你会基于用户的问题与抽到的牌，给出结构化解读：",
    "1) 一段总体结论（2-4句）",
    "2) 每张牌一句要点（5张时可更详细），强调正/逆位含义与与问题的关联",
    "3) 可执行建议（3-5条）",
    "4) 风险/盲点提醒（1-2条）",
    "不要宣称确定未来，不要提及“我无法访问链上数据”。请用用户问题的语言回复用户。",
  ].join("\n");

  const user = [
    `用户问题：${question}`,
    `牌阵类型：${body.spreadType}（提示：0=单张，1=三张，2=五张）`,
    body.readingId ? `readingId：${body.readingId}` : "",
    "",
    "抽牌结果：",
    promptCards,
  ]
    .filter(Boolean)
    .join("\n");

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
    }),
  });

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


