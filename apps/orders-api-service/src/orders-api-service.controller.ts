import { Controller, Get } from '@nestjs/common';
import { OrdersApiServiceService } from './orders-api-service.service';

@Controller()
export class OrdersApiServiceController {
  constructor(
    private readonly ordersApiServiceService: OrdersApiServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.ordersApiServiceService.getHello();
  }
}
