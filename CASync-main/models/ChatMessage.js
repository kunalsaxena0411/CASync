import mongoose from "mongoose"

const ChatMessageSchema = new mongoose.Schema({

  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },

  message: String,
  attachment_path: String,

  is_from_admin: { type: Boolean, default: false },
  is_completed: { type: Boolean, default: false },

  created_at: { type: Date, default: Date.now }

})

export default mongoose.models.ChatMessage || mongoose.model("ChatMessage", ChatMessageSchema)