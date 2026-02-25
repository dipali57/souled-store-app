import { IsNotEmpty, IsNumber, IsString } from "@nestjs/class-validator";

export class ResetPassDTO {
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}
