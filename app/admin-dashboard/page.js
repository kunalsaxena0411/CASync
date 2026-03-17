"use client";

import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [activeView, setActiveView] = useState("loginPage");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  useEffect(() => {
    const requestedView = new URLSearchParams(window.location.search).get("view");
    if (requestedView === "dashboard") {
      setActiveView("dashboard");
      return;
    }

    setActiveView("loginPage");
  }, []);

  function login() {
    if (adminEmail === "muneshlife@gmail.com" && adminPassword === "1234567890") {
      setActiveView("dashboard");
    } else {
      alert("Incorrect Credentials");
    }
  }

  function addAdmin() {
    if (newAdminEmail && newAdminPassword) {
      alert(`New admin added: ${newAdminEmail}`);
      setActiveView("dashboard");
    } else {
      alert("Please fill in all fields");
    }
  }

  function goBack() {
    setActiveView("dashboard");
  }

  return (
    <div className="page">
      <div className="container">
        <div className={`login-container ${activeView === "loginPage" ? "active" : ""}`} id="loginPage">
          <h2>Admin Login</h2>
          <div className="admin-credentials">
            <p>
              <strong>Email:</strong> muneshlife@gmail.com
            </p>
            <p>
              <strong>Password:</strong> 1234567890
            </p>
          </div>
          <input type="email" id="adminEmail" placeholder="Enter Email" value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} />
          <input type="password" id="adminPassword" placeholder="Enter Password" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} />
          <button onClick={login}>Login</button>
        </div>

        <div className={`admin-dashboard ${activeView === "dashboard" ? "active" : ""}`} id="dashboard">
          <h1>Welcome Admin of Total Tax Hub</h1>
          <button onClick={() => setActiveView("addAdmin")}>Add Admin</button>
          <button onClick={() => setActiveView("registeredUsers")}>Registered Users</button>
          <button onClick={() => setActiveView("adminData")}>Admin Data</button>
          <button onClick={() => setActiveView("comingSoon")}>Add News</button>
        </div>

        <div className={`admin-section ${activeView === "addAdmin" ? "active" : ""}`} id="addAdmin">
          <h2>Add New Admin</h2>
          <input type="email" id="newAdminEmail" placeholder="New Admin Email" value={newAdminEmail} onChange={(event) => setNewAdminEmail(event.target.value)} />
          <input type="password" id="newAdminPassword" placeholder="New Admin Password" value={newAdminPassword} onChange={(event) => setNewAdminPassword(event.target.value)} />
          <button onClick={addAdmin}>Save</button>
          <button onClick={goBack}>Back</button>
        </div>

        <div className={`admin-section ${activeView === "registeredUsers" ? "active" : ""}`} id="registeredUsers">
          <h2>Registered Users</h2>
          <p>Example User: Name: K, Email: aa@gmail.com, Phone: 1234567890</p>
          <button onClick={() => setActiveView("userOptions")}>View Details</button>
          <button onClick={goBack}>Back</button>
        </div>

        <div className={`admin-section ${activeView === "userOptions" ? "active" : ""}`} id="userOptions">
          <h2>User Options</h2>
          <button onClick={() => setActiveView("incomeTax")}>Income Tax Return</button>
          <button onClick={() => setActiveView("gstReturn")}>GST Return</button>
          <button onClick={() => setActiveView("chatBox")}>Chat Box</button>
          <button onClick={() => setActiveView("loginDetails")}>Logged-in Details</button>
          <button onClick={goBack}>Back</button>
        </div>

        <div className={`admin-section ${activeView === "incomeTax" ? "active" : ""}`} id="incomeTax"><h2>Income Tax Return</h2><p>No Data Found</p><button onClick={goBack}>Back</button></div>
        <div className={`admin-section ${activeView === "gstReturn" ? "active" : ""}`} id="gstReturn"><h2>GST Return</h2><p>No Data Found</p><button onClick={goBack}>Back</button></div>
        <div className={`admin-section ${activeView === "chatBox" ? "active" : ""}`} id="chatBox"><h2>Chat Box</h2><textarea placeholder="Type a message..." /><input type="file" /><button>Send</button><button onClick={goBack}>Back</button></div>
        <div className={`admin-section ${activeView === "loginDetails" ? "active" : ""}`} id="loginDetails"><h2>Logged-in Details</h2><p>No Data Found</p><button onClick={goBack}>Back</button></div>
        <div className={`admin-section ${activeView === "adminData" ? "active" : ""}`} id="adminData"><h2>Admin Data</h2><p>List of all admins</p><button onClick={goBack}>Back</button></div>
        <div className={`admin-section ${activeView === "comingSoon" ? "active" : ""}`} id="comingSoon"><h2>Coming Soon</h2><button onClick={goBack}>Back</button></div>
      </div>

      <style jsx>{`
        .page { font-family: Arial, sans-serif; text-align: center; background-color: #f0f8ff; margin: 0; padding: 50px 0; min-height: 100vh; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }
        .login-container, .admin-dashboard, .admin-section { display: none; padding: 20px; }
        .active { display: block !important; }
        button { padding: 12px 20px; margin: 10px; cursor: pointer; background-color: #007bff; color: white; border: none; border-radius: 5px; transition: 0.3s; }
        button:hover { background-color: #0056b3; }
        input, textarea { width: 90%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 5px; }
        h1, h2 { color: #333; }
        .admin-credentials { margin: 0 auto 18px; width: 90%; padding: 14px; border-radius: 8px; background: #eef6ff; color: #1f3b57; text-align: left; }
        .admin-credentials p { margin: 6px 0; }
        .admin-section { background: #f9f9f9; padding: 20px; border-radius: 10px; }
      `}</style>
    </div>
  );
}
