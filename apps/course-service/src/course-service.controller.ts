import { Controller, Logger } from '@nestjs/common';
import { CourseServiceService } from './course-service.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import type { PaymentCompletedEvent } from '‎libs/shared/event.contracts';

@Controller()
export class CourseServiceController {
  private readonly logger = new Logger(CourseServiceController.name);
  constructor(private readonly courseServiceService: CourseServiceService) {}

  @EventPattern('payment.completed')
  async handlePaymentCompleted(@Payload() data: PaymentCompletedEvent) {
    this.logger.log(
      `[Kafka Listener] Received 'payment.completed' event for Order: ${data.orderId}`,
    );

    await this.courseServiceService.unlockCourse(data);
  }
}
