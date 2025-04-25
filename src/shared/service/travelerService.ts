import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "./userSetting";

export const travelerCreate = createAsyncThunk(
    'traveler/register',
    async (payload: any, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.post('traveler', payload);
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

export const travelers = createAsyncThunk(
    'traveler',
    async (_, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.get('traveler');
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

export const updatetraveler = createAsyncThunk(
    'Updatetraveler',
    async (traveler:any, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.put(`traveler/${traveler.travelerId}`, traveler);
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

export const deletetraveler = createAsyncThunk(
    'Deletetraveler',
    async (travelerId:number, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.delete(`traveler/${travelerId}`);
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