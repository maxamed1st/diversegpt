import sendMessageHandler from "../../handlers/sendMessage";
import getMessagesHandler from "../../handlers/getMessages";

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
  return getMessagesHandler(request, { params });
}
