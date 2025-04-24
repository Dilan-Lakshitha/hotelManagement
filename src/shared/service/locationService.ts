import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosApi } from "./userSetting";

export const locationCreate = createAsyncThunk(
    'location/register',
    async (payload: any, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.post('locationTicket', payload);
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

export const locations = createAsyncThunk(
    'location',
    async (_, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.get('locationTicket');
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

export const updatelocation = createAsyncThunk(
    'Updatelocation',
    async (location:any, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.put(`locationTicket/${location.locationTicketId}`, location);
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

export const deletelocation = createAsyncThunk(
    'Deletelocation',
    async (locationId:number, { rejectWithValue }) => {
        const api = axiosApi
        try {
            const response = await api.delete(`locationTicket/${locationId}`);
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