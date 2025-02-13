import sendMessageHandler from "../../handlers/sendMessage";

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  return sendMessageHandler(request, { params });
}

export async function Get(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  return { message: "Get chat messages with pagination" };
}
