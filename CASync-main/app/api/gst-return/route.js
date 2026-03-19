import { connectDB } from "@/lib/mongodb";
import GSTReturn from "@/models/GSTReturn";

export async function POST(req) {

  try {

    await connectDB();

    const body = await req.json();

    const gstReturn = await GSTReturn.create(body);

    return Response.json({
      success: true,
      message: "GST Return submitted successfully",
      data: gstReturn
    });

  } catch (error) {

    return Response.json({
      success: false,
      message: error.message
    });

  }

}

export async function GET() {

  try {

    await connectDB();

    const returns = await GSTReturn.find();

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