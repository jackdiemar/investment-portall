"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { SessionRole } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/holdings", label: "Holdings" },
  { href: "/updates", label: "Updates" },
  { href: "/data-room", label: "Data room" },
];

export function PortalShell({ children, role }: { children: ReactNode; role: SessionRole }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand-lockup" href="/dashboard" aria-label="Diemar Equities dashboard">
            <span className="brand-mark">DE</span>
            <span>
              <span className="brand-name">Diemar Equities</span>
              <span className="brand-subtitle">Investment Portal</span>
            </span>
          </Link>

          <nav className="primary-nav" aria-label="Primary navigation">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} className={active ? "nav-link active" : "nav-link"} href={item.href}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="header-actions">
            <span className="role-badge">{role === "admin" ? "Admin" : "Investor"}</span>
            <Link className="text-link" href="/logout">
              Log out
            </Link>
          </div>
        </div>
      </header>
      <main id="main" className="container page-frame">
        {children}
      </main>
    </div>
  );
}
