export interface SignupDTO {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  mobile?: string;
  gender?: 'M' | 'F' | 'O';
  birthdate?: string;
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
