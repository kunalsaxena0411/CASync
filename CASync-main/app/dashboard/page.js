"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, showToast } from "@/components/Toast";

const MOCK_REQUESTS = [
  { id:"REQ-001", service:"Income Tax Return", status:"in_progress", assigned:"Rohan Sharma", created:"2024-01-10", updated:"2024-01-20", due:"2024-01-25" },
  { id:"REQ-002", service:"GST Filing",        status:"completed",   assigned:"Priya Mehta",  created:"2024-01-05", updated:"2024-01-15", due:"2024-01-10" },
];
const MOCK_INVOICES = [
  { id:"INV-001", reqId:"REQ-001", service:"ITR Filing",            amount:5000,  date:"2024-01-15", due:"2024-01-25", status:"paid" },
  { id:"INV-002", reqId:"REQ-002", service:"GST Filing",            amount:2500,  date:"2024-01-05", due:"2024-01-10", status:"paid" },
  { id:"INV-003", reqId:"REQ-003", service:"Company Incorporation", amount:15000, date:"2024-01-20", due:"2024-02-05", status:"pending" },
];
const MOCK_DOCS = [
  { id:"d1", name:"PAN_Card.pdf",        reqId:"REQ-001", service:"Income Tax Return", date:"2024-01-10", size:"1.2 MB" },
  { id:"d2", name:"Aadhaar_Card.pdf",    reqId:"REQ-001", service:"Income Tax Return", date:"2024-01-10", size:"0.8 MB" },
  { id:"d3", name:"GST_Certificate.pdf", reqId:"REQ-002", service:"GST Filing",        date:"2024-01-05", size:"2.1 MB" },
];
const MOCK_NOTIFS_INIT = [
  { id:"n1", title:"Request Completed",   message:"Your GST Filing (REQ-002) has been completed.", type:"success", time:"2 hours ago",  read:true,  reqId:"REQ-002" },
  { id:"n2", title:"Documents Requested", message:"Additional documents needed for REQ-001.",       type:"warning", time:"5 hours ago",  read:true,  reqId:"REQ-001" },
  { id:"n3", title:"Status Update",       message:"REQ-001 (ITR Filing) is now in progress.",       type:"info",    time:"12 hours ago", read:false, reqId:"REQ-001" },
  { id:"n4", title:"Request Submitted",   message:"Your request REQ-003 has been received.",        type:"info",    time:"1 day ago",    read:false, reqId:"REQ-003" },
  { id:"n5", title:"Invoice Generated",   message:"Invoice INV-001 has been generated.",            type:"info",    time:"2 days ago",   read:true },
];
const STATUS_COLOR = {
  in_progress:  { bg:"#fef9c3", text:"#854d0e", label:"In Progress" },
  completed:    { bg:"#dcfce7", text:"#166534", label:"Completed" },
  pending_docs: { bg:"#fee2e2", text:"#991b1b", label:"Pending Docs" },
  submitted:    { bg:"#dbeafe", text:"#1e40af", label:"Submitted" },
  on_hold:      { bg:"#f3f4f6", text:"#374151", label:"On Hold" },
  paid:         { bg:"#dcfce7", text:"#166534", label:"Paid" },
  pending:      { bg:"#ffedd5", text:"#9a3412", label:"Pending" },
};
const NOTIF_ICON  = { success:"✓", warning:"⚠", info:"ℹ", error:"✕" };
const NOTIF_COLOR = { success:"#16a34a", warning:"#d97706", info:"#2563eb", error:"#dc2626" };

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName]         = useState("User");
  const [userEmail, setUserEmail]       = useState("");
  const [activePage, setActivePage]     = useState("dashboard");
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [collapsed, setCollapsed]       = useState(false);
  const [darkMode, setDarkMode]         = useState(false);
  const [svcDropdown, setSvcDropdown]   = useState("");
  const [reqSearch, setReqSearch]       = useState("");
  const [reqStatus, setReqStatus]       = useState("all");
  const [docSearch, setDocSearch]       = useState("");
  const [notifs, setNotifs]             = useState(MOCK_NOTIFS_INIT);
  const [notifTab, setNotifTab]         = useState("all");
  const [billingTab, setBillingTab]     = useState("invoices");
  const [editing, setEditing]           = useState(false);
  const [profileName, setProfileName]   = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileMobile, setProfileMobile] = useState("");

  useEffect(() => {
    const cu = localStorage.getItem("currentUser");
    if (!cu) { router.replace("/login"); return; }
    const u = JSON.parse(cu);
    setUserName(u.name || "User");
    setUserEmail(u.email || "");
    setProfileName(u.name || "");
    setProfileEmail(u.email || "");
    setProfileMobile(u.mobile || "");
    const dark = localStorage.getItem("darkMode") === "true";
    setDarkMode(dark);
    if (dark) document.documentElement.setAttribute("data-theme","dark");
  }, [router]);

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("darkMode", String(next));
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  }

  function handleLogout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    showToast("Logged out successfully","info");
    setTimeout(() => router.push("/login"), 800);
  }

  function navigate(page) { setActivePage(page); setSidebarOpen(false); }

  const userInitials = userName.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const activeReqs    = MOCK_REQUESTS.filter(r => r.status==="in_progress" || r.status==="submitted");
  const completedReqs = MOCK_REQUESTS.filter(r => r.status==="completed");
  const filteredReqs  = MOCK_REQUESTS
    .filter(r => reqStatus==="all" || r.status===reqStatus)
    .filter(r => !reqSearch || r.id.toLowerCase().includes(reqSearch.toLowerCase()) || r.service.toLowerCase().includes(reqSearch.toLowerCase()));
  const filteredDocs  = MOCK_DOCS.filter(d => !docSearch || d.name.toLowerCase().includes(docSearch.toLowerCase()));
  const unreadCount   = notifs.filter(n => !n.read).length;
  const shownNotifs   = notifTab==="unread" ? notifs.filter(n=>!n.read) : notifs;
  const paidTotal     = MOCK_INVOICES.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0);
  const pendingTotal  = MOCK_INVOICES.filter(i=>i.status!=="paid").reduce((s,i)=>s+i.amount,0);
  const totalAmount   = MOCK_INVOICES.reduce((s,i)=>s+i.amount,0);

  const serviceItems = [
    { id:"income-tax", label:"Income Tax", icon:"fas fa-file-invoice",
      links:[{href:"/income-tax",label:"Open Income Tax"},{href:"/add-pan",label:"Add PAN"},{href:"/income-tax-query",label:"Income Tax Query"},{href:"/filereturn",label:"File Return"}] },
    { id:"gst", label:"GST", icon:"fas fa-percentage",
      links:[{href:"/gst",label:"Open GST"},{href:"/gst-registration",label:"GST Registration"},{href:"/gst-return",label:"File GST Return"}] },
  ];

  const navItems = [
    { id:"dashboard",     label:"Dashboard",          icon:"fas fa-th-large" },
    { id:"new-request",   label:"New Service Request", icon:"fas fa-plus-circle" },
    { id:"my-requests",   label:"My Requests",         icon:"fas fa-list-alt" },
    { id:"documents",     label:"Documents",            icon:"fas fa-folder-open" },
    { id:"billing",       label:"Billing & Payments",   icon:"fas fa-credit-card" },
    { id:"notifications", label:"Notifications",        icon:"fas fa-bell", badge:unreadCount },
    { id:"profile",       label:"Profile",              icon:"fas fa-user-circle" },
    { id:"settings",      label:"Settings",             icon:"fas fa-cog" },
  ];

  /* ─── Pages ─── */
  function PageDashboard() {
    return <>
      <div className="page-heading">
        <div><h2 className="page-title">Dashboard</h2><p className="page-sub">Welcome back, {userName}!</p></div>
        <button className="btn-primary" onClick={()=>navigate("new-request")}><i className="fas fa-plus"/> New Service Request</button>
      </div>
      <div className="stats-grid">
        {[{label:"Active Requests",val:activeReqs.length,icon:"fas fa-chart-line",color:"#3b82f6"},
          {label:"Completed",val:completedReqs.length,icon:"fas fa-check-circle",color:"#10b981"},
          {label:"Pending Docs",val:0,icon:"fas fa-file-alt",color:"#f59e0b"},
          {label:"Total Requests",val:MOCK_REQUESTS.length,icon:"fas fa-clock",color:"#6366f1"},
        ].map(s=>(
          <div className="stat-card" key={s.label}>
            <div className="stat-top"><span className="stat-label">{s.label}</span><i className={s.icon} style={{color:s.color}}/></div>
            <div className="stat-value">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginBottom:"1.5rem"}}>
        <div className="card-header"><h3 className="card-title">Active Requests</h3><p className="card-sub">Your ongoing service requests</p></div>
        <div className="card-body">
          {activeReqs.length===0 ? <p className="empty-msg">No active requests. Create one to get started!</p>
            : activeReqs.map(r=>(
              <div className="req-row" key={r.id}>
                <span className="req-id">{r.id}</span>
                <span className="badge" style={{background:STATUS_COLOR[r.status]?.bg,color:STATUS_COLOR[r.status]?.text}}>{STATUS_COLOR[r.status]?.label}</span>
                <span className="req-assigned" style={{flex:1}}>Assigned to: {r.assigned}</span>
                <div style={{textAlign:"right"}}><p className="act-time">{STATUS_COLOR[r.status]?.label}</p><p style={{fontSize:12,fontWeight:500,color:"var(--text-main)"}}>Due {r.due}</p></div>
              </div>
            ))}
        </div>
      </div>

      <div className="card" style={{marginBottom:"1.5rem"}}>
        <div className="card-header"><h3 className="card-title">Recent Activity</h3><p className="card-sub">Latest updates across your requests</p></div>
        <div className="card-body">
          {MOCK_REQUESTS.map(r=>(
            <div className="activity-row" key={r.id}>
              <i className="fas fa-clock" style={{color:"var(--text-muted)",marginTop:2}}/>
              <div><p className="act-text"><strong>{r.id}</strong> – {r.service}</p><p className="act-time">Updated {r.updated}</p></div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-heading">Tax & Business Services</div>
      <div className="service-grid">
        {serviceItems.map(svc=>(
          <div key={svc.id} className="service-card">
            <button className="card-toggle" onClick={()=>setSvcDropdown(svcDropdown===svc.id?"":svc.id)}>
              <i className={svc.icon}/><h3>{svc.label}</h3>
              <p>{svcDropdown===svc.id?"Hide options":"View options"}</p>
            </button>
            {svcDropdown===svc.id && <div className="dropdown-content">{svc.links.map(l=><Link key={l.href} href={l.href} className="dropdown-link">{l.label}</Link>)}</div>}
          </div>
        ))}
        <Link href="/company" className="service-card service-link-card"><i className="fas fa-building"/><h3>Company</h3><p>Registration & compliance</p></Link>
        <div className="service-card other-card">
          <i className="fas fa-ellipsis-h"/><h3>Other</h3>
          <div className="other-links">
            <Link href="/firm">Firm Registration</Link>
            <Link href="/udhyam">Udhyam Registration</Link>
            <button onClick={()=>showToast("Coming Soon!","info")} className="other-more">More Services</button>
          </div>
        </div>
      </div>
    </>;
  }

  function PageMyRequests() {
    return <>
      <div className="page-heading">
        <div><h2 className="page-title">My Requests</h2><p className="page-sub">Track all your service requests</p></div>
        <button className="btn-primary" onClick={()=>navigate("new-request")}><i className="fas fa-plus"/> New Request</button>
      </div>
      <div className="card" style={{marginBottom:"1.5rem"}}>
        <div className="card-body">
          <div className="filter-row">
            <div className="search-wrap"><i className="fas fa-search search-icon"/><input className="input-field" placeholder="Search by ID or service..." value={reqSearch} onChange={e=>setReqSearch(e.target.value)}/></div>
            <select className="select-field" value={reqStatus} onChange={e=>setReqStatus(e.target.value)}>
              <option value="all">All Status</option><option value="submitted">Submitted</option>
              <option value="in_progress">In Progress</option><option value="pending_docs">Pending Docs</option>
              <option value="completed">Completed</option><option value="on_hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header"><h3 className="card-title">Requests ({filteredReqs.length})</h3></div>
        {filteredReqs.length===0
          ? <div className="card-body"><p className="empty-msg" style={{textAlign:"center",padding:"2rem 0"}}>No requests found.</p></div>
          : <div className="table-wrap"><table className="data-table">
              <thead><tr><th>Request ID</th><th>Service</th><th>Assigned To</th><th>Status</th><th>Created</th><th>Updated</th></tr></thead>
              <tbody>{filteredReqs.map(r=>(
                <tr key={r.id}>
                  <td><strong>{r.id}</strong></td><td>{r.service}</td><td>{r.assigned}</td>
                  <td><span className="badge" style={{background:STATUS_COLOR[r.status]?.bg,color:STATUS_COLOR[r.status]?.text}}>{STATUS_COLOR[r.status]?.label}</span></td>
                  <td>{r.created}</td><td>{r.updated}</td>
                </tr>
              ))}</tbody>
            </table></div>}
      </div>
    </>;
  }

  function PageDocuments() {
    return <>
      <div className="page-heading"><div><h2 className="page-title">Documents</h2><p className="page-sub">Central repository for all your documents</p></div></div>
      <div className="card" style={{marginBottom:"1.5rem"}}>
        <div className="card-body"><div className="search-wrap"><i className="fas fa-search search-icon"/><input className="input-field" placeholder="Search documents..." value={docSearch} onChange={e=>setDocSearch(e.target.value)}/></div></div>
      </div>
      <div className="section-heading">Documents ({filteredDocs.length})</div>
      {filteredDocs.length===0
        ? <div className="card"><div className="card-body" style={{textAlign:"center",padding:"3rem"}}>
            <i className="fas fa-folder-open" style={{fontSize:48,color:"var(--text-muted)",marginBottom:12,display:"block"}}/>
            <p className="empty-msg">No documents found</p></div></div>
        : <div style={{display:"grid",gap:"1rem"}}>
            {filteredDocs.map(doc=>(
              <div className="card doc-card" key={doc.id}>
                <div className="doc-icon-wrap"><i className="fas fa-file-pdf"/></div>
                <div className="doc-info">
                  <h4 className="doc-name">{doc.name}</h4>
                  <div className="doc-meta">
                    <span className="badge" style={{background:"#dbeafe",color:"#1e40af"}}>{doc.reqId}</span>
                    <span>{doc.date}</span><span>{doc.size}</span>
                  </div>
                </div>
                <button className="btn-outline" onClick={()=>showToast("Download started","info")}><i className="fas fa-download"/> Download</button>
              </div>
            ))}</div>}
    </>;
  }

  function PageBilling() {
    return <>
      <div className="page-heading"><div><h2 className="page-title">Billing & Payments</h2><p className="page-sub">Manage your invoices and payment history</p></div></div>
      <div className="stats-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        {[{label:"Total Invoices",val:`₹${totalAmount.toLocaleString()}`,color:"#3b82f6"},
          {label:"Paid",val:`₹${paidTotal.toLocaleString()}`,color:"#16a34a"},
          {label:"Pending",val:`₹${pendingTotal.toLocaleString()}`,color:"#d97706"},
        ].map(s=><div className="stat-card" key={s.label}><div className="stat-top"><span className="stat-label">{s.label}</span></div><div className="stat-value" style={{color:s.color}}>{s.val}</div></div>)}
      </div>
      <div className="tabs-row">
        {["invoices","payments","methods"].map(t=>(
          <button key={t} className={`tab-btn ${billingTab===t?"active":""}`} onClick={()=>setBillingTab(t)}>
            {t==="invoices"?"Invoices":t==="payments"?"Payment History":"Payment Methods"}
          </button>
        ))}
      </div>
      {billingTab==="invoices" && (
        <div className="card">
          <div className="card-header"><h3 className="card-title">All Invoices</h3></div>
          <div className="table-wrap"><table className="data-table">
            <thead><tr><th>Invoice</th><th>Request</th><th>Service</th><th>Amount</th><th>Date</th><th>Due</th><th>Status</th></tr></thead>
            <tbody>{MOCK_INVOICES.map(inv=>(
              <tr key={inv.id}>
                <td><strong>{inv.id}</strong></td>
                <td><span className="badge" style={{background:"#f3f4f6",color:"#374151"}}>{inv.reqId}</span></td>
                <td>{inv.service}</td><td><strong>₹{inv.amount.toLocaleString()}</strong></td>
                <td>{inv.date}</td><td>{inv.due}</td>
                <td><span className="badge" style={{background:STATUS_COLOR[inv.status]?.bg,color:STATUS_COLOR[inv.status]?.text}}>{STATUS_COLOR[inv.status]?.label}</span></td>
              </tr>
            ))}</tbody>
          </table></div>
        </div>
      )}
      {billingTab==="payments" && (
        <div className="card"><div className="card-header"><h3 className="card-title">Payment History</h3></div>
          <div className="card-body">{MOCK_INVOICES.filter(i=>i.status==="paid").map(inv=>(
            <div className="pay-row" key={inv.id}>
              <div><p style={{fontWeight:600,color:"var(--text-main)"}}>{inv.id} – {inv.service}</p><p className="act-time">Paid on {inv.date}</p></div>
              <span className="badge" style={{background:"#dcfce7",color:"#166534"}}>₹{inv.amount.toLocaleString()}</span>
            </div>
          ))}</div>
        </div>
      )}
      {billingTab==="methods" && (
        <div className="card"><div className="card-header"><h3 className="card-title">Payment Methods</h3></div>
          <div className="card-body">
            {[{title:"Bank Transfer",badge:"Primary",lines:["Account: 1234567890","IFSC: SBIN0001234","Bank: State Bank of India"]},
              {title:"Credit Card",badge:null,lines:["•••• •••• •••• 4242","Expires: 12/26"]},
              {title:"UPI",badge:null,lines:["caservices@upi"]},
            ].map(m=>(
              <div className="method-card" key={m.title}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <strong style={{color:"var(--text-main)"}}>{m.title}</strong>
                  {m.badge && <span className="badge" style={{background:"#dbeafe",color:"#1e40af"}}>{m.badge}</span>}
                </div>
                {m.lines.map(l=><p key={l} className="act-time">{l}</p>)}
              </div>
            ))}
          </div>
        </div>
      )}
    </>;
  }

  function PageNotifications() {
    return <>
      <div className="page-heading">
        <div><h2 className="page-title">Notifications</h2><p className="page-sub">Stay updated with your service requests</p></div>
        {unreadCount>0 && <span className="badge" style={{background:"#2563eb",color:"#fff",fontSize:13,padding:"4px 14px"}}>{unreadCount} unread</span>}
      </div>
      <div className="tabs-row">
        <button className={`tab-btn ${notifTab==="all"?"active":""}`} onClick={()=>setNotifTab("all")}>All ({notifs.length})</button>
        <button className={`tab-btn ${notifTab==="unread"?"active":""}`} onClick={()=>setNotifTab("unread")}>Unread ({unreadCount})</button>
      </div>
      <div style={{display:"grid",gap:"0.75rem"}}>
        {shownNotifs.length===0
          ? <div className="card"><div className="card-body" style={{textAlign:"center",padding:"3rem"}}>
              <i className="fas fa-check-circle" style={{fontSize:48,color:"#16a34a",marginBottom:12,display:"block"}}/>
              <p className="empty-msg">All caught up!</p></div></div>
          : shownNotifs.map(n=>(
            <div className="card notif-card" key={n.id}
              style={{borderLeft:`3px solid ${NOTIF_COLOR[n.type]}`,background:!n.read?"var(--notif-unread)":"var(--card-bg)"}}>
              <div className="notif-icon" style={{background:NOTIF_COLOR[n.type]+"22",color:NOTIF_COLOR[n.type]}}>{NOTIF_ICON[n.type]}</div>
              <div className="notif-body">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div>
                    <h4 className="notif-title">{n.title}</h4>
                    <p className="notif-msg">{n.message}</p>
                    {n.reqId && <span className="badge" style={{background:"#f3f4f6",color:"#374151",marginTop:6,display:"inline-block"}}>{n.reqId}</span>}
                  </div>
                  <span className="act-time" style={{whiteSpace:"nowrap",marginLeft:12}}>{n.time}</span>
                </div>
                <div className="notif-actions">
                  {!n.read && <button className="ghost-btn" onClick={()=>setNotifs(notifs.map(x=>x.id===n.id?{...x,read:true}:x))}>Mark as read</button>}
                  <button className="ghost-btn" style={{color:"#ef4444"}} onClick={()=>setNotifs(notifs.filter(x=>x.id!==n.id))}><i className="fas fa-trash-alt"/> Delete</button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>;
  }

  function PageProfile() {
    return <div className="profile-container">
      <div className="page-heading">
        <div><h2 className="page-title">My Profile</h2><p className="page-sub">Manage your account information</p></div>
        <button className={`btn-outline${editing?" danger":""}`} onClick={()=>setEditing(!editing)}>
          {editing?<><i className="fas fa-times"/> Cancel</>:<><i className="fas fa-edit"/> Edit Profile</>}
        </button>
      </div>

      <div className="profile-row">
        <div className="left-column">
          <div className="card" style={{marginBottom:"0"}}>
            <div className="card-header"><h3 className="card-title">Personal Information</h3></div>
            <div className="card-body">
              {editing
                ? <div style={{display:"grid",gap:"1rem"}}>
                    {[["Full Name",profileName,setProfileName,"text"],["Email",profileEmail,setProfileEmail,"email"],["Mobile",profileMobile,setProfileMobile,"tel"]].map(([l,v,fn,t])=>(
                      <div className="form-group" key={l}><label className="form-label">{l}</label><input className="input-field" style={{paddingLeft:12}} type={t} value={v} onChange={e=>fn(e.target.value)}/></div>
                    ))}
                    <div style={{display:"flex",gap:8,marginTop:4}}>
                      <button className="btn-primary" onClick={()=>{setEditing(false);showToast("Profile updated!","success");}}><i className="fas fa-save"/> Save Changes</button>
                      <button className="btn-outline" onClick={()=>setEditing(false)}>Cancel</button>
                    </div>
                  </div>
                : <div style={{display:"grid",gap:"1rem"}}>
                    {[["Full Name",profileName],["Email",profileEmail],["Mobile",profileMobile]].map(([l,v])=>(
                      <div key={l}><p className="form-label">{l}</p><p style={{fontWeight:600,color:"var(--text-main)"}}>{v||"—"}</p></div>
                    ))}
                  </div>}
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="card">
            <div className="card-header"><h3 className="card-title">Registered Documents</h3></div>
            <div className="card-body">
              {["PAN Card","GST Certificate","Business Registration"].map(doc=>(
                <div className="method-card" key={doc}>
                  <strong style={{color:"var(--text-main)"}}>{doc}</strong>
                  <p className="act-time">Verified on 15 Jan 2024</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>;
  }

  function PageSettings() {
    return <div style={{maxWidth:680}}>
      <div className="page-heading"><div><h2 className="page-title">Settings</h2><p className="page-sub">Manage your preferences</p></div></div>
      <div className="card"><div className="card-body">
        <div className="setting-row">
          <div><p style={{fontWeight:600,color:"var(--text-main)"}}>Dark Mode</p><p className="act-time">Toggle dark/light theme</p></div>
          <button className={`toggle-btn${darkMode?" on":""}`} onClick={toggleDark}><span className="toggle-thumb"/></button>
        </div>
        <div className="setting-row">
          <div><p style={{fontWeight:600,color:"var(--text-main)"}}>Email Notifications</p><p className="act-time">Receive email updates</p></div>
          <button className="toggle-btn on"><span className="toggle-thumb"/></button>
        </div>
        <div className="setting-row">
          <div><p style={{fontWeight:600,color:"var(--text-main)"}}>Language</p><p className="act-time">Interface language</p></div>
          <select className="select-field" style={{width:"auto"}}><option>English</option><option>Hindi</option></select>
        </div>
      </div></div>
    </div>;
  }

  function PageNewRequest() {
    const allLinks = [
      ...serviceItems.flatMap(s=>s.links.map(l=>({label:l.label,href:l.href,icon:s.icon}))),
      {label:"Company Registration",href:"/company",icon:"fas fa-building"},
      {label:"Firm Registration",href:"/firm",icon:"fas fa-briefcase"},
      {label:"Udhyam Registration",href:"/udhyam",icon:"fas fa-store"},
    ];
    return <>
      <div className="page-heading"><div><h2 className="page-title">New Service Request</h2><p className="page-sub">Select a service to get started</p></div></div>
      <div className="service-grid">
        {allLinks.map(item=>(
          <Link key={item.href} href={item.href} className="service-card service-link-card">
            <i className={item.icon}/><h3 style={{fontSize:14}}>{item.label}</h3>
          </Link>
        ))}
      </div>
    </>;
  }

  const pages = { dashboard:<PageDashboard/>, "my-requests":<PageMyRequests/>, documents:<PageDocuments/>,
    billing:<PageBilling/>, notifications:<PageNotifications/>, profile:<PageProfile/>,
    settings:<PageSettings/>, "new-request":<PageNewRequest/> };

  return (
    <>
      <ToastContainer/>
      {sidebarOpen && <div className="overlay" onClick={()=>setSidebarOpen(false)}/>}
      <div className="layout">
        {/* SIDEBAR */}
        <aside className={`sidebar${sidebarOpen?" open":""}${collapsed?" collapsed":""}`}>
          <div className="sb-brand">
            <div className="brand-logo">CA</div>
            {!collapsed && <span className="brand-name">CASync</span>}
            <button className="collapse-btn" onClick={()=>setCollapsed(!collapsed)} title={collapsed?"Expand sidebar":"Collapse sidebar"}>
              <i className={`fas fa-${collapsed?"chevron-right":"chevron-left"}`}/>
            </button>
            <button className="sb-close" onClick={()=>setSidebarOpen(false)}><i className="fas fa-times"/></button>
          </div>
          <nav className="sb-nav">
            {navItems.map(item=>(
              <button key={item.id} className={`nav-item${activePage===item.id?" active":""}`} onClick={()=>navigate(item.id)} title={item.label}>
                <i className={item.icon}/>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge>0 && <span className="nav-badge">{item.badge}</span>}
                {collapsed && item.badge>0 && <span className="nav-badge-dot"/>}
              </button>
            ))}
            {!collapsed && <div className="nav-divider">Services</div>}
            {collapsed && <div className="nav-divider-dot"/>}
            {serviceItems.map(svc=>(
              <div key={svc.id}>
                <button className={`nav-item${svcDropdown===svc.id+"_sb"?" active":""}`} onClick={()=>!collapsed&&setSvcDropdown(svcDropdown===svc.id+"_sb"?"":svc.id+"_sb")} title={svc.label}>
                  <i className={svc.icon}/>
                  {!collapsed && <><span>{svc.label}</span><i className={`fas fa-chevron-${svcDropdown===svc.id+"_sb"?"up":"down"} nav-chevron`}/></>}
                </button>
                {!collapsed && svcDropdown===svc.id+"_sb" && (
                  <div className="nav-sub">
                    {svc.links.map(l=><Link key={l.href} href={l.href} className="nav-sub-item" onClick={()=>setSidebarOpen(false)}><i className="fas fa-angle-right"/>{l.label}</Link>)}
                  </div>
                )}
              </div>
            ))}
            <Link href="/company" className="nav-item" onClick={()=>setSidebarOpen(false)} title="Company"><i className="fas fa-building"/>{!collapsed && <span>Company</span>}</Link>
            <div>
              <button className={`nav-item${svcDropdown==="other_sb"?" active":""}`} onClick={()=>!collapsed&&setSvcDropdown(svcDropdown==="other_sb"?"":"other_sb")} title="Other Services">
                <i className="fas fa-ellipsis-h"/>{!collapsed && <><span>Other Services</span><i className={`fas fa-chevron-${svcDropdown==="other_sb"?"up":"down"} nav-chevron`}/></>}
              </button>
              {!collapsed && svcDropdown==="other_sb" && (
                <div className="nav-sub">
                  <Link href="/firm" className="nav-sub-item" onClick={()=>setSidebarOpen(false)}><i className="fas fa-angle-right"/>Firm Registration</Link>
                  <Link href="/udhyam" className="nav-sub-item" onClick={()=>setSidebarOpen(false)}><i className="fas fa-angle-right"/>Udhyam Registration</Link>
                </div>
              )}
            </div>
          </nav>
          <div className="sb-bottom">
            {!collapsed && (
              <div className="user-pill">
                <div className="user-avatar">{userInitials}</div>
                <div className="user-meta">
                  <span className="user-name-sm">{userName}</span>
                  <span className="user-email-sm">{userEmail}</span>
                  <span className="user-role">Client</span>
                </div>
              </div>
            )}
            {collapsed && <div className="user-avatar" style={{margin:"8px auto"}}>{userInitials}</div>}
            <button className="bottom-btn" onClick={toggleDark} title={darkMode?"Light mode":"Dark mode"}>
              <i className={`fas fa-${darkMode?"sun":"moon"}`}/>
              {!collapsed && <span>{darkMode?"Light":"Dark"}</span>}
            </button>
            <button className="bottom-btn logout" onClick={handleLogout} title="Logout">
              <i className="fas fa-sign-out-alt"/>
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main-wrap">
          <header className="topbar">
            <button className="hamburger" onClick={()=>setSidebarOpen(true)}><i className="fas fa-bars"/></button>
            <h1 className="topbar-title">CA Services Platform</h1>
            <button className="topbar-icon" onClick={()=>navigate("settings")}><i className="fas fa-cog"/></button>
          </header>
          <main className="content">{pages[activePage] || pages.dashboard}</main>
        </div>
      </div>

      <style jsx global>{`
        :root{--sb-bg:#0f172a;--sb-hover:#1e293b;--sb-active:#2563eb;--sb-text:#94a3b8;--sb-text-on:#f1f5f9;--sb-border:#1e293b;--sb-width:252px;--sb-collapsed-width:64px;--top-bg:#fff;--top-border:#e2e8f0;--top-text:#0f172a;--content-bg:#f1f5f9;--card-bg:#fff;--card-border:#e2e8f0;--text-main:#0f172a;--text-muted:#64748b;--accent:#2563eb;--notif-unread:#eff6ff;}
        [data-theme="dark"]{--top-bg:#1e293b;--top-border:#334155;--top-text:#f1f5f9;--content-bg:#0f172a;--card-bg:#1e293b;--card-border:#334155;--text-main:#f1f5f9;--text-muted:#94a3b8;--notif-unread:#1e3a5f;}
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Segoe UI',system-ui,sans-serif;}
        a{text-decoration:none;color:inherit;}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:40;}
        .layout{display:flex;min-height:100vh;background:var(--content-bg);}
        .sidebar{width:var(--sb-width);background:var(--sb-bg);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:50;transition:transform .28s cubic-bezier(.4,0,.2,1),width .25s ease;}
        .sidebar.collapsed{width:var(--sb-collapsed-width);}
        .sidebar.collapsed .nav-item{justify-content:center;padding:10px 0;}
        .sidebar.collapsed .nav-item i{width:auto;font-size:16px;}
        .sidebar.collapsed .bottom-btn{justify-content:center;padding:9px 0;}
        .sidebar.collapsed .bottom-btn i{width:auto;}
        .collapse-btn{background:none;border:none;color:var(--sb-text);cursor:pointer;font-size:12px;padding:4px 6px;border-radius:6px;margin-left:auto;transition:background .15s,color .15s;flex-shrink:0;}
        .collapse-btn:hover{background:var(--sb-hover);color:var(--sb-text-on);}
        .nav-badge-dot{width:8px;height:8px;background:#ef4444;border-radius:50%;position:absolute;top:6px;right:6px;}
        .nav-item{position:relative;}
        .nav-divider-dot{height:1px;background:var(--sb-border);margin:8px 12px;}
        .sb-brand{display:flex;align-items:center;gap:10px;padding:18px 16px;border-bottom:1px solid var(--sb-border);flex-shrink:0;}
        .brand-logo{width:32px;height:32px;background:var(--sb-active);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0;}
        .brand-name{font-size:16px;font-weight:700;color:var(--sb-text-on);flex:1;}
        .sb-close{background:none;border:none;color:var(--sb-text);cursor:pointer;font-size:16px;display:none;}
        .sb-nav{flex:1;overflow-y:auto;padding:10px 8px;scrollbar-width:thin;scrollbar-color:#334155 transparent;}
        .nav-item{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;background:none;border:none;border-radius:8px;color:var(--sb-text);font-size:13.5px;font-weight:500;cursor:pointer;text-decoration:none;transition:background .15s,color .15s;text-align:left;}
        .nav-item i{width:18px;text-align:center;font-size:14px;flex-shrink:0;}
        .nav-item:hover{background:var(--sb-hover);color:var(--sb-text-on);}
        .nav-item.active{background:var(--sb-active);color:#fff;}
        .nav-badge{margin-left:auto;background:#ef4444;color:#fff;border-radius:9999px;font-size:10px;font-weight:700;padding:1px 7px;}
        .nav-chevron{margin-left:auto;font-size:11px!important;width:auto!important;}
        .nav-divider{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#475569;padding:14px 12px 6px;}
        .nav-sub{padding-left:16px;margin:2px 0;}
        .nav-sub-item{display:flex;align-items:center;gap:8px;padding:8px 12px;color:var(--sb-text);font-size:12.5px;text-decoration:none;border-radius:6px;background:none;border:none;cursor:pointer;width:100%;text-align:left;transition:background .15s,color .15s;}
        .nav-sub-item:hover{background:var(--sb-hover);color:var(--sb-text-on);}
        .nav-sub-item i{font-size:11px;}
        .sb-bottom{border-top:1px solid var(--sb-border);padding:12px 8px;flex-shrink:0;}
        .user-pill{display:flex;align-items:center;gap:10px;padding:10px 12px;margin-bottom:4px;}
        .user-avatar{width:34px;height:34px;border-radius:50%;background:var(--sb-active);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0;}
        .user-meta{display:flex;flex-direction:column;overflow:hidden;}
        .user-name-sm{font-size:13px;font-weight:600;color:var(--sb-text-on);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .user-email-sm{font-size:11px;color:var(--sb-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .user-role{font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;}
        .bottom-btn{display:flex;align-items:center;gap:10px;width:100%;padding:9px 12px;background:none;border:none;border-radius:8px;color:var(--sb-text);font-size:13px;font-weight:500;cursor:pointer;transition:background .15s,color .15s;text-align:left;}
        .bottom-btn i{width:18px;text-align:center;}
        .bottom-btn:hover{background:var(--sb-hover);color:var(--sb-text-on);}
        .bottom-btn.logout:hover{background:#7f1d1d;color:#fca5a5;}
        .main-wrap{flex:1;margin-left:var(--sb-width);display:flex;flex-direction:column;min-height:100vh;transition:margin-left .28s;}
        .sidebar.collapsed ~ .main-wrap, .layout:has(.sidebar.collapsed) .main-wrap{margin-left:var(--sb-collapsed-width)!important;}
        .topbar{background:var(--top-bg);border-bottom:1px solid var(--top-border);height:58px;display:flex;align-items:center;padding:0 24px;gap:16px;position:sticky;top:0;z-index:30;}
        .hamburger{background:none;border:none;font-size:18px;color:var(--top-text);cursor:pointer;display:none;padding:6px;}
        .topbar-title{font-size:17px;font-weight:600;color:var(--top-text);flex:1;}
        .topbar-icon{margin-left:auto;background:none;border:none;font-size:18px;color:var(--text-muted);cursor:pointer;padding:6px;border-radius:8px;transition:background .15s;}
        .topbar-icon:hover{background:var(--card-border);}
        .content{padding:28px;flex:1;}
        .page-heading{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px;}
        .page-title{font-size:26px;font-weight:700;color:var(--text-main);}
        .page-sub{font-size:14px;color:var(--text-muted);margin-top:2px;}
        .btn-primary{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;}
        .btn-primary:hover{background:#1d4ed8;}
        .btn-outline{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:none;border:1px solid var(--card-border);border-radius:8px;font-size:13px;font-weight:500;color:var(--text-main);cursor:pointer;}
        .btn-outline:hover{background:var(--content-bg);}
        .btn-outline.danger{border-color:#ef4444;color:#ef4444;}
        .ghost-btn{background:none;border:none;color:var(--text-muted);font-size:12px;cursor:pointer;padding:4px 8px;border-radius:6px;}
        .ghost-btn:hover{background:var(--content-bg);color:var(--text-main);}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px;}
        .stat-card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:18px 20px;}
        .stat-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
        .stat-label{font-size:13px;color:var(--text-muted);}
        .stat-value{font-size:28px;font-weight:700;color:var(--text-main);}
        .card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;overflow:hidden;}
        .card-header{padding:18px 20px 0;}
        .card-title{font-size:16px;font-weight:700;color:var(--text-main);}
        .card-sub{font-size:13px;color:var(--text-muted);margin-top:2px;}
        .card-body{padding:16px 20px;}
        .empty-msg{color:var(--text-muted);font-size:14px;}
        .section-heading{font-size:15px;font-weight:700;color:var(--text-main);margin-bottom:14px;margin-top:24px;}
        .badge{display:inline-block;padding:2px 10px;border-radius:9999px;font-size:12px;font-weight:600;}
        .req-row{display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--card-border);}
        .req-row:last-child{border-bottom:none;}
        .req-id{font-weight:700;font-size:14px;color:var(--text-main);}
        .req-assigned{font-size:13px;color:var(--text-muted);}
        .activity-row{display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid var(--card-border);}
        .activity-row:last-child{border-bottom:none;}
        .act-text{font-size:14px;color:var(--text-main);}
        .act-time{font-size:12px;color:var(--text-muted);margin-top:2px;}
        .service-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px;}
        .service-card{background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:20px;text-align:center;transition:transform .2s,box-shadow .2s;cursor:pointer;color:var(--text-main);}
        .service-card:hover{transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,.08);}
        .service-card i{font-size:2rem;color:var(--accent);margin-bottom:12px;display:block;}
        .service-card h3{font-size:15px;font-weight:700;color:var(--text-main);margin-bottom:6px;}
        .service-card p{font-size:13px;color:var(--text-muted);}
        .card-toggle{background:none;border:none;cursor:pointer;color:inherit;width:100%;}
        .dropdown-content{display:grid;gap:8px;margin-top:14px;text-align:left;}
        .dropdown-link{display:block;padding:9px 14px;background:var(--content-bg);border:1px solid var(--card-border);border-radius:8px;font-size:13px;font-weight:600;color:var(--accent);}
        .dropdown-link:hover{background:var(--card-border);}
        .other-card{text-align:left;}
        .other-links{display:grid;gap:8px;margin-top:14px;}
        .other-links a,.other-more{display:block;padding:9px 14px;background:var(--content-bg);border:1px solid var(--card-border);border-radius:8px;font-size:13px;font-weight:600;color:var(--accent);cursor:pointer;width:100%;text-align:left;}
        .other-links a:hover,.other-more:hover{background:var(--card-border);}
        .table-wrap{overflow-x:auto;}
        .data-table{width:100%;border-collapse:collapse;font-size:14px;}
        .data-table thead tr{background:var(--content-bg);}
        .data-table th{padding:12px 16px;text-align:left;font-size:13px;font-weight:600;color:var(--text-muted);border-bottom:1px solid var(--card-border);}
        .data-table td{padding:12px 16px;border-bottom:1px solid var(--card-border);color:var(--text-main);}
        .data-table tr:last-child td{border-bottom:none;}
        .data-table tbody tr:hover{background:var(--content-bg);}
        .filter-row{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;}
        .search-wrap{position:relative;}
        .search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:14px;}
        .input-field{width:100%;padding:9px 12px 9px 36px;border:1px solid var(--card-border);border-radius:8px;font-size:14px;background:var(--card-bg);color:var(--text-main);outline:none;}
        .input-field:focus{border-color:var(--accent);}
        .select-field{padding:9px 12px;border:1px solid var(--card-border);border-radius:8px;font-size:14px;background:var(--card-bg);color:var(--text-main);outline:none;cursor:pointer;}
        .doc-card{display:flex!important;align-items:center;gap:16px;padding:16px 20px!important;}
        .doc-icon-wrap{width:48px;height:48px;border-radius:10px;background:#dbeafe;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .doc-icon-wrap i{font-size:22px;color:#2563eb;}
        .doc-info{flex:1;}
        .doc-name{font-size:15px;font-weight:600;color:var(--text-main);margin-bottom:6px;}
        .doc-meta{display:flex;align-items:center;gap:12px;font-size:12px;color:var(--text-muted);flex-wrap:wrap;}
        /* Profile two-column layout */
        .profile-container{max-width:980px;margin:0 auto;padding:0 8px;}
        .profile-row{display:flex;gap:20px;align-items:stretch;}
        .profile-row .left-column{flex:1;}
        .profile-row .right-column{flex:0 0 320px;}
        .profile-row .card{height:100%;display:flex;flex-direction:column;}
        .profile-row .card .card-body{flex:1;}
        @media(max-width:880px){.profile-row{flex-direction:column}.profile-row .right-column{flex:1}}
        .pay-row{display:flex;justify-content:space-between;align-items:center;padding:14px;border:1px solid var(--card-border);border-radius:10px;margin-bottom:10px;background:#f0fdf4;}
        .method-card{padding:16px;border:1px solid var(--card-border);border-radius:10px;margin-bottom:12px;}
        .tabs-row{display:flex;gap:4px;margin-bottom:16px;background:var(--content-bg);padding:4px;border-radius:10px;width:fit-content;}
        .tab-btn{padding:8px 18px;border:none;background:none;border-radius:8px;font-size:14px;font-weight:500;color:var(--text-muted);cursor:pointer;transition:background .15s,color .15s;}
        .tab-btn.active{background:var(--card-bg);color:var(--text-main);font-weight:600;box-shadow:0 1px 4px rgba(0,0,0,.08);}
        .notif-card{display:flex!important;align-items:flex-start;gap:14px;padding:16px 20px!important;}
        .notif-icon{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;flex-shrink:0;}
        .notif-body{flex:1;}
        .notif-title{font-size:14px;font-weight:700;color:var(--text-main);}
        .notif-msg{font-size:13px;color:var(--text-muted);margin-top:2px;}
        .notif-actions{display:flex;gap:4px;margin-top:10px;}
        .form-group{display:grid;gap:6px;}
        .form-label{font-size:13px;font-weight:500;color:var(--text-muted);}
        .setting-row{display:flex;justify-content:space-between;align-items:center;padding:16px 0;border-bottom:1px solid var(--card-border);}
        .setting-row:last-child{border-bottom:none;}
        .toggle-btn{width:44px;height:24px;border-radius:12px;background:#cbd5e1;border:none;cursor:pointer;position:relative;transition:background .2s;}
        .toggle-btn.on{background:var(--accent);}
        .toggle-thumb{position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .2s;display:block;}
        .toggle-btn.on .toggle-thumb{transform:translateX(20px);}
        @media(max-width:1024px){.stats-grid{grid-template-columns:repeat(2,1fr);}}
        @media(max-width:768px){.sidebar{transform:translateX(-100%);}.sidebar.open{transform:translateX(0);}.sidebar.collapsed{width:var(--sb-width);}.sb-close{display:block;}.hamburger{display:block;}.main-wrap{margin-left:0!important;}.content{padding:16px;}.stats-grid{grid-template-columns:repeat(2,1fr);}.filter-row{grid-template-columns:1fr;}.page-title{font-size:22px;}.collapse-btn{display:none;}}
      `}</style>
    </>
  );
}