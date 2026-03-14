import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Req,
  UseGuards,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDTO } from 'src/auth/dto/register.dto';
import { ResetPassDTO } from 'src/auth/dto/reset-pass.dto';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { Request, Response } from 'express';
import { CurrentUser } from './decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: RegisterDTO) {
    return this.authService.signup(createUserDto);
  }

  @Post('signin')
  async signIn(
    @Body() loginDto: LoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.signIn(loginDto);

    res.cookie('Authentication', accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: 'lax',
      secure: false,
      path: '/',
    });

    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax',
      secure: false,
      path: '/',
    });

    // res.cookie('IsAuthenticated', true, {
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    return { success: true, user };
  }
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.sendResetOTP(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPassDTO) {
    return this.authService.resetPassword(body);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authentication');
    // res.clearCookie('IsAuthenticated');
    res.clearCookie('Refresh');
    return { message: 'Logout successful' };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies?.Refresh;

    if (!oldRefreshToken) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken } =
      await this.authService.refreshToken(oldRefreshToken);

    res.cookie('Authentication', accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });

    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });

    return { success: true };
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async authStatus(@Req() req: Request, @CurrentUser() user: User) {
    // const isAuth = req.cookies['IsAuthenticated'] === 'true';
    // return { isAuthenticated: isAuth, status: !!user, user };
     return { status: true, user };
  }
}
