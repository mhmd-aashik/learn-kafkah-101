import { Test, TestingModule } from '@nestjs/testing';
import { OrdersApiServiceController } from './orders-api-service.controller';
import { OrdersApiServiceService } from './orders-api-service.service';

describe('OrdersApiServiceController', () => {
  let ordersApiServiceController: OrdersApiServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersApiServiceController],
      providers: [OrdersApiServiceService],
    }).compile();

    ordersApiServiceController = app.get<OrdersApiServiceController>(
      OrdersApiServiceController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ordersApiServiceController.getHello()).toBe('Hello World!');
    });
  });
});
