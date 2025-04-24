import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "./userSetting";

export const guideCreate = createAsyncThunk(
    'guide/register',
    async (payload: any, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.post('guide/create', payload);
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

export const guides = createAsyncThunk(
    'guide',
    async (_, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.get('guide');
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

export const updateGuide = createAsyncThunk(
    'Updateguide',
    async (guide:any, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.put(`guide/${guide.guideId}`, guide);
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

export const deleteGuide = createAsyncThunk(
    'Deleteguide',
    async (guideId:number, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.delete(`guide/${guideId}`);
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