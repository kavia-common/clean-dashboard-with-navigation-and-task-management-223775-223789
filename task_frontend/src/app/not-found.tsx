import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <main className="main">
      <div className="panel" role="alert" aria-live="assertive">
        <div className="panelHeader">
          <div className="brandTitle">404 — SIGNAL LOST</div>
          <div className="brandSubtitle">The page you’re looking for doesn’t exist.</div>
        </div>

        <div className="panelBody">
          <div className="stack">
            <div className="noticeBox">Try returning to the console.</div>
            <div className="actions">
              <Link className="button buttonPrimary" href="/dashboard/tasks">
                ↩ Back to Tasks
              </Link>
              <Link className="button" href="/login">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
