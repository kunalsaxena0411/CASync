"use client";

import { useEffect, useState } from "react";

export default function AdminDashboardPage() {

const [activeView, setActiveView] = useState("loginPage");

const [adminEmail, setAdminEmail] = useState("");
const [adminPassword, setAdminPassword] = useState("");

const [newAdminEmail, setNewAdminEmail] = useState("");
const [newAdminPassword, setNewAdminPassword] = useState("");

const [users, setUsers] = useState([]);

async function loadUsers() {

try {

const token = localStorage.getItem("adminToken");

const res = await fetch("/api/admin/users",{
headers:{
Authorization:`Bearer ${token}`
}
});

const data = await res.json();

if(data.success){
setUsers(data.users);
}

}catch(error){
console.log("Error loading users");
}

}

useEffect(()=>{

const requestedView = new URLSearchParams(window.location.search).get("view");

if(requestedView==="dashboard"){
setActiveView("dashboard");
loadUsers();
}else{
setActiveView("loginPage");
}

},[]);

async function login(){

try{

const res = await fetch("/api/admin/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email:adminEmail,
password:adminPassword
})
});

const data = await res.json();

if(data.success){

localStorage.setItem("adminToken",data.token);

setActiveView("dashboard");

loadUsers();

}else{

alert(data.message || "Incorrect Credentials");

}

}catch(error){

alert("Login failed");

}

}

async function addAdmin(){

if(!newAdminEmail || !newAdminPassword){
alert("Please fill in all fields");
return;
}

try{

const token = localStorage.getItem("adminToken");

const res = await fetch("/api/admin/add-admin",{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
email:newAdminEmail,
password:newAdminPassword
})
});

const data = await res.json();

if(data.success){

alert("Admin Added Successfully");

setNewAdminEmail("");
setNewAdminPassword("");

setActiveView("dashboard");

}else{

alert(data.message || "Failed to add admin");

}

}catch(error){

alert("Error adding admin");

}

}

function openUsers(){
loadUsers();
setActiveView("registeredUsers");
}

function goBack(){
setActiveView("dashboard");
}

return(

<div className="page">

<div className="container">

<div className={`login-container ${activeView==="loginPage"?"active":""}`}>
<h2>Admin Login</h2>

<input
type="email"
placeholder="Enter Email"
value={adminEmail}
onChange={(e)=>setAdminEmail(e.target.value)}
/>

<input
type="password"
placeholder="Enter Password"
value={adminPassword}
onChange={(e)=>setAdminPassword(e.target.value)}
/>

<button onClick={login}>Login</button>

</div>

<div className={`admin-dashboard ${activeView==="dashboard"?"active":""}`}>
<h1>Welcome Admin of Total Tax Hub</h1>

<button onClick={()=>setActiveView("addAdmin")}>Add Admin</button>

<button onClick={openUsers}>Registered Users</button>

<button onClick={()=>setActiveView("adminData")}>Admin Data</button>

<button onClick={()=>setActiveView("comingSoon")}>Add News</button>

</div>

<div className={`admin-section ${activeView==="addAdmin"?"active":""}`}>
<h2>Add New Admin</h2>

<input
type="email"
placeholder="New Admin Email"
value={newAdminEmail}
onChange={(e)=>setNewAdminEmail(e.target.value)}
/>

<input
type="password"
placeholder="New Admin Password"
value={newAdminPassword}
onChange={(e)=>setNewAdminPassword(e.target.value)}
/>

<button onClick={addAdmin}>Save</button>

<button onClick={goBack}>Back</button>

</div>

<div className={`admin-section ${activeView==="registeredUsers"?"active":""}`}>
<h2>Registered Users</h2>

{users.length===0?(

<p>No users found</p>
):(
users.map((user)=>(
<p key={user._id}>
Name: {user.name} | Email: {user.email} | Phone: {user.mobile}
</p>
))
)}

<button onClick={goBack}>Back</button>

</div>

<div className={`admin-section ${activeView==="adminData"?"active":""}`}>
<h2>Admin Data</h2>
<p>Admin list will appear here</p>
<button onClick={goBack}>Back</button>
</div>

<div className={`admin-section ${activeView==="comingSoon"?"active":""}`}>
<h2>Coming Soon</h2>
<button onClick={goBack}>Back</button>
</div>

</div>

<style jsx>{`

.page{
font-family:Arial,sans-serif;
text-align:center;
background:#f0f8ff;
padding:50px 0;
min-height:100vh;
}

.container{
max-width:800px;
margin:auto;
background:white;
padding:20px;
border-radius:10px;
box-shadow:0 4px 8px rgba(0,0,0,0.2);
}

.login-container,
.admin-dashboard,
.admin-section{
display:none;
padding:20px;
}

.active{
display:block!important;
}

button{
padding:12px 20px;
margin:10px;
cursor:pointer;
background:#007bff;
color:white;
border:none;
border-radius:5px;
}

button:hover{
background:#0056b3;
}

input{
width:90%;
padding:10px;
margin:10px 0;
border:1px solid #ccc;
border-radius:5px;
}

.admin-section{
background:#f9f9f9;
border-radius:10px;
}

`}</style>

</div>

);

}
