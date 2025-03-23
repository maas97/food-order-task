import { Controller } from '@nestjs/common';
import { UserService } from '../services/users.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { User } from '../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'getAllUsers' })
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.userService.getAllUsers();
      return users ?? [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new RpcException('Failed to fetch users');
    }
  }
}
