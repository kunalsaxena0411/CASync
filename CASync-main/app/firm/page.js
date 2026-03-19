"use client";

import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function FirmPage() {
  return (
    <>
      <SiteHeader />
      <main className="main-content">
        <div className="container">
          <Link href="/" className="back-button">
            <i className="fas fa-arrow-left" /> Back to Home
          </Link>

          <section className="service-content">
            <h2>Firm Registration Services</h2>
            <p>Complete support for partnership setup, documentation, compliance, and advisory services.</p>
            <div className="service-features">
              <div className="feature-card"><h3><i className="fas fa-handshake" /> Partnership Firm Registration</h3><p>End-to-end support for starting and registering your partnership firm.</p></div>
              <div className="feature-card"><h3><i className="fas fa-file-contract" /> Partnership Deed</h3><p>Professional drafting and guidance for partnership deed preparation.</p></div>
              <div className="feature-card"><h3><i className="fas fa-clipboard-list" /> Compliance Services</h3><p>Ongoing filing and compliance support for registered firms.</p></div>
              <div className="feature-card"><h3><i className="fas fa-chart-line" /> Business Advisory</h3><p>Guidance to help firms with planning, setup, and operational decisions.</p></div>
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
