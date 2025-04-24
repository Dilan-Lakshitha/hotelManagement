import { createSlice } from "@reduxjs/toolkit";
import {
  deleteHotel,
  hotelCreate,
  hotels,
  updateHotel,
} from "../../shared/service/hotelService";
import { hotelModel } from "../../shared/models/hotel-model";

const initialState: hotelModel = {
  loading: false,
  error: "",
  success: false,
  hotel: [],
  pendingRates: [],
};

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = "";
    },
    resetSuccess: (state) => {
      state.success = false;
    },
    setPendingRates: (state, action) => {
      state.pendingRates = action.payload;
    },
    clearPendingRates: (state) => {
      state.pendingRates = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hotelCreate.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(hotelCreate.fulfilled, (state, payload: any) => {
        state.loading = false;
        state.success = payload.success;
        if (payload) {
          state.hotel.push(payload.payload);
        }
      })
      .addCase(hotelCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(hotels.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(hotels.fulfilled, (state, payload: any) => {
        console.log("payload", payload);
        state.loading = false;
        state.success = payload.success;
        state.hotel = payload.payload;
      })
      .addCase(hotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateHotel.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateHotel.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = action.payload.success;

        const updatedPatient = action.payload;
        const index = state.hotel.findIndex(
          (p: any) => p.customer_id === updatedPatient.customer_id
        );
        if (index !== -1) {
          state.hotel[index] = updatedPatient;
        }
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(deleteHotel.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteHotel.fulfilled, (state, action: any) => {
        state.loading = false;
        state.success = action.payload.success;
        const deletedId = action.payload.deletedId;
        state.hotel = state.hotel.filter(
          (p: any) => p.hotel_id !== deletedId
        );
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetState, resetSuccess, setPendingRates ,clearPendingRates } =
  hotelSlice.actions;
export default hotelSlice.reducer;
