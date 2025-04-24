import { createSlice } from "@reduxjs/toolkit";
import { guideModel } from "../../shared/models/guide-model";
import { deleteGuide, guideCreate, guides, updateGuide } from "../../shared/service/guideService";

const initialState: guideModel = {
  loading: false,
  error: "",
  success: false,
  guide: [],
};

const guideSlice = createSlice({
  name: "guide",
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
      .addCase(guideCreate.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(guideCreate.fulfilled, (state, payload: any) => {
        state.loading = false;
        state.success = payload.success;
        if (payload) {
          state.guide.push(payload.payload);
        }
      })
      .addCase(guideCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(guides.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(guides.fulfilled, (state, payload: any) => {
        console.log("payload", payload);
        state.loading = false;
        state.success = payload.success;
        state.guide = payload.payload;
      })
      .addCase(guides.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateGuide.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateGuide.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = action.payload.success;

        const updatedPatient = action.payload;
        const index = state.guide.findIndex(
          (p: any) => p.customer_id === updatedPatient.customer_id
        );
        if (index !== -1) {
          state.guide[index] = updatedPatient;
        }
      })
      .addCase(updateGuide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteGuide.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteGuide.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = action.payload.success;

        console.log("action.payload", action.payload);
        const deletedId = action.payload.deletedCustomerId;
        state.guide = state.guide.filter(
          (p: any) => p.customer_id !== deletedId
        );
      })
      .addCase(deleteGuide.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetState, resetSuccess } = guideSlice.actions;
export default guideSlice.reducer;
