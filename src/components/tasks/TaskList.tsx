import { TaskItem } from "./TaskItem";
import { Card } from "@/components/ui/card";
import { ClipboardListIcon, FilterIcon } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
export function TaskList({ onEdit }: { onEdit: (id: string) => void }) {
  const { items, filters } = useAppSelector((state) => state.tasks);
  const search = filters.search.trim().toLowerCase();
  const tasks = items
    .filter((task) => !search || task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search))
    .filter((task) => filters.status === "all" || task.status === filters.status)
    .filter((task) => filters.priority === "all" || task.priority === filters.priority)
    .sort((a, b) => {
      if (filters.sortBy === "oldest") return Date.parse(a.createdAt) - Date.parse(b.createdAt);
      if (filters.sortBy === "priority") {
        const rank = { high: 0, medium: 1, low: 2 }; return rank[a.priority] - rank[b.priority];
      }
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    });
  const total = items.length;
  const isFiltering = search !== "" || filters.status !== "all" || filters.priority !== "all" || filters.sortBy !== "newest";

  if (total === 0) {
    return (
      <Card className="flex flex-col items-center gap-2 px-6 py-12 text-center text-muted-foreground">
        <ClipboardListIcon className="size-8" />
        <p className="font-medium text-foreground">No tasks yet</p>
        <p className="text-sm">Click "New Task" to get started.</p>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-2 px-6 py-12 text-center text-muted-foreground">
        <FilterIcon className="size-8" />
        <p className="font-medium text-foreground">No matches</p>
        <p className="text-sm">
          {isFiltering
            ? "Try clearing or adjusting the filters."
            : "Nothing matches the current view."}
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onEdit={onEdit} />
      ))}
    </div>
  );
}
