"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type UserMe } from "@/lib/apiClient";
import { getAccessToken } from "@/lib/authToken";

type RequireAuthState =
  | { status: "loading"; user: null }
  | { status: "ready"; user: UserMe }
  | { status: "error"; user: null; error: string };

// PUBLIC_INTERFACE
export function useRequireAuth(): RequireAuthState {
  /** Ensure the user is authenticated; otherwise redirect to /login. */
  const router = useRouter();
  const [state, setState] = useState<RequireAuthState>({ status: "loading", user: null });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    api
      .me()
      .then((user) => {
        if (cancelled) return;
        setState({ status: "ready", user });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "Failed to load user";
        setState({ status: "error", user: null, error: msg });
        router.replace("/login");
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  return state;
}
