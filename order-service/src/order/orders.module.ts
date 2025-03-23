import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './services/order.service';
import { OrdersController } from './controllers/order.controller';
import { Order } from './entities/order.entity';
import { AuthClientModule } from 'src/auth/auth-client.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), AuthClientModule],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
