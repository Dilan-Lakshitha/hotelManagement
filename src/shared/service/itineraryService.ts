import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "./userSetting";

export const itineraryCreate = createAsyncThunk(
    'itinerary/register',
    async (payload: any, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.post('itinerary', payload);
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

export const itinerarys = createAsyncThunk(
    'itinerary',
    async (_, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.get('itinerary');
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

export const updateitinerary = createAsyncThunk(
    'Updateitinerary',
    async (itinerary:any, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.put(`itinerary/${itinerary.itineraryId}`, itinerary);
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

export const deleteitinerary = createAsyncThunk(
    'Deleteitinerary',
    async (itineraryId:number, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.delete(`itinerary/${itineraryId}`);
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