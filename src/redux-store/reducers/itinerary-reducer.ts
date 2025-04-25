import { createSlice } from "@reduxjs/toolkit";
import { itineraryModel } from "../../shared/models/itinerary-model";
import { deleteitinerary, itineraryCreate, itinerarys, updateitinerary } from "../../shared/service/itineraryService";

const initialState: itineraryModel = {
  loading: false,
  error: "",
  success: false,
  itinerary: [],
};

const itinerarySlice = createSlice({
  name: "itinerary",
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
      .addCase(itineraryCreate.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(itineraryCreate.fulfilled, (state, payload: any) => {
        state.loading = false;
        state.success = payload.success;
        if (payload) {
          state.itinerary.push(payload.payload);
        }
      })
      .addCase(itineraryCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(itinerarys.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(itinerarys.fulfilled, (state, payload: any) => {
        console.log("payload", payload);
        state.loading = false;
        state.success = payload.success;
        state.itinerary = payload.payload;
      })
      .addCase(itinerarys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateitinerary.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateitinerary.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = action.payload.success;

        const updatedPatient = action.payload;
        const index = state.itinerary.findIndex(
          (p: any) => p.customer_id === updatedPatient.customer_id
        );
        if (index !== -1) {
          state.itinerary[index] = updatedPatient;
        }
      })
      .addCase(updateitinerary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteitinerary.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteitinerary.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = action.payload.success;
        const deletedId = action.payload;
        state.itinerary = state.itinerary.filter(
          (p: any) => p.itinerary_id !== deletedId
        );
      })
      .addCase(deleteitinerary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetState, resetSuccess } = itinerarySlice.actions;
export default itinerarySlice.reducer;