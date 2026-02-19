"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { api } from "@/lib/apiClient";
import { setAccessToken } from "@/lib/authToken";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length >= 8;

  const onRegister = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await api.register({
        email: email.trim(),
        password,
        display_name: displayName.trim() ? displayName.trim() : undefined,
      });
      setAccessToken(res.access_token);
      router.replace("/dashboard/tasks");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="main">
      <div className="panel">
        <div className="panelHeader">
          <div className="brandTitle">REGISTER</div>
          <div className="brandSubtitle">Create an account to store tasks per-user.</div>
        </div>

        <div className="panelBody">
          <div className="stack">
            {error ? <div className="errorBox" role="alert">{error}</div> : null}

            <div>
              <label className="label" htmlFor="displayName">Display name (optional)</label>
              <input
                id="displayName"
                className="input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Operator 7"
                autoComplete="nickname"
              />
            </div>

            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">Password (min 8 chars)</label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            <div className="actions">
              <button className="button buttonPrimary" type="button" disabled={!canSubmit || busy} onClick={onRegister}>
                ＋ Create Account
              </button>
              <Link className="button" href="/login">
                ← Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
