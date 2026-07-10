import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  PaymentCompletedEvent,
  CourseUnlockedEvent,
  CourseUnlockFailedEvent,
} from '‎libs/shared/event.contracts';

@Injectable()
export class CourseServiceService implements OnModuleInit {
  private readonly logger = new Logger(CourseServiceService.name);

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.logger.log('Connecting to Kafka broker as producer...');
    await this.kafkaClient.connect();
    this.logger.log('Kafka broker connection established.');
  }

  async unlockCourse(
    paymentCompletedEvent: PaymentCompletedEvent,
  ): Promise<void> {
    const { orderId, userId, courseId } = paymentCompletedEvent;

    this.logger.log(
      `[Course] Started unlocking access to course '${courseId}' for user ${userId}`,
    );

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isUnlockSuccess = courseId !== 'invalid-course';

    if (isUnlockSuccess) {
      // 3. Prepare success event payload
      const successPayload: CourseUnlockedEvent = {
        orderId,
        userId,
        courseId,
      };

      this.logger.log(
        `[Course] Course '${courseId}' unlocked for user ${userId}. Emitting 'course.unlocked'`,
      );
      this.kafkaClient.emit('course.unlocked', JSON.stringify(successPayload));
    } else {
      // 4. Prepare failure event payload
      const failurePayload: CourseUnlockFailedEvent = {
        orderId,
        userId,
        courseId,
        reason: 'COURSE_ID_NOT_FOUND',
      };

      this.logger.warn(
        `[Course] Course unlock failed for course '${courseId}'. Emitting 'course.unlock.failed'`,
      );
      this.kafkaClient.emit(
        'course.unlock.failed',
        JSON.stringify(failurePayload),
      );
    }
  }
}
