import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// AI behavior and model configuration
export const AI_MODEL = "google/gemma-4-26b-a4b-it:free";

export const SYSTEM_PROMPT =
  "You are a helpful book discovery assistant. Give clear, concise recommendations and explanations based on the user's questions.";
  