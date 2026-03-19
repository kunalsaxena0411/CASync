"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function GstPage() {
  return (
    <>
      <SiteHeader />
      <main className="main-content">
        <div className="container">
          <Link href="/" className="back-button">
            <i className="fas fa-arrow-left" /> Back to Home
          </Link>

          <section className="service-content">
            <h2>Goods and Services Tax (GST) Services</h2>
            <p>Comprehensive GST registration, return filing, billing, and compliance support for your business.</p>

            <div className="service-features">
              <div className="feature-card"><h3><i className="fas fa-registered" /> GST Registration</h3><p>Assistance with GST registration and related document preparation.</p></div>
              <div className="feature-card"><h3><i className="fas fa-file-invoice" /> GST Returns</h3><p>Timely filing of monthly, quarterly, and annual GST returns.</p></div>
              <div className="feature-card"><h3><i className="fas fa-receipt" /> GST Billing</h3><p>Support for invoice setup, billing guidance, and GST-compliant documentation.</p></div>
              <div className="feature-card"><h3><i className="fas fa-book" /> GST Compliance</h3><p>Professional compliance support to keep your business aligned with GST requirements.</p></div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />

      <style jsx>{`
        .service-content { padding: 40px 0; }
        .service-features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 30px; }
        .feature-card { background: var(--white); padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
        .back-button { display: inline-block; padding: 10px 20px; background-color: var(--secondary-color); color: var(--white); text-decoration: none; border-radius: 4px; margin-bottom: 20px; }
        .back-button:hover { background-color: #2980b9; }
      `}</style>
    </>
  );
}
