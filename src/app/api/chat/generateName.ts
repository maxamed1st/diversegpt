import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export async function generateTitleFromUserMessage({
  message,
}: {
  message: string;
}) {
  const { text: title } = await generateText({
    model: anthropic('claude-3-5-sonnet-latest'),
    system: `\n
    - you will generate a short title based on the first message a user begins a conversation with
    - ensure it is not more than 80 characters long
    - the title should be a summary of the user's message
    - do not use quotes or colons`,
    prompt: message,
  });

  return title;
}
