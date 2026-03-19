import mongoose from "mongoose";

const IncomeTaxReturnSchema = new mongoose.Schema({

  userEmail: { type: String, default: "" },

  pan: String,
  name: String,
  fatherName: String,
  dob: String,
  mobileNo: String,
  email: String,
  incomeType: String,
  address: String,
  bankAccount: String,
  ifscCode: String,
  financialYear: String,
  assessmentYear: String,

  landSale: { type: Number, default: 0 },
  housingRent: { type: Number, default: 0 },
  salary: { type: Number, default: 0 },
  business: { type: Number, default: 0 },
  agriculture: { type: Number, default: 0 },
  electricityBill: { type: Number, default: 0 },
  bankStatement: { type: Number, default: 0 },
  other: { type: Number, default: 0 },

  otherIncome: String,

  createdAt: { type: Date, default: Date.now }

});

export default mongoose.models.IncomeTaxReturn ||
mongoose.model("IncomeTaxReturn", IncomeTaxReturnSchema);