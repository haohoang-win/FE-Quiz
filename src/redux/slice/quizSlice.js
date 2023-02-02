import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axiosCustomize';

export const fetchQuizById = createAsyncThunk(
    'quiz/fetchQuizById',
    async (quizId) => {
        const res = await axios.get(`/quizzes/${quizId}`);
        return res.DT
    }
)

const initialState = {
    id: '',
    detalQuiz: [],
    isLoading: false,
    isError: false
}

export const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        addQuizId: (state, action) => {
            state.id = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuizById.pending, (state, action) => {
                state.isLoading = true;
                state.isError = false
            })
            .addCase(fetchQuizById.fulfilled, (state, action) => {
                state.detalQuiz = action.payload;
                state.isLoading = false;
                state.isError = false
            })
            .addCase(fetchQuizById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true
            })
    }
})

// Action creators are generated for each case reducer function
export const { addQuizId } = quizSlice.actions

export default quizSlice.reducer