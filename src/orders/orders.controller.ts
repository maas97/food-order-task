import { Body, Controller, Post, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Order successfully created',
    schema: {
      properties: {
        id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        total: { type: 'number', example: 25.99 },
        status: { type: 'string', example: 'pending' },
        createdAt: { type: 'string', format: 'date-time', example: '2025-03-23T18:00:00Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBearerAuth()  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    try {
      const orderData = {
        userId: req.user.id,
        items: createOrderDto.items,
        deliveryAddress: createOrderDto.deliveryAddress
      };

      return await firstValueFrom(
        this.orderClient.send({ cmd: 'create_order' }, orderData),
      );
    } catch (error) {
      const statusCode = typeof error.status === 'number' ? 
        error.status : HttpStatus.INTERNAL_SERVER_ERROR;
      
      throw new HttpException(
        error.message || 'Failed to create order',
        statusCode,
      );
    }
  }
}
