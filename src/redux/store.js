import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './slice/quizSlice'
import userReducer from './slice/userSlice'

export const store = configureStore({
    reducer: {
        quiz: quizReducer,
        user: userReducer
    },
})