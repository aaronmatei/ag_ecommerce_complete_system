import axios from 'axios'

export const UserRegistration = data => {

    return axios
        .post(`${process.env.REACT_APP_API}/users/signup`, data)
        .then(res => res.status)
        .catch(err => err.message)
}

