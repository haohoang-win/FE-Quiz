import axios from '../utils/axiosCustomize';

const postNewQuiz = (name, difficulty, description, image, imageB64) => {
    const data = new FormData();
    data.append('name', name);
    data.append('difficulty', difficulty);
    data.append('description', description);
    data.append('image', image);
    data.append('imageB64', imageB64);

    return axios.post('/quizzes', data);
}

const getQuizByPage = (page, limit) => {
    return axios.get(`/quizzes?page=${page}&limit=${limit}`)
}

const upsertQuiz = (dataUpsert) => {
    const data = new FormData();
    data.append('id', dataUpsert._id);
    data.append('description', dataUpsert.description);
    if (dataUpsert.image) {
        data.append('image', dataUpsert.image);
        data.append('imageB64', dataUpsert.imageB64);
    }
    return axios.put('/quizzes', data);
}

const deleteQuiz = (id) => {
    return axios.delete(`/quizzes/${id}`);
}

export { postNewQuiz, getQuizByPage, upsertQuiz, deleteQuiz }