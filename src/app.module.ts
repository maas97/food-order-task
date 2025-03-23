import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { OrdersController } from './orders/orders.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './common/guards/throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60, 
      limit: 10, 
    }]),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_URL?.split(':')[0] || 'auth-service',
          port: parseInt(process.env.AUTH_SERVICE_URL?.split(':')[1] || '3001'),
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ORDER_SERVICE_URL?.split(':')[0] || 'order-service',
          port: parseInt(process.env.ORDER_SERVICE_URL?.split(':')[1] || '3002'),
        },
      },
    ]),
  ],
  controllers: [AppController, AuthController, OrdersController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
