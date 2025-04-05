import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserRole } from 'src/common/enums/user-role.enum';

@Controller('users')
// @UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDTO) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('all')
  async findAll() {
    return await this.usersService.findAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findUserById(+id);
  }

  @Get()
  findByUserName(@Body() username: string) {
    return this.usersService.findUser(username);
  }

  @Patch('role')
  async updateUserRole(
    @Body('email') email: string,
    @Body('role') role: UserRole,
  ) {
    return this.usersService.updateRole(email, role);
  }
}
