import axios from "axios";
import { FORGOT_PASSWORD_URL, SIGNIN_URL, SIGNUP_URL } from "../api/constants/endpoints";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(SIGNIN_URL, { email, password });
  return response.data;
};

export const registerUser = async (name: string, email: string, password: string) => {
  const response = await axios.post(SIGNUP_URL, { name, email, password });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  await axios.post(FORGOT_PASSWORD_URL, { email });
};