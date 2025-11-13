import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(Number(id));

    if (!user) {
      throw new NotFoundException(`User with id=${id} not found`);
    }

    return user;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const success = await this.usersService.deleteUser(Number(id));

    if (!success) {
      throw new NotFoundException(`User with id=${id} not found`);
    }

    return { deleted: true };
  }
  @Post(':userId/roles/:roleId')
async assignRoleToUser(
  @Param('userId') userId: number,
  @Param('roleId') roleId: number,
): Promise<string> {
  const user = await this.usersService.assignRole(userId, roleId);
  return `Роль назначена пользователю ${user.username}`;
}


}
