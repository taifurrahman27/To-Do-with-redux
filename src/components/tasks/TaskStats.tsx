import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  FlameIcon,
  ListChecksIcon,
  LoaderIcon,
  SignalLowIcon,
  SignalMediumIcon,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";

type Status = "pending" | "in-progress" | "done";
type Priority = "low" | "medium" | "high";

function useReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduce;
}

/** Counts a number up smoothly (instant when reduced motion is on). */
function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduce) {
      node.textContent = String(value);
      previous.current = value;
      return;
    }

    const from = previous.current;
    const start = performance.now();
    const duration = 600;
    let frame = 0;

    const update = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = String(Math.round(from + (value - from) * eased));
      if (progress < 1) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    previous.current = value;
    return () => cancelAnimationFrame(frame);
  }, [value, reduce]);

  return <span ref={ref}>{value}</span>;
}

type Tile = {
  label: string;
  value: number;
  icon: LucideIcon;
  text: string; // value + icon color
  chip: string; // icon background
  glow: string; // top accent line
};

export function TaskStats() {
  const tasks = useAppSelector((state) => state.tasks.items);

  const stats = useMemo(() => {
    const byStatus: Record<Status, number> = { pending: 0, "in-progress": 0, done: 0 };
    const byPriority: Record<Priority, number> = { low: 0, medium: 0, high: 0 };
    for (const t of tasks) {
      if (t.status in byStatus) byStatus[t.status as Status] += 1;
      if (t.priority in byPriority) byPriority[t.priority as Priority] += 1;
    }
    const pct = tasks.length ? Math.round((byStatus.done / tasks.length) * 100) : 0;
    return { total: tasks.length, byStatus, byPriority, pct };
  }, [tasks]);

  const statusTiles: Tile[] = [
    { label: "Pending", value: stats.byStatus.pending, icon: CircleDashedIcon, text: "text-slate-600 dark:text-slate-300", chip: "bg-slate-500/15", glow: "from-slate-400" },
    { label: "In Progress", value: stats.byStatus["in-progress"], icon: LoaderIcon, text: "text-blue-600 dark:text-blue-400", chip: "bg-blue-500/15", glow: "from-blue-500" },
    { label: "Done", value: stats.byStatus.done, icon: CheckCircle2Icon, text: "text-emerald-600 dark:text-emerald-400", chip: "bg-emerald-500/15", glow: "from-emerald-500" },
  ];

  const priorityTiles: Tile[] = [
    { label: "High", value: stats.byPriority.high, icon: FlameIcon, text: "text-red-600 dark:text-red-400", chip: "bg-red-500/15", glow: "from-red-500" },
    { label: "Medium", value: stats.byPriority.medium, icon: SignalMediumIcon, text: "text-amber-600 dark:text-amber-400", chip: "bg-amber-500/15", glow: "from-amber-500" },
    { label: "Low", value: stats.byPriority.low, icon: SignalLowIcon, text: "text-teal-600 dark:text-teal-400", chip: "bg-teal-500/15", glow: "from-teal-500" },
  ];

  return (
    <Card className="relative overflow-hidden p-4 shadow-lg sm:p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-linear-to-br from-indigo-500/20 via-fuchsia-500/15 to-transparent blur-3xl"
      />

      {/* Header: total + completion */}
      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-linear-to-br from-indigo-500 to-fuchsia-500 text-white shadow-md shadow-fuchsia-500/30">
            <ListChecksIcon className="size-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Total tasks</p>
            <p className="text-3xl font-bold leading-none tabular-nums">
              <AnimatedNumber value={stats.total} />
            </p>
          </div>
        </div>

        <div className="w-full sm:max-w-xs">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">Completion</span>
            <span className="font-semibold tabular-nums">{stats.pct}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={stats.pct}
            aria-label="Tasks completed"
            className="h-2.5 overflow-hidden rounded-full bg-muted"
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-indigo-500 via-fuchsia-500 to-emerald-400 transition-[width] duration-700 ease-out motion-reduce:transition-none"
              style={{ width: `${stats.pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tiles */}
      <dl className="relative mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[...statusTiles, ...priorityTiles].map((tile) => (
          <div
            key={tile.label}
            className="group relative overflow-hidden rounded-xl border bg-muted/40 px-3 py-2.5 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span
              aria-hidden
              className={`absolute inset-x-0 top-0 h-0.5 bg-linear-to-r ${tile.glow} to-transparent opacity-70`}
            />
            <div className="flex items-center justify-between">
              <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {tile.label}
              </dt>
              <span className={`grid size-6 place-items-center rounded-md ${tile.chip} ${tile.text}`}>
                <tile.icon className="size-3.5" />
              </span>
            </div>
            <dd className={`mt-1 text-2xl font-semibold tabular-nums ${tile.text}`}>
              <AnimatedNumber value={tile.value} />
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}