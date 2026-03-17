"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function RegisterPage() {
  const router = useRouter();

  function handleRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").toLowerCase();
    const mobile = String(formData.get("mobile") || "").trim();
    const password = String(formData.get("password") || "");

    const user = { name, email, mobile, password };
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const existingUser = users.find((entry) => entry.email === email);

    if (existingUser) {
      alert("User with this email already exists. Please login instead.");
      return;
    }

    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Registration successful! Please login with your email and password.");
    router.push("/login");
  }

  return (
    <>
      <SiteHeader />
      <main className="main-content">
        <div className="container">
          <Link href="/" className="back-button">
            <i className="fas fa-arrow-left" /> Back to Home
          </Link>

          <div className="auth-container">
            <h2>
              <i className="fas fa-user-plus" /> Register
            </h2>
            <form id="registerForm" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email ID</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit mobile number"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
              </div>
              <button type="submit" className="submit-btn">
                Register
              </button>
            </form>
            <div className="auth-links">
              <p>
                Already have an account? <Link href="/login">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />

      <style jsx>{`
        .auth-container {
          max-width: 500px;
          margin: 40px auto;
          padding: 30px;
          background-color: var(--white);
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .auth-container h2 {
          text-align: center;
          margin-bottom: 30px;
          color: var(--primary-color);
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: var(--text-color);
        }
        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        .form-group input:focus {
          outline: none;
          border-color: var(--secondary-color);
        }
        .submit-btn {
          width: 100%;
          padding: 12px;
          background-color: var(--secondary-color);
          color: var(--white);
          border: none;
          border-radius: 4px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .submit-btn:hover {
          background-color: #2980b9;
        }
        .auth-links {
          text-align: center;
          margin-top: 20px;
        }
        .auth-links :global(a) {
          color: var(--secondary-color);
          text-decoration: none;
        }
        .auth-links :global(a:hover) {
          text-decoration: underline;
        }
        .back-button {
          display: inline-block;
          padding: 10px 20px;
          background-color: var(--secondary-color);
          color: var(--white);
          text-decoration: none;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        .back-button:hover {
          background-color: #2980b9;
        }
      `}</style>
    </>
  );
}
