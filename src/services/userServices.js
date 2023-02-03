import axios from '../utils/axiosCustomize';

const postNewUser = (username, email, image, role, imageB64) => {
    const data = new FormData();
    data.append('username', username);
    data.append('email', email);
    data.append('image', image);
    data.append('imageB64', imageB64);
    data.append('role', role);

    return axios.post('/users', data);
}

const postQuizForUser = (data) => {
    return axios.post('/users', data);
}


const getUser = () => {
    return axios.get(`/users`)
}

const getUserAndQuiz = () => {
    return axios.get(`/users?populate=quizzes`)
}

const getUserByPage = (page, limit) => {
    return axios.get(`/users?page=${page}&limit=${limit}`)
}

const upsertUser = (dataUpsert) => {
    const data = new FormData();
    data.append('id', dataUpsert._id);
    data.append('username', dataUpsert.username);
    data.append('role', dataUpsert.role);
    if (dataUpsert.image) {
        data.append('image', dataUpsert.image);
        data.append('imageB64', dataUpsert.imageB64);
    }
    return axios.put('/users', data);
}

const deleteUser = (id) => {
    return axios.delete(`/users/${id}`);
}

const registerNewUser = (email, username, password) => {
    return axios.post('/register', { email, username, password })
}

const loginUser = (email, password) => {
    return axios.post("/login", {
        email, password
    })
}

const getUserAccount = () => {
    return axios.get("/account")
}

const logoutUser = () => {
    return axios.get(`/logout`)
}

export { postNewUser, getUser, getUserAndQuiz, getUserByPage, upsertUser, deleteUser, postQuizForUser, registerNewUser, loginUser, getUserAccount, logoutUser }