import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    this.logger.log(`Find user: ${id}`);
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      this.logger.warn(`No user found: ${id}`);
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.log(`Find email: ${email}`);
    return this.usersRepository.findOne({ where: { email } });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`New user: ${createUserDto.email}`);
    
    try {
      const hashedPassword = await bcryptjs.hash(createUserDto.password, 10);

      const user = this.usersRepository.create({
        email: createUserDto.email,
        passwordHash: hashedPassword,
      });

      const savedUser = await this.usersRepository.save(user);
      this.logger.log(`Created: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Create error: ${error.message}`);
      throw error;
    }
  }

  getAllUsers(): Promise<User[]> {
    this.logger.log('Getting users');
    return this.usersRepository.find();
  }
}
