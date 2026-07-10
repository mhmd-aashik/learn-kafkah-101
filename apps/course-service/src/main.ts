import { NestFactory } from '@nestjs/core';
import { CourseServiceModule } from './course-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CourseServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'course-service-consumer',
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
        consumer: {
          groupId: 'course-service-group', // Distinct consumer group for course service
        },
      },
    },
  );

  await app.listen();

  console.log(
    `\n=============================================================`,
  );
  console.log(`🚀 Course Service (Pure Kafka Consumer) is running...`);
  console.log(
    `   Listening on Kafka Broker: ${process.env.KAFKA_BROKER || 'localhost:9092'}`,
  );
  console.log(
    `=============================================================\n`,
  );
}
void bootstrap();
