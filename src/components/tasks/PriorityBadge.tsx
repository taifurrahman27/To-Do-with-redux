import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STYLES: Record<string, string> = {
  low: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  medium:
    "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  high: "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
};

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge variant="outline" className={cn("font-medium", STYLES[priority])}>
      {priority}
    </Badge>
  );
}
