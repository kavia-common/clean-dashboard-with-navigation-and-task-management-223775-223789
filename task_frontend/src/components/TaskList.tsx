"use client";

import React from "react";
import type { Task } from "@/lib/apiClient";
import { formatDateShort } from "@/lib/format";

function StatusBadge(props: { status: Task["status"] }) {
  const cls =
    props.status === "todo"
      ? "badge badgeTodo"
      : props.status === "in_progress"
        ? "badge badgeProgress"
        : "badge badgeDone";

  return <span className={cls}>{props.status}</span>;
}

// PUBLIC_INTERFACE
export function TaskList(props: {
  tasks: Task[];
  busyTaskId?: string | null;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  /** Render list of tasks with actions. */
  if (props.tasks.length === 0) {
    return <div className="noticeBox">No tasks yet. Create one to begin.</div>;
  }

  return (
    <div className="taskList" role="list" aria-label="Tasks">
      {props.tasks.map((t) => (
        <div className="taskItem" key={t.id} role="listitem">
          <div className="taskItemHeader">
            <div>
              <div className="taskTitle">{t.title}</div>
              <div className="taskMeta">
                <StatusBadge status={t.status} />{" "}
                <span>• Due: {formatDateShort(t.due_date)}</span>
                <span> • Updated: {new Date(t.updated_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="actions" aria-label={`Actions for ${t.title}`}>
              <button className="button" type="button" disabled={props.busyTaskId === t.id} onClick={() => props.onEdit(t)}>
                ✎ Edit
              </button>
              <button className="button buttonDanger" type="button" disabled={props.busyTaskId === t.id} onClick={() => props.onDelete(t)}>
                🗑 Delete
              </button>
            </div>
          </div>

          {t.description ? <div className="taskDesc">{t.description}</div> : null}
        </div>
      ))}
    </div>
  );
}
