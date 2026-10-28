import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addTask, updateTask } from "@/store/tasksSlice";
import type { TaskPriority, TaskStatus } from "@/types";

interface TaskFormValues { title: string; description: string; status: TaskStatus; priority: TaskPriority }
interface TaskFormDialogProps { open: boolean; mode: "create" | "edit"; editingId: string | null; onClose: () => void }

export function TaskFormDialog({ open, mode, editingId, onClose }: TaskFormDialogProps) {
  const dispatch = useAppDispatch();
  const task = useAppSelector((state) => state.tasks.items.find((item) => item.id === editingId));
  const { register, handleSubmit, control, reset } = useForm<TaskFormValues>({ defaultValues: { title: "", description: "", status: "pending", priority: "medium" } });

  useEffect(() => {
    if (open) reset(mode === "edit" && task ? { title: task.title, description: task.description, status: task.status, priority: task.priority } : { title: "", description: "", status: "pending", priority: "medium" });
  }, [open, mode, task, reset]);

  const onSubmit = (values: TaskFormValues) => {
    const title = values.title.trim();
    if (!title) return;
    if (mode === "edit" && editingId) dispatch(updateTask({ id: editingId, ...values, title }));
    else dispatch(addTask({ ...values, title }));
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit task" : "New task"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the details of this task."
              : "Capture what you need to get done."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="task-form"
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              autoFocus
              {...register("title", { required: true })}
              placeholder="What needs doing?"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              {...register("description")}
              placeholder="Optional details…"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button form="task-form" type="submit">
            {mode === "edit" ? "Save changes" : "Create task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
