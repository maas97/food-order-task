import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const calculatedTotal = createOrderDto.items.reduce(
      (sum, item) => item.price * item.quantity + sum,
      0,
    );

    if (calculatedTotal !== createOrderDto.total) {
      throw new Error('Order total mismatch');
    }

    const order = this.orderRepository.create({
      userId,
      items: createOrderDto.items,
      total: createOrderDto.total,
      status: 'pending',
    });

    return this.orderRepository.save(order);
  }
}
