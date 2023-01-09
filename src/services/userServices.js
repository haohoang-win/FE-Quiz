import axios from '../utils/axiosCustomize';

const postNewUser = (username, email, image, imageB64) => {
    const data = new FormData();
    data.append('username', username);
    data.append('email', email);
    data.append('image', image);
    data.append('imageB64', imageB64);

    return axios.post('/users', data);
}

const postQuizForUser = (data) => {
    return axios.post('/users', data);
}


const getUser = () => {
    return axios.get(`/users`)
}

const getUserByPage = (page, limit) => {
    return axios.get(`/users?page=${page}&limit=${limit}`)
}

const upsertUser = (dataUpsert) => {
    const data = new FormData();
    data.append('id', dataUpsert._id);
    data.append('username', dataUpsert.username);
    if (dataUpsert.image) {
        data.append('image', dataUpsert.image);
        data.append('imageB64', dataUpsert.imageB64);
    }
    return axios.put('/users', data);
}

const deleteUser = (id) => {
    return axios.delete(`/users/${id}`);
}

export { postNewUser, getUser, getUserByPage, upsertUser, deleteUser, postQuizForUser }