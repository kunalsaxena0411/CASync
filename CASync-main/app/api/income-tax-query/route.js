import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

// Inline schema since it's a simple query form
const IncomeTaxQuerySchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  pan: String,
  queryType: String,
  queryDetails: String,
  timestamp: { type: Date, default: Date.now }
});

const IncomeTaxQuery = mongoose.models.IncomeTaxQuery ||
  mongoose.model("IncomeTaxQuery", IncomeTaxQuerySchema);

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("Query Received:", body);

    const query = await IncomeTaxQuery.create(body);

    return Response.json({
      success: true,
      message: "Query submitted successfully! We will get back to you soon.",
      data: query
    });

  } catch (error) {
    console.error("Query Error:", error);
    return Response.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const queries = await IncomeTaxQuery.find().sort({ timestamp: -1 });
    return Response.json({ success: true, data: queries });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}