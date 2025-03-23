import {
  Controller,
  UnauthorizedException,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { OrdersService } from '../services/order.service';
import { CreateOrderDto, OrderResponseDto } from '../dto/create-order.dto';
import { AuthClient } from '../../auth/auth-client.module';

@Controller()
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly authClient: AuthClient,
  ) {}

  @MessagePattern({ cmd: 'create_order' })
  async createOrderMicroservice(data: { userId: string, items: any[], deliveryAddress: string }): Promise<OrderResponseDto> {
    try {
      const createOrderDto: CreateOrderDto = {
        items: data.items.map(item => ({
          name: item.itemId,
          quantity: item.quantity,
          price: item.price
        })),
        total: data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };

      const order = await this.ordersService.createOrder(
        data.userId,
        createOrderDto,
      );

      return new OrderResponseDto(order);
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Failed to create order');
    }
  }
}
