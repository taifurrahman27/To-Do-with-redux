import { useCallback, useState } from "react";
import { ListChecksIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskFormDialog } from "@/components/tasks/TaskFormDialog";
import { TaskStats } from "@/components/tasks/TaskStats";
import { FiltersBar } from "@/components/filters/FiltersBar";

type DialogMode = "create" | "edit";

interface DialogState {
  open: boolean;
  mode: DialogMode;
  editingId: string | null;
}

const CLOSED_DIALOG: DialogState = {
  open: false,
  mode: "create",
  editingId: null,
};

function App() {
  const [dialog, setDialog] = useState<DialogState>(CLOSED_DIALOG);

  const openCreate = useCallback(() => {
    setDialog({ open: true, mode: "create", editingId: null });
  }, []);

  const openEdit = useCallback((id: string) => {
    setDialog({ open: true, mode: "edit", editingId: id });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-muted/40 to-primary/10 text-foreground">
      <header className="sticky top-0 z-30 border-b bg-background/70 backdrop-blur-md">
        <div className="container mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <ListChecksIcon className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight tracking-tight">
                Redux Todo
              </h1>
              <p className="text-xs text-muted-foreground">
                Powered by Redux Toolkit
              </p>
            </div>
          </div>

          <Button size="sm" onClick={openCreate} className="shadow-sm">
            <PlusIcon className="size-4" />
            New Task
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl space-y-5 px-4 py-8">
        <TaskStats />
        <div className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm">
          <FiltersBar />
          <TaskList onEdit={openEdit} />
        </div>
      </main>

      <TaskFormDialog
        open={dialog.open}
        mode={dialog.mode}
        editingId={dialog.editingId}
        onClose={closeDialog}
      />
      <Toaster richColors position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;