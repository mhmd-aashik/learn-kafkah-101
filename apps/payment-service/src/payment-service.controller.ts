import { Controller, Logger } from '@nestjs/common';
import { PaymentServiceService } from './payment-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { OrderCreatedEvent } from '‎libs/shared/event.contracts';

@Controller()
export class PaymentServiceController {
  private readonly logger = new Logger(PaymentServiceController.name);

  constructor(private readonly paymentServiceService: PaymentServiceService) {}

  @EventPattern('order.created')
  async handleOrderCreated(@Payload() data: OrderCreatedEvent) {
    this.logger.log(
      `[Kafka Listener] Received 'order.created' event for Order: ${data.orderId}`,
    );
    // Process the payment simulation asynchronously
    await this.paymentServiceService.processPayment(data);
  }
}
