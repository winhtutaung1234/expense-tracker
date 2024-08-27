import LoginForm from "../../Types/Auth/Login";
import api from "../api";
import Storage from "../Storage";

class Auth {
    static async getUser() {
        return api.get('/verify')
            .then((data) => data)
            .catch((error) => {
                Storage.clear();
                throw error;
            });
    }

    static async login(loginFormData: LoginForm) {
        return api.post('/login', loginFormData)
            .then((data) => data)
            .catch((error) => {
                throw error;
            })
    }
}

export default Auth;