import mongoose from "mongoose";

const GSTRegistrationSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  userEmail: {
    type: String,
    default: ""
  },

  gstNumber: String,
  firmName: String,
  businessType: String,
  mainPerson: String,
  address: String,
  panNo: String,
  udyamNo: String,
  bankAccNo: String,
  ifscCode: String,

  documents: {
    type: [String],
    default: []
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.models.GSTRegistration ||
mongoose.model("GSTRegistration", GSTRegistrationSchema);