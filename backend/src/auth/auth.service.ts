import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { ResetPassDTO } from 'src/users/dto/reset-pass.dto';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { LoginDTO } from 'src/users/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private otpStore = new Map(); // Temporary storage for OTPs

  async signup(createUser: CreateUserDTO) {
    const existingUser = await this.usersService.findUserByEmail(
      createUser.email,
    );
    if (existingUser)
      throw new HttpException('Email already exists', HttpStatus.FOUND);

    const hashedPassword = await bcrypt.hash(createUser.password, 10);
    return this.usersService.createUser({
      ...createUser,
      password: hashedPassword,
    });
  }

  async signIn(loginDto: LoginDTO) {
    const user = await this.usersService.findUserByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Bad Credentials');
    }

    const isMatch = await this.verifyPassword(
      loginDto.password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Bad Credentials');
    }

    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);
        const { password, ...safeUser } = user;
        return { token, user: safeUser };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && (await this.verifyPassword(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async sendResetOTP(email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    this.otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // OTP valid for 5 minutes
    });

    try {
      await this.emailService.sendEmail(
        email,
        'Password Reset OTP',
        `Your OTP is: ${otp}`,
      );
    } catch (error) {
      console.error('Error sending OTP:', error.message);
      throw new InternalServerErrorException(
      'Unable to send OTP. Please try again later.',
    );
    }
    return {
        message: 'OTP sent to email',
        note: 'Check console for Ethereal Email preview URL',
    };
  }

  async resetPassword(body: ResetPassDTO) {
    const { email, otp, newPassword } = body;
    const record = this.otpStore.get(email);

    if (!record) {
      throw new BadRequestException('No OTP request found for this email');
    }

    if (record.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    const otpTimestamp = this.otpStore.get(`${email}_timestamp`);
    const currentTime = Date.now();
    const otpExpiryTime = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (currentTime - otpTimestamp > otpExpiryTime) {
      this.otpStore.delete(email);
      this.otpStore.delete(`${email}_timestamp`);
      throw new BadRequestException('OTP has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(email, hashedPassword);

    this.otpStore.delete(email);
    // this.otpStore.delete(`${email}_timestamp`);

    return { message: 'Password updated successfully' };
  }

  async verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
