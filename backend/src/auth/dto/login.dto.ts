import { IsEmail, IsNotEmpty, IsString } from "@nestjs/class-validator";

export class LoginDTO {
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Please provide a valid email address'})
    email: string;

    @IsString()
    @IsNotEmpty({message: 'Password is required'})
    password: string;
}