"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [openDropdown, setOpenDropdown] = useState("");
  const dashboardSections = [
    {
      id: "income-tax",
      title: "Income Tax",
      icon: "fas fa-file-invoice",
      links: [
        { href: "/income-tax", label: "Open Income Tax" },
        { href: "/add-pan", label: "Add PAN" },
        { href: "/income-tax-query", label: "Income Tax Query" },
        { href: "/filereturn", label: "File Return" }
      ]
    },
    {
      id: "gst",
      title: "GST",
      icon: "fas fa-percentage",
      links: [
        { href: "/gst", label: "Open GST" },
        { href: "/gst-registration", label: "GST Registration" },
        { href: "/gst-return", label: "File GST Return" }
      ]
    }
  ];

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.replace("/login");
      return;
    }

    const user = JSON.parse(currentUser);
    setUserName(user.name || "User");
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isLoggedIn");
    document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    router.push("/login");
  }

  function showComingSoon() {
    alert("Coming Soon");
  }

  function toggleDropdown(service) {
    setOpenDropdown((current) => (current === service ? "" : service));
  }

  return (
    <>
      <SiteHeader />
      <main className="main-content">
        <div className="container">
          <div className="dashboard-container">
            <div className="welcome-section">
              <div className="user-info">
                <h2>
                  Welcome, <span id="userName">{userName}</span>!
                </h2>
                <p>Access all your tax and business services from one place</p>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <i className="fas fa-sign-out-alt" /> Logout
              </button>
            </div>

            <div className="service-grid">
              {dashboardSections.map((section) => {
                const isOpen = openDropdown === section.id;

                return (
                  <div key={section.id} className={`service-card dropdown-card ${isOpen ? "open" : ""}`}>
                    <button type="button" className="card-toggle" onClick={() => toggleDropdown(section.id)}>
                      <i className={section.icon} />
                      <h3>{section.title}</h3>
                      <p>{isOpen ? "Hide options" : "View options"}</p>
                    </button>

                    {isOpen ? (
                      <div className="dropdown-content">
                        {section.links.map((link) => (
                          <Link key={link.href} href={link.href} className="dropdown-link">
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}

              <Link href="/company" className="service-card service-link-card">
                <i className="fas fa-building" />
                <h3>Company</h3>
                <p>Explore registration and compliance services</p>
              </Link>

              <div className="service-card other-services-card">
                <i className="fas fa-ellipsis-h" />
                <h3>Other</h3>
                <div className="other-links">
                  <Link href="/firm">Firm Registration</Link>
                  <Link href="/udhyam">Udhyam Registration</Link>
                  <button
                    type="button"
                    onClick={showComingSoon}
                    className="secondary-action"
                  >
                    More Services
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />

      <style jsx>{`
        .dashboard-container {
          padding: 20px;
          margin: 20px 0;
        }
        .welcome-section {
          background-color: var(--white);
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .user-info {
          flex-grow: 1;
        }
        .logout-btn {
          padding: 10px 20px;
          background-color: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .logout-btn:hover {
          background-color: #c82333;
        }
        .service-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          padding: 20px 0;
          align-items: start;
        }
        .service-card {
          background-color: var(--white);
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          transition:
            transform 0.3s,
            box-shadow 0.3s;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          position: relative;
        }
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .service-card i {
          font-size: 2.5em;
          color: var(--secondary-color);
          margin-bottom: 15px;
        }
        .service-card h3 {
          margin: 10px 0;
          color: var(--primary-color);
        }
        .card-toggle {
          width: 100%;
          background: transparent;
          border: 0;
          cursor: pointer;
          color: inherit;
        }
        .card-toggle p,
        .service-link-card p,
        .other-services-card p {
          color: #5c6b7a;
          margin-top: 8px;
        }
        .dropdown-content {
          display: grid;
          gap: 10px;
          margin-top: 18px;
          text-align: left;
        }
        .dropdown-link,
        .other-links :global(a),
        .secondary-action {
          color: var(--primary-color);
          padding: 12px 16px;
          text-decoration: none;
          display: block;
          background-color: #f7f9fc;
          border-radius: 6px;
          border: 1px solid #dbe3ec;
          font-weight: 600;
        }
        .dropdown-link:hover,
        .other-links :global(a:hover),
        .secondary-action:hover {
          background-color: #eef4fb;
        }
        .service-link-card {
          display: block;
        }
        .other-services-card {
          text-align: left;
        }
        .other-links {
          display: grid;
          gap: 10px;
          margin-top: 18px;
        }
        .secondary-action {
          width: 100%;
          text-align: left;
          cursor: pointer;
          font: inherit;
        }
        @media (max-width: 768px) {
          .welcome-section {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}
