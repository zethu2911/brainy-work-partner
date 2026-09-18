import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MODEL = "openai/gpt-6-astra";
const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

type Msg = { role: "system" | "user" | "assistant"; content: string };

async function complete(messages: Msg[], maxTokens = 1600): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) {
    throw new Error(
      "AI is not connected: the AI service key is missing. Set it up before using the AI tools.",
    );
  }

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      reasoning_effort: "low",
      max_completion_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    let message = body;
    try {
      const parsed = JSON.parse(body);
      message = parsed?.error?.message ?? parsed?.message ?? body;
    } catch {
      /* keep raw body */
    }
    if (res.status === 429) {
      throw new Error("The AI service is busy right now. Please try again in a moment.");
    }
    if (res.status === 402) {
      throw new Error(`AI credits are exhausted. ${message}`);
    }
    if (res.status === 403) {
      throw new Error(`AI access is blocked. ${message}`);
    }
    throw new Error(`AI request failed (${res.status}). ${message}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("The AI returned an empty response. Please try again.");
  return text;
}

/* ---------------------------------- email --------------------------------- */

const EmailInput = z.object({
  recipient: z.string().min(1),
  purpose: z.string().min(1),
  context: z.string().default(""),
  keyPoints: z.string().default(""),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => EmailInput.parse(d))
  .handler(async ({ data }) =>
    complete([
      {
        role: "system",
        content:
          "You are an expert workplace communication writer. Write a complete, specific email using only the details given. Never invent facts, names, dates or numbers that were not provided. Output a subject line starting with 'Subject:' followed by the email body. No commentary.",
      },
      {
        role: "user",
        content: `Recipient: ${data.recipient}\nPurpose: ${data.purpose}\nContext: ${data.context || "(none given)"}\nKey points: ${data.keyPoints || "(none given)"}\nTone: ${data.tone}`,
      },
    ]),
  );

/* --------------------------------- planner -------------------------------- */

const PlanInput = z.object({
  tasks: z.string().min(1),
  deadlines: z.string().default(""),
  priorities: z.string().default(""),
  availableTime: z.string().default(""),
  range: z.enum(["Daily", "Weekly"]),
});

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => PlanInput.parse(d))
  .handler(async ({ data }) =>
    complete([
      {
        role: "system",
        content:
          "You are a productivity planner. Build a realistic schedule from only the tasks the user listed. Use markdown-free plain text with clear time blocks, a prioritised task order (with a short reason each), and a short list of risks or trade-offs. Never add tasks the user did not mention.",
      },
      {
        role: "user",
        content: `Plan type: ${data.range}\nTasks: ${data.tasks}\nDeadlines: ${data.deadlines || "(none given)"}\nPriorities: ${data.priorities || "(none given)"}\nAvailable time: ${data.availableTime || "(not specified)"}`,
      },
    ]),
  );

/* -------------------------------- summarizer ------------------------------- */

const UrlInput = z.object({ url: z.string().url() });

export const summarizeUrl = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => UrlInput.parse(d))
  .handler(async ({ data }) => {
    let html: string;
    try {
      const page = await fetch(data.url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; WorkplaceAssistant/1.0)" },
      });
      if (!page.ok) throw new Error(`The page could not be loaded (status ${page.status}).`);
      html = await page.text();
    } catch (error) {
      throw new Error(
        `Could not read that link. ${error instanceof Error ? error.message : "Check the address and try again."}`,
      );
    }

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&#39;|&rsquo;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 14000);

    if (text.length < 200) {
      throw new Error(
        "There was not enough readable text on that page to summarise. Try a different link.",
      );
    }

    return complete([
      {
        role: "system",
        content:
          "You summarise web pages for busy professionals. Use only the supplied page text. Reply in plain text with three clearly labelled sections: 'Summary', 'Key Insights' (bulleted with '-'), and 'Actionable Recommendations' (bulleted with '-'). If the text is incomplete, say so.",
      },
      { role: "user", content: `URL: ${data.url}\n\nPage text:\n${text}` },
    ]);
  });

/* ---------------------------------- chat ---------------------------------- */

const ChatInput = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1) }))
    .min(1)
    .max(30),
});

export const chatReply = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ChatInput.parse(d))
  .handler(async ({ data }) =>
    complete(
      [
        {
          role: "system",
          content:
            "You are a workplace productivity assistant for professionals. Be concise, practical and specific to what the user asked. Use short paragraphs or bullet lists. Ask a clarifying question when the request is ambiguous.",
        },
        ...data.messages,
      ],
      1200,
    ),
  );
