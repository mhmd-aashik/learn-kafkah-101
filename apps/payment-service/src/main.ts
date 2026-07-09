import { NestFactory } from '@nestjs/core';
import { PaymentServiceModule } from './payment-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PaymentServiceModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'payment-service-consumer',
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
        consumer: {
          groupId: 'payment-service-group', // Distinct consumer group for payment service
        },
      },
    },
  );

  // Start listening to Kafka
  await app.listen();

  console.log(
    `\n=============================================================`,
  );
  console.log(`🚀 Payment Service (Pure Kafka Consumer) is running...`);
  console.log(
    `   Listening on Kafka Broker: ${process.env.KAFKA_BROKER || 'localhost:9092'}`,
  );
  console.log(
    `=============================================================\n`,
  );
}

void bootstrap();
