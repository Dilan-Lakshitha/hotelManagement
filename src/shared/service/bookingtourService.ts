import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "./userSetting";

export const bookingtourCreate = createAsyncThunk(
    'bookingtour/register',
    async (payload: any, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.post('bookingTour', payload);
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

export const bookingtours = createAsyncThunk(
    'bookingtours',
    async (_, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.get('bookingTour');
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