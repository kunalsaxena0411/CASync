import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
});

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);