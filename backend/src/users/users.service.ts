import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createUser(userData:CreateUserDTO):Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findUser(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username: username },
    });
    if (!user) {
      throw new NotFoundException(`User ${username} does not exist!`);
    }
    return user;
  }

  async updatePassword(email: string, hashedPassword: string) {
    await this.usersRepository.update({ email }, { password: hashedPassword });
  }

  
  async findUserById(id: number): Promise<User> {
    // return this.usersRepository.findOne({ where: { id } });
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
