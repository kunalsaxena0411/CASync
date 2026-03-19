import mongoose from "mongoose"

const UserLoginSchema = new mongoose.Schema({

  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  login_time: { type: Date, default: Date.now },

  ip_address: String,
  user_agent: String

})

export default mongoose.models.UserLogin || mongoose.model("UserLogin", UserLoginSchema)