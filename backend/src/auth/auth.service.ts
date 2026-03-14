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
import { ResetPassDTO } from 'src/auth/dto/reset-pass.dto';
import { RegisterDTO } from 'src/auth/dto/register.dto';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Gender } from 'src/common/enums/user-role.enum';
interface RefreshTokenPayload {
  id: number;
  tokenId: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  private otpStore = new Map(); // Temporary storage for OTPs
  private refreshTokens = new Map<string, { userId: number; expires: Date }>();

  async signup(createUser: RegisterDTO) {
    const { email, password } = createUser;
    const existingUser = await this.usersService.findUserByEmail(email);
    if (existingUser)
      throw new HttpException('Email already exists', HttpStatus.FOUND);

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.createUser({
      ...createUser,
      password: hashedPassword,
    });
  }

  // Update signIn method
  async signIn(loginDto: LoginDTO) {
    const user = await this.repo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: loginDto.email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Bad Credentials');
    }

    const isMatch = await this.verifyPassword(loginDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Bad Credentials');
    }

    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      mobile: user.mobile,
      sub: user.id,
      role: user.role,
    };

    // Create tokens
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m', // Short lived
    });

    const refreshToken = await this.createRefreshToken(user.id);

    const { password, ...safeUser } = user;
    return { accessToken, refreshToken, user: safeUser };
  }

  // New method to create refresh token
  private async createRefreshToken(userId: number): Promise<string> {
    const tokenId =
      Math.random().toString(36).substring(2) + Date.now().toString(36);
    const refreshToken = await this.jwtService.signAsync(
      { id: userId, tokenId },
      { expiresIn: '7d' },
    );

    // Store in memory (use Redis in production)
    this.refreshTokens.set(tokenId, {
      userId,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return refreshToken;
  }

  // New method to refresh tokens
  async refreshToken(oldRefreshToken: string) {
    try {
      // Verify refresh token
      const payload =
        await this.jwtService.verifyAsync<RefreshTokenPayload>(oldRefreshToken);

      // Check if token exists in store
      const storedToken = this.refreshTokens.get(payload.tokenId);
      if (!storedToken || storedToken.userId !== payload.id) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if expired
      if (storedToken.expires < new Date()) {
        this.refreshTokens.delete(payload.tokenId);
        throw new UnauthorizedException('Refresh token expired');
      }

      // Get user
      const user = await this.usersService.findOne(payload.id);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Delete old refresh token
      this.refreshTokens.delete(payload.tokenId);

      // Create new tokens
      const newPayload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        mobile: user.mobile,
        sub: user.id,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: '15m',
      });

      const refreshToken = await this.createRefreshToken(user.id);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // New method to revoke refresh token
  async revokeRefreshToken(refreshToken: string) {
    try {
      const payload =
        await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken);
      this.refreshTokens.delete(payload.tokenId);
    } catch (error) {
      // Token invalid, just ignore
    }
  }

  // async signIn(loginDto: LoginDTO) {
  //   const user = await this.repo
  //     .createQueryBuilder('user')
  //     .addSelect('user.password')
  //     .where('user.email = :email', { email: loginDto.email })
  //     .getOne();

  //   if (!user) {
  //     throw new UnauthorizedException('Bad Credentials');
  //   }

  //   const isMatch = await this.verifyPassword(
  //     loginDto.password,
  //     user.password,
  //   );

  //   if (!isMatch) {
  //     throw new UnauthorizedException('Bad Credentials');
  //   }

  //   const payload = {
  //     id: user.id,
  //     email: user.email,
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     gender: user.gender,
  //     mobile: user.mobile,
  //     sub: user.id,
  //     role: user.role,
  //   };

  //   const token = await this.jwtService.signAsync(payload);
  //     const { password, ...safeUser } = user;
  //       return { token, user: safeUser };
  // }

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
