"use client";

import { useEffect, useState } from "react";
import { showToast, ToastContainer } from "@/components/Toast";

// ─── Mock/initial data (replace with real API later) ─────────────────────────
const MOCK_SERVICE_REQUESTS = [
  { id: "REQ-001", client: "ABC Pvt Ltd", service: "INCOME TAX RETURN", assignedTo: "Rohan Sharma", status: "in_progress", createdDate: "2024-01-15" },
  { id: "REQ-002", client: "XYZ Enterprises", service: "GST FILING", assignedTo: "Neha Verma", status: "submitted", createdDate: "2024-01-18" },
  { id: "REQ-003", client: "PQR Ltd", service: "COMPANY INCORPORATION", assignedTo: "Neha Verma", status: "submitted", createdDate: "2024-01-20" },
  { id: "REQ-004", client: "LMN Traders", service: "GST REGISTRATION", assignedTo: "Rohan Sharma", status: "completed", createdDate: "2024-01-10" },
  { id: "REQ-005", client: "DEF Solutions", service: "INCOME TAX RETURN", assignedTo: "Rohan Sharma", status: "pending_docs", createdDate: "2024-01-22" },
];

const MOCK_ACTIVITY = [
  { id: 1, action: "Request Created", description: "REQ-003 - Company Incorporation", type: "created", timestamp: "2024-01-20 10:30" },
  { id: 2, action: "Request Assigned", description: "REQ-003 assigned to Neha Verma", type: "assigned", timestamp: "2024-01-20 11:00" },
  { id: 3, action: "Status Updated", description: "REQ-001 - Status: In Progress", type: "updated", timestamp: "2024-01-19 15:45" },
  { id: 4, action: "Request Created", description: "REQ-002 - GST Filing", type: "created", timestamp: "2024-01-18 09:20" },
  { id: 5, action: "Request Completed", description: "REQ-004 - GST Registration", type: "completed", timestamp: "2024-01-17 14:00" },
];

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",        label: "Dashboard",         icon: "⊞" },
  { id: "serviceRequests",  label: "Service Requests",  icon: "📋" },
  { id: "registeredUsers",  label: "Clients",           icon: "👥" },
  { id: "adminData",        label: "Admin Data",        icon: "🛡" },
  { id: "addAdmin",         label: "Add Admin",         icon: "➕" },
  { id: "reports",          label: "Reports",           icon: "📊" },
  { id: "activityLog",      label: "Activity Log",      icon: "📜" },
  { id: "settings",         label: "Settings",          icon: "⚙" },
];

