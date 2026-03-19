import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST(req){

  await connectDB();

  const body = await req.json();

  const admin = await Admin.findOne({
    email: body.email,
    password: body.password
  });

  if(!admin){
    return Response.json({
      success:false,
      message:"Admin not found"
    });
  }

  return Response.json({
    success:true,
    admin
  });

}