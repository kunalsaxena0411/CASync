import mongoose from "mongoose";

const PanDetailsSchema = new mongoose.Schema({

  userEmail: { type: String, default: "" },

  pan: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, default: "" },
  middleName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  fatherName: { type: String, default: "" },
  dob: { type: String, default: "" },
  mobileNo: { type: String, default: "" },
  email: { type: String, default: "" },
  incomeType: { type: String, default: "" },

  // Full address fields
  plotNo: { type: String, default: "" },
  buildingName: { type: String, default: "" },
  streetNo: { type: String, default: "" },
  area: { type: String, default: "" },
  city: { type: String, default: "" },
  district: { type: String, default: "" },
  state: { type: String, default: "" },
  pin: { type: String, default: "" },

  // Combined address string (used in filereturn search)
  address: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now }

});

export default mongoose.models.PanDetails ||
mongoose.model("PanDetails", PanDetailsSchema);