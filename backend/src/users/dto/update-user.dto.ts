import { PartialType } from '@nestjs/mapped-types';
import { RegisterDTO } from '../../auth/dto/register.dto';
import { IsEmail, IsEnum, IsOptional, IsString } from '@nestjs/class-validator';
import { Gender } from 'src/common/enums/user-role.enum';

export class UpdateUserDto {
    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    mobile?: string;

    @IsOptional()
    @IsString()
    @IsEnum(Gender, {
    message: 'Gender must be M, F or O',
    })
    gender?: Gender;
}
