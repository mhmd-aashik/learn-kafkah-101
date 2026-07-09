import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  OrderCreatedEvent,
  PaymentCompletedEvent,
  PaymentFailedEvent,
} from '‎libs/shared/event.contracts';

@Injectable()
export class PaymentServiceService implements OnModuleInit {
  private readonly logger = new Logger(PaymentServiceService.name);

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.logger.log('Connecting to Kafka broker as producer...');
    await this.kafkaClient.connect();
    this.logger.log('Kafka broker connection established.');
  }

  async processPayment(orderCreatedEvent: OrderCreatedEvent): Promise<void> {
    const { orderId, userId, amount, courseId } = orderCreatedEvent;

    this.logger.log(
      `[Payment] Started processing payment for Order: ${orderId} (Amount: $${amount / 100})`,
    );

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const isSuccess = Math.random() > 0.2;

    if (isSuccess) {
      // 3. Prepare success event payload
      const successPayload: PaymentCompletedEvent = {
        orderId,
        userId,
        courseId,
        amount,
      };

      this.logger.log(
        `[Payment] Payment SUCCESS for Order ${orderId}. Emitting 'payment.completed'`,
      );

      this.kafkaClient.emit(
        'payment.completed',
        JSON.stringify(successPayload),
      );
    } else {
      // 4. Prepare failure event payload
      const failurePayload: PaymentFailedEvent = {
        orderId,
        userId,
        courseId,
        amount,
        reason: 'INSUFFICIENT_FUNDS', // Fake reason
      };

      this.logger.warn(
        `[Payment] Payment FAILED for Order ${orderId}. Emitting 'payment.failed'`,
      );
      this.kafkaClient.emit('payment.failed', JSON.stringify(failurePayload));
    }
  }
}
