"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function GstReturnPage() {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [selectedGst, setSelectedGst] = useState("");
  const [financialYear, setFinancialYear] = useState("");
  const [month, setMonth] = useState("");
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const email = currentUser?.email;

    if (!email) {
      alert("User not logged in! Redirecting...");
      router.replace("/login");
      return;
    }

    setLoggedInUser(email);

    // ✅ Fetch GST registrations from API instead of localStorage
    async function fetchRegistrations() {
      try {
        const res = await fetch("/api/gst-registration");
        const data = await res.json();
        if (data.success) {
          // Filter only current user's registrations
          const userGSTs = data.data.filter((gst) => gst.userEmail === email);
          if (userGSTs.length === 0) {
            alert("No GST Registrations found. Please register first.");
          }
          setRegistrations(userGSTs);
        }
      } catch (err) {
        console.error("Failed to fetch GST registrations:", err);
      }
    }

    fetchRegistrations();
  }, [router]);

  const selectedRegistration = useMemo(
    () => registrations.find((entry) => entry.gstNumber === selectedGst),
    [registrations, selectedGst]
  );

  async function handleSubmit(event) {
    event.preventDefault();

    const gstReturnData = {
      userEmail: loggedInUser,
      gstNumber: selectedGst,
      businessName: selectedRegistration?.firmName || "",
      state: selectedRegistration?.address || "",
      mainPerson: selectedRegistration?.mainPerson || "",
      panNo: selectedRegistration?.panNo || "",
      financialYear,
      month,
      documents: documents.map((file) => file.name),
    };

    try {
      const res = await fetch("/api/gst-return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gstReturnData),
      });

      const data = await res.json();

      if (data.success) {
        alert("GST Return submitted successfully!");
        event.target.reset();
        setSelectedGst("");
        setFinancialYear("");
        setMonth("");
        setDocuments([]);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  }

  return (
    <div className="page">
      <div className="form-container">
        <h2>Submit GST Return</h2>
        <div id="errorContainer" className="error-message" />
        {loggedInUser ? <p>{`Logged in as: ${loggedInUser}`}</p> : null}
        <form id="gstReturnForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="gstRegistration">Select GST Registration:</label>
            <select
              id="gstRegistration"
              required
              value={selectedGst}
              onChange={(event) => setSelectedGst(event.target.value)}
              disabled={registrations.length === 0}
            >
              <option value="">Select GST Registration</option>
              {registrations.map((gst) => (
                <option key={gst.gstNumber} value={gst.gstNumber}>
                  {`${gst.gstNumber} - ${gst.firmName}`}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="businessName">Business Name:</label>
            <input type="text" id="businessName" readOnly value={selectedRegistration?.firmName || ""} />
          </div>
          <div className="form-group">
            <label htmlFor="state">State:</label>
            <input type="text" id="state" readOnly value={selectedRegistration?.address || ""} />
          </div>
          <div className="form-group">
            <label htmlFor="mainPerson">Main Person:</label>
            <input type="text" id="mainPerson" readOnly value={selectedRegistration?.mainPerson || ""} />
          </div>
          <div className="form-group">
            <label htmlFor="panNo">PAN Number:</label>
            <input type="text" id="panNo" readOnly value={selectedRegistration?.panNo || ""} />
          </div>

          <div className="form-group">
            <label htmlFor="financialYear">Financial Year:</label>
            <select id="financialYear" required value={financialYear} onChange={(event) => setFinancialYear(event.target.value)}>
              <option value="">Select Financial Year</option>
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="month">Month:</label>
            <select id="month" required value={month} onChange={(event) => setMonth(event.target.value)}>
              <option value="">Select Month</option>
              {["April","May","June","July","August","September","October","November","December","January","February","March"].map((entry) => (
                <option key={entry} value={entry}>{entry}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="documents">Upload Documents (Maximum 20):</label>
            <input
              type="file"
              id="documents"
              multiple
              onChange={(event) => setDocuments(Array.from(event.target.files || []).slice(0, 20))}
            />
            <div id="documentList" className="document-list">
              {documents.map((file) => (
                <div key={file.name}>{file.name}</div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-submit">Submit GST Return</button>
        </form>
      </div>

      <style jsx>{`
        .page { background: #f7f9fc; padding: 40px 20px; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; }
        .form-container { background: #ffffff; border-radius: 12px; padding: 30px; max-width: 600px; width: 100%; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08); }
        .form-container h2 { text-align: center; margin-bottom: 24px; color: #333; font-weight: 500; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-weight: 500; color: #333; }
        input[type="text"], select, input[type="file"] { width: 100%; padding: 10px 14px; border: 1px solid #ccc; border-radius: 6px; background: #f9f9f9; font-size: 14px; transition: border-color 0.3s ease; }
        input:read-only { background-color: #eaeaea; cursor: not-allowed; }
        input:focus, select:focus { border-color: #007bff; outline: none; }
        input[type="file"] { background-color: #fff; padding: 8px; }
        .document-list { margin-top: 10px; font-size: 13px; color: #555; }
        .btn-submit { display: block; width: 100%; padding: 12px; background-color: #007bff; color: white; font-size: 16px; font-weight: 500; border: none; border-radius: 8px; cursor: pointer; transition: background-color 0.3s ease; }
        .btn-submit:hover { background-color: #0056b3; }
        .error-message { color: red; text-align: center; margin-bottom: 16px; font-size: 14px; }
      `}</style>
    </div>
  );
}