import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./features/filters/filters.slice";
import tasksReducer from "./features/tasks/tasks.slice";

export const store = configureStore({
  reducer: {
tasks: tasksReducer,
filters: filtersReducer,
},
});

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store