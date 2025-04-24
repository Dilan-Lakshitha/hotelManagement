import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "./userSetting";

export const driverCreate = createAsyncThunk(
    'patinet/register',
    async (payload: any, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.post('Driver/create', payload);
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

export const drivers = createAsyncThunk(
    'patinets',
    async (_, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.get('Driver');
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

export const updateDriver = createAsyncThunk(
    'Updatepatinets',
    async (driver:any, { rejectWithValue }) => {
        console.log('driver', driver);
        const api = axiosApi
        try {
            const response = await api.put(`Driver/${driver.driverId}`, driver);
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

export const deleteDriver = createAsyncThunk(
    'Deletepatinets',
    async (driverId:number, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.delete(`Driver/${driverId}`);
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