import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  PencilLineIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addTask, updateTask } from "@/store/tasksSlice";
import type { TaskPriority, TaskStatus } from "@/types";

interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
}

interface TaskFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  editingId: string | null;
  onClose: () => void;
}

/** Small colored dot shown next to select options. */
function Dot({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block size-2 rounded-full ${className}`}
    />
  );
}

function Option({
  dot,
  children,
}: {
  dot: string;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-2">
      <Dot className={dot} />
      {children}
    </span>
  );
}

export function TaskFormDialog({
  open,
  mode,
  editingId,
  onClose,
}: TaskFormDialogProps) {
  const dispatch = useAppDispatch();

  const task = useAppSelector((state) =>
    state.tasks.items.find((item) => item.id === editingId),
  );

  const { register, handleSubmit, control, reset } =
    useForm<TaskFormValues>({
      defaultValues: {
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
      },
    });

  useEffect(() => {
    if (open) {
      reset(
        mode === "edit" && task
          ? {
              title: task.title,
              description: task.description,
              status: task.status,
              priority: task.priority,
            }
          : {
              title: "",
              description: "",
              status: "pending",
              priority: "medium",
            },
      );
    }
  }, [open, mode, task, reset]);

  const onSubmit = (values: TaskFormValues) => {
    const title = values.title.trim();

    if (!title) return;

    if (mode === "edit" && editingId) {
      dispatch(updateTask({ id: editingId, ...values, title }));
    } else {
      dispatch(addTask({ ...values, title }));
    }

    onClose();
  };

  const isEdit = mode === "edit";
  const HeaderIcon = isEdit ? PencilLineIcon : SparklesIcon;

  const fieldStyle =
    "h-11 border-white/10 bg-[#18243a] text-slate-100 shadow-none placeholder:text-slate-500 transition-colors hover:border-white/20 focus-visible:border-fuchsia-400/60 focus-visible:ring-2 focus-visible:ring-fuchsia-400/20";

  const selectTriggerStyle =
    "h-11 border-white/10 bg-[#18243a] text-slate-200 shadow-none transition-colors hover:border-white/20 focus-visible:border-fuchsia-400/60 focus-visible:ring-2 focus-visible:ring-fuchsia-400/20";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="overflow-hidden border border-white/10 bg-[#131e32] p-0 text-slate-100 shadow-2xl shadow-black/30 sm:max-w-md">
        {/* Accent bar */}
        <div
          aria-hidden
          className="h-1 w-full bg-linear-to-r from-indigo-500 via-fuchsia-500 to-purple-500"
        />

        <div className="relative px-6 pb-6 pt-5">
          {/* Background decoration */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-16 size-48 rounded-full bg-linear-to-br from-indigo-500/15 via-fuchsia-500/10 to-transparent blur-3xl"
          />

          <DialogHeader className="relative flex-row items-center gap-3 space-y-0 text-left">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-indigo-500 to-fuchsia-500 text-white shadow-md shadow-fuchsia-500/20">
              <HeaderIcon className="size-5" />
            </div>

            <div className="space-y-1">
              <DialogTitle className="text-lg font-semibold tracking-tight text-white">
                {isEdit ? "Edit task" : "New task"}
              </DialogTitle>

              <DialogDescription className="text-sm text-slate-400">
                {isEdit
                  ? "Update the details of this task."
                  : "Capture what you need to get done."}
              </DialogDescription>
            </div>
          </DialogHeader>

          <form
            id="task-form"
            className="relative mt-6 space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            {/* Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-xs font-semibold uppercase tracking-wide text-slate-300"
              >
                Title
              </Label>

              <Input
                id="title"
                autoFocus
                {...register("title", { required: true })}
                placeholder="What needs doing?"
                className={`text-base ${fieldStyle}`}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-xs font-semibold uppercase tracking-wide text-slate-300"
              >
                Description
              </Label>

              <Textarea
                id="description"
                rows={3}
                {...register("description")}
                placeholder="Optional details..."
                className={`min-h-24 resize-none border-white/10 bg-[#18243a] text-slate-100 shadow-none placeholder:text-slate-500 transition-colors hover:border-white/20 focus-visible:border-fuchsia-400/60 focus-visible:ring-2 focus-visible:ring-fuchsia-400/20`}
              />
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Status
                </Label>

                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={selectTriggerStyle}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>

                      <SelectContent className="border-white/10 bg-[#1b2940] text-slate-200">
                        <SelectItem value="pending">
                          <Option dot="bg-slate-400">Pending</Option>
                        </SelectItem>

                        <SelectItem value="in-progress">
                          <Option dot="bg-blue-400">In progress</Option>
                        </SelectItem>

                        <SelectItem value="done">
                          <Option dot="bg-emerald-400">Done</Option>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                  Priority
                </Label>

                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={selectTriggerStyle}>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>

                      <SelectContent className="border-white/10 bg-[#1b2940] text-slate-200">
                        <SelectItem value="low">
                          <Option dot="bg-teal-400">Low</Option>
                        </SelectItem>

                        <SelectItem value="medium">
                          <Option dot="bg-amber-400">Medium</Option>
                        </SelectItem>

                        <SelectItem value="high">
                          <Option dot="bg-red-400">High</Option>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </form>

          {/* Actions */}
          <DialogFooter className="relative mt-7 gap-2 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="border border-white/10 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Button>

            <Button
              form="task-form"
              type="submit"
              className="gap-1.5 border-0 bg-linear-to-r from-indigo-500 to-fuchsia-500 text-white shadow-md shadow-fuchsia-500/20 transition-all hover:from-indigo-600 hover:to-fuchsia-600 hover:shadow-lg hover:shadow-fuchsia-500/25"
            >
              {!isEdit && <PlusIcon className="size-4" />}
              {isEdit ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
