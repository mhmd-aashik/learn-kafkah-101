import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderCreatedEvent } from '‎libs/shared/event.contracts';

export interface Order {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  status:
    | 'PENDING'
    | 'PAYMENT_PROCESSING'
    | 'PAYMENT_FAILED'
    | 'COURSE_UNLOCKING'
    | 'COMPLETED'
    | 'MANUAL_REVIEW';
  createdAt: Date;
}

@Injectable()
export class OrdersApiService implements OnModuleInit {
  private readonly logger = new Logger(OrdersApiService.name);

  public readonly ordersDB = new Map<string, Order>();

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.logger.log('Connecting to Kafka broker...');
    await this.kafkaClient.connect();
    this.logger.log('Kafka broker connection established.');
  }

  createOrder(createOrderDto: CreateOrderDto): Order {
    const orderId = `ord_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newOrder: Order = {
      id: orderId,
      userId: createOrderDto.userId,
      courseId: createOrderDto.courseId,
      amount: createOrderDto.amount,
      status: 'PENDING',
      createdAt: new Date(),
    };

    this.ordersDB.set(orderId, newOrder);
    this.logger.log(
      `[POST Service] Saved new order in-memory: ${orderId} (Status: PENDING)`,
    );

    const eventPayload: OrderCreatedEvent = {
      orderId: newOrder.id,
      userId: newOrder.userId,
      courseId: newOrder.courseId,
      amount: newOrder.amount,
    };

    this.logger.log(
      `[POST Service] Emitting 'order.created' event for: ${orderId}`,
    );

    this.kafkaClient.emit('order.created', JSON.stringify(eventPayload));

    newOrder.status = 'PAYMENT_PROCESSING';
    this.ordersDB.set(orderId, newOrder);
    this.logger.log(
      `[POST Service] Local status updated for Order ${orderId}: PENDING -> PAYMENT_PROCESSING`,
    );

    return newOrder;
  }

  getOrder(orderId: string): Order {
    const order = this.ordersDB.get(orderId);
    if (!order) {
      this.logger.warn(`[GET Service] Order not found: ${orderId}`);
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    return order;
  }
}
