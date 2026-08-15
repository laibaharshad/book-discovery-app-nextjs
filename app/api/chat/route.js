import { streamText, convertToModelMessages } from "ai";
import { openrouter, AI_MODEL, SYSTEM_PROMPT } from "../../../lib/ai";
import { searchBooksTool } from "../../../lib/tools";

export async function POST(req) {
  const { messages } = await req.json();

  const result = streamText({
    model: openrouter(AI_MODEL),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),

    tools: {
      searchBooks: searchBooksTool,
    },

    onError({ error }) {
      console.error("AI STREAM ERROR:", error);
    },
  });

  return result.toUIMessageStreamResponse({
    onError: (error) =>
      error instanceof Error ? error.message : String(error),
  });
}