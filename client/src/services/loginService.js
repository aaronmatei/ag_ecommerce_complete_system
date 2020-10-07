import axios from 'axios'

const LoginService = data => (
    axios
        .post(`${process.env.REACT_APP_API}/users/signin`, data)
        .then(res => res.status)
        .catch(err => err.error)
)

export default LoginService