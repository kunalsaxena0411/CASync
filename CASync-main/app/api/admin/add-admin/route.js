import { connectDB } from "../../../../lib/mongodb";
import Admin from "../../../../models/Admin";

export async function POST(req) {

  try {

    await connectDB();

    const body = await req.json();

    const admin = await Admin.create(body);

    return Response.json({
      success: true,
      message: "Admin added successfully",
      admin
    });

  } catch (error) {

    return Response.json({
      success: false,
      message: error.message
    });

  }

}