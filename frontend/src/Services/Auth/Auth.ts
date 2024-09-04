import { VerifyEmailProps } from "../../Types/Auth/Email";
import { LoginForm, LoginResponse } from "../../Types/Auth/Login";
import { RegisterForm, RegisterResponse } from "../../Types/Auth/Register";
import { User } from "../../Types/User";
import api from "../api";
import Storage from "../Storage";

class Auth {
    static async verify(): Promise<User> {
        try {
            const response = await api.get('/verify');
            return response.data;
        } catch (error) {
            try {
                await this.refreshToken();
                return await this.verify();
            } catch (refreshError) {
                Storage.clear();
                throw error;
            }
        }
    }

    static async login(loginFormData: LoginForm): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>('/login', loginFormData);
            const { accessToken } = response.data;
            if (accessToken) {
                Storage.setItem('Access Token', accessToken);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async register(registerFormData: RegisterForm): Promise<RegisterResponse> {
        try {
            const response = await api.post<RegisterResponse>('/users', registerFormData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async verifyEmail(emailPayload: VerifyEmailProps) {
        try {
            const response = await api.post(`/email-verify`, emailPayload);
            const { accessToken } = response.data;
            if (accessToken) {
                Storage.setItem('Access Token', accessToken);
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async resendEmail() {
        try {
            const response = await api.post('/resend-verification');
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async refreshToken() {
        try {
            const response = await api.post('/refresh-token');
            const { accessToken } = response.data;
            Storage.setItem("Access Token", accessToken);
            return response.data;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            throw error;
        }
    }
}

export default Auth;
