import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export async function GET(req, { params }) {

  try {

    await connectDB();

    const { id } = params;

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found"
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    return NextResponse.json({
      success: false,
      message: error.message
    });

  }

}