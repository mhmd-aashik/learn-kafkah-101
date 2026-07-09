import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { OrdersApiService } from './orders-api-service.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import type {
  CourseUnlockedEvent,
  CourseUnlockFailedEvent,
  PaymentCompletedEvent,
  PaymentFailedEvent,
} from '‎libs/shared/event.contracts';

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

  @Get(':orderId')
  getOrder(@Param('orderId') orderId: string) {
    this.logger.log(
      `[REST] Received GET request to check status of order: ${orderId}`,
    );
    return this.ordersApiService.getOrder(orderId);
  }

  // Kafka Event Pattern: payment.completed
  @EventPattern('payment.completed')
  handlePaymentCompleted(@Payload() data: PaymentCompletedEvent) {
    this.logger.log(
      `[Kafka Event] Received 'payment.completed' for order: ${data.orderId}`,
    );
    this.ordersApiService.updateStatus(data.orderId, 'COURSE_UNLOCKING');
  }

  // Kafka Event Pattern: payment.failed
  @EventPattern('payment.failed')
  handlePaymentFailed(@Payload() data: PaymentFailedEvent) {
    this.logger.log(
      `[Kafka Event] Received 'payment.failed' for order: ${data.orderId}. Reason: ${data.reason}`,
    );
    this.ordersApiService.updateStatus(
      data.orderId,
      'PAYMENT_FAILED',
      data.reason,
    );
  }

  // Kafka Event Pattern: course.unlocked
  @EventPattern('course.unlocked')
  handleCourseUnlocked(@Payload() data: CourseUnlockedEvent) {
    this.logger.log(
      `[Kafka Event] Received 'course.unlocked' for order: ${data.orderId}`,
    );
    this.ordersApiService.updateStatus(data.orderId, 'COMPLETED');
  }

  // Kafka Event Pattern: course.unlock.failed
  @EventPattern('course.unlock.failed')
  handleCourseUnlockFailed(@Payload() data: CourseUnlockFailedEvent) {
    this.logger.log(
      `[Kafka Event] Received 'course.unlock.failed' for order: ${data.orderId}. Reason: ${data.reason}`,
    );
    this.ordersApiService.updateStatus(
      data.orderId,
      'MANUAL_REVIEW',
      data.reason,
    );
  }
}
