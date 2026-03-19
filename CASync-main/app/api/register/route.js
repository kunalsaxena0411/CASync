import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.json();

    console.log("Incoming Data:", data);

    const existing = await User.findOne({
      email: data.email
    });

    if (existing) {
      return Response.json({
        success: false,
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await User.create({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      password: hashedPassword
    });

    console.log("User Saved:", newUser);

    return Response.json({
      success: true,
      message: "Registration successful"
    });

  } catch (error) {
    console.log("ERROR:", error);

    return Response.json({
      success: false,
      message: error.message
    });
  }
}