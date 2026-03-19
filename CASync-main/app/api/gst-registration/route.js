import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import GSTRegistration from "@/models/GSTRegistration";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("Received Data:", body); // 🔥 DEBUG

    const gst = await GSTRegistration.create(body);

    return NextResponse.json({
      success: true,
      message: "GST Registration saved successfully",
      data: gst,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}

export async function GET() {
  try {
    await connectDB();

    const gstList = await GSTRegistration.find();

    return NextResponse.json({
      success: true,
      data: gstList,
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}