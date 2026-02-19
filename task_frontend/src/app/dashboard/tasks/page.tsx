"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { TaskEditor } from "@/components/TaskEditor";
import { TaskList } from "@/components/TaskList";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { api, type Task, type WsTaskEvent } from "@/lib/apiClient";
import { subscribeToTaskEvents } from "@/lib/wsClient";

type WsState = { state: "connecting" | "open" | "closed" | "error"; message?: string } | null;

function upsertTask(list: Task[], task: Task): Task[] {
  const idx = list.findIndex((t) => t.id === task.id);
  if (idx === -1) return [task, ...list];
  const next = [...list];
  next[idx] = task;
  next.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
  return next;
}

function removeTask(list: Task[], taskId: string): Task[] {
  return list.filter((t) => t.id !== taskId);
}

export default function TasksPage() {
  const auth = useRequireAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyTaskId, setBusyTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Task | null>(null);
  const [wsState, setWsState] = useState<WsState>(null);

  const headerSubtitle = useMemo(() => {
    if (!wsState) return "Realtime: not started";
    if (wsState.state === "open") return "Realtime: ONLINE";
    if (wsState.state === "connecting") return "Realtime: connecting…";
    if (wsState.state === "error") return `Realtime: error (${wsState.message ?? "unknown"})`;
    return "Realtime: offline";
  }, [wsState]);

  useEffect(() => {
    if (auth.status !== "ready") return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .listTasks()
      .then((t) => {
        if (cancelled) return;
        setTasks(t);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load tasks");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [auth.status]);

  useEffect(() => {
    if (auth.status !== "ready") return;

    const sub = subscribeToTaskEvents({
      onStatus: (s) => setWsState(s),
      onEvent: (evt: WsTaskEvent) => {
        if (evt.type === "task_created" || evt.type === "task_updated") {
          setTasks((prev) => upsertTask(prev, evt.task));
        } else if (evt.type === "task_deleted") {
          setTasks((prev) => removeTask(prev, evt.task_id));
          setEditing((cur) => (cur?.id === evt.task_id ? null : cur));
        }
      },
    });

    return () => sub.close();
  }, [auth.status]);

  const onCreate = async (draft: {
    title: string;
    description: string | null;
    status: Task["status"];
    due_date: string | null;
  }) => {
    setError(null);
    setBusyTaskId("creating");
    try {
      const created = await api.createTask(draft);
      setTasks((prev) => upsertTask(prev, created));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create task");
    } finally {
      setBusyTaskId(null);
    }
  };

  const onSaveEdit = async (draft: {
    title: string;
    description: string | null;
    status: Task["status"];
    due_date: string | null;
  }) => {
    if (!editing) return;
    setError(null);
    setBusyTaskId(editing.id);
    try {
      const updated = await api.updateTask(editing.id, draft);
      setTasks((prev) => upsertTask(prev, updated));
      setEditing(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update task");
    } finally {
      setBusyTaskId(null);
    }
  };

  const onDelete = async (task: Task) => {
    const ok = window.confirm(`Delete task "${task.title}"?`);
    if (!ok) return;

    setError(null);
    setBusyTaskId(task.id);
    try {
      await api.deleteTask(task.id);
      setTasks((prev) => removeTask(prev, task.id));
      setEditing((cur) => (cur?.id === task.id ? null : cur));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete task");
    } finally {
      setBusyTaskId(null);
    }
  };

  return (
    <DashboardShell userEmail={auth.status === "ready" ? auth.user.email : null}>
      <div className="stack">
        <div className="panel">
          <div className="panelHeader">
            <div className="brandTitle">TASKS</div>
            <div className="brandSubtitle">{headerSubtitle}</div>
          </div>

          <div className="panelBody">
            <div className="stack">
              {error ? <div className="errorBox" role="alert">{error}</div> : null}
              {loading ? <div className="noticeBox">Loading tasks…</div> : null}

              <div className="row3">
                <div className="stack">
                  <TaskEditor mode="create" busy={busyTaskId === "creating"} onSubmit={onCreate} />

                  {editing ? (
                    <TaskEditor
                      mode="edit"
                      initial={editing}
                      busy={busyTaskId === editing.id}
                      onSubmit={onSaveEdit}
                      onCancel={() => setEditing(null)}
                    />
                  ) : null}
                </div>

                <div className="panel">
                  <div className="panelHeader">
                    <div className="brandTitle">LIST</div>
                    <div className="brandSubtitle">Auto-updates on changes.</div>
                  </div>
                  <div className="panelBody">
                    <TaskList
                      tasks={tasks}
                      busyTaskId={busyTaskId}
                      onEdit={(t) => setEditing(t)}
                      onDelete={onDelete}
                    />
                  </div>
                </div>

                <div className="panel">
                  <div className="panelHeader">
                    <div className="brandTitle">SYSTEM</div>
                    <div className="brandSubtitle">Connection + hints</div>
                  </div>
                  <div className="panelBody">
                    <div className="stack">
                      <div className="noticeBox">
                        <strong>REST:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}
                      </div>
                      <div className="noticeBox">
                        <strong>WS:</strong> {process.env.NEXT_PUBLIC_WS_BASE_URL ?? "ws://localhost:8000"}
                      </div>
                      <div className="noticeBox">
                        If realtime shows offline, you can still CRUD via REST. (WS requires auth token and sends pings every 25s.)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
