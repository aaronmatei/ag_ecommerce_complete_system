import axios from 'axios'

const LoginService = data => (
    axios.post("http://localhost:5000/api/v1/users/authenticate")
        .then(res => res.status)
)

export default LoginService