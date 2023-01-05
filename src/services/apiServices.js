import axios from '../utils/axiosCustomize';

const postNewUser = (username, email, image) => {
    const data = new FormData();
    data.append('username', username);
    data.append('email', email);
    data.append('image', image);

    return axios.post('users', data);
}

export { postNewUser }