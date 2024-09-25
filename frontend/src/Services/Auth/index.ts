import {
  ResendEmailResponse,
  VerifyEmailProps,
  VerifyEmailResponse,
} from "../../Types/Auth/Email";
import { LoginForm, LoginResponse } from "../../Types/Auth/Login";
import { LogoutResponse } from "../../Types/Auth/Logout";
import { RefreshTokenResponse } from "../../Types/Auth/RefreshToken";
import { RegisterForm, RegisterResponse } from "../../Types/Auth/Register";
import { User } from "../../Types/User";
import api from "../api";
import Storage from "../Storage";

class Auth {
  static async verify(): Promise<User> {
    const accessToken = Storage.getItem("Access Token");
    if (!accessToken) {
      throw new Error("No access token available.");
    }
    try {
      const response = await api.get<User>("/verify");
      return response.data;
    } catch (error) {
      Storage.clear();
      throw error;
    }
  }

  static async login(loginFormData: LoginForm): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>("/login", loginFormData);
      const { accessToken } = response.data;
      if (accessToken) {
        Storage.setItem("Access Token", accessToken);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async register(
    registerFormData: RegisterForm
  ): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>(
        "/users",
        registerFormData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async logout(): Promise<LogoutResponse> {
    try {
      const response = await api.post<LogoutResponse>("/logout");
      Storage.clear();
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async verifyEmail(
    emailPayload: VerifyEmailProps
  ): Promise<VerifyEmailResponse> {
    try {
      const response = await api.post<VerifyEmailResponse>(
        `/email-verify`,
        emailPayload
      );
      const { accessToken } = response.data;
      if (accessToken) {
        Storage.setItem("Access Token", accessToken);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async resendEmail(): Promise<ResendEmailResponse> {
    try {
      const response = await api.post<ResendEmailResponse>(
        "/resend-verification"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async refreshToken(): Promise<RefreshTokenResponse> {
    try {
      const response = await api.post<RefreshTokenResponse>("/refresh-token");
      const { accessToken } = response.data;
      Storage.setItem("Access Token", accessToken);
      return response.data;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      throw error;
    }
  }
}

export default Auth;
