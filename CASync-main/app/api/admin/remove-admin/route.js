import { connectDB } from "../../../../lib/mongodb";
import Admin from "../../../../models/Admin";

export async function POST(req) {

  try {

    await connectDB();

    const body = await req.json();

    await Admin.findByIdAndDelete(body.adminId);

    return Response.json({
      success: true,
      message: "Admin removed"
    });

  } catch (error) {

    return Response.json({
      success: false,
      message: error.message
    });

  }

}