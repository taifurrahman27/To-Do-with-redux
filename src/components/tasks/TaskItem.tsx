import { formatDistanceToNow } from "date-fns";
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PriorityBadge } from "./PriorityBadge";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { deleteTask, setTaskStatus } from "@/store/tasksSlice";
import type { Task, TaskStatus } from "@/types";

const STATUS_DOT: Record<TaskStatus, string> = { pending: "bg-slate-400", "in-progress": "bg-blue-500", done: "bg-emerald-500" };
const STATUS_LABEL: Record<TaskStatus, string> = { pending: "Pending", "in-progress": "In progress", done: "Done" };
const TASK_STATUSES: TaskStatus[] = ["pending", "in-progress", "done"];

export function TaskItem({ task, onEdit }: { task: Task; onEdit: (id: string) => void }) {
  const dispatch = useAppDispatch();
  const handleStatusChange = (value: string) => dispatch(setTaskStatus({ id: task.id, status: value as TaskStatus }));
  const handleDelete = () => { dispatch(deleteTask(task.id)); toast.warning("Task deleted", { description: task.title }); };

  return (
    <Card className="flex flex-row items-start justify-between gap-3 p-4">
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={cn(
              "inline-block h-2 w-2 rounded-full",
              STATUS_DOT[task.status],
            )}
          />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {STATUS_LABEL[task.status]}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(task.updatedAt, { addSuffix: true })}
          </span>
        </div>

        <h3
          className={cn(
            "font-semibold leading-tight",
            task.status === "done" && "line-through text-muted-foreground",
          )}
        >
          {task.title}
        </h3>

        {task.description ? (
          <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">
            {task.description}
          </p>
        ) : null}

        <div className="flex items-center gap-2 pt-1">
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Task actions">
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Status</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={task.status}
            onValueChange={handleStatusChange}
          >
            {TASK_STATUSES.map((status) => (
              <DropdownMenuRadioItem key={status} value={status}>
                {STATUS_LABEL[status]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => onEdit(task.id)}>
            <PencilIcon className="size-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={handleDelete}>
            <Trash2Icon className="size-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
