/**
 * Event published when a user creates a new course purchase order.
 * Topic: order.created
 */
export interface OrderCreatedEvent {
  orderId: string;
  userId: string;
  courseId: string;
  amount: number;
}

/**
 * Event published when the payment service successfully processes the order payment.
 * Topic: payment.completed
 */
export interface PaymentCompletedEvent {
  orderId: string;
  userId: string;
  courseId: string;
  amount: number;
}

/**
 * Event published when the payment service fails to process the order payment.
 * Topic: payment.failed
 */
export interface PaymentFailedEvent {
  orderId: string;
  userId: string;
  courseId: string;
  amount: number;
  reason: string;
}

/**
 * Event published when the course service successfully unlocks the course access for the user.
 * Topic: course.unlocked
 */
export interface CourseUnlockedEvent {
  orderId: string;
  userId: string;
  courseId: string;
}

/**
 * Event published when the course service fails to unlock the course.
 * Topic: course.unlock.failed
 */
export interface CourseUnlockFailedEvent {
  orderId: string;
  userId: string;
  courseId: string;
  reason: string;
}
