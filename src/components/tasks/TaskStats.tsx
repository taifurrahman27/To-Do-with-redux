import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/card";

type Status = "pending" | "in-progress" | "done";
type Priority = "low" | "medium" | "high";

interface Task {
  id: string;
  status: Status;
  priority: Priority;
}

interface RootState {
  tasks: {
    items: Task[];
  };
}

const selectTasks = (state: RootState) => state.tasks.items;

export function TaskStats() {
  const tasks = useSelector(selectTasks);

  const stats = useMemo(() => {
    const byStatus: Record<Status, number> = {
      pending: 0,
      "in-progress": 0,
      done: 0,
    };
    const byPriority: Record<Priority, number> = {
      low: 0,
      medium: 0,
      high: 0,
    };
    for (const t of tasks) {
      byStatus[t.status] += 1;
      byPriority[t.priority] += 1;
    }
    return { total: tasks.length, byStatus, byPriority };
  }, [tasks]);

  const items: Array<{ label: string; value: number; tone: string }> = [
    { label: "Total", value: stats.total, tone: "text-foreground" },
    { label: "Pending", value: stats.byStatus.pending, tone: "text-slate-300" },
    {
      label: "In Progress",
      value: stats.byStatus["in-progress"],
      tone: "text-blue-400",
    },
    { label: "Done", value: stats.byStatus.done, tone: "text-emerald-400" },
    { label: "High", value: stats.byPriority.high, tone: "text-red-400" },
    { label: "Medium", value: stats.byPriority.medium, tone: "text-amber-400" },
    { label: "Low", value: stats.byPriority.low, tone: "text-emerald-400" },
  ];

  return (
    <Card className="grid grid-cols-2 gap-3 border-white/10 bg-card/80 p-4 shadow-lg backdrop-blur sm:grid-cols-4 lg:grid-cols-7">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col rounded-lg bg-muted/40 px-3 py-2"
        >
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {item.label}
          </span>
          <span className={`text-2xl font-semibold tabular-nums ${item.tone}`}>
            {item.value}
          </span>
        </div>
      ))}
    </Card>
  );
}