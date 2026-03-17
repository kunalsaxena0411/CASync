"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function FileReturnPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [formValues, setFormValues] = useState({
    panSearch: "",
    pan: "",
    name: "",
    fatherName: "",
    dob: "",
    mobileNo: "",
    email: "",
    incomeType: "",
    address: "",
    bankAccount: "",
    ifscCode: "",
    financialYear: "2022-23",
    assessmentYear: "2023-24",
    otherIncome: ""
  });
  const [checks, setChecks] = useState({
    landSale: false,
    housingRent: false,
    salary: false,
    business: false,
    agriculture: false,
    electricityBill: false,
    bankStatement: false,
    other: false
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser?.email) {
      router.replace("/login");
      return;
    }
    setUserEmail(currentUser.email);
  }, [router]);

  function handlePanSearch(value) {
    setFormValues((current) => ({ ...current, panSearch: value }));
    const panRecords = JSON.parse(localStorage.getItem("panRecords") || "[]");
    const match = panRecords.find((entry) => entry.pan === value.toUpperCase());

    if (!match) {
      setFormValues((current) => ({
        ...current,
        panSearch: value,
        pan: "",
        name: "",
        fatherName: "",
        dob: "",
        mobileNo: "",
        email: "",
        incomeType: "",
        address: ""
      }));
      return;
    }

    setFormValues((current) => ({
      ...current,
      panSearch: value.toUpperCase(),
      pan: match.pan || "",
      name: [match.name, match.middleName, match.lastName].filter(Boolean).join(" "),
      fatherName: match.fatherName || "",
      dob: match.dob || "",
      mobileNo: match.mobileNo || "",
      email: match.email || "",
      incomeType: match.incomeType || "",
      address: match.address || ""
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const data = {
      ...formValues,
      otherIncome: formValues.otherIncome,
      landSale: checks.landSale ? 1 : 0,
      housingRent: checks.housingRent ? 1 : 0,
      salary: checks.salary ? 1 : 0,
      business: checks.business ? 1 : 0,
      agriculture: checks.agriculture ? 1 : 0,
      electricityBill: checks.electricityBill ? 1 : 0,
      bankStatement: checks.bankStatement ? 1 : 0,
      other: checks.other ? 1 : 0
    };

    const filedReturns = JSON.parse(localStorage.getItem("fileReturns") || "[]");
    filedReturns.push(data);
    localStorage.setItem("fileReturns", JSON.stringify(filedReturns));

    try {
      const response = await fetch("/api/file-return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.success) {
        alert(result.message);
        router.push("/dashboard");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Submission failed", error);
      alert("Something went wrong while submitting the form.");
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="main-content">
        <div className="container">
          <div className="form-container">
            <h2>File Return</h2>
            <p>Email: <span id="userEmail">{userEmail}</span></p>
            <div className="form-group">
              <label htmlFor="panSearch">Search PAN:</label>
              <input type="text" id="panSearch" placeholder="Enter PAN to search" value={formValues.panSearch} onChange={(event) => handlePanSearch(event.target.value)} />
            </div>
            <form id="fileReturnForm" onSubmit={handleSubmit}>
              <div className="form-group"><label htmlFor="pan">PAN</label><input type="text" id="pan" readOnly value={formValues.pan} /></div>
              <div className="form-group"><label htmlFor="name">Name</label><input type="text" id="name" readOnly value={formValues.name} /></div>
              <div className="form-group"><label htmlFor="fatherName">Father&apos;s Name</label><input type="text" id="fatherName" readOnly value={formValues.fatherName} /></div>
              <div className="form-group"><label htmlFor="dob">Date of Birth</label><input type="text" id="dob" readOnly value={formValues.dob} /></div>
              <div className="form-group"><label htmlFor="mobileNo">Mobile Number</label><input type="text" id="mobileNo" readOnly value={formValues.mobileNo} /></div>
              <div className="form-group"><label htmlFor="email">Email</label><input type="text" id="email" readOnly value={formValues.email} /></div>
              <div className="form-group"><label htmlFor="incomeType">Income Type</label><input type="text" id="incomeType" readOnly value={formValues.incomeType} /></div>
              <div className="form-group"><label htmlFor="address">Address</label><input type="text" id="address" readOnly value={formValues.address} /></div>
              <div className="form-group"><label htmlFor="bankAccount">Bank Account Number</label><input type="text" id="bankAccount" required value={formValues.bankAccount} onChange={(event) => setFormValues((current) => ({ ...current, bankAccount: event.target.value }))} /></div>
              <div className="form-group"><label htmlFor="ifscCode">IFSC Code</label><input type="text" id="ifscCode" required value={formValues.ifscCode} onChange={(event) => setFormValues((current) => ({ ...current, ifscCode: event.target.value }))} /></div>
              <div className="form-group">
                <label htmlFor="financialYear">Financial Year</label>
                <select id="financialYear" required value={formValues.financialYear} onChange={(event) => setFormValues((current) => ({ ...current, financialYear: event.target.value }))}>
                  <option value="2022-23">2022-23</option>
                  <option value="2023-24">2023-24</option>
                  <option value="2024-25">2024-25</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="assessmentYear">Assessment Year</label>
                <select id="assessmentYear" required value={formValues.assessmentYear} onChange={(event) => setFormValues((current) => ({ ...current, assessmentYear: event.target.value }))}>
                  <option value="2023-24">2023-24</option>
                  <option value="2024-25">2024-25</option>
                  <option value="2025-26">2025-26</option>
                </select>
              </div>
              <h3>During the Year</h3>
              <div className="checkbox-group">
                {[
                  ["landSale", "Land Sale"],
                  ["housingRent", "Housing Rent"],
                  ["salary", "Salary"],
                  ["business", "Business"],
                  ["agriculture", "Agriculture"],
                  ["electricityBill", "Electricity Bill"],
                  ["bankStatement", "Bank Statement"],
                  ["other", "Other"]
                ].map(([key, label]) => (
                  <div className="checkbox-item" key={key}>
                    <input type="checkbox" id={key} checked={checks[key]} onChange={(event) => setChecks((current) => ({ ...current, [key]: event.target.checked }))} />
                    <label htmlFor={key}>{label}</label>
                  </div>
                ))}
              </div>
              <div className={`other-input ${checks.other ? "show" : ""}`} id="otherInput">
                <input type="text" placeholder="Specify other income source" value={formValues.otherIncome} onChange={(event) => setFormValues((current) => ({ ...current, otherIncome: event.target.value }))} />
              </div>
              <div className="attachment-section">
                <div className="form-group"><label htmlFor="form16">Form 16</label><input type="file" id="form16" /></div>
                <div className="form-group"><label htmlFor="otherDocs">Other Documents (Max 20)</label><input type="file" id="otherDocs" multiple /></div>
              </div>
              <div className="button-group">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="back-btn" onClick={() => router.push("/dashboard")}>Back</button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <SiteFooter />

      <style jsx>{`
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .form-container { background-color: var(--white); padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin-top: 20px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 500; color: #333333; }
        .form-group input, .form-group select { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; transition: border-color 0.3s; }
        .form-group input:focus, .form-group select:focus { border-color: var(--secondary-color); outline: none; box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2); }
        .checkbox-group { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; margin: 15px 0; }
        .checkbox-item { display: flex; align-items: center; gap: 5px; }
        .checkbox-item input { width: auto; }
        .other-input { margin-top: 10px; display: none; }
        .other-input.show { display: block; }
        .attachment-section { margin-top: 30px; }
        .button-group { display: flex; gap: 15px; margin-top: 30px; justify-content: center; }
        .save-btn, .back-btn { padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; transition: background-color 0.3s; min-width: 120px; }
        .save-btn { background-color: var(--secondary-color); color: var(--white); }
        .save-btn:hover { background-color: #2980b9; }
        .back-btn { background-color: var(--accent-color); color: var(--white); }
        .back-btn:hover { background-color: #c0392b; }
      `}</style>
    </>
  );
}
