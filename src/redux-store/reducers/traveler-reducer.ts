import { createSlice } from "@reduxjs/toolkit";
import { travelerModel } from "../../shared/models/traveler-model";
import { deletetraveler, travelerCreate, travelers, updatetraveler } from "../../shared/service/travelerService";

const initialState: travelerModel = {
  loading: false,
  error: "",
  success: false,
  traveler: [],
};

const travelerSlice = createSlice({
  name: "traveler",
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
      .addCase(travelerCreate.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(travelerCreate.fulfilled, (state, payload: any) => {
        state.loading = false;
        state.success = payload.success;
        if (payload) {
          state.traveler.push(payload.payload);
        }
      })
      .addCase(travelerCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(travelers.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(travelers.fulfilled, (state, payload: any) => {
        console.log("payload", payload);
        state.loading = false;
        state.success = payload.success;
        state.traveler = payload.payload;
      })
      .addCase(travelers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updatetraveler.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updatetraveler.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = action.payload.success;

        const updatedPatient = action.payload;
        const index = state.traveler.findIndex(
          (p: any) => p.customer_id === updatedPatient.customer_id
        );
        if (index !== -1) {
          state.traveler[index] = updatedPatient;
        }
      })
      .addCase(updatetraveler.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deletetraveler.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deletetraveler.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = action.payload.success;
        const deletedId = action.payload.travelerId;
        state.traveler = state.traveler.filter(
          (p: any) => p.traveler_id !== deletedId
        );
      })
      .addCase(deletetraveler.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetState, resetSuccess } = travelerSlice.actions;
export default travelerSlice.reducer;
