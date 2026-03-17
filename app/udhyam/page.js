"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function UdhyamPage() {
  return (
    <>
      <SiteHeader />
      <main className="main-content">
        <div className="container">
          <Link href="/" className="back-button">
            <i className="fas fa-arrow-left" /> Back to Home
          </Link>

          <section className="service-content">
            <h2>UDHYAM Aadhar Registration Services</h2>
            <p>Complete assistance for MSME registration through UDHYAM Aadhar portal.</p>
            <div className="service-features">
              <div className="feature-card"><h3><i className="fas fa-id-card" /> New Registration</h3><p>Assistance in new UDHYAM Aadhar registration for your business.</p></div>
              <div className="feature-card"><h3><i className="fas fa-sync" /> Updates &amp; Modifications</h3><p>Help in updating existing UDHYAM registration details.</p></div>
              <div className="feature-card"><h3><i className="fas fa-check-circle" /> Compliance</h3><p>Guidance on maintaining compliance with MSME regulations.</p></div>
              <div className="feature-card"><h3><i className="fas fa-hands-helping" /> Benefits Consultation</h3><p>Information about various benefits available for MSME registered businesses.</p></div>
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
