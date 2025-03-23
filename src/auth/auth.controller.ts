import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Throttle } from '../common/decorators/throttler.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'User successfully registered',
    schema: {
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        email: { type: 'string', example: 'user@example.com' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Throttle(10, 60) 
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const response = await firstValueFrom(
        this.authClient.send({ cmd: 'register' }, registerDto),
      );
      
      if (response && response.status && response.message) {
        throw new HttpException(
          response.message,
          response.status
        );
      }
      
      return response;
    } catch (error) {
      const statusCode = typeof error.status === 'number' ? 
        error.status : HttpStatus.INTERNAL_SERVER_ERROR;
      
      throw new HttpException(
        error.message || 'Registration failed',
        statusCode,
      );
    }
  }

  @ApiOperation({ summary: 'Login with user credentials' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'User successfully logged in',
    schema: {
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })  
  @Throttle(10, 60)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const response = await firstValueFrom(
        this.authClient.send({ cmd: 'login' }, loginDto),
      );
      
      if (response && response.status && response.message) {
        throw new HttpException(
          response.message,
          response.status
        );
      }
      
      return response;
    } catch (error) {
      const statusCode = typeof error.status === 'number' ? 
        error.status : HttpStatus.UNAUTHORIZED;
      
      throw new HttpException(
        error.message || 'Login failed',
        statusCode,
      );
    }
  }

  @ApiOperation({ summary: 'Get all users (Debug endpoint)' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all users',
    schema: {
      type: 'array',
      items: {
        properties: {
          id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
          email: { type: 'string', example: 'user@example.com' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('debug/users')
  async getAllUsers() {
    try {
      const response = await firstValueFrom(
        this.authClient.send({ cmd: 'get_all_users' }, {}),
      );
      
      if (response && response.status && response.message) {
        throw new HttpException(
          response.message,
          response.status
        );
      }
      
      return response;
    } catch (error) {
      const statusCode = typeof error.status === 'number' ? 
        error.status : HttpStatus.INTERNAL_SERVER_ERROR;
      
      throw new HttpException(
        error.message || 'Failed to get users',
        statusCode,
      );
    }
  }
}
