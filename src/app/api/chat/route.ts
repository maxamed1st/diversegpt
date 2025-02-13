import createChatHandler from "@/app/api/chat/handlers/createChat";

export async function POST(request: Request) {
  return createChatHandler(request);
}

export async function GET(request: Request) {
  return { message: "Get chat list with details" };
}
