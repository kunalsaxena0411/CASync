"use client";

import { useEffect, useState } from "react";
import { showToast, ToastContainer } from "@/components/Toast";

export default function AdminDashboardPage() {
  const [activeView, setActiveView] = useState("loginPage");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);

  async function loadUsers() {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch (error) {
      console.log("Error loading users");
    }
  }

  async function loadAdmins() {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/all-admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAdmins(data.admins);
    } catch (error) {
      console.log("Error loading admins");
    }
  }

  useEffect(() => {
    const requestedView = new URLSearchParams(window.location.search).get("view");
    if (requestedView === "dashboard") {
      setActiveView("dashboard");
      loadUsers();
    } else {
      setActiveView("loginPage");
    }
  }, []);

  async function login() {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        setActiveView("dashboard");
        loadUsers();
        showToast("Welcome back, Admin!", "success");
      } else {
        showToast(data.message || "Incorrect Credentials", "error");
      }
    } catch (error) {
      showToast("Login failed. Please try again.", "error");
    }
  }

  async function addAdmin() {
    if (!newAdminEmail || !newAdminPassword) {
      showToast("Please fill in all fields", "warning");
      return;
    }
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/add-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newAdminEmail, password: newAdminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Admin Added Successfully!", "success");
        setNewAdminEmail("");
        setNewAdminPassword("");
        setActiveView("dashboard");
      } else {
        showToast(data.message || "Failed to add admin", "error");
      }
    } catch (error) {
      showToast("Error adding admin. Please try again.", "error");
    }
  }

  function openUsers() { loadUsers(); setActiveView("registeredUsers"); }
  function openAdminData() { loadAdmins(); setActiveView("adminData"); }
  function goBack() { setActiveView("dashboard"); }
  function goHome() { window.location.href = "/"; }

  function logout() {
    localStorage.removeItem("adminToken");
    setActiveView("loginPage");
    setAdminEmail("");
    setAdminPassword("");
    showToast("Logged out successfully", "info");
  }

  const isLoggedIn = activeView !== "loginPage";

  return (
    <div className="page">
      <ToastContainer />

      <header className="site-header">
        <div className="header-top">
          <span className="brand">TOTALTAXHUB.COM</span>
          <div className="header-contacts">
            <span>✉ btpitsolution@gmail.com</span>
            <span>📞 9414973521</span>
          </div>
        </div>
        <nav className="header-nav">
          <div className="nav-left">
            {(activeView === "loginPage" || activeView === "dashboard") ? (
              <button className="nav-btn back-btn" onClick={goHome}>← Back</button>
            ) : (
              <button className="nav-btn back-btn" onClick={goBack}>← Back</button>
            )}
            <a href="/" className="nav-link">Home</a>
            <a href="/register" className="nav-link">Register</a>
            <a href="/login" className="nav-link">Login</a>
            <a href="/#news" className="nav-link">News</a>
            <a href="/#query" className="nav-link">Query</a>
          </div>
          <div className="nav-right">
            {isLoggedIn ? (
              <button className="nav-btn logout-btn" onClick={logout}>Logout</button>
            ) : (
              <span className="nav-btn admin-label">Admin Login</span>
            )}
          </div>
        </nav>
      </header>

      <div className="container">

        <div className={`login-container ${activeView === "loginPage" ? "active" : ""}`}>
          <h2>Admin Login</h2>
          <input type="email" placeholder="Enter Email" value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()} />
          <input type="password" placeholder="Enter Password" value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()} />
          <button onClick={login}>Login</button>
        </div>

        <div className={`admin-dashboard ${activeView === "dashboard" ? "active" : ""}`}>
          <h1>Welcome Admin of Total Tax Hub</h1>
          <button onClick={() => setActiveView("addAdmin")}>Add Admin</button>
          <button onClick={openUsers}>Registered Users</button>
          <button onClick={openAdminData}>Admin Data</button>
          <button onClick={() => setActiveView("comingSoon")}>Add News</button>
        </div>

        <div className={`admin-section ${activeView === "addAdmin" ? "active" : ""}`}>
          <h2>Add New Admin</h2>
          <input type="email" placeholder="New Admin Email" value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)} />
          <input type="password" placeholder="New Admin Password" value={newAdminPassword}
            onChange={(e) => setNewAdminPassword(e.target.value)} />
          <button onClick={addAdmin}>Save</button>
          <button onClick={goBack}>Back</button>
        </div>

        <div className={`admin-section ${activeView === "registeredUsers" ? "active" : ""}`}>
          <h2>Registered Users</h2>
          {users.length === 0 ? <p className="empty-msg">No users found</p> : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td><td>{user.name}</td>
                      <td>{user.email}</td><td>{user.mobile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button onClick={goBack}>Back</button>
        </div>

        <div className={`admin-section ${activeView === "adminData" ? "active" : ""}`}>
          <h2>Admin Data</h2>
          {admins.length === 0 ? <p className="empty-msg">No admins found</p> : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th></tr></thead>
                <tbody>
                  {admins.map((admin, index) => (
                    <tr key={admin._id}>
                      <td>{index + 1}</td><td>{admin.name || "—"}</td>
                      <td>{admin.email}</td><td>{admin.phone || admin.mobile || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <button onClick={goBack}>Back</button>
        </div>

        <div className={`admin-section ${activeView === "comingSoon" ? "active" : ""}`}>
          <h2>Coming Soon</h2>
          <button onClick={goBack}>Back</button>
        </div>

      </div>

      <style jsx>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .page { font-family: Arial, sans-serif; background: #f0f8ff; min-height: 100vh; }
        .site-header { background: #2c3e50; color: white; }
        .header-top { display: flex; justify-content: space-between; align-items: center; padding: 12px 24px; flex-wrap: wrap; gap: 8px; }
        .brand { font-size: 22px; font-weight: bold; letter-spacing: 1px; }
        .header-contacts { display: flex; gap: 20px; font-size: 13px; color: #ccc; }
        .header-nav { background: #3498db; display: flex; justify-content: space-between; align-items: center; padding: 0 16px; }
        .nav-left { display: flex; align-items: center; gap: 4px; }
        .nav-right { display: flex; align-items: center; }
        .nav-link { color: white; text-decoration: none; padding: 12px 16px; display: inline-block; font-size: 14px; transition: background 0.2s; }
        .nav-link:hover { background: rgba(255,255,255,0.15); }
        .nav-btn { padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 14px; font-weight: 600; border: none; margin: 6px 4px; transition: background 0.2s; }
        .back-btn { background: rgba(255,255,255,0.2); color: white; }
        .back-btn:hover { background: rgba(255,255,255,0.35); }
        .logout-btn { background: #e74c3c; color: white; }
        .logout-btn:hover { background: #c0392b; }
        .admin-label { background: transparent; color: white; border: 1.5px solid white; padding: 7px 16px; border-radius: 5px; font-size: 14px; font-weight: 600; margin: 6px 4px; }
        .container { max-width: 900px; margin: 40px auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .login-container, .admin-dashboard, .admin-section { display: none; padding: 20px; text-align: center; }
        .active { display: block !important; }
        h1 { font-size: 22px; margin-bottom: 20px; color: #2c3e50; }
        h2 { font-size: 20px; margin-bottom: 20px; color: #2c3e50; }
        button { padding: 10px 20px; margin: 8px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 5px; font-size: 14px; transition: background 0.2s; }
        button:hover { background: #0056b3; }
        input { width: 90%; padding: 10px; margin: 8px auto; border: 1px solid #ccc; border-radius: 5px; font-size: 14px; display: block; }
        .admin-section { background: #f9f9f9; border-radius: 10px; }
        .table-wrapper { overflow-x: auto; margin: 16px 0; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; text-align: left; }
        thead tr { background: #3498db; color: white; }
        thead th { padding: 12px 16px; font-weight: 600; }
        tbody tr { border-bottom: 1px solid #e0e0e0; transition: background 0.15s; }
        tbody tr:hover { background: #eaf4ff; }
        tbody td { padding: 11px 16px; color: #333; }
        tbody tr:nth-child(even) { background: #f5f9ff; }
        tbody tr:nth-child(even):hover { background: #eaf4ff; }
        .empty-msg { color: #888; margin: 20px 0; font-size: 15px; }
      `}</style>
    </div>
  );
}