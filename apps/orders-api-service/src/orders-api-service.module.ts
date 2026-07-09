import { Module } from '@nestjs/common';
import { OrdersApiServiceController } from './orders-api-service.controller';
import { OrdersApiServiceService } from './orders-api-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'orders-api-producer',
              brokers: [
                configService.get<string>('KAFKA_BROKER', 'localhost:9092'),
              ],
            },
            consumer: {
              groupId: 'orders-api-producer-group',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [OrdersApiServiceController],
  providers: [OrdersApiServiceService],
})
export class OrdersApiServiceModule {}
