import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { ResetPassDTO } from 'src/users/dto/reset-pass.dto';
import { LoginDTO } from 'src/users/dto/login.dto';
import { Request, Response } from 'express';
import { CurrentUser } from './decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDTO) {
    return this.authService.signup(createUserDto);
  }

  @Post('signin')
  async signIn(@Body() loginDto: LoginDTO, @Res() res: Response) {
    const { token, user } = await this.authService.signIn(loginDto);
    res.cookie('IsAuthenticated', true, { maxAge: 2 * 60 * 60 * 1000 });
    res.cookie('Authentication', token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000,
    });
    return res.send({ success: true, user });
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.sendResetOTP(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPassDTO) {
    return this.authService.resetPassword(body);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async authStatus(@Req() req: Request, @CurrentUser() user: User) {
    const isAuth = req.cookies['IsAuthenticated'] === 'true';
    return { isAuthenticated: isAuth, status: !!user, user };
  }

  @Post('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('Authentication');
    res.clearCookie('IsAuthenticated');
    return res.status(200).send({ success: true });
  }
}
