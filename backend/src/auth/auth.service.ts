import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from './email.service';
import { ResetPassDTO } from 'src/users/dto/reset-pass.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private otpStore = new Map(); // Temporary storage for OTPs

  async signup(userData) {
    const existingUser = await this.usersService.findUserByEmail(userData.email);
    if (existingUser) throw new HttpException('Email already exists', HttpStatus.FOUND);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.usersService.createUser({ ...userData, password: hashedPassword });
  }

  async login(user) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findUser(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Passwords match
      const { password, ...result } = user;
      return result;
    }
    return null; // User not found or password doesn't match
  }

  async sendResetOTP(email: string) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    this.otpStore.set(email, otp);

    try {
      await this.emailService.sendEmail(
        email,
        'Password Reset OTP',
        `Your OTP is: ${otp}`
      );
      
      return { 
        message: 'OTP sent to email',
        note: 'Check console for Ethereal Email preview URL'
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP email');
    }
  }

  async resetPassword(body: ResetPassDTO) {
    const { email, otp, newPassword } = body;
    if (!this.otpStore.has(email)) {
      throw new BadRequestException('No OTP request found for this email');
    }

    // 2. Verify OTP (case-sensitive and exact match)
    const storedOtp = this.otpStore.get(email);
    if (storedOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // 3. Check OTP expiration (optional - recommended)
    const otpTimestamp = this.otpStore.get(`${email}_timestamp`);
    const currentTime = Date.now();
    const otpExpiryTime = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (currentTime - otpTimestamp > otpExpiryTime) {
      this.otpStore.delete(email);
      this.otpStore.delete(`${email}_timestamp`);
      throw new BadRequestException('OTP has expired');
    }

    // 5. Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(email, hashedPassword);

    // 6. Clean up OTP data
    this.otpStore.delete(email);
    this.otpStore.delete(`${email}_timestamp`);

    return { message: 'Password updated successfully' };
  }
}
