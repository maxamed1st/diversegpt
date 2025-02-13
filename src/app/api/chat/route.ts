import createChatHandler from "@/app/api/chat/handlers/createChatHandler";

export async function POST(request: Request) {
  return createChatHandler(request);
}
