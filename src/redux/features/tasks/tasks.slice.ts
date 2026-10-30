import { createSlice } from "@reduxjs/toolkit";

interface initialState{
    name: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
}

const initialState: initialState = {
    name: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
};

const tasksSlice = createSlice({
  name: "tasks",

    initialState,
    reducers: {}
});

export default tasksSlice.reducer;