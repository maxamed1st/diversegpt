import { NextResponse } from "next/server";
import sendMessageHandler from "../../handlers/sendMessageHandler";

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  return sendMessageHandler(request, { params });
}
