
import axios from "axios";
import { AUTH_STATUS, FORGOT_PASSWORD_URL, LOGOUT_URL, RESET_PASSWORD_URL, SIGNIN_URL, SIGNUP_URL } from "./axios";
import type { LoginDTO, ResetPassDTO, SignupDTO } from "./types/auth.types";

export const signinUser = async (params: LoginDTO) => {
  try {
    const response = await axios.post(SIGNIN_URL, params, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
};

export const signupUser = async (params: SignupDTO) => {
return await axios.post(SIGNUP_URL, {
    headers: {
      Accept: 'application/json',
    },
    ...params,
  });
};

export const forgotPassword = async (email: string) => {
  const response = await axios.post(FORGOT_PASSWORD_URL, {email});
  return response.data;
}

export const resetPassword = async (data: ResetPassDTO) => {
  const response = await axios.post(RESET_PASSWORD_URL, data);
  return response.data;
};

export const checkAuthStatus = async () => {
  return await axios.get(AUTH_STATUS, {
    headers: {
      Accept: 'application/json',
    },
  });
};

export const logoutUser = async () => {
  const response = await axios.post(LOGOUT_URL);
  return response.data;
};