"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function HomePage() {
  function showComingSoon(event) {
    event.preventDefault();
    alert("Coming Soon!");
  }

  return (
    <>
      <SiteHeader title="TOTALTAXHUB.COM" />

      <nav className="main-nav">
        <div className="container">
          <div className="nav-row">
            <ul>
              <li>
                <Link href="/" className="active">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/register">Register</Link>
              </li>
              <li>
                <Link href="/login">Login</Link>
              </li>
              <li>
                <a href="#" onClick={showComingSoon}>
                  News
                </a>
              </li>
              <li>
                <a href="#" onClick={showComingSoon}>
                  Query
                </a>
              </li>
            </ul>

            <div className="nav-admin">
              <Link href="/admin-dashboard?view=login">Admin Login</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <div className="container">
          <section className="services">
            <h2>Services Provided</h2>
            <div className="service-grid">
              <Link href="/income-tax" className="service-card">
                <i className="fas fa-file-invoice" />
                <h3>Income Tax Return</h3>
              </Link>
              <Link href="/gst" className="service-card">
                <i className="fas fa-percentage" />
                <h3>Goods and Service Tax</h3>
              </Link>
              <Link href="/udhyam" className="service-card">
                <i className="fas fa-id-card" />
                <h3>UDHYAM Aadhar</h3>
              </Link>
              <Link href="/firm" className="service-card">
                <i className="fas fa-building" />
                <h3>Firm Registration</h3>
              </Link>
              <Link href="/company" className="service-card">
                <i className="fas fa-landmark" />
                <h3>Company Registration</h3>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter text="\u00a9 2025 TOTALTAXHUB.COM. All rights reserved." />
    </>
  );
}
