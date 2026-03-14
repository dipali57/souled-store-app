import { api, AUTH_REFRESH, AUTH_STATUS, FORGOT_PASSWORD_URL, GET_ME, LOGOUT_URL, RESET_PASSWORD_URL, SIGNIN_URL, SIGNUP_URL } from "./axios";
import type { LoginDTO, ResetPassDTO, SignupDTO } from "./types/auth.types";

export const signinUser = async (data: LoginDTO) => await api.post(SIGNIN_URL, data);

export const signupUser = async (data: SignupDTO) =>  await api.post(SIGNUP_URL, data);

export const forgotPassword = async (email: string) => await api.post(FORGOT_PASSWORD_URL, {email});

export const resetPassword = async (data: ResetPassDTO) => await api.post(RESET_PASSWORD_URL, data);

export const checkAuthStatus = async () => await api.get(AUTH_STATUS);

export const logoutUser = async () => await api.post(LOGOUT_URL);

export const refreshToken = async () => await api.post(AUTH_REFRESH);

export const getProfile = async () => await api.get(GET_ME);