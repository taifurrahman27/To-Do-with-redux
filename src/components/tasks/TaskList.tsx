import { useMemo } from "react";
import {
  ClipboardListIcon,
  SearchXIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";
import { TaskItem } from "./TaskItem";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 } as const;

type TaskListProps = {
  onEdit: (id: string) => void;
  /**
   * Optional: wire this to your "reset filters" reducer to show a Clear button.
   */
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
      .filter(
        (task) =>
          filters.status === "all" || task.status === filters.status,
      )
      .filter(
        (task) =>
          filters.priority === "all" || task.priority === filters.priority,
      )
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

  const isFiltering =
    search !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all";

  // ---------- Empty: no tasks at all ----------
  if (total === 0) {
    return (
      <Card className="relative overflow-hidden border-dashed border-white/10 bg-[#0b1424]/70 px-6 py-14 text-center shadow-none">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl"
        />

        <div className="relative flex flex-col items-center gap-4">
          <div className="grid size-16 place-items-center rounded-2xl border border-blue-400/20 bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
            <ClipboardListIcon className="size-8" />
          </div>

          <div className="space-y-1.5">
            <p className="text-lg font-semibold tracking-tight text-white">
              Your list is a blank canvas
            </p>

            <p className="mx-auto max-w-xs text-sm leading-6 text-slate-400">
              Click{" "}
              <span className="font-medium text-blue-400">
                &quot;New Task&quot;
              </span>{" "}
              and start turning plans into progress.
            </p>
          </div>

          <div className="flex items-center gap-2 text-blue-400">
            <SparklesIcon className="size-4" aria-hidden />
            <span className="text-xs font-medium">Your productivity starts here</span>
          </div>
        </div>
      </Card>
    );
  }

  // ---------- Empty: filters hide everything ----------
  if (tasks.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 border-dashed border-white/10 bg-[#0b1424]/70 px-6 py-12 text-center shadow-none">
        <div className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-slate-800/70 text-slate-400">
          <SearchXIcon className="size-7" />
        </div>

        <div className="space-y-1">
          <p className="text-lg font-semibold tracking-tight text-white">
            No matches
          </p>

          <p className="text-sm text-slate-400">
            {isFiltering
              ? "Nothing fits these filters. Try loosening them."
              : "Nothing matches the current view."}
          </p>
        </div>

        {isFiltering && onClearFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="mt-1 gap-1.5 border-white/10 bg-slate-800/70 text-slate-300 hover:border-blue-400/30 hover:bg-blue-500/10 hover:text-blue-400"
          >
            <XIcon className="size-3.5" />
            Clear filters
          </Button>
        )}
      </Card>
    );
  }

  // ---------- List ----------
  return (
    <section aria-label="Tasks" className="flex flex-col gap-4">
      <div
        className="flex items-center justify-between px-1 text-xs font-medium text-slate-500"
        aria-live="polite"
      >
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />

          Showing{" "}
          <span className="font-semibold text-blue-400">
            {tasks.length}
          </span>{" "}
          of {total} {total === 1 ? "task" : "tasks"}
        </span>

        {isFiltering && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="text-slate-400 underline-offset-4 transition-colors hover:text-blue-400 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
          >
            <TaskItem task={task} onEdit={onEdit} />
          </li>
        ))}
      </ul>
    </section>
  );
}