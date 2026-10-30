import { formatDistanceToNow } from "date-fns";
import {
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PriorityBadge } from "./PriorityBadge";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { deleteTask, setTaskStatus } from "@/store/tasksSlice";
import type { Task, TaskStatus } from "@/types";

const STATUS_DOT: Record<TaskStatus, string> = {
  pending: "bg-slate-400",
  "in-progress": "bg-blue-400",
  done: "bg-emerald-400",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: "Pending",
  "in-progress": "In progress",
  done: "Done",
};

const TASK_STATUSES: TaskStatus[] = [
  "pending",
  "in-progress",
  "done",
];

export function TaskItem({
  task,
  onEdit,
}: {
  task: Task;
  onEdit: (id: string) => void;
}) {
  const dispatch = useAppDispatch();

  const handleStatusChange = (value: string) =>
    dispatch(
      setTaskStatus({
        id: task.id,
        status: value as TaskStatus,
      }),
    );

  const handleDelete = () => {
    dispatch(deleteTask(task.id));

    toast.warning("Task deleted", {
      description: task.title,
    });
  };

  return (
    <Card className="group flex flex-row items-start justify-between gap-3 border-white/8 bg-[#18243a]/80 p-4 shadow-sm transition-all duration-200 hover:border-fuchsia-400/20 hover:bg-[#1b2940] hover:shadow-lg hover:shadow-fuchsia-950/10">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* Status and updated time */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            aria-hidden
            className={cn(
              "inline-block size-2 rounded-full",
              STATUS_DOT[task.status],
            )}
          />

          <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            {STATUS_LABEL[task.status]}
          </span>

          <span className="text-xs text-slate-600">·</span>

          <span className="text-xs text-slate-400">
            {formatDistanceToNow(task.updatedAt, {
              addSuffix: true,
            })}
          </span>
        </div>

        {/* Task title */}
        <h3
          className={cn(
            "wrap-break-word font-semibold leading-tight text-slate-100 transition-colors group-hover:text-white",
            task.status === "done" &&
              "text-slate-400 line-through decoration-slate-500",
          )}
        >
          {task.title}
        </h3>

        {/* Task description */}
        {task.description ? (
          <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-400">
            {task.description}
          </p>
        ) : null}

        {/* Priority */}
        <div className="flex items-center gap-2 pt-1">
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      {/* Task actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Task actions"
            className="size-8 shrink-0 text-slate-400 transition-colors hover:bg-fuchsia-500/10 hover:text-fuchsia-300"
          >
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-44 border-white/10 bg-[#1b2940] text-slate-200 shadow-xl shadow-black/20"
        >
          <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Status
          </DropdownMenuLabel>

          <DropdownMenuRadioGroup
            value={task.status}
            onValueChange={handleStatusChange}
          >
            {TASK_STATUSES.map((status) => (
              <DropdownMenuRadioItem
                key={status}
                value={status}
                className="cursor-pointer focus:bg-fuchsia-500/10 focus:text-fuchsia-300"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      STATUS_DOT[status],
                    )}
                  />
                  {STATUS_LABEL[status]}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator className="bg-white/10" />

          <DropdownMenuItem
            onSelect={() => onEdit(task.id)}
            className="cursor-pointer focus:bg-fuchsia-500/10 focus:text-fuchsia-300"
          >
            <PencilIcon className="size-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onSelect={handleDelete}
            className="cursor-pointer"
          >
            <Trash2Icon className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
