import {
  IsArray,
  IsDecimal,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Order } from '../entities/order.entity';

class OrderItemDto {
  @IsNotEmpty()
  name: string;

  @IsDecimal({ decimal_digits: '2' })
  price: number;

  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsDecimal({ decimal_digits: '2' })
  total: number;
}

export class OrderResponseDto {
  id: string;
  total: number;
  status: string;
  createdAt: Date;

  constructor(order: Order) {
    this.id = order.id;
    this.total = order.total;
    this.status = order.status;
    this.createdAt = order.createdAt;
  }
}
