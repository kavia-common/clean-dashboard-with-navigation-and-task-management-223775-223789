"use client";

import React, { useMemo, useState } from "react";
import type { Task, TaskStatus } from "@/lib/apiClient";

type TaskDraft = {
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string; // YYYY-MM-DD or ""
};

function toDraft(task?: Task | null): TaskDraft {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? "todo",
    due_date: task?.due_date ?? "",
  };
}

// PUBLIC_INTERFACE
export function TaskEditor(props: {
  mode: "create" | "edit";
  initial?: Task | null;
  busy?: boolean;
  onSubmit: (draft: { title: string; description: string | null; status: TaskStatus; due_date: string | null }) => void;
  onCancel?: () => void;
}) {
  /** Create/edit task form. */
  const [draft, setDraft] = useState<TaskDraft>(() => toDraft(props.initial));

  const canSubmit = useMemo(() => draft.title.trim().length > 0, [draft.title]);

  return (
    <div className="panel">
      <div className="panelHeader">
        <div className="brandTitle">
          {props.mode === "create" ? "NEW TASK" : "EDIT TASK"}
        </div>
        <div className="brandSubtitle">All fields are optional except Title.</div>
      </div>

      <div className="panelBody">
        <div className="stack">
          <div>
            <label className="label" htmlFor="task-title">Title</label>
            <input
              id="task-title"
              className="input"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="e.g. Fix pipeline glitch"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="label" htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              className="textarea"
              value={draft.description}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="Optional notes…"
            />
          </div>

          <div className="row">
            <div>
              <label className="label" htmlFor="task-status">Status</label>
              <select
                id="task-status"
                className="select"
                value={draft.status}
                onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as TaskStatus }))}
              >
                <option value="todo">todo</option>
                <option value="in_progress">in_progress</option>
                <option value="done">done</option>
              </select>
            </div>

            <div>
              <label className="label" htmlFor="task-due">Due date</label>
              <input
                id="task-due"
                className="input"
                type="date"
                value={draft.due_date}
                onChange={(e) => setDraft((d) => ({ ...d, due_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="actions">
            <button
              className="button buttonPrimary"
              type="button"
              disabled={!canSubmit || !!props.busy}
              onClick={() =>
                props.onSubmit({
                  title: draft.title.trim(),
                  description: draft.description.trim() ? draft.description : null,
                  status: draft.status,
                  due_date: draft.due_date ? draft.due_date : null,
                })
              }
            >
              {props.mode === "create" ? "＋ Create" : "✓ Save"}
            </button>

            {props.onCancel ? (
              <button className="button" type="button" disabled={!!props.busy} onClick={props.onCancel}>
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
