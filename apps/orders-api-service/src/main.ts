import { NestFactory } from '@nestjs/core';
import { OrdersApiServiceModule } from './orders-api-service.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(OrdersApiServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'orders-api-producer',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'orders-api-group',
      },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT_ORDERS_API || 3000;
  await app.listen(port);

  console.log(
    `\n=============================================================`,
  );
  console.log(`🚀 Orders API Service is running on http://localhost:${port}`);
  console.log(
    `   Connected to Kafka Broker: ${process.env.KAFKA_BROKER || 'localhost:9092'}`,
  );
  console.log(
    `=============================================================\n`,
  );
}
void bootstrap();
