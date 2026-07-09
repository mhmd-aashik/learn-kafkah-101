import { Body, Controller, Logger, Post } from '@nestjs/common';
import { OrdersApiService } from './orders-api-service.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller()
export class OrdersApiServiceController {
  private readonly logger = new Logger(OrdersApiServiceController.name);

  constructor(private readonly ordersApiService: OrdersApiService) {}

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    this.logger.log(
      `[REST] Received POST request to create order for user: ${createOrderDto.userId}`,
    );

    return this.ordersApiService.createOrder(createOrderDto);
  }
}
