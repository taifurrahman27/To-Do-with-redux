import { SearchIcon, XIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearFilters,
  setPriority,
  setSearch,
  setSortBy,
  setStatus,
  type SortBy,
} from "@/store/tasksSlice";
import type { TaskPriority, TaskStatus } from "@/types";

const SORT_LABEL: Record<SortBy, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  priority: "By priority",
};

export function FiltersBar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.tasks.filters);

  const isFiltering =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.sortBy !== "newest";

  const selectTriggerClass =
    "min-w-0 border-white/10 bg-[#0b1424] text-slate-300 shadow-none transition-colors hover:border-blue-400/30 focus:ring-blue-500/20 data-[placeholder]:text-slate-500";

  const selectContentClass =
    "border-white/10 bg-[#111a2b] text-slate-300";

  return (
    <Card className="flex flex-col gap-3 border-white/8 bg-[#111a2b]/60 p-3 shadow-none sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative min-w-0 flex-1">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

        <Input
          value={filters.search}
          onChange={(event) => dispatch(setSearch(event.target.value))}
          placeholder="Search tasks..."
          className="h-10 border-white/10 bg-[#0b1424] pl-9 text-sm text-slate-200 shadow-none placeholder:text-slate-500 focus-visible:border-blue-500/50 focus-visible:ring-2 focus-visible:ring-blue-500/20"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
        {/* Status */}
        <Select
          value={filters.status}
          onValueChange={(value) =>
            dispatch(setStatus(value as TaskStatus | "all"))
          }
        >
          <SelectTrigger className={`${selectTriggerClass} w-full sm:w-32`}>
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent className={selectContentClass}>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority */}
        <Select
          value={filters.priority}
          onValueChange={(value) =>
            dispatch(setPriority(value as TaskPriority | "all"))
          }
        >
          <SelectTrigger className={`${selectTriggerClass} w-full sm:w-32`}>
            <SelectValue placeholder="Priority" />
          </SelectTrigger>

          <SelectContent className={selectContentClass}>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Sorting */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => dispatch(setSortBy(value as SortBy))}
        >
          <SelectTrigger className={`${selectTriggerClass} col-span-2 w-full sm:w-36`}>
            <SelectValue>{SORT_LABEL[filters.sortBy]}</SelectValue>
          </SelectTrigger>

          <SelectContent className={selectContentClass}>
            {(Object.keys(SORT_LABEL) as SortBy[]).map((value) => (
              <SelectItem key={value} value={value}>
                {SORT_LABEL[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      <Button
        variant="ghost"
        size="sm"
        disabled={!isFiltering}
        onClick={() => dispatch(clearFilters())}
        className="h-9 gap-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
      >
        <XIcon className="size-4" />
        Clear
      </Button>
    </Card>
  );
}
