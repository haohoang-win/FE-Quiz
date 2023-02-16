import { createSlice } from '@reduxjs/toolkit'

let initialState = {
    isAuthenticated: false,
    token: "",
    account: {},
    weekNumber: ''
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
        }
    },
})

// Action creators are generated for each case reducer function
export const { loginRedux, logoutRedux, refreshPage, setWeekNumber } = userSlice.actions

export default userSlice.reducer