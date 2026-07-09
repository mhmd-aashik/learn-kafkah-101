import { NestFactory } from '@nestjs/core';
import { OrdersApiServiceModule } from './orders-api-service.module';

async function bootstrap() {
  const app = await NestFactory.create(OrdersApiServiceModule);
  await app.listen(process.env.port ?? 3000);
}
void bootstrap();
