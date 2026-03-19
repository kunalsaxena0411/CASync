import { connectDB } from "../../../../lib/mongodb";
import ChatMessage from "../../../../models/ChatMessage";

export async function POST(req) {

  try {

    await connectDB();

    const body = await req.json();

    const chat = await ChatMessage.create(body);

    return Response.json({
      success: true,
      message: "Message sent",
      chat
    });

  } catch (error) {

    return Response.json({
      success: false,
      message: error.message
    });

  }

}