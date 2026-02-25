import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Role } from 'src/common/enums/user-role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { UserResponseDto } from './dto/user-response.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  // Get Current user profile
  @Get('me')
  async getProfile(@CurrentUser() user: User): Promise<UserResponseDto> {
    return this.usersService.findOne(user.id);
  }

  //Get user by ID (for admin purpose)
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  // Get all users (for admin purpose)
  @Get()
  @Roles(Role.ADMIN)
  async findAll(): Promise<UserResponseDto[]> {
    return await this.usersService.findAll();
  }

  // Update current user profile
  @Patch('me')
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.update(user.id, updateUserDto);
  }

  //Change current user password
  @Patch('me/password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    console.log('userId', user);
    return await this.usersService.changePassword(user.id, changePasswordDto);
  }

  //Delete Current user Account
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  async deleteAccount(
    @CurrentUser('id') userId: number,
  ): Promise<{ message: string }> {
    return await this.usersService.remove(userId);
  }

  //Delete user by Id (for admin purpose)
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: number): Promise<{ message: string }> {
    return await this.usersService.remove(id);
  }

  @Patch('role')
  async updateUserRole(@Body('email') email: string, @Body('role') role: Role) {
    return this.usersService.updateRole(email, role);
  }
}
