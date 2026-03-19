import { connectDB } from "@/lib/mongodb";
import IncomeTaxReturn from "@/models/IncomeTaxReturn";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("File Return Data:", body);

    const tax = await IncomeTaxReturn.create(body);

    return Response.json({
      success: true,
      message: "Tax return filed successfully!",
      data: tax
    });

  } catch (error) {
    console.error("File Return Error:", error);
    return Response.json({
      success: false,
      message: error.message
    });
  }
}

export async function GET() {
  try {
    await connectDB();

    const returns = await IncomeTaxReturn.find();

    return Response.json({
      success: true,
      data: returns
    });

  } catch (error) {
    return Response.json({
      success: false,
      message: error.message
    });
  }
}