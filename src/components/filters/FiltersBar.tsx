import { SearchIcon, XIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearFilters, setPriority, setSearch, setSortBy, setStatus, type SortBy } from "@/store/tasksSlice";
import type { TaskPriority, TaskStatus } from "@/types";

const SORT_LABEL: Record<SortBy, string> = { newest: "Newest first", oldest: "Oldest first", priority: "By priority" };

export function FiltersBar() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.tasks.filters);
  const isFiltering = filters.search !== "" || filters.status !== "all" || filters.priority !== "all" || filters.sortBy !== "newest";

  return (
    <Card className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={filters.search} onChange={(event) => dispatch(setSearch(event.target.value))} placeholder="Search tasks…" className="pl-9" />
      </div>

      <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
        <Select value={filters.status} onValueChange={(value) => dispatch(setStatus(value as TaskStatus | "all"))}>
          <SelectTrigger className="min-w-30"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.priority} onValueChange={(value) => dispatch(setPriority(value as TaskPriority | "all"))}>
          <SelectTrigger className="min-w-30"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sortBy} onValueChange={(value) => dispatch(setSortBy(value as SortBy))}>
          <SelectTrigger className="min-w-30"><SelectValue>{SORT_LABEL[filters.sortBy]}</SelectValue></SelectTrigger>
          <SelectContent>
            {(Object.keys(SORT_LABEL) as SortBy[]).map((value) => <SelectItem key={value} value={value}>{SORT_LABEL[value]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Button variant="ghost" size="sm" disabled={!isFiltering} onClick={() => dispatch(clearFilters())}>
        <XIcon className="size-4" /> Clear
      </Button>
    </Card>
  );
}
