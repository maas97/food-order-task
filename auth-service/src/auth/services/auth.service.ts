import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/services/users.service';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(userId: string) {
    return this.userService.findById(userId);
  }

  async validateUserCredentials(email: string, password: string) {
    this.logger.log(`Validating user: ${email}`);
    const user = await this.userService.findByEmail(email);
    if (!user) {
      this.logger.warn(`User not found`);
      return null;
    }

    this.logger.log(`Checking password`);
    const isPasswordValid = await bcryptjs.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      this.logger.warn(`Wrong password`);
      return null;
    }

    this.logger.log(`Login is done`);
    return user;
  }

  async login(user: any) {
    this.logger.log(`Login: ${user.email}`);
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registrationData: any) {
    this.logger.log(`New user: ${registrationData.email}`);
    return this.userService.createUser(registrationData);
  }

  async validateToken(token: string) {
    try {
      this.logger.log(`Checking token`);
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.sub);
      
      if (!user) {
        this.logger.warn(`User not in db`);
        throw new UnauthorizedException('User not found');
      }
      
      this.logger.log(`Token is ok for: ${user.email}`);
      return {
        id: user.id,
        email: user.email
      };
    } catch (error) {
      this.logger.error(`Bad token: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