// ─── Simple bar chart using CSS ───────────────────────────────────────────────
function BarChart({ data, color = "#2563eb" }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "160px", padding: "8px 0" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
            <div style={{
              width: "100%",
              height: `${(d.value / max) * 100}%`,
              background: color,
              borderRadius: "4px 4px 0 0",
              minHeight: d.value > 0 ? "8px" : "0",
              transition: "height 0.3s ease"
            }} />
          </div>
          <span style={{ fontSize: "10px", color: "#94a3b8", textAlign: "center" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Simple pie chart using CSS conic-gradient ────────────────────────────────
function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const colors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  let cumulative = 0;
  const segments = data.map((d, i) => {
    const pct = (d.value / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return { ...d, pct, start, color: colors[i % colors.length] };
  });
  const gradient = segments.map(s => `${s.color} ${s.start}% ${s.start + s.pct}%`).join(", ");

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
      <div style={{
        width: "120px", height: "120px", borderRadius: "50%",
        background: total > 0 ? `conic-gradient(${gradient})` : "#e2e8f0",
        flexShrink: 0
      }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: "13px", color: "#64748b" }}>{s.label} ({s.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    in_progress:  { label: "In Progress",  bg: "#dbeafe", color: "#1d4ed8" },
    submitted:    { label: "Submitted",    bg: "#fef9c3", color: "#a16207" },
    completed:    { label: "Completed",    bg: "#dcfce7", color: "#15803d" },
    pending_docs: { label: "Pending Docs", bg: "#fee2e2", color: "#b91c1c" },
  };
  const s = map[status] || { label: status, bg: "#f1f5f9", color: "#475569" };
  return (
    <span style={{
      padding: "3px 10px", borderRadius: "999px", fontSize: "11px",
      fontWeight: 600, background: s.bg, color: s.color
    }}>{s.label}</span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [activeView, setActiveView]         = useState("loginPage");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [darkMode, setDarkMode]             = useState(false);

  // Login
  const [adminEmail, setAdminEmail]         = useState("");
  const [adminPassword, setAdminPassword]   = useState("");

  // Add admin form
  const [newAdminName, setNewAdminName]     = useState("");
  const [newAdminEmail, setNewAdminEmail]   = useState("");
  const [newAdminPhone, setNewAdminPhone]   = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  // Data from API
  const [users, setUsers]     = useState([]);
  const [admins, setAdmins]   = useState([]);

  // Service requests (mock for now)
  const [serviceRequests] = useState(MOCK_SERVICE_REQUESTS);
  const [srSearch, setSrSearch]   = useState("");
  const [srStatus, setSrStatus]   = useState("all");

  // Settings state
  const [slaDefault, setSlaDefault] = useState("7");
  const [allowReg, setAllowReg]     = useState(true);
  const [autoAssign, setAutoAssign] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);

  // ── API helpers ──────────────────────────────────────────────────────────────
  async function loadUsers() {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUsers(data.users);
    } catch { console.log("Error loading users"); }
  }

  async function loadAdmins() {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/all-admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setAdmins(data.admins);
    } catch { console.log("Error loading admins"); }
  }

  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get("view");
    if (view === "dashboard") { setActiveView("dashboard"); loadUsers(); loadAdmins(); }
    else setActiveView("loginPage");
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────────────────
  async function login() {
    if (!adminEmail || !adminPassword) { showToast("Please fill all fields", "warning"); return; }
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
        loadUsers(); loadAdmins();
        showToast("Welcome back, Admin!", "success");
      } else {
        showToast(data.message || "Incorrect Credentials", "error");
      }
    } catch { showToast("Login failed. Please try again.", "error"); }
  }

  function logout() {
    localStorage.removeItem("adminToken");
    setActiveView("loginPage");
    setAdminEmail(""); setAdminPassword("");
    showToast("Logged out successfully", "info");
  }

  // ── Add admin ────────────────────────────────────────────────────────────────
  async function addAdmin() {
    if (!newAdminEmail || !newAdminPassword) { showToast("Email and Password required", "warning"); return; }
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/add-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newAdminName, email: newAdminEmail, phone: newAdminPhone, password: newAdminPassword }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Admin Added Successfully!", "success");
        setNewAdminName(""); setNewAdminEmail(""); setNewAdminPhone(""); setNewAdminPassword("");
        loadAdmins();
        setActiveView("adminData");
      } else {
        showToast(data.message || "Failed to add admin", "error");
      }
    } catch { showToast("Error adding admin.", "error"); }
  }

  // ── Navigate ─────────────────────────────────────────────────────────────────
  function navigate(view) {
    setActiveView(view);
    setMobileSidebarOpen(false);
    if (view === "registeredUsers") loadUsers();
    if (view === "adminData") loadAdmins();
  }

  // ── Computed stats ────────────────────────────────────────────────────────────
  const totalReq    = serviceRequests.length;
  const pendingReq  = serviceRequests.filter(r => r.status === "submitted" || r.status === "pending_docs").length;
  const completedReq= serviceRequests.filter(r => r.status === "completed").length;
  const inProgressReq=serviceRequests.filter(r => r.status === "in_progress").length;
  const completionRate = Math.round((completedReq / Math.max(totalReq, 1)) * 100);

  const requestsByService = [
    { label: "ITR",    value: serviceRequests.filter(r => r.service.includes("INCOME")).length },
    { label: "GST",    value: serviceRequests.filter(r => r.service.includes("GST")).length },
    { label: "Company",value: serviceRequests.filter(r => r.service.includes("COMPANY")).length },
    { label: "Others", value: serviceRequests.filter(r => !r.service.includes("INCOME") && !r.service.includes("GST") && !r.service.includes("COMPANY")).length },
  ];

  const assignees = [...new Set(serviceRequests.map(r => r.assignedTo))];
  const requestsByTeam = assignees.map(name => ({
    label: name.split(" ")[0],
    value: serviceRequests.filter(r => r.assignedTo === name).length
  }));

  // ── Filter service requests ───────────────────────────────────────────────────
  const filteredRequests = serviceRequests.filter(r => {
    const matchSearch = r.id.toLowerCase().includes(srSearch.toLowerCase()) ||
                        r.service.toLowerCase().includes(srSearch.toLowerCase()) ||
                        r.client.toLowerCase().includes(srSearch.toLowerCase());
    const matchStatus = srStatus === "all" || r.status === srStatus;
    return matchSearch && matchStatus;
  });

  // ── CSS vars ─────────────────────────────────────────────────────────────────
  const theme = darkMode ? {
    bg: "#0f172a", cardBg: "#1e293b", sidebar: "#0f172a",
    border: "#334155", text: "#f1f5f9", muted: "#94a3b8",
    inputBg: "#1e293b", inputBorder: "#475569", tableTh: "#1e3a5f"
  } : {
    bg: "#f1f5f9", cardBg: "#ffffff", sidebar: "#0f172a",
    border: "#e2e8f0", text: "#0f172a", muted: "#64748b",
    inputBg: "#ffffff", inputBorder: "#e2e8f0", tableTh: "#2563eb"
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  if (activeView === "loginPage") {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", flexDirection: "column" }}>
        <ToastContainer />
        {/* Top bar */}
        <div style={{ background: "#1e293b", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "18px", letterSpacing: "1px" }}>TOTALTAXHUB.COM</span>
          <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: "#94a3b8" }}>
            <span>✉ btpitsolution@gmail.com</span>
            <span>📞 9414973521</span>
          </div>
        </div>
        <div style={{ background: "#2563eb", display: "flex", alignItems: "center", gap: "8px", padding: "0 16px" }}>
          <a href="/" style={{ color: "#fff", textDecoration: "none", padding: "12px 16px", fontSize: "14px", background: "rgba(255,255,255,0.15)", display: "inline-block" }}>← Back</a>
          <a href="/" style={{ color: "#fff", textDecoration: "none", padding: "12px 16px", fontSize: "14px" }}>Home</a>
          <a href="/register" style={{ color: "#fff", textDecoration: "none", padding: "12px 16px", fontSize: "14px" }}>Register</a>
          <a href="/login" style={{ color: "#fff", textDecoration: "none", padding: "12px 16px", fontSize: "14px" }}>Login</a>
        </div>

        {/* Login card */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
          <div style={{ background: "#1e293b", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "400px", border: "1px solid #334155" }}>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div style={{ width: "56px", height: "56px", background: "#2563eb", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", margin: "0 auto 16px" }}>🛡</div>
              <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: 700, margin: 0 }}>Admin Login</h1>
              <p style={{ color: "#94a3b8", fontSize: "14px", margin: "6px 0 0" }}>Total Tax Hub Administration</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "6px" }}>Email Address</label>
                <input type="email" placeholder="admin@totaltaxhub.com" value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && login()}
                  style={{ width: "100%", padding: "11px 14px", background: "#0f172a", border: "1px solid #475569", borderRadius: "8px", color: "#fff", fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
              </div>
              <div>
                <label style={{ color: "#94a3b8", fontSize: "13px", display: "block", marginBottom: "6px" }}>Password</label>
                <input type="password" placeholder="••••••••" value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && login()}
                  style={{ width: "100%", padding: "11px 14px", background: "#0f172a", border: "1px solid #475569", borderRadius: "8px", color: "#fff", fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
              </div>
              <button onClick={login} style={{ padding: "12px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 600, cursor: "pointer", marginTop: "4px" }}>
                Login to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Dashboard layout (logged in) ──────────────────────────────────────────────
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: theme.bg, color: theme.text, fontFamily: "'Segoe UI', sans-serif" }}>
      <ToastContainer />

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div onClick={() => setMobileSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40, display: "none" }}
          className="mobile-overlay" />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{
        width: sidebarCollapsed ? "64px" : "240px",
        background: "#0f172a",
        display: "flex", flexDirection: "column",
        flexShrink: 0, transition: "width 0.25s ease",
        position: "relative", zIndex: 30,
        borderRight: "1px solid #1e293b"
      }}>
        {/* Brand */}
        <div style={{ padding: "16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1e293b", minHeight: "64px" }}>
          {!sidebarCollapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
              <div style={{ width: "32px", height: "32px", background: "#2563eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700, color: "#fff", fontSize: "14px" }}>CA</div>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px", whiteSpace: "nowrap" }}>CASync Admin</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div style={{ width: "32px", height: "32px", background: "#2563eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", fontWeight: 700, color: "#fff", fontSize: "14px" }}>CA</div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#94a3b8", cursor: "pointer", borderRadius: "6px", width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", flexShrink: 0 }}>
            {sidebarCollapsed ? "›" : "‹"}
          </button>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {!sidebarCollapsed && (
            <p style={{ color: "#475569", fontSize: "10px", fontWeight: 600, letterSpacing: "1px", padding: "4px 8px 8px", textTransform: "uppercase" }}>ADMIN PANEL</p>
          )}
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => navigate(item.id)}
              title={sidebarCollapsed ? item.label : ""}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px",
                padding: sidebarCollapsed ? "10px" : "10px 12px",
                background: activeView === item.id ? "#2563eb" : "transparent",
                border: "none", borderRadius: "8px", cursor: "pointer",
                color: activeView === item.id ? "#fff" : "#94a3b8",
                fontSize: "14px", fontWeight: activeView === item.id ? 600 : 400,
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
                transition: "all 0.15s ease",
              }}>
              <span style={{ fontSize: "16px", flexShrink: 0 }}>{item.icon}</span>
              {!sidebarCollapsed && <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom: Admin info + dark mode + logout */}
        <div style={{ borderTop: "1px solid #1e293b", padding: "12px 8px" }}>
          {/* Dark mode toggle */}
          <button onClick={() => setDarkMode(!darkMode)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: sidebarCollapsed ? "10px" : "10px 12px", background: "transparent", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: "14px", borderRadius: "8px", justifyContent: sidebarCollapsed ? "center" : "flex-start", marginBottom: "4px" }}>
            <span style={{ fontSize: "16px" }}>{darkMode ? "☀" : "🌙"}</span>
            {!sidebarCollapsed && <span>{darkMode ? "Light" : "Dark"}</span>}
          </button>

          {/* Logout */}
          <button onClick={logout}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: sidebarCollapsed ? "10px" : "10px 12px", background: "transparent", border: "none", cursor: "pointer", color: "#f87171", fontSize: "14px", borderRadius: "8px", justifyContent: sidebarCollapsed ? "center" : "flex-start", marginBottom: "8px" }}>
            <span style={{ fontSize: "16px" }}>↩</span>
            {!sidebarCollapsed && <span>Logout</span>}
          </button>

          {/* Admin info */}
          {!sidebarCollapsed && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "#1e293b", borderRadius: "8px" }}>
              <div style={{ width: "32px", height: "32px", background: "#2563eb", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "13px", flexShrink: 0 }}>A</div>
              <div style={{ overflow: "hidden" }}>
                <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: 0, whiteSpace: "nowrap" }}>Admin User</p>
                <p style={{ color: "#64748b", fontSize: "11px", margin: 0, whiteSpace: "nowrap" }}>ADMIN</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <div style={{ background: theme.cardBg, borderBottom: `1px solid ${theme.border}`, padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: theme.muted }}>CA Services Platform</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => window.location.href = "/"} style={{ padding: "7px 14px", background: "transparent", border: `1px solid ${theme.border}`, borderRadius: "8px", cursor: "pointer", color: theme.muted, fontSize: "13px" }}>← Home</button>
            <button onClick={logout} style={{ padding: "7px 14px", background: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer", color: "#fff", fontSize: "13px", fontWeight: 600 }}>Logout</button>
          </div>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px" }}>

          {/* ── DASHBOARD ─────────────────────────────────────────────────── */}
          {activeView === "dashboard" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 4px", color: theme.text }}>Admin Dashboard</h1>
                <p style={{ color: theme.muted, fontSize: "14px", margin: 0 }}>System overview and key metrics</p>
              </div>

              {/* Stat cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                {[
                  { label: "Total Requests",  value: totalReq,         icon: "📋", color: "#2563eb" },
                  { label: "Pending Requests",value: pendingReq,       icon: "⏳", color: "#d97706" },
                  { label: "Total Clients",   value: users.length,     icon: "👥", color: "#7c3aed" },
                  { label: "Completion Rate", value: `${completionRate}%`, icon: "📈", color: "#059669" },
                ].map((s, i) => (
                  <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "20px 24px" }}>
                    <p style={{ color: theme.muted, fontSize: "13px", margin: "0 0 8px", fontWeight: 500 }}>{s.label}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <span style={{ fontSize: "30px", fontWeight: 700, color: s.color }}>{s.value}</span>
                      <span style={{ fontSize: "22px" }}>{s.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "20px" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 600, color: theme.text }}>Requests by Service</h3>
                  <p style={{ color: theme.muted, fontSize: "12px", margin: "0 0 16px" }}>Distribution across service types</p>
                  <BarChart data={requestsByService} color="#2563eb" />
                </div>
                <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "20px" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 600, color: theme.text }}>Requests by Team Member</h3>
                  <p style={{ color: theme.muted, fontSize: "12px", margin: "0 0 16px" }}>Workload distribution</p>
                  <PieChart data={requestsByTeam} />
                </div>
              </div>

              {/* Recent requests */}
              <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
                <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 600, color: theme.text }}>Recent Service Requests</h3>
                <p style={{ color: theme.muted, fontSize: "12px", margin: "0 0 16px" }}>Latest requests in the system</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {serviceRequests.slice(0, 5).map(r => (
                    <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", border: `1px solid ${theme.border}`, borderRadius: "8px" }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: theme.text }}>{r.id}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: theme.muted }}>{r.service.replace(/_/g, " ")} • {r.assignedTo}</p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick stats bottom */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
                {[
                  { label: "In Progress", value: inProgressReq, color: "#2563eb" },
                  { label: "Completed",   value: completedReq,  color: "#059669" },
                  { label: "Admins",      value: admins.length || "—", color: "#7c3aed" },
                ].map((s, i) => (
                  <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "20px 24px" }}>
                    <p style={{ margin: "0 0 8px", fontSize: "13px", fontWeight: 600, color: theme.muted }}>{s.label}</p>
                    <p style={{ margin: 0, fontSize: "32px", fontWeight: 700, color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SERVICE REQUESTS ───────────────────────────────────────────── */}
          {activeView === "serviceRequests" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 4px", color: theme.text }}>Service Requests</h1>
                <p style={{ color: theme.muted, fontSize: "14px", margin: 0 }}>Master view of all service requests</p>
              </div>

              {/* Search & Filter */}
              <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "16px 20px", marginBottom: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <input placeholder="Search by ID, service, or client..." value={srSearch}
                  onChange={e => setSrSearch(e.target.value)}
                  style={{ flex: 1, minWidth: "200px", padding: "9px 12px", border: `1px solid ${theme.inputBorder}`, borderRadius: "8px", background: theme.inputBg, color: theme.text, fontSize: "13px", outline: "none" }} />
                <select value={srStatus} onChange={e => setSrStatus(e.target.value)}
                  style={{ padding: "9px 12px", border: `1px solid ${theme.inputBorder}`, borderRadius: "8px", background: theme.inputBg, color: theme.text, fontSize: "13px", outline: "none", cursor: "pointer" }}>
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending_docs">Pending Docs</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Table */}
              <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ background: theme.tableTh }}>
                        {["Request ID","Client","Service","Assigned To","Status","Created","Actions"].map(h => (
                          <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#fff", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((r, i) => (
                        <tr key={r.id} style={{ borderBottom: `1px solid ${theme.border}`, background: i % 2 === 1 ? (darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc") : "transparent" }}>
                          <td style={{ padding: "12px 16px", fontWeight: 600, color: theme.text }}>{r.id}</td>
                          <td style={{ padding: "12px 16px", color: theme.text }}>{r.client}</td>
                          <td style={{ padding: "12px 16px", color: theme.text }}>{r.service.replace(/_/g, " ")}</td>
                          <td style={{ padding: "12px 16px", color: theme.text }}>{r.assignedTo}</td>
                          <td style={{ padding: "12px 16px" }}><StatusBadge status={r.status} /></td>
                          <td style={{ padding: "12px 16px", color: theme.muted }}>{r.createdDate}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ display: "flex", gap: "6px" }}>
                              <button style={{ padding: "5px 10px", border: `1px solid ${theme.border}`, borderRadius: "6px", background: "transparent", cursor: "pointer", fontSize: "12px", color: theme.muted }}>👁 View</button>
                              <button style={{ padding: "5px 10px", border: `1px solid ${theme.border}`, borderRadius: "6px", background: "transparent", cursor: "pointer", fontSize: "12px", color: theme.muted }}>✏ Edit</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredRequests.length === 0 && (
                  <div style={{ textAlign: "center", padding: "48px", color: theme.muted }}>No requests found</div>
                )}
              </div>
            </div>
          )}

          {/* ── REGISTERED USERS (Clients) ─────────────────────────────────── */}
          {activeView === "registeredUsers" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 4px", color: theme.text }}>Clients</h1>
                <p style={{ color: theme.muted, fontSize: "14px", margin: 0 }}>All registered users on the platform</p>
              </div>

              <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ background: theme.tableTh }}>
                        {["#","Name","Email","Mobile","Joined"].map(h => (
                          <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#fff", fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr><td colSpan={5} style={{ padding: "48px", textAlign: "center", color: theme.muted }}>No users found</td></tr>
                      ) : users.map((u, i) => (
                        <tr key={u._id} style={{ borderBottom: `1px solid ${theme.border}`, background: i % 2 === 1 ? (darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc") : "transparent" }}>
                          <td style={{ padding: "12px 16px", color: theme.muted }}>{i + 1}</td>
                          <td style={{ padding: "12px 16px", fontWeight: 600, color: theme.text }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ width: "30px", height: "30px", background: "#2563eb", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}>
                                {(u.name || "?")[0].toUpperCase()}
                              </div>
                              {u.name || "—"}
                            </div>
                          </td>
                          <td style={{ padding: "12px 16px", color: theme.text }}>{u.email}</td>
                          <td style={{ padding: "12px 16px", color: theme.text }}>{u.mobile || "—"}</td>
                          <td style={{ padding: "12px 16px", color: theme.muted }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ADMIN DATA ─────────────────────────────────────────────────── */}
          {activeView === "adminData" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div>
                  <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 4px", color: theme.text }}>Admin Data</h1>
                  <p style={{ color: theme.muted, fontSize: "14px", margin: 0 }}>Manage system administrators</p>
                </div>
                <button onClick={() => navigate("addAdmin")} style={{ padding: "10px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                  + Add Admin
                </button>
              </div>

              <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", overflow: "hidden" }}>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ background: theme.tableTh }}>
                        {["#","Name","Email","Phone"].map(h => (
                          <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#fff", fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {admins.length === 0 ? (
                        <tr><td colSpan={4} style={{ padding: "48px", textAlign: "center", color: theme.muted }}>No admins found</td></tr>
                      ) : admins.map((a, i) => (
                        <tr key={a._id} style={{ borderBottom: `1px solid ${theme.border}`, background: i % 2 === 1 ? (darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc") : "transparent" }}>
                          <td style={{ padding: "12px 16px", color: theme.muted }}>{i + 1}</td>
                          <td style={{ padding: "12px 16px", fontWeight: 600, color: theme.text }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <div style={{ width: "30px", height: "30px", background: "#7c3aed", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "12px", flexShrink: 0 }}>
                                {(a.name || a.email || "?")[0].toUpperCase()}
                              </div>
                              {a.name || "—"}
                            </div>
                          </td>
                          <td style={{ padding: "12px 16px", color: theme.text }}>{a.email}</td>
                          <td style={{ padding: "12px 16px", color: theme.text }}>{a.phone || a.mobile || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ADD ADMIN ──────────────────────────────────────────────────── */}
          {activeView === "addAdmin" && (
            <div style={{ maxWidth: "520px" }}>
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 4px", color: theme.text }}>Add Admin</h1>
                <p style={{ color: theme.muted, fontSize: "14px", margin: 0 }}>Create a new administrator account</p>
              </div>

              <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { label: "Full Name", type: "text", val: newAdminName, set: setNewAdminName, placeholder: "Rohan Sharma" },
                    { label: "Email Address", type: "email", val: newAdminEmail, set: setNewAdminEmail, placeholder: "admin@example.com" },
                    { label: "Phone Number", type: "tel", val: newAdminPhone, set: setNewAdminPhone, placeholder: "9876543210" },
                    { label: "Password", type: "password", val: newAdminPassword, set: setNewAdminPassword, placeholder: "••••••••" },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ color: theme.muted, fontSize: "13px", display: "block", marginBottom: "6px", fontWeight: 500 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={f.val}
                        onChange={e => f.set(e.target.value)}
                        style={{ width: "100%", padding: "10px 12px", border: `1px solid ${theme.inputBorder}`, borderRadius: "8px", background: theme.inputBg, color: theme.text, fontSize: "14px", boxSizing: "border-box", outline: "none" }} />
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                    <button onClick={addAdmin} style={{ flex: 1, padding: "11px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px" }}>
                      Save Admin
                    </button>
                    <button onClick={() => navigate("adminData")} style={{ flex: 1, padding: "11px", background: "transparent", color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── REPORTS ────────────────────────────────────────────────────── */}
          {activeView === "reports" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 4px", color: theme.text }}>Reports</h1>
                <p style={{ color: theme.muted, fontSize: "14px", margin: 0 }}>Analytics and insights</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: "16px", marginBottom: "24px" }}>
                {[
                  { label: "Total Requests",  value: totalReq,        color: "#2563eb" },
                  { label: "Completed",       value: completedReq,    color: "#059669" },
                  { label: "Pending",         value: pendingReq,      color: "#d97706" },
                  { label: "Completion Rate", value: `${completionRate}%`, color: "#7c3aed" },
                ].map((s, i) => (
                  <div key={i} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "20px 24px" }}>
                    <p style={{ color: theme.muted, fontSize: "13px", margin: "0 0 8px" }}>{s.label}</p>
                    <p style={{ fontSize: "28px", fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "20px" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 600, color: theme.text }}>Requests by Service</h3>
                  <p style={{ color: theme.muted, fontSize: "12px", margin: "0 0 16px" }}>Distribution across service types</p>
                  <BarChart data={requestsByService} color="#2563eb" />
                </div>
                <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "20px" }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: 600, color: theme.text }}>Requests by Team</h3>
                  <p style={{ color: theme.muted, fontSize: "12px", margin: "0 0 16px" }}>Workload distribution</p>
                  <BarChart data={requestsByTeam} color="#10b981" />
                </div>
              </div>
            </div>
          )}

          {/* ── ACTIVITY LOG ───────────────────────────────────────────────── */}
          {activeView === "activityLog" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 4px", color: theme.text }}>Activity Log</h1>
                <p style={{ color: theme.muted, fontSize: "14px", margin: 0 }}>System audit trail of all operations</p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {MOCK_ACTIVITY.map(activity => {
                  const typeStyle = {
                    created:   { bg: "#dbeafe", color: "#1d4ed8", label: "created" },
                    assigned:  { bg: "#ede9fe", color: "#6d28d9", label: "assigned" },
                    updated:   { bg: "#dcfce7", color: "#15803d", label: "updated" },
                    completed: { bg: "#dcfce7", color: "#15803d", label: "completed" },
                  }[activity.type] || { bg: "#f1f5f9", color: "#475569", label: activity.type };

                  return (
                    <div key={activity.id} style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "16px 20px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      <div style={{ width: "40px", height: "40px", background: darkMode ? "#1e293b" : "#f1f5f9", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0 }}>🕐</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <p style={{ margin: "0 0 2px", fontWeight: 600, color: theme.text, fontSize: "14px" }}>{activity.action}</p>
                            <p style={{ margin: 0, fontSize: "13px", color: theme.muted }}>{activity.description}</p>
                          </div>
                          <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 600, background: typeStyle.bg, color: typeStyle.color, flexShrink: 0 }}>
                            {typeStyle.label}
                          </span>
                        </div>
                        <p style={{ margin: "8px 0 0", fontSize: "12px", color: theme.muted }}>{activity.timestamp}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SETTINGS ───────────────────────────────────────────────────── */}
          {activeView === "settings" && (
            <div style={{ maxWidth: "600px" }}>
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "26px", fontWeight: 700, margin: "0 0 4px", color: theme.text }}>Settings</h1>
                <p style={{ color: theme.muted, fontSize: "14px", margin: 0 }}>Configure system-wide settings</p>
              </div>

              {/* System Config */}
              <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: 600, color: theme.text }}>System Configuration</h3>

                <div style={{ marginBottom: "16px" }}>
                  <label style={{ color: theme.muted, fontSize: "13px", display: "block", marginBottom: "6px" }}>Default SLA (in days)</label>
                  <input type="number" value={slaDefault} onChange={e => setSlaDefault(e.target.value)}
                    style={{ width: "120px", padding: "9px 12px", border: `1px solid ${theme.inputBorder}`, borderRadius: "8px", background: theme.inputBg, color: theme.text, fontSize: "13px", outline: "none" }} />
                </div>

                {[
                  { label: "Allow New Client Registration", desc: "Clients can sign up for accounts", val: allowReg, set: setAllowReg },
                  { label: "Auto-Assignment Enabled", desc: "Automatically assign requests to team members", val: autoAssign, set: setAutoAssign },
                  { label: "Email Notifications", desc: "Send email updates to clients and team", val: emailNotif, set: setEmailNotif },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: `1px solid ${theme.border}` }}>
                    <div>
                      <p style={{ margin: "0 0 2px", fontWeight: 500, fontSize: "14px", color: theme.text }}>{s.label}</p>
                      <p style={{ margin: 0, fontSize: "12px", color: theme.muted }}>{s.desc}</p>
                    </div>
                    <button onClick={() => s.set(!s.val)} style={{
                      width: "44px", height: "24px", borderRadius: "999px", border: "none", cursor: "pointer",
                      background: s.val ? "#2563eb" : (darkMode ? "#334155" : "#e2e8f0"),
                      position: "relative", transition: "background 0.2s", flexShrink: 0
                    }}>
                      <span style={{
                        position: "absolute", top: "3px", left: s.val ? "22px" : "3px",
                        width: "18px", height: "18px", background: "#fff", borderRadius: "50%",
                        transition: "left 0.2s", display: "block"
                      }} />
                    </button>
                  </div>
                ))}

                <button onClick={() => showToast("Settings saved!", "success")}
                  style={{ marginTop: "20px", padding: "10px 20px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}>
                  Save Settings
                </button>
              </div>

              {/* Dark Mode */}
              <div style={{ background: theme.cardBg, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "24px" }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "15px", fontWeight: 600, color: theme.text }}>Appearance</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ margin: "0 0 2px", fontWeight: 500, fontSize: "14px", color: theme.text }}>Dark Mode</p>
                    <p style={{ margin: 0, fontSize: "12px", color: theme.muted }}>Toggle dark/light theme</p>
                  </div>
                  <button onClick={() => setDarkMode(!darkMode)} style={{
                    width: "44px", height: "24px", borderRadius: "999px", border: "none", cursor: "pointer",
                    background: darkMode ? "#2563eb" : "#e2e8f0", position: "relative", transition: "background 0.2s"
                  }}>
                    <span style={{
                      position: "absolute", top: "3px", left: darkMode ? "22px" : "3px",
                      width: "18px", height: "18px", background: "#fff", borderRadius: "50%",
                      transition: "left 0.2s", display: "block"
                    }} />
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}