import axios from '../utils/axiosCustomize';

const postNewSeason = (data) => {
    return axios.post('/season', data);
}

const getAllSeason = () => {
    return axios.get('/season');
}

export { postNewSeason, getAllSeason }