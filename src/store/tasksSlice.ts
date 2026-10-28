import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskPriority, TaskStatus } from "@/types";

export type SortBy = "newest" | "oldest" | "priority";
export interface Filters {
  search: string;
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  sortBy: SortBy;
}

interface TasksState {
  items: Task[];
  filters: Filters;
}

const initialState: TasksState = { items: [], filters: { search: "", status: "all", priority: "all", sortBy: "newest" } };

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<{ title: string; description: string; status: TaskStatus; priority: TaskPriority }>) {
      const now = new Date().toISOString();
      state.items.unshift({ id: nanoid(), ...action.payload, createdAt: now, updatedAt: now });
    },
    updateTask(state, action: PayloadAction<{ id: string; title: string; description: string; status: TaskStatus; priority: TaskPriority }>) {
      const task = state.items.find((item) => item.id === action.payload.id);
      if (task) Object.assign(task, action.payload, { updatedAt: new Date().toISOString() });
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((task) => task.id !== action.payload);
    },
    setTaskStatus(state, action: PayloadAction<{ id: string; status: TaskStatus }>) {
      const task = state.items.find((item) => item.id === action.payload.id);
      if (task) Object.assign(task, { status: action.payload.status, updatedAt: new Date().toISOString() });
    },
    setSearch(state, action: PayloadAction<string>) { state.filters.search = action.payload; },
    setStatus(state, action: PayloadAction<TaskStatus | "all">) { state.filters.status = action.payload; },
    setPriority(state, action: PayloadAction<TaskPriority | "all">) { state.filters.priority = action.payload; },
    setSortBy(state, action: PayloadAction<SortBy>) { state.filters.sortBy = action.payload; },
    clearFilters(state) { state.filters = initialState.filters; },
  },
});

export const { addTask, updateTask, deleteTask, setTaskStatus, setSearch, setStatus, setPriority, setSortBy, clearFilters } = tasksSlice.actions;
export default tasksSlice.reducer;
