import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { UserModel } from "../../shared/models/user-model";
import { signIn, signUp } from "../../shared/service/userSetting";

const initialState:UserModel = {
    userInfo:localStorage.getItem('authToken') ? jwtDecode(localStorage.getItem('authToken') as string) : null,
    loading: false,
    error: '',
    success: false,
    user: []
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout:(state)=>{
            localStorage.removeItem('authToken');
        },
        resetState: (state) => {
            state.loading = false;
            state.error = '';
        },
        resetSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase( signUp.pending,(state) => {
            state.loading = true;
            state.error = '';
        })
        .addCase(signUp.fulfilled,(state,payload:any ) => {
            state.loading = false;
            state.success = payload.success;
        })
        .addCase(signUp.rejected,(state,action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase( signIn.pending,(state) => {
            state.loading = true;
            state.error = '';
        })
        .addCase(signIn.fulfilled,(state,payload:any ) => {
            console.log(payload.payload.token);
            if(payload.payload.token){
               localStorage.setItem("authToken", payload.payload.token);
            }
            state.loading = false;
            state.success = payload.success;
        })
        .addCase(signIn.rejected,(state,action) => {
            state.loading = false;
            state.error = action.error.message;
        })
    }
    });

export const { resetState, resetSuccess } = authSlice.actions;
export default authSlice.reducer;