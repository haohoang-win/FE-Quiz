import axios from '../utils/axiosCustomize';

const postNewSeason = (data) => {
    return axios.post('/season', data);
}

const getAllSeason = () => {
    return axios.get('/season?populate=grades.classes');
}

const getCurrentSeason = () => {
    return axios.get('/season?year=2022/2023');
}

const upsertSeason = (dataUpsert) => {
    return axios.post('/upsert-season', dataUpsert);
}

export { postNewSeason, getAllSeason, upsertSeason, getCurrentSeason }