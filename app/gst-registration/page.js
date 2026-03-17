"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GstRegistrationPage() {
  const router = useRouter();
  const [businessType, setBusinessType] = useState("");
  const [documents, setDocuments] = useState([]);

  function handleFilesChange(event) {
    const files = Array.from(event.target.files || []);
    if (files.length > 20) {
      alert("You can upload a maximum of 20 documents.");
      event.target.value = "";
      setDocuments([]);
      return;
    }
    setDocuments(files);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const loggedInUser = currentUser?.email;

    if (!loggedInUser) {
      alert("User not logged in!");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const gstData = {
      gstNumber: String(formData.get("firmGstNo") || ""),
      businessName: String(formData.get("firmName") || ""),
      businessType: String(formData.get("businessType") || ""),
      mainPerson: String(formData.get("mainPerson") || ""),
      address: String(formData.get("address") || ""),
      panNo: String(formData.get("panNo") || ""),
      udyamNo: String(formData.get("udyamNo") || ""),
      bankAccNo: String(formData.get("bankAccNo") || ""),
      ifscCode: String(formData.get("ifscCode") || ""),
      documents: documents.map((file) => file.name)
    };

    const existingData = JSON.parse(localStorage.getItem(`gst_${loggedInUser}`) || "[]");
    existingData.push(gstData);
    localStorage.setItem(`gst_${loggedInUser}`, JSON.stringify(existingData));

    alert("GST Registration Saved Successfully!");
    event.currentTarget.reset();
    setBusinessType("");
    setDocuments([]);
  }

  return (
    <div className="page">
      <div className="form-container">
        <h2>GST Return Registration</h2>
        <form id="gstRegistrationForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firmGstNo">Firm GST Number *</label>
            <input
              type="text"
              id="firmGstNo"
              name="firmGstNo"
              pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}"
              title="Enter valid GST number (15 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="firmName">Firm Name *</label>
            <input type="text" id="firmName" name="firmName" required />
          </div>

          <div className="form-group">
            <label htmlFor="businessType">Business Type *</label>
            <select
              id="businessType"
              name="businessType"
              required
              value={businessType}
              onChange={(event) => setBusinessType(event.target.value)}
            >
              <option value="">Select Business Type</option>
              <option value="partner">Partner</option>
              <option value="proprietor">Proprietor</option>
              <option value="company">Company</option>
              <option value="huf">HUF</option>
              <option value="aop">AOP</option>
            </select>
          </div>

          <div className="additional-fields" style={{ display: businessType ? "block" : "none" }}>
            <div className="form-group"><label htmlFor="mainPerson">Main Person *</label><input type="text" id="mainPerson" name="mainPerson" required /></div>
            <div className="form-group"><label htmlFor="address">Address *</label><input type="text" id="address" name="address" required /></div>
            <div className="form-group"><label htmlFor="panNo">PAN Number *</label><input type="text" id="panNo" name="panNo" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" title="Enter valid PAN number" required /></div>
            <div className="form-group"><label htmlFor="udyamNo">Udyam Aadhaar Number *</label><input type="text" id="udyamNo" name="udyamNo" pattern="[0-9]{12}" title="Enter 12-digit Udyam Aadhaar Number" required /></div>
            <div className="form-group"><label htmlFor="bankAccNo">Bank Account Number *</label><input type="text" id="bankAccNo" name="bankAccNo" pattern="[0-9]{9,18}" title="Enter valid Bank Account Number (9-18 digits)" required /></div>
            <div className="form-group"><label htmlFor="ifscCode">IFSC Code *</label><input type="text" id="ifscCode" name="ifscCode" pattern="[A-Z]{4}0[A-Z0-9]{6}" title="Enter valid IFSC Code" required /></div>
          </div>

          <div className="form-group">
            <label htmlFor="documents">Upload Documents (Maximum 20) *</label>
            <input type="file" id="documents" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFilesChange} />
            <div id="documentList" className="document-list">
              {documents.map((file) => (
                <div className="document-item" key={file.name}>
                  {file.name}
                </div>
              ))}
            </div>
          </div>

          <div className="button-group">
            <button type="button" onClick={() => router.back()}>Back</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .page { background: #e3f2fd; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; font-family: "Poppins", sans-serif; }
        .form-container { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); width: 100%; max-width: 600px; border-top: 5px solid #007bff; }
        h2 { text-align: center; color: #007bff; margin-bottom: 20px; }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; font-weight: 600; margin-bottom: 5px; color: #333; }
        .form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #b0bec5; border-radius: 6px; font-size: 14px; transition: 0.3s; background: #f8f9fa; }
        .form-group input:focus, .form-group select:focus { border-color: #007bff; outline: none; box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); }
        .additional-fields { display: none; background: #e3f2fd; padding: 15px; border-radius: 6px; margin-top: 10px; }
        .button-group { display: flex; justify-content: space-between; margin-top: 20px; }
        .button-group button { padding: 10px 15px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; transition: 0.3s; }
        .button-group button:first-child { background: #d32f2f; color: white; }
        .button-group button:last-child { background: #007bff; color: white; }
        .button-group button:hover { opacity: 0.8; }
        .document-list { margin-top: 10px; padding: 10px; border: 1px solid #b0bec5; border-radius: 6px; background: #f8f9fa; min-height: 50px; }
        .document-item { display: flex; justify-content: space-between; align-items: center; padding: 8px; background: white; border: 1px solid #b0bec5; border-radius: 4px; margin-bottom: 5px; }
      `}</style>
    </div>
  );
}
