import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { ResetPassDTO } from 'src/users/dto/reset-pass.dto';
import { LoginDTO } from 'src/users/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDTO) {
    return this.authService.signup(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDTO) {
    console.log('req:',loginDTO);
    return this.authService.login(loginDTO);
  }
  
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(@Body() loginDto: LoginDTO) {
    return this.authService.signIn(loginDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.sendResetOTP(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPassDTO) {
    return this.authService.resetPassword(body);
  }

  @Get('dashboard')
  @Roles(UserRole.ADMIN)
  async getAdminDashboard() {
    return { message: 'Welcome to Admin Dashboard' };
  }
}
