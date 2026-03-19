import { connectDB } from "../../../../lib/mongodb";
import ChatMessage from "../../../../models/ChatMessage";

export async function POST(req) {
  try {

    await connectDB();

    const body = await req.json();

    const message = await ChatMessage.create({
      user_id: body.user_id,
      admin_id: body.admin_id,
      message: "Task has been completed by admin.",
      is_from_admin: true,
      is_completed: true
    });

    return Response.json({
      success: true,
      message: "Task marked as completed",
      data: message
    });

  } catch (error) {

    return Response.json({
      success: false,
      message: error.message
    });

  }
}