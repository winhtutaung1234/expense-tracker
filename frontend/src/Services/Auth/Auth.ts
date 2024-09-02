import { LoginForm, LoginResponse } from "../../Types/Auth/Login";
import api from "../api";
import Storage from "../Storage";

class Auth {
    static async verify() {
        return api.get('/verify')
            .then((response) => {
                return response.data;
            })
            .catch((error) => {
                Storage.clear();
                throw error;
            });
    }

    static async login(loginFormData: LoginForm) {
        return api.post<LoginResponse>('/login', loginFormData)
            .then((response) => {
                const { accessToken } = response.data;
                Storage.setItem('Access Token', accessToken);
                return response.data;
            })
            .catch((error) => {
                throw error;
            });
    }
}

export default Auth;
