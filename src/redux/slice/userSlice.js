import { createSlice } from '@reduxjs/toolkit'

const loadState = async () => {
    console.log(123);
    // let res = await getUserAccount();
    // if (res && res.EC === 0) {
    //     let groupWithRoles = res.DT.groupWithRoles
    //     let email = res.DT.email
    //     let username = res.DT.username
    //     let token = res.DT.access_token

    //     let data = {
    //         isAuthenticated: true,
    //         token,
    //         account: { groupWithRoles, email, username },
    //         isLoading: false
    //     }
    //     setUser(data);
    //     console.log(123);
    // } else {
    //     setUser({ ...userDefault, isLoading: false })
    // }
}

const initialState = {
    isAuthenticated: false,
    token: "",
    account: {}
}

const peristedState = loadState();

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginRedux: (state, action) => {
            console.log(action);
            state.isAuthenticated = action.payload.isAuthenticated;
            state.token = action.payload.token;
            state.account = action.payload.account;
        },
        logoutContext: (state, action) => {
            state.isAuthenticated = false;
            state.token = '';
            state.account = {};
        },
        // loadState
    },
})

// Action creators are generated for each case reducer function
export const { loginRedux, logoutContext } = userSlice.actions

export default userSlice.reducer