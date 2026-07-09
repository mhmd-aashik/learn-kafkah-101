import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'userId is required' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'courseId is required' })
  courseId: string;

  @IsNumber()
  @Min(1, { message: 'quantity must be greater than 0' })
  amount: number;
}
