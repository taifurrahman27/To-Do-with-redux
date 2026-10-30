import { combineReducers } from "@reduxjs/toolkit";

import filtersReducer from "./features/filters/filters.slice";
import tasksReducer from "./features/tasks/tasks.slice";

export const rootReducer = combineReducers({
  tasks: tasksReducer,
  filters: filtersReducer,
  
});
