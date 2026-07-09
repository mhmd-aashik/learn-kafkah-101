export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  courseId: string;
  amount: number;
}
