import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    // Step 1: Find user by email only
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return Response.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Step 2: Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      return Response.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Step 3: Return user data (excluding password)
    return Response.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}