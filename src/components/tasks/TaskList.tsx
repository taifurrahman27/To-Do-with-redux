import { useMemo } from "react";
import { ClipboardListIcon, SearchXIcon, SparklesIcon, XIcon } from "lucide-react";
import { TaskItem } from "./TaskItem";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 } as const;

type TaskListProps = {
  onEdit: (id: string) => void;
  /** Optional: wire this to your "reset filters" reducer to show a Clear button. */
  onClearFilters?: () => void;
};

export function TaskList({ onEdit, onClearFilters }: TaskListProps) {
  const { items, filters } = useAppSelector((state) => state.tasks);

  const search = filters.search.trim().toLowerCase();

  const tasks = useMemo(() => {
    return items
      .filter(
        (task) =>
          !search ||
          (task.title ?? "").toLowerCase().includes(search) ||
          (task.description ?? "").toLowerCase().includes(search),
      )
      .filter((task) => filters.status === "all" || task.status === filters.status)
      .filter((task) => filters.priority === "all" || task.priority === filters.priority)
      .sort((a, b) => {
        const byNewest = Date.parse(b.createdAt) - Date.parse(a.createdAt);
        if (filters.sortBy === "oldest") return -byNewest;
        if (filters.sortBy === "priority") {
          return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || byNewest;
        }
        return byNewest;
      });
  }, [items, search, filters.status, filters.priority, filters.sortBy]);

  const total = items.length;
  const isFiltering = search !== "" || filters.status !== "all" || filters.priority !== "all";

  // ---------- Empty: no tasks at all ----------
  if (total === 0) {
    return (
      <Card className="relative overflow-hidden border-dashed px-6 py-14 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-linear-to-br from-indigo-500/20 via-fuchsia-500/20 to-amber-400/20 blur-3xl"
        />
        <div className="relative flex flex-col items-center gap-3">
          <div className="grid size-16 place-items-center rounded-2xl bg-linear-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30">
            <ClipboardListIcon className="size-8" />
          </div>
          <p className="text-lg font-semibold tracking-tight">Your list is a blank canvas</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Click <span className="font-medium text-foreground">&quot;New Task&quot;</span> and
            start turning plans into progress.
          </p>
          <SparklesIcon className="size-4 text-amber-400" aria-hidden />
        </div>
      </Card>
    );
  }

  // ---------- Empty: filters hide everything ----------
  if (tasks.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 border-dashed px-6 py-12 text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
          <SearchXIcon className="size-7" />
        </div>
        <p className="text-lg font-semibold tracking-tight">No matches</p>
        <p className="text-sm text-muted-foreground">
          {isFiltering
            ? "Nothing fits these filters. Try loosening them."
            : "Nothing matches the current view."}
        </p>
        {isFiltering && onClearFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters} className="mt-1 gap-1.5">
            <XIcon className="size-3.5" /> Clear filters
          </Button>
        )}
      </Card>
    );
  }

  // ---------- List ----------
  return (
    <section aria-label="Tasks" className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1 text-xs font-medium text-muted-foreground" aria-live="polite">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-linear-to-r from-indigo-500 to-fuchsia-500" />
          Showing <span className="text-foreground">{tasks.length}</span> of {total}{" "}
          {total === 1 ? "task" : "tasks"}
        </span>
        {isFiltering && onClearFilters && (
          <button onClick={onClearFilters} className="underline-offset-4 hover:text-foreground hover:underline">
            Clear filters
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="rounded-xl transition-shadow hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <TaskItem task={task} onEdit={onEdit} />
          </li>
        ))}
      </ul>
    </section>
  );
}