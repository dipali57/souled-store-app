import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role.enum';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { RolesGuard } from './guards/roles.guards';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { ResetPassDTO } from 'src/users/dto/reset-pass.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.signup(createUserDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
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
