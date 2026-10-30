import { useCallback, useState } from "react";
import { ListChecksIcon, PlusIcon, SparklesIcon } from "lucide-react";
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
    <div className="relative min-h-screen overflow-hidden bg-[#080d1a] text-slate-100">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-112.5 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute -right-40 top-40 size-112.5 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 size-87.5 -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[#080d1a]/80 backdrop-blur-xl">
        <div className="container mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl border border-blue-400/20 bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <ListChecksIcon className="size-5 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Redux <span className="text-blue-400">Todo</span>
              </h1>
              <p className="text-xs text-slate-500">
                Powered by Redux Toolkit
              </p>
            </div>
          </div>

          <Button
            size="lg"
            onClick={openCreate}
            className="border border-blue-400/20 bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500"
          >
            <PlusIcon className="size-4" />
            New Task
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto max-w-5xl space-y-8 px-4 py-10">
        {/* Page Heading */}
        <section className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-400">
            <SparklesIcon className="size-4" />
            YOUR PRODUCTIVITY SPACE
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Manage your <span className="text-blue-400">tasks.</span>
          </h2>

          <p className="max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Stay organized, track your progress, and get things done one task
            at a time.
          </p>
        </section>

        {/* Task Statistics */}
        <section>
          <TaskStats />
        </section>

        {/* Task Management */}
        <section className="space-y-5 rounded-2xl border border-white/8 bg-[#111a2b]/80 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-white">
              Your Tasks
            </h3>
            <p className="text-sm text-slate-500">
              Organize and manage your daily activities.
            </p>
          </div>

          <div className="h-px bg-white/[0.07]" />

          <FiltersBar />

          <TaskList onEdit={openEdit} />
        </section>

        {/* Footer */}
        <footer className="border-t border-white/6 py-5 text-center">
          <p className="text-xs text-slate-600">
            Built with React & Redux Toolkit
          </p>
        </footer>
      </main>

      {/* Task Dialog */}
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
