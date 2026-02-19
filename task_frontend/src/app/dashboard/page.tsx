"use client";

import Link from "next/link";
import React from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { DashboardShell } from "@/components/DashboardShell";

export default function DashboardPage() {
  const auth = useRequireAuth();

  return (
    <DashboardShell userEmail={auth.status === "ready" ? auth.user.email : null}>
      <div className="panel">
        <div className="panelHeader">
          <div className="brandTitle">DASHBOARD</div>
          <div className="brandSubtitle">Your retro command center.</div>
        </div>

        <div className="panelBody">
          <div className="stack">
            <div className="noticeBox">
              Navigate to <Link className="link" href="/dashboard/tasks">Tasks</Link> to manage your list.
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
