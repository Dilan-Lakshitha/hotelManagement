import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "./userSetting";

export const hotelCreate = createAsyncThunk(
    'hotel/register',
    async (payload: any, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.post('hotel', payload);
            return response.data;
        } catch (error:any) {
            if (error.response) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);

export const hotels = createAsyncThunk(
    'hotel',
    async (_, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.get('hotel');
            return response.data;
        } catch (error:any) {
            if (error.response) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);

export const updateHotel = createAsyncThunk(
    'Updatehotel',
    async (hotel: any, { rejectWithValue }) => {
      try {
        const response = await axiosApi.put(`hotel/${hotel.HotelId}`, hotel);
        return response.data;
      } catch (error: any) {
        if (error.response) {
          return rejectWithValue(error.response.data);
        } else {
          return rejectWithValue('An unknown error occurred');
        }
      }
    }
  );
  

export const deleteHotel = createAsyncThunk(
    'DeleteHotel',
    async (hotelId:number, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.delete(`hotel/${hotelId}`);
            return response.data;
        } catch (error:any) {
            if (error.response) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);