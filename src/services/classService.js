import axios from '../utils/axiosCustomize';

const deleteManyClass = (data) => {
    return axios.post('/class-delete-many', data);
}

const getClassById = (id) => {
    return axios.get(`/class/${id}?populate=students`);
}

const getClassByIdWithTeacher = (id) => {
    return axios.get(`/class/${id}?populate=teacherObject`);
}

const getAllClassWithSeason = (id) => {
    return axios.get(`/all-class/2022-2023/${id}`);
}

const postStudentForClass = (data) => {
    return axios.post(`/class`, data);
}

const postObjectTeacherForClass = (data) => {
    return axios.post(`/class-subbject-teacher`, data);
}

export { deleteManyClass, getClassById, postStudentForClass, getClassByIdWithTeacher, postObjectTeacherForClass, getAllClassWithSeason }