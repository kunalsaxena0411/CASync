"use client";

import { useRouter } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function IncomeTaxQueryPage() {
  const router = useRouter();

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const queryData = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      pan: String(formData.get("pan") || ""),
      queryType: String(formData.get("queryType") || ""),
      queryDetails: String(formData.get("queryDetails") || ""),
      timestamp: new Date().toISOString()
    };

    try {
      const queries = JSON.parse(localStorage.getItem("incomeTaxQueries") || "[]");
      queries.push(queryData);
      localStorage.setItem("incomeTaxQueries", JSON.stringify(queries));
      alert("Query submitted successfully! We will get back to you soon.");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving query:", error);
      alert("Error submitting query. Please try again.");
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="main-content">
        <div className="container">
          <div className="form-container">
            <h2>Income Tax Query</h2>
            <form id="queryForm" onSubmit={handleSubmit}>
              <div className="form-group"><label htmlFor="name">Name</label><input type="text" id="name" name="name" required /></div>
              <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" name="email" required /></div>
              <div className="form-group"><label htmlFor="phone">Phone Number</label><input type="tel" id="phone" name="phone" pattern="[0-9]{10}" title="Please enter valid 10-digit phone number" required /></div>
              <div className="form-group"><label htmlFor="pan">PAN Number</label><input type="text" id="pan" name="pan" pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}" title="Please enter valid PAN number" required /></div>
              <div className="form-group">
                <label htmlFor="queryType">Query Type</label>
                <select id="queryType" name="queryType" required>
                  <option value="">Select Query Type</option>
                  <option value="return">Income Tax Return</option>
                  <option value="refund">Tax Refund</option>
                  <option value="notice">Income Tax Notice</option>
                  <option value="calculation">Tax Calculation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="queryDetails">Query Details</label>
                <textarea id="queryDetails" name="queryDetails" placeholder="Please describe your query in detail..." required />
              </div>
              <div className="form-group"><label htmlFor="attachment">Attach Documents (if any)</label><input type="file" id="attachment" multiple /></div>
              <div className="button-group">
                <button type="submit" className="submit-btn">Submit Query</button>
                <button type="button" className="back-btn" onClick={() => router.push("/dashboard")}>Back</button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <SiteFooter />

      <style jsx>{`
        .form-container { max-width: 800px; margin: 40px auto; padding: 30px; background-color: var(--white); border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-color); }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; }
        .form-group textarea { min-height: 140px; resize: vertical; }
        .button-group { display: flex; gap: 15px; margin-top: 30px; justify-content: center; }
        .submit-btn, .back-btn { padding: 12px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; transition: background-color 0.3s; min-width: 140px; }
        .submit-btn { background-color: var(--secondary-color); color: var(--white); }
        .submit-btn:hover { background-color: #2980b9; }
        .back-btn { background-color: var(--accent-color); color: var(--white); }
        .back-btn:hover { background-color: #c0392b; }
      `}</style>
    </>
  );
}
