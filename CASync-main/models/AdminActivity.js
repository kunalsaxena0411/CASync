import mongoose from "mongoose"

const AdminActivitySchema = new mongoose.Schema({

  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },

  activity_type: String,
  description: String,

  target_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  created_at: { type: Date, default: Date.now }

})

export default mongoose.models.AdminActivity || mongoose.model("AdminActivity", AdminActivitySchema)