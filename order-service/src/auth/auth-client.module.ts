import { Inject, Injectable, Module } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthClient {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  async validateToken(
    token: string,
  ): Promise<{ valid: boolean; userId: string }> {
    try {
      const response$ = this.client.send<{
        valid: boolean;
        userId: string;
      }>(
        {
          cmd: 'validate_token',
        },
        token,
      );
      return await lastValueFrom(response$);
    } catch (error) {
      console.log(error);
      return { valid: false, userId: '' };
    }
  }
}

@Module({
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useFactory: () =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: 'auth-service',
            port: parseInt(process.env.AUTH_SERVICE_PORT || '3001'),
          },
        }),
    },
    AuthClient,
  ],
  exports: [AuthClient],
})
export class AuthClientModule {}
