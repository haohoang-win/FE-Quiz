import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    isAuthenticated: false,
    token: "",
    account: {},
    weekNumber: '',
    isLoading: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginRedux: (state, action) => {
            state.isAuthenticated = action.payload.isAuthenticated;
            state.token = action.payload.token;
            state.account = action.payload.account;
        },
        logoutRedux: (state, action) => {
            state.isAuthenticated = false;
            state.token = '';
            state.account = {};
        },
        refreshPage: (state, action) => {
            state.isAuthenticated = action?.payload?.isAuthenticated;
            state.token = action?.payload?.token;
            state.account = action?.payload?.account;
        },
        setWeekNumber: (state, action) => {
            state.weekNumber = action?.payload
        },
        loadingLogin: (state, action) => {
            state.isLoading = true;
        },
        unLoadingLogin: (state, action) => {
            state.isLoading = false;
        }
    },
})

// Action creators are generated for each case reducer function
export const { loginRedux, logoutRedux, refreshPage, setWeekNumber, loadingLogin, unLoadingLogin } = userSlice.actions

export default userSlice.reducer