import { createSlice } from "@reduxjs/toolkit";
import { bookingtourModel } from "../../shared/models/bookingtour-model";
import { bookingtourCreate, bookingtours } from "../../shared/service/bookingtourService";

const initialState: bookingtourModel = {
  loading: false,
  error: "",
  success: false,
  bookingtour: [],
};

const bookingtourSlice = createSlice({
  name: "bookingtour",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = "";
    },
    resetSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookingtourCreate.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(bookingtourCreate.fulfilled, (state, payload: any) => {
        state.loading = false;
        state.success = payload.success;
        if (payload) {
          state.bookingtour.push(payload.payload);
        }
      })
      .addCase(bookingtourCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(bookingtours.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(bookingtours.fulfilled, (state, payload: any) => {
        console.log("payload", payload);
        state.loading = false;
        state.success = payload.success;
        state.bookingtour = payload.payload;
      })
      .addCase(bookingtours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export const { resetState, resetSuccess } = bookingtourSlice.actions;
export default bookingtourSlice.reducer;