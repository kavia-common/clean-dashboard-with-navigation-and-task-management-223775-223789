"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/authToken";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    router.replace(token ? "/dashboard/tasks" : "/login");
  }, [router]);

  return (
    <main className="main">
      <div className="panel">
        <div className="panelHeader">
          <div className="brandTitle">BOOTING…</div>
          <div className="brandSubtitle">Routing to your console.</div>
        </div>
        <div className="panelBody">
          <div className="noticeBox">Please wait.</div>
        </div>
      </div>
    </main>
  );
}
