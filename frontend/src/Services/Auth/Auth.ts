import api from "../api";

class Auth {
    static login() {
        api.get('verify')
            .then((data) => {
                return data
            })
            .catch((error) => {
                return error
            })
    }
}

export default Auth
