import { Controller, UnauthorizedException, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UserService } from '../../users/services/users.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @MessagePattern({ cmd: 'register' })
  async register(registrationData: RegisterDto) {
    this.logger.log(`Register: ${registrationData.email}`);
    try {
      const result = await this.authService.register(registrationData);
      this.logger.log(`Registered done: ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Register failed: ${error.message}`);
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: error.message || 'Registration failed'
      };
    }
  }

  @MessagePattern({ cmd: 'login' })
  async login(loginData: LoginDto) {
    this.logger.log(`Login: ${loginData.email}`);
    try {
      const user = await this.authService.validateUserCredentials(
        loginData.email,
        loginData.password
      );
      if (!user) {
        this.logger.warn(`Could not login: ${loginData.email}`);
        return {
          status: HttpStatus.UNAUTHORIZED,
          message: 'Invalid credentials'
        };
      }
      const result = await this.authService.login(user);
      this.logger.log(`Login done: ${loginData.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: error.message || 'Login failed'
      };
    }
  }

  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(payload: { token: string }) {
    this.logger.log('Token check');
    try {
      const result = await this.authService.validateToken(payload.token);
      this.logger.log('Token is va;id');
      return result;
    } catch (error) {
      this.logger.error(`Token error: ${error.message}`);
      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid token'
      };
    }
  }

  @MessagePattern({ cmd: 'get_all_users' })
  async getAllUsers() {
    this.logger.log('Get users');
    try {
      const users = await this.userService.getAllUsers();
      return users;
    } catch (error) {
      this.logger.error(`Users error: ${error.message}`);
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Failed to get users'
      };
    }
  }
}
