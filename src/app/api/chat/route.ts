import createChatHandler from "@/app/api/chat/handlers/createChat";
import chatListHandler from "@/app/api/chat/handlers/chatList";

export async function POST(request: Request) {
  return createChatHandler(request);
}

export async function GET() {
  return chatListHandler();
}
