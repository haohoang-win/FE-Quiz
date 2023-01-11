import axios from '../utils/axiosCustomize';

const getQuestion = (id) => {
    return axios.get(`/questions/${id}`)
}

const postQuestion = (dataQuestion) => {
    const data = new FormData();
    data.append('description', dataQuestion.description);
    data.append('difficulty', dataQuestion.difficulty);
    data.append('image', dataQuestion.image);
    data.append('imageB64', dataQuestion.imageB64);
    data.append('answersDescription', dataQuestion.answersDescription);
    data.append('answers', dataQuestion.answers);
    return axios.post(`/questions`, data)
}

const postAnswerForQuestion = (dataQuestion) => {
    const data = new FormData();
    data.append('type', dataQuestion.type);
    data.append('_id', dataQuestion._id);
    data.append('description', dataQuestion.description);
    for (let i = 0; i < dataQuestion.answers.length; i++) {
        data.append('answers', dataQuestion.answers[i]);
        data.append('answersDescription', dataQuestion.answersDescription[i]);
    }
    if (!!dataQuestion.image.name) {
        data.append('image', dataQuestion.image);
        data.append('imageB64', dataQuestion.imageB64);
    } else {
        delete dataQuestion.image;
        delete dataQuestion.imageB64;
    }
    return axios.post(`/questions`, data);
}

export {
    postQuestion, postAnswerForQuestion, getQuestion
}