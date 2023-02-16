import axios from '../utils/axiosCustomize';

const getAllSchedule = (idClass, weekNumber) => {
    return axios.get(`/schedule?idClass=${idClass}&season=2022/2023&weekNumber=${weekNumber}`);
}

const getAllScheduleForStudent = (weekNumber) => {
    return axios.get(`/schedule-student?season=2022/2023&weekNumber=${weekNumber}`);
}

const postScheduleForClass = (data) => {
    return axios.post(`/schedule`, data);
}

export {
    getAllSchedule, postScheduleForClass, getAllScheduleForStudent
}