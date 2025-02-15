import createChatHandler from "@/app/api/chats/handlers/createChat";
import chatListHandler from "@/app/api/chats/handlers/chatList";

export async function POST(request: Request) {
  return createChatHandler(request);
}

export async function GET() {
  return chatListHandler();
}
