import axios from '../utils/axiosCustomize';

const postAnswer = (data) => {
    return axios.post(`/answers`, data)
}

const putAnswer = (data) => {
    return axios.put(`/answers`, data)
}

export {
    postAnswer, putAnswer
}