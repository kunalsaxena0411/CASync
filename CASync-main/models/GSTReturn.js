import mongoose from "mongoose";

const GSTReturnSchema = new mongoose.Schema({

  userEmail: {
    type: String,
    default: ""
  },

  gstNumber: String,
  businessName: String,
  state: String,
  mainPerson: String,
  panNo: String,
  financialYear: String,
  month: String,

  documents: {
    type: [String],
    default: []
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.models.GSTReturn ||
mongoose.model("GSTReturn", GSTReturnSchema);