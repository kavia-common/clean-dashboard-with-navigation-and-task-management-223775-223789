"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { api } from "@/lib/apiClient";
import { setAccessToken } from "@/lib/authToken";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length >= 1;

  const onLogin = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await api.login({ email: email.trim(), password });
      setAccessToken(res.access_token);
      router.replace("/dashboard/tasks");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="main">
      <div className="panel">
        <div className="panelHeader">
          <div className="brandTitle">LOGIN</div>
          <div className="brandSubtitle">Authenticate to access your task dashboard.</div>
        </div>

        <div className="panelBody">
          <div className="stack">
            {error ? (
              <div className="errorBox" role="alert">
                {error}
              </div>
            ) : null}

            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
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
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div className="actions">
              <button className="button buttonPrimary" type="button" disabled={!canSubmit || busy} onClick={onLogin}>
                → Login
              </button>
              <Link className="button" href="/register">
                ＋ Register
              </Link>
            </div>

            <div className="brandSubtitle">Tip: backend default JWT requires min 8 chars on register.</div>
          </div>
        </div>
      </div>
    </main>
  );
}
