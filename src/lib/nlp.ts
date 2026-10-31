import { createAnthropic } from "@ai-sdk/anthropic"

/**
 * Provider-agnostic NLP entry point.
 * Swap provider/model here — call sites import `nlp` and `NLP_MODEL`, so no
 * other file needs to change when the backend moves.
 */
export const NLP_MODEL = "anthropic/claude-haiku-4.5"

export const nlp = createAnthropic({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
})
