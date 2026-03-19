import mongoose from "mongoose"

const NewsSchema = new mongoose.Schema({

  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },

  title: String,
  content: String,

  created_at: { type: Date, default: Date.now }

})

export default mongoose.models.News || mongoose.model("News", NewsSchema)