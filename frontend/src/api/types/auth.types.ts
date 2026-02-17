export interface SignupDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ResetPassDTO {
  email: string;
  otp: string;
  newPassword: string;
}
