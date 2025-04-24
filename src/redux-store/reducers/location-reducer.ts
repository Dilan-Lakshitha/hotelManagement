import { createSlice } from "@reduxjs/toolkit";
import { deletelocation, locationCreate, locations, updatelocation } from "../../shared/service/locationService";
import { locationModel } from "../../shared/models/location-model";

const initialState: locationModel = {
  loading: false,
  error: "",
  success: false,
  location: [],
};

const locationSlice = createSlice({
  name: "location",
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
      .addCase(locationCreate.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(locationCreate.fulfilled, (state, payload: any) => {
        state.loading = false;
        state.success = payload.success;
        if (payload) {
          state.location.push(payload.payload);
        }
      })
      .addCase(locationCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(locations.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(locations.fulfilled, (state, payload: any) => {
        console.log("payload", payload);
        state.loading = false;
        state.success = payload.success;
        state.location = payload.payload;
      })
      .addCase(locations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updatelocation.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updatelocation.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = action.payload.success;

        const updatedLocation = action.payload;
        const index = state.location.findIndex(
          (p: any) => p.location_ticket_id === updatedLocation.location_ticket_id
        );
        if (index !== -1) {
          state.location[index] = updatedLocation;
        }
      })
      .addCase(updatelocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deletelocation.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deletelocation.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = action.payload.success;
        const deletedId = action.payload.deletedId;
        state.location = state.location.filter(
          (p: any) => p.location_ticket_id !== deletedId
        );
      })
      .addCase(deletelocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetState, resetSuccess } = locationSlice.actions;
export default locationSlice.reducer;
