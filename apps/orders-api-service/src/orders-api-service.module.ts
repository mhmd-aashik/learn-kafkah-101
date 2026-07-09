import { Module } from '@nestjs/common';
import { OrdersApiServiceController } from './orders-api-service.controller';
import { OrdersApiServiceService } from './orders-api-service.service';

@Module({
  imports: [],
  controllers: [OrdersApiServiceController],
  providers: [OrdersApiServiceService],
})
export class OrdersApiServiceModule {}
