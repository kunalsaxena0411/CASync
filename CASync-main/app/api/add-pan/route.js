import { connectDB } from "@/lib/mongodb";
import PanDetails from "@/models/PanDetails";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("PAN Data Received:", body);

    // Check if PAN already exists
    const existing = await PanDetails.findOne({ pan: body.pan });
    if (existing) {
      return Response.json({
        success: false,
        message: "PAN already exists"
      }, { status: 400 });
    }

    const pan = await PanDetails.create(body);

    return Response.json({
      success: true,
      message: "PAN details saved successfully!",
      data: pan
    });

  } catch (error) {
    console.error("PAN Error:", error);
    return Response.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const pan = searchParams.get("pan");

    if (pan) {
      const record = await PanDetails.findOne({ pan: pan.toUpperCase() });
      return Response.json({
        success: !!record,
        data: record || null
      });
    }

    const allPans = await PanDetails.find();
    return Response.json({
      success: true,
      data: allPans
    });

  } catch (error) {
    return Response.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}