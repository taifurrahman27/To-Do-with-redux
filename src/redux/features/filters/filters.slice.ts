import { createSlice } from "@reduxjs/toolkit";


interface initialState{
    name: string;
    priority: string;
    status: string;
}

const initialState: initialState = {
    name: "",
    priority: "medium",
    status: "pending",
};

const filtersSlice = createSlice({
  name: "filters",

    initialState,
    reducers: {}
});

export default filtersSlice.reducer;