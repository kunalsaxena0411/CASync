import { connectDB } from "../../../../lib/mongodb";
import Admin from "../../../../models/Admin";

export async function GET(req) {

  try {

    await connectDB();

    const admins = await Admin.find().sort({ created_at: -1 });

    return Response.json({
      success: true,
      admins: admins
    });

  } catch (error) {

    return Response.json({
      success: false,
      message: error.message
    });

  }

}