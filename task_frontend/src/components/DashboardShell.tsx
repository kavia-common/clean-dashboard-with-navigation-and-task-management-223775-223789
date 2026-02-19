"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { clearAccessToken } from "@/lib/authToken";

function NavItem(props: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === props.href;

  return (
    <Link href={props.href} className="button" aria-current={active ? "page" : undefined}>
      {active ? "▸" : " "}
      {props.label}
    </Link>
  );
}

// PUBLIC_INTERFACE
export function DashboardShell(props: { children: React.ReactNode; userEmail?: string | null }) {
  /** App shell layout with retro sidebar and main content. */
  const router = useRouter();

  const onLogout = () => {
    clearAccessToken();
    router.replace("/login");
  };

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandTitle">RETRO TASK OPS</div>
          <div className="brandSubtitle">
            {props.userEmail ? (
              <>
                Signed in as <strong>{props.userEmail}</strong>
              </>
            ) : (
              "—"
            )}
          </div>
        </div>

        <div className="hr" />

        <div className="stack" role="navigation" aria-label="Sidebar navigation">
          <NavItem href="/dashboard" label="Dashboard" />
          <NavItem href="/dashboard/tasks" label="Tasks" />
        </div>

        <div className="hr" />

        <div className="stack">
          <button className="button buttonDanger" onClick={onLogout} type="button">
            ⏻ Logout
          </button>

          <a className="link" href={`${apiBase}/docs`} target="_blank" rel="noreferrer">
            API Docs →
          </a>

          <a className="link" href={`${apiBase}/realtime`} target="_blank" rel="noreferrer">
            Realtime Help →
          </a>
        </div>
      </aside>

      <main className="main">{props.children}</main>
    </div>
  );
}
