import { Module } from '@nestjs/common';
import { CourseServiceController } from './course-service.controller';
import { CourseServiceService } from './course-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    // 1. Load config globally from root .env file
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // 2. Configure Kafka producer client to send unlock completion/failure events
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_CLIENT',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'course-service-producer',
              brokers: [
                configService.get<string>('KAFKA_BROKER', 'localhost:9092'),
              ],
            },
            consumer: {
              groupId: 'course-service-producer-group',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CourseServiceController],
  providers: [CourseServiceService],
})
export class CourseServiceModule {}
