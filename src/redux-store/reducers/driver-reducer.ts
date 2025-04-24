import { createSlice } from "@reduxjs/toolkit";
import {
  deleteDriver,
  driverCreate,
  drivers,
  updateDriver,
} from "../../shared/service/driverService";
import { driverModel } from "../../shared/models/driver-model";

const initialState: driverModel = {
  loading: false,
  error: "",
  success: false,
  driver: [],
};

const driverSlice = createSlice({
  name: "driver",
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
      .addCase(driverCreate.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(driverCreate.fulfilled, (state, payload: any) => {
        state.loading = false;
        state.success = payload.success;
        if (payload) {
          state.driver.push(payload.payload);
        }
      })
      .addCase(driverCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(drivers.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(drivers.fulfilled, (state, payload: any) => {
        console.log("payload", payload);
        state.loading = false;
        state.success = payload.success;
        state.driver = payload.payload;
      })
      .addCase(drivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateDriver.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateDriver.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = action.payload.success;

        const updatedPatient = action.payload;
        const index = state.driver.findIndex(
          (p: any) => p.customer_id === updatedPatient.customer_id
        );
        if (index !== -1) {
          state.driver[index] = updatedPatient;
        }
      })
      .addCase(updateDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteDriver.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteDriver.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = action.payload.success;
        const deletedId = action.payload.id;
        state.driver = state.driver.filter(
          (p: any) => p.driver_id !== deletedId
        );
      })
      .addCase(deleteDriver.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetState, resetSuccess } = driverSlice.actions;
export default driverSlice.reducer;
