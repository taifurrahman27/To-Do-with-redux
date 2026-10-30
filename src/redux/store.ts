import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "./features/filters/filters.slice";
import tasksReducer from "./features/tasks/tasks.slice";

export const store = configureStore({
  reducer: {
tasks: tasksReducer,
filters: filtersReducer,
},
});

